import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import ChatbotNotificationSettings from "@/models/ChatbotNotificationSettings";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const chatbotId = searchParams.get("chatbotId");

    const settings = await ChatbotNotificationSettings.findOne({ chatbotId });
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notification settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    const settings = await ChatbotNotificationSettings.findOneAndUpdate(
      { chatbotId: body.chatbotId },
      body,
      { new: true, upsert: true }
    );

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save notification settings" }, { status: 500 });
  }
} 