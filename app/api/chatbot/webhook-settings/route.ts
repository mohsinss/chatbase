import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import ChatbotWebhookSettings from "@/models/ChatbotWebhookSettings";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const chatbotId = searchParams.get("chatbotId");

    const settings = await ChatbotWebhookSettings.findOne({ chatbotId });
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch webhook settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    const settings = await ChatbotWebhookSettings.findOneAndUpdate(
      { chatbotId: body.chatbotId },
      body,
      { new: true, upsert: true }
    );

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save webhook settings" }, { status: 500 });
  }
} 