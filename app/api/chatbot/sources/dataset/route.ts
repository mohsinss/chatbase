import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import DatasetModel from "@/models/Dataset"; // Import your MongoDB model

export async function POST(req: Request) {
  try {
    const { chatbotId, name } = await req.json();

    // Connect to MongoDB
    await connectMongo();

    // Check for existing dataset ID in MongoDB
    let existingDataset = await DatasetModel.findOne({ chatbotId });

    if (existingDataset) {
      // If a dataset exists, return its ID
      return NextResponse.json({ id: existingDataset.datasetId });
    }

    // If no existing dataset, create a new one
    const response = await fetch("https://api.trieve.ai/api/dataset", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
        "TR-Organization": process.env.TRIEVE_ORG_ID!,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        dataset_name: name || `Chatbot Dataset ${chatbotId}`,
        server_configuration: {
          chunk_size: 512,
          chunk_overlap: 50
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Dataset creation failed:", data);
      throw new Error(data.message || "Failed to create dataset");
    }

    // Save the new dataset ID to MongoDB
    const newDataset = new DatasetModel({
      chatbotId,
      datasetId: data.id // Assuming 'data.id' contains the new dataset ID
    });
    
    await newDataset.save();

    // Return the newly created dataset ID
    return NextResponse.json({ datasetId: data.id });
  } catch (error) {
    console.error("Dataset creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create or retrieve dataset" },
      { status: 500 }
    );
  }
}
