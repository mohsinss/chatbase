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
    throw error;
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
  const file_id = await uploadFile(fileBuffer, fileName);
  const myVectorStoreFile  = await openai.beta.vectorStores.files.create(
    vectorStoreId,
    {
      file_id
    }
  );
  
  console.log("Added file to vector store:", myVectorStoreFile );
  return myVectorStoreFile ;
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
    const { chatbotId } = await req.json();
    
    if (!chatbotId) {
      return NextResponse.json({ error: "chatbotId is required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    let existingDataset = await DatasetModel.findOne({ chatbotId });

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