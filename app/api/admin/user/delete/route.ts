import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Team from "@/models/Team";
import Chatbot from "@/models/Chatbot";
import ChatbotConversation from "@/models/ChatbotConversation";
import Dataset from "@/models/Dataset";

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || ['admin@example.com'];

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    await connectMongo();

    // Get all teams owned by the user
    const teams = await Team.find({ 
      $or: [
        { createdBy: userId },
        { 'members.user': userId }
      ]
    });

    // Get all chatbots from these teams
    const chatbots = await Chatbot.find({
      teamId: { $in: teams.map(team => team.teamId) }
    });

    // Delete all datasets
    for (const chatbot of chatbots) {
      const dataset = await Dataset.findOne({ chatbotId: chatbot.chatbotId });
      if (dataset) {
        const options = {
          method: 'DELETE',
          headers: { 
            'TR-Dataset': dataset.datasetId, 
            Authorization: `Bearer ${process.env.TRIEVE_API_KEY}` 
          }
        };

        await fetch(`https://api.trieve.ai/api/dataset/${dataset.datasetId}`, options);
        await Dataset.deleteOne({ chatbotId: chatbot.chatbotId });
      }
    }

    // Delete all related data
    await Promise.all([
      User.deleteOne({ _id: userId }),
      Team.deleteMany({ 
        $or: [
          { createdBy: userId },
          { 'members.user': userId }
        ]
      }),
      Chatbot.deleteMany({ 
        teamId: { $in: teams.map(team => team.teamId) }
      }),
      ChatbotConversation.deleteMany({ 
        chatbotId: { $in: chatbots.map(bot => bot.chatbotId) }
      }),
    ]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("User deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
} 