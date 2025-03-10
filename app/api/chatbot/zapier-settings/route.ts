
import { NextRequest, NextResponse } from "next/server";
import Chatbot from "@/models/Chatbot";

export async function GET(req: NextRequest) {
  const chatbotId = req.nextUrl.searchParams.get("chatbotId");
  if (!chatbotId) {
    return NextResponse.json({ error: "chatbotId is required" }, { status: 400 });
  }

  try {
    const chatbot = await Chatbot.findOne({ chatbotId });
    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    return NextResponse.json({ zapierKey: chatbot.zapierKey });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    const { chatbotId, zapierKey } = await req.json();
  
    if (!chatbotId || !zapierKey) {
      return NextResponse.json({ error: "chatbotId and zapierKey are required" }, { status: 400 });
    }
  
    try {
      const chatbot = await Chatbot.findOneAndUpdate(
        { chatbotId },
        { zapierKey },
        { new: true }
      );
  
      if (!chatbot) {
        return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
      }
  
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }