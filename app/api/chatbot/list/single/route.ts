import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Chatbot from "@/models/Chatbot";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const chatbotId = searchParams.get('chatbotId');

    if (!chatbotId) {
      return NextResponse.json(
        { error: "Chatbot ID is required" },
        { status: 400 }
      );
    }

    const chatbot = await Chatbot.findOne({ chatbotId }).lean();
    console.log('Found chatbot:', chatbot); // Debug log

    if (!chatbot) {
      return NextResponse.json(
        { error: "Chatbot not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ chatbot });
  } catch (error) {
    console.error("Failed to fetch chatbot:", error);
    return NextResponse.json(
      { error: "Failed to fetch chatbot" },
      { status: 500 }
    );
  }
} 