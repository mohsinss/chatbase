import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Chatbot from "@/models/Chatbot";
import { nanoid } from 'nanoid';
import DatasetModel from "@/models/Dataset";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { teamId, sources, name } = await req.json();
    const chatbotId = nanoid();

    await connectMongo();
    
    const chatbot = await Chatbot.create({
      chatbotId,
      teamId,
      name: name || `Chatbot ${new Date().toLocaleString()}`,
      sources,
      createdBy: session.user.id
    });
    
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
      datasetId: data.id, // Assuming 'data.id' contains the new dataset ID
      // vectorStoreId: null,
      // openaiAssistantId: null,
      text: null,
    });
    
    await newDataset.save();

    return NextResponse.json({ 
      chatbotId: chatbot.chatbotId,
      name: chatbot.name 
    });

  } catch (error: any) {
    console.error("Chatbot creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create chatbot" },
      { status: 500 }
    );
  }
} 