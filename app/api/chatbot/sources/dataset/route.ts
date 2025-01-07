import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import DatasetModel from "@/models/Dataset";

export async function POST(req: Request) {
  try {
    const { chatbotId, name } = await req.json();

    if (!chatbotId) {
      return NextResponse.json(
        { error: "chatbotId is required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectMongo();

    // Check for existing dataset ID in MongoDB
    let existingDataset = await DatasetModel.findOne({ chatbotId });

    if (existingDataset) {
      // If a dataset exists, return its ID
      return NextResponse.json({ id: existingDataset.datasetId });
    }

    // Return error if dataset not found
    return NextResponse.json(
      { error: "No dataset found for this chatbot" },
      { status: 404 }
    );
    
  } catch (error) {
    console.error("Dataset creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create or retrieve dataset" },
      { status: 500 }
    );
  }
}
