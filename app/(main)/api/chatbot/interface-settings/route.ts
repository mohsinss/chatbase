import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ChatbotInterfaceSettings from "@/models/ChatbotInterfaceSettings";
import Chatbot from "@/models/Chatbot";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const chatbotId = searchParams.get("chatbotId");

    const settings = await ChatbotInterfaceSettings.findOne({ chatbotId });
    return NextResponse.json(settings || {});
  } catch (error) {
    console.error("Error fetching interface settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch interface settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { chatbotId, displayName, ...otherSettings } = body;

    const settings = await ChatbotInterfaceSettings.findOneAndUpdate(
      { chatbotId },
      { 
        displayName,
        ...otherSettings 
      },
      { upsert: true, new: true }
    );

    if (displayName) {
      await Chatbot.findOneAndUpdate(
        { chatbotId },
        { name: displayName }
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error saving interface settings:", error);
    return NextResponse.json(
      { error: "Failed to save interface settings" },
      { status: 500 }
    );
  }
} 