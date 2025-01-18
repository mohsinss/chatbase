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
    
    if (!existingDataset) {
      return NextResponse.json(
        { error: "No dataset found for this chatbot" },
        { status: 404 }
      );
    }

    // Log the existing dataset details
    console.log("Found existing dataset:", {
      id: existingDataset._id,
      chatbotId: existingDataset.chatbotId,
      vectorStoreId: existingDataset.vectorStoreId,
      openaiAssistantId: existingDataset.openaiAssistantId
    });

    try {
      // Create vector store if it doesn't exist
      if (!existingDataset.vectorStoreId) {
        console.log("Creating new vector store for chatbot:", chatbotId);
        const vectorStoreId = await createVectorStore(chatbotId);
        
        try {
          // Log the query parameters
          console.log("Update query:", {
            filter: { chatbotId },
            update: { $set: { vectorStoreId } },
            existingDataset: existingDataset._id
          });

          // Perform update with error catching
          const updatedDataset = await DatasetModel.findOneAndUpdate(
            { chatbotId: chatbotId },
            { $set: { vectorStoreId: vectorStoreId } },
            { 
              new: true, 
              runValidators: true,
              // Add this to get more detailed error information
              validateBeforeSave: true
            }
          );

          // Log the raw response
          console.log("Raw MongoDB response:", updatedDataset);

          if (!updatedDataset) {
            // Check if the document still exists
            const checkDataset = await DatasetModel.findOne({ chatbotId });
            console.log("Document check after failed update:", checkDataset);
            throw new Error("Dataset not found during update");
          }

          if (!updatedDataset.vectorStoreId) {
            console.error("Vector store ID not set after update");
            throw new Error("Vector store ID update failed");
          }

          existingDataset = updatedDataset;
          console.log("Successfully updated dataset with vector store ID:", existingDataset.vectorStoreId);
        } catch (updateError) {
          // Enhanced error logging
          console.error("Detailed update error:", {
            name: updateError.name,
            message: updateError.message,
            stack: updateError.stack,
            // If it's a MongoDB error, it might have additional details
            code: updateError.code,
            keyPattern: updateError.keyPattern,
            keyValue: updateError.keyValue
          });
          throw updateError;
        }
      } else {
        console.log("Clearing existing vector store:", existingDataset.vectorStoreId);
        await clearVectorStore(existingDataset.vectorStoreId);
      }

      // Create assistant if it doesn't exist
      if (!existingDataset.openaiAssistantId) {
        console.log("Creating new assistant for chatbot:", chatbotId);
        const assistantId = await createAssistantWithFiles(existingDataset.vectorStoreId);
        
        try {
          // Update using findOneAndUpdate to ensure atomic operation
          const updatedDataset = await DatasetModel.findOneAndUpdate(
            { chatbotId: chatbotId }, // Use chatbotId instead of _id
            { $set: { openaiAssistantId: assistantId } },
            { new: true, runValidators: true }
          );

          if (!updatedDataset) {
            console.error("No dataset found during assistant update");
            throw new Error("Dataset not found during assistant update");
          }

          if (!updatedDataset.openaiAssistantId) {
            console.error("Assistant ID not set after update");
            throw new Error("Assistant ID update failed");
          }

          existingDataset = updatedDataset;
          console.log("Successfully updated dataset with assistant ID:", existingDataset.openaiAssistantId);
        } catch (updateError) {
          console.error("Error updating dataset with assistant ID:", updateError);
          console.error("Dataset state:", existingDataset);
          throw new Error(`Failed to update dataset with assistant ID: ${updateError.message}`);
        }
      }

      const datasetsResponse = await fetch(
        `https://api.trieve.ai/api/dataset/files/${existingDataset.datasetId}/1`,
        {
          headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TRIEVE_API_KEY}`,
            "TR-Organization": process.env.NEXT_PUBLIC_TRIEVE_ORG_ID!,
            "TR-Dataset": existingDataset.datasetId,
          }
        }
      );

      if (!datasetsResponse.ok) {
        throw new Error(`Failed to fetch datasets: ${datasetsResponse.statusText}`);
      }

      const datasets = await datasetsResponse.json();

      if (!datasets.file_and_group_ids?.length) {
        return NextResponse.json(
          { error: "No files found in the chatbot dataset" },
          { status: 404 }
        );
      }

      console.log(`Processing ${datasets.file_and_group_ids.length} files`);

      for (const fileGroup of datasets.file_and_group_ids) {
        const fileId = fileGroup.file.id;
        console.log(`Processing file ID: ${fileId}`);

        const fileResponse = await fetch(
          `https://api.trieve.ai/api/file/${fileId}`,
          {
            headers: {
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TRIEVE_API_KEY}`,
              "TR-Organization": process.env.NEXT_PUBLIC_TRIEVE_ORG_ID!,
              "TR-Dataset": existingDataset.datasetId,
            }
          }
        );

        if (!fileResponse.ok) {
          console.error(`Failed to fetch file ${fileId}: ${fileResponse.statusText}`);
          continue;
        }

        const fileData = await fileResponse.json();
        
        const response = await fetch(fileData.s3_url);
        if (!response.ok) {
          console.error(`Failed to download file ${fileId} from S3: ${response.statusText}`);
          continue;
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        try {
          await addFileToVectorStore(existingDataset.vectorStoreId, buffer, fileData.file_name);
          console.log(`Successfully processed file ${fileId}`);
        } catch (error) {
          console.error(`Failed to add file ${fileId} to vector store:`, error);
        }
      }

      return NextResponse.json({
        success: true,
        vectorStoreId: existingDataset.vectorStoreId,
        assistantId: existingDataset.openaiAssistantId
      });

    } catch (error) {
      console.error("Error processing dataset:", error);
      throw error;
    }

  } catch (error: any) {
    console.error("Training error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to train chatbot" },
      { status: 500 }
    );
  }
} 