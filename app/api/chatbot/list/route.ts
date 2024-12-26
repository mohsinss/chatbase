import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Chatbot from "@/models/Chatbot";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
    }

    await connectMongo();
    
    const chatbots = await Chatbot.find({ 
      teamId,
      createdBy: session.user.id 
    }).select('chatbotId name createdAt').sort({ createdAt: -1 });

    console.log('Found chatbots:', chatbots); // Debug log

    return NextResponse.json({ chatbots });

  } catch (error: any) {
    console.error("Chatbot list error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to list chatbots" },
      { status: 500 }
    );
  }
} 