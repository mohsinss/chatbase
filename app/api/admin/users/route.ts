export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Team from "@/models/Team";
import Chatbot from "@/models/Chatbot";
import ChatbotConversation from "@/models/ChatbotConversation";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    let ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || ['admin@example.com']; // Same as auth route
    
    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectMongo();

    // Get all users with their teams, chatbots, and plan
    const users = await User.find().select('name email plan').lean();

    // Enhance user data with teams and chatbots
    const enhancedUsers = await Promise.all(users.map(async (user) => {
      const teams = await Team.find({ createdBy: user._id }).lean();
      
      const enhancedTeams = await Promise.all(teams.map(async (team) => {
        const chatbots = await Chatbot.find({ teamId: team.teamId }).lean();
        
        const enhancedChatbots = await Promise.all(chatbots.map(async (chatbot) => {
          const conversationCount = await ChatbotConversation.countDocuments({
            chatbotId: chatbot.chatbotId
          });
          
          return {
            ...chatbot,
            conversationCount
          };
        }));

        return {
          ...team,
          chatbots: enhancedChatbots
        };
      }));

      return {
        ...user,
        teams: enhancedTeams,
        totalTeams: teams.length,
        totalChatbots: enhancedTeams.reduce((acc, team) => acc + team.chatbots.length, 0),
        plan: user.plan || 'Free' // Ensure plan is included with a default value
      };
    }));

    return NextResponse.json(enhancedUsers);
  } catch (error) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users data" },
      { status: 500 }
    );
  }
} 