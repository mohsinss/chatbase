export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Team from "@/models/Team";
import Chatbot from "@/models/Chatbot";
import ChatbotConversation from "@/models/ChatbotConversation";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || ['admin@example.com'];
    
    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectMongo();

    // Get recent conversations with actual messages
    const recentConversations = await ChatbotConversation.find({
      'messages.0': { $exists: true },
    })
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();

    console.log(`Found ${recentConversations.length} conversations`);

    if (recentConversations.length === 0) {
      return NextResponse.json([]);
    }

    // Filter for conversations with user messages
    const validConversations = recentConversations.filter((conv: any) =>
      conv.messages?.some((msg: any) => msg.role === 'user' && msg.content?.trim())
    );

    console.log(`Found ${validConversations.length} valid conversations`);

    const activities = [];

    for (const conversation of validConversations.slice(0, 30)) {
      try {
        const chatbot = await Chatbot.findOne({ chatbotId: conversation.chatbotId }).lean();
        if (!chatbot) continue;

        const team = await Team.findOne({ teamId: (chatbot as any).teamId }).lean();
        if (!team) continue;

        const user = await User.findById((team as any).createdBy).lean();
        if (!user) continue;

        const messages = conversation.messages || [];
        const userMessage = messages.find((msg: any) => msg.role === 'user')?.content || 'No user message';
        const botResponse = messages.find((msg: any) => msg.role === 'assistant')?.content || 'No bot response';

        activities.push({
          userId: (user as any)._id.toString(),
          userName: (user as any).name,
          teamId: (team as any).teamId,
          chatbotId: (chatbot as any).chatbotId,
          chatbotName: (chatbot as any).name,
          timestamp: conversation.updatedAt || conversation.createdAt,
          userMessage: userMessage.substring(0, 200) + (userMessage.length > 200 ? '...' : ''),
          botResponse: botResponse.substring(0, 300) + (botResponse.length > 300 ? '...' : '')
        });
      } catch (error) {
        console.error('Error processing conversation:', error);
        continue;
      }
    }

    console.log(`Returning ${activities.length} activities`);
    return NextResponse.json(activities);

  } catch (error) {
    console.error("Admin recent activities fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent activities" },
      { status: 500 }
    );
  }
} 