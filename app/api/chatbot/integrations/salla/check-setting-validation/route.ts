import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Chatbot from "@/models/Chatbot";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const chatbotId = body?.data?.chatbotId;

    // Log webhook data if enabled
    if (process.env.ENABLE_WEBHOOK_LOGGING_SALLA == "1") {
      try {
        const response = await fetch(process.env.ENDPOINT_LOGGING_SALLA, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          console.error(`Webhook logging error: ${response.status}`);
        }
      } catch (error) {
        console.error('Webhook logging error:', JSON.stringify(body));
        // Continue execution even if logging fails
      }
    }

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
      return NextResponse.json({ success: false, errors: "Invalid chatbotId" });
    }
  } catch (error) {
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
