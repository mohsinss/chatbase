import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Chatbot from "@/models/Chatbot";
import { nanoid } from 'nanoid';

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