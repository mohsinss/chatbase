import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import ChatbotInterfaceSettings from "@/models/ChatbotInterfaceSettings";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const chatbotId = searchParams.get("chatbotId");

    const settings = await ChatbotInterfaceSettings.findOne({ chatbotId });
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch interface settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    const settings = await ChatbotInterfaceSettings.findOneAndUpdate(
      { chatbotId: body.chatbotId },
      body,
      { new: true, upsert: true }
    );

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save interface settings" }, { status: 500 });
  }
} 