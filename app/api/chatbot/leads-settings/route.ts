import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import ChatbotLeadsSettings from "@/models/ChatbotLeadsSettings";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const chatbotId = searchParams.get("chatbotId");

    const settings = await ChatbotLeadsSettings.findOne({ chatbotId });
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leads settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    const settings = await ChatbotLeadsSettings.findOneAndUpdate(
      { chatbotId: body.chatbotId },
      body,
      { new: true, upsert: true }
    );

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save leads settings" }, { status: 500 });
  }
} 