import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Chatbot from "@/models/Chatbot";
import DatasetModel from "@/models/Dataset"; // Import your MongoDB model
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//@ts-ignore
async function uploadFile(fileBuffer, fileName) {
  try {
    // Determine file type based on extension
    const fileExtension = path.extname(fileName).toLowerCase();
    const mimeType = fileExtension === '.pdf' ? 'application/pdf' : 'text/plain';

    const file = new File([fileBuffer], fileName, { type: mimeType });
    const response = await openai.files.create({
      file: file,
      purpose: 'assistants'
    });

    console.log("Uploaded file ID:", response);
    return response.id;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("File upload failed");
  }
}

//@ts-ignore
async function createVectorStore(chatbotId) {
  try {
    const response = await openai.beta.vectorStores.create({
      name: "Knowledge Base For " + chatbotId
    });
    if (!response?.id) {
      throw new Error("Vector store creation failed - no ID returned");
    }
    console.log("Vector Store created successfully:", response.id);
    return response.id;
  } catch (error) {
    console.error("Failed to create vector store:", error);
    throw new Error("Vector store creation failed");
  }
}

//@ts-ignore
async function createAssistantWithFiles(vectorStoreId) {
  const response = await openai.beta.assistants.create({
    // Available models for assistants:
    model: "gpt-4-turbo-preview",  // Latest GPT-4 model
    // OR
    // model: "gpt-4-1106-preview",   // GPT-4 Turbo
    // model: "gpt-4",                // Original GPT-4
    // model: "gpt-3.5-turbo",        // GPT-3.5 Turbo
    // model: "gpt-3.5-turbo-1106",   // Latest GPT-3.5
    instructions: "You are a knowledgeable assistant that uses the provided files to answer questions.",
    tools: [{ type: "file_search" }],
    tool_resources: {
      file_search: {
        vector_store_ids: [vectorStoreId]
      }
    }
  });
  console.log("Assistant ID:", response.id);
  return response.id;
}

//@ts-ignore
async function addFileToVectorStore(vectorStoreId, fileBuffer, fileName) {
  try {
    const file_id = await uploadFile(fileBuffer, fileName);
    const myVectorStoreFile = await openai.beta.vectorStores.files.create(
      vectorStoreId,
      {
        file_id
      }
    );

    console.log("Added file to vector store:", myVectorStoreFile);
    return myVectorStoreFile;
  } catch (error) {
    console.error("Error adding file to vector store:", error);
    throw new Error("Failed to add file to vector store");
  }
}

//@ts-ignore
async function clearVectorStore(vectorStoreId) {
  // Get list of all files in the vector store
  const vectorStoreFiles = await openai.beta.vectorStores.files.list(vectorStoreId);

  // Delete each file
  for (const file of vectorStoreFiles.data) {
    await openai.beta.vectorStores.files.del(vectorStoreId, file.id);
    console.log(`Deleted file ${file.id} from vector store`);
  }

  console.log("Cleared all files from vector store");
}

export async function POST(req: Request) {
  try {
    const { chatbotId, text } = await req.json();
    console.log("Received text:", text);

    const base64File = Buffer.from(text, 'utf-8').toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    console.log("Base64 encoded file:", base64File);

    if (!chatbotId) {
      return NextResponse.json({ error: "chatbotId is required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    let existingDataset = await DatasetModel.findOne({ chatbotId });
    if (!existingDataset) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
    }
    existingDataset.text = text;
    // Perform update with error catching
    const updatedDataset = await DatasetModel.findOneAndUpdate(
      { chatbotId: chatbotId },
      { $set: { text: text } },
      { 
        new: true, 
        runValidators: true,
        // Add this to get more detailed error information
        validateBeforeSave: true
      }
    );
    if (!updatedDataset) {
      // Check if the document still exists
      const checkDataset = await DatasetModel.findOne({ chatbotId });
      console.log("Document check after failed update:", checkDataset);
      throw new Error("Dataset not found during update");
    }
    
    // Delete associated chunks using the uniqueTag from the file metadata
    const response2 = await fetch(`https://api.trieve.ai/api/chunk`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
        "TR-Dataset": existingDataset.datasetId, // Use datasetId since it's guaranteed to be present
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          filter: {
            metadata: {
              type: 'texttexttexttext'
            }
          }
        }
      )
    });

    // Check if the chunk deletion was successful
    if (!response2.ok) {
      throw new Error(`Failed to delete chunks: ${response2.statusText}`);
    }

    const response = await fetch("https://api.trieve.ai/api/file", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
        "TR-Dataset": existingDataset.datasetId,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        {
          base64_file: base64File,
          file_name: 'texttexttexttext.txt',
          metadata: {
            type: 'text'
          },
        }
      )
    });

    const responseData = await response.json();
    console.log("API response:", responseData);

    if (!response.ok) {
      throw new Error(`Failed to update text: ${response.statusText} - ${JSON.stringify(responseData)}`);
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error: any) {
    console.error("Training error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to train chatbot" },
      { status: 500 }
    );
  }
} 