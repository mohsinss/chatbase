import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Chatbot from "@/models/Chatbot";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const chatbotId = body?.data?.chatbotId;

    if (!chatbotId || typeof chatbotId !== "string") {
      return NextResponse.json(
        { success: false, errors: ["chatbotId is missing or invalid"] },
        { status: 400 }
      );
    }

    await connectMongo();

    const chatbotExists = await Chatbot.exists({ chatbotId });

    if (chatbotExists) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, errors: ["Invalid chatbotId"] });
    }
  } catch (error) {
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
