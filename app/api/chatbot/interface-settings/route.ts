import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import ChatbotInterfaceSettings from "@/models/ChatbotInterfaceSettings";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const chatbotId = searchParams.get("chatbotId");

    if (!chatbotId) {
      return NextResponse.json({ error: "Chatbot ID is required" }, { status: 400 });
    }

    const settings = await ChatbotInterfaceSettings.findOne({ chatbotId });
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { chatbotId, ...settings } = body;

    if (!chatbotId) {
      return NextResponse.json({ error: "Chatbot ID is required" }, { status: 400 });
    }

    const updatedSettings = await ChatbotInterfaceSettings.findOneAndUpdate(
      { chatbotId },
      {
        chatbotId,
        initialMessage: settings.initialMessage,
        messagePlaceholder: settings.messagePlaceholder,
        userMessageColor: settings.userMessageColor,
        theme: settings.theme,
        displayName: settings.displayName,
        footerText: settings.footerText,
        syncColors: settings.syncColors,
        roundedHeaderCorners: settings.roundedHeaderCorners,
        roundedChatCorners: settings.roundedChatCorners,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(updatedSettings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
} 