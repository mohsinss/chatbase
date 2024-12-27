import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ChatbotVisibilitySettings from "@/models/ChatbotVisibilitySettings";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const chatbotId = searchParams.get("chatbotId");

    if (!chatbotId) {
      return NextResponse.json(
        { error: "Chatbot ID is required" },
        { status: 400 }
      );
    }

    let settings = await ChatbotVisibilitySettings.findOne({ chatbotId });
    
    if (!settings) {
      settings = await ChatbotVisibilitySettings.create({ 
        chatbotId,
        isPublic: false 
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching visibility settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch visibility settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { chatbotId, isPublic } = body;

    if (!chatbotId) {
      return NextResponse.json(
        { error: "Chatbot ID is required" },
        { status: 400 }
      );
    }

    const settings = await ChatbotVisibilitySettings.findOneAndUpdate(
      { chatbotId },
      { isPublic },
      { new: true, upsert: true }
    );

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating visibility settings:", error);
    return NextResponse.json(
      { error: "Failed to update visibility settings" },
      { status: 500 }
    );
  }
} 