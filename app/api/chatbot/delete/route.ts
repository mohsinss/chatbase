import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Chatbot from "@/models/Chatbot";
import ChatbotAISettings from "@/models/ChatbotAISettings";
import DatasetModel from "@/models/Dataset";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatbotId } = await req.json();

    if (!chatbotId) {
      return NextResponse.json({ error: "Chatbot ID is required" }, { status: 400 });
    }

    await connectMongo();

    // Check for existing dataset ID in MongoDB
    let existingDataset = await DatasetModel.findOne({ chatbotId });

    if (existingDataset) {
      // If a dataset exists, delete it using the external API
      const datasetId = existingDataset.datasetId; // Assuming _id is the dataset ID
      const options = {
        method: 'DELETE',
        headers: { 'TR-Dataset': datasetId, Authorization: `Bearer ${process.env.TRIEVE_API_KEY}` }
      };

      await fetch(`https://api.trieve.ai/api/dataset/${datasetId}`, options)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to delete dataset');
          }
          return response.json();
        })
        .then(response => console.log(response))
        .catch(err => console.error(err));

      await DatasetModel.deleteOne({ datasetId });
    }

    // Delete the chatbot and its associated data
    await Promise.all([
      Chatbot.deleteOne({ chatbotId }),
      ChatbotAISettings.deleteOne({ chatbotId }),
      // Add other collections that need to be cleaned up
    ]);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Chatbot deletion error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete chatbot" },
      { status: 500 }
    );
  }
} 