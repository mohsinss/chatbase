import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import DatasetModel from "@/models/Dataset";

export async function POST(req: Request) {
  try {
    const { chatbotId, name, youtubeLinks } = await req.json();

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
      // Update youtubeLinks if provided
      if (youtubeLinks) {
        existingDataset.youtubeLinks = youtubeLinks;
        await existingDataset.save();
      }
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chatbotId = searchParams.get("chatbotId");

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
      // If a dataset exists, return its details
      return NextResponse.json(existingDataset);
    }

    // Return error if dataset not found
    return NextResponse.json(
      { error: "No dataset found for this chatbot" },
      { status: 404 }
    );

  } catch (error) {
    console.error("Dataset retrieval error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to retrieve dataset" },
      { status: 500 }
    );
  }
}
