import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import Chatbot from "@/models/Chatbot";
import ChatbotConversation from "@/models/ChatbotConversation";
import Dataset from "@/models/Dataset";
import mongoose from "mongoose";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { teamId, chatbotIds } = await req.json();

    if (!teamId) {
      return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
    }

    await connectMongo();

    // Verify the user is the team owner
    const team = await Team.findOne({ teamId });
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Convert both IDs to strings for comparison
    const teamOwnerId = team.createdBy.toString();
    const userId = session.user.id.toString();

    if (teamOwnerId !== userId) {
      return NextResponse.json({ error: "Only team owners can delete teams" }, { status: 403 });
    }

    // Delete all chatbots' datasets
    for (const chatbotId of chatbotIds) {
      const dataset = await Dataset.findOne({ chatbotId });
      if (dataset) {
        const options = {
          method: 'DELETE',
          headers: { 
            'TR-Dataset': dataset.datasetId, 
            Authorization: `Bearer ${process.env.TRIEVE_API_KEY}` 
          }
        };

        await fetch(`https://api.trieve.ai/api/dataset/${dataset.datasetId}`, options);
        await Dataset.deleteOne({ chatbotId });
      }
    }

    // Delete all related data
    await Promise.all([
      Team.deleteOne({ teamId }),
      Chatbot.deleteMany({ teamId }),
      ChatbotConversation.deleteMany({ chatbotId: { $in: chatbotIds } }),
    ]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Team deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete team" },
      { status: 500 }
    );
  }
} 