import { NextResponse } from "next/server";
import { TrieveSDK } from "trieve-ts-sdk";
import DatasetModel from "@/models/Dataset";
import connectMongo from "@/libs/mongoose";
import ChatbotModel from "@/models/Chatbot";

export const dynamic = 'force-dynamic';

// Handler for GET requests to retrieve file data
export async function GET(
  req: Request,
  { params }: { params: { fileId: string } }
) {
  const url = new URL(req.url);
  const datasetId = url.searchParams.get("datasetId"); // Extract datasetId from query parameters

  try {
    // Initialize the Trieve SDK with API key and organization ID
    const trieve = new TrieveSDK({
      apiKey: process.env.TRIEVE_API_KEY!,
      organizationId: process.env.TRIEVE_ORG_ID!
    });

    // Fetch file data using the provided fileId and datasetId if needed
    const fileData = await trieve.getFile({
      fileId: params.fileId,
    });

    // Return the file data as a JSON response
    return NextResponse.json(fileData);
  } catch (error) {
    // Handle errors and return a JSON response with the error message
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get file" },
      { status: 500 }
    );
  }
}

// Handler for PUT requests to update a file
export async function PUT(
  req: Request,
  { params }: { params: { fileId: string } }
) {
  const body = await req.json();
  const url = new URL(req.url);
  const datasetId = url.searchParams.get("datasetId"); // Extract datasetId from query parameters

  // Check if datasetId is provided
  if (!datasetId) {
    return NextResponse.json(
      { error: "datasetId is required" },
      { status: 400 } // Bad Request
    );
  }

  await connectMongo();

  try {
    // Find the dataset using the datasetId and update the file record in the files array
    const updatedFile = await DatasetModel.findOneAndUpdate(
      { datasetId: datasetId, "files._id": params.fileId },
      {
        $set: {
          "files.$.charCount": body.charCount,
          "files.$.status": body.status,
          "files.$.text": body.text,
        }
      },
      { new: true } // This option returns the modified document
    );

    // Return the updated file data as a JSON response
    return NextResponse.json(updatedFile);
  } catch (error) {
    // Handle errors and return a JSON response with the error message
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update file" },
      { status: 500 }
    );
  }
}

// Handler for DELETE requests to delete a file and its associated chunks
export async function DELETE(
  req: Request,
  { params }: { params: { fileId: string } }
) {
  const url = new URL(req.url);
  const datasetId = url.searchParams.get("datasetId"); // Extract datasetId from query parameters
  const trieveId = url.searchParams.get("trieveId"); // Extract datasetId from query parameters
  const chatbotId = url.searchParams.get("chatbotId"); // Extract datasetId from query parameters
  
  console.log(`trieveId: ${trieveId}`); 
  
  // Check if datasetId is provided
  if (!datasetId) {
    return NextResponse.json(
      { error: "datasetId is required" },
      { status: 400 } // Bad Request
    );
  }

  // Check if chatbotId is provided
  if (!chatbotId) {
    return NextResponse.json(
      { error: "chatbotId is required" },
      { status: 400 } // Bad Request
    );
  }

  await connectMongo();

  try {
    // Find the dataset using the datasetId and remove the file record from the files array
    await DatasetModel.findOneAndUpdate(
      { datasetId: datasetId },
      { $pull: { files: { _id: params.fileId } } }
    );

    if (trieveId !== undefined && trieveId !== "undefined") {
      // Fetch the file metadata before deletion
      const response1 = await fetch(`https://api.trieve.ai/api/file/${trieveId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
          "TR-Organization": process.env.TRIEVE_ORG_ID!,
          "TR-Dataset": datasetId, // Use datasetId since it's guaranteed to be present
        }
      });

      // Check if the file metadata fetch was successful
      if (!response1.ok) {
        throw new Error(`Failed to fetch file metadata: ${response1.statusText}`);
      }

      const data = await response1.json();

      // Delete the file using the provided fileId
      const response = await fetch(`https://api.trieve.ai/api/file/${trieveId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
          "TR-Organization": process.env.TRIEVE_ORG_ID!,
          "TR-Dataset": datasetId, // Use datasetId since it's guaranteed to be present
        }
      });

      // Check if the file deletion was successful
      if (!response.ok) {
        throw new Error(`Failed to delete file: ${response.statusText}`);
      }

      // Delete associated chunks using the uniqueTag from the file metadata for pdftext files
      const response3 = await fetch(`https://api.trieve.ai/api/chunk`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
          "TR-Dataset": datasetId, // Use datasetId since it's guaranteed to be present
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            filter: {
              must: [
                {
                  field: "metadata.uniqueTag",
                  match_all: [data.metadata.uniqueTag]
                }
              ]
            }
          }
        )
      });

      // Check if the chunk deletion was successful
      if (!response3.ok) {
        throw new Error(`Failed to delete chunks: ${response3.statusText}`);
      }

      await ChatbotModel.findOneAndUpdate(
        { chatbotId },
        { $inc: { sourcesCount: -1 } }
      );
    }

    // Return a success response
    return NextResponse.json({ success: true });
  } catch (error) {
    // Handle errors and return a JSON response with the error message
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete file" },
      { status: 500 }
    );
  }
} 