import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Chatbot from "@/models/Chatbot";

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { 
      chatbotId, 
      name, 
      characterCount, 
      creditLimitEnabled, 
      creditLimit 
    } = await request.json();

    const updatedChatbot = await Chatbot.findOneAndUpdate(
      { chatbotId },
      { 
        name,
        characterCount,
        creditLimitEnabled,
        creditLimit
      },
      { new: true }
    );

    if (!updatedChatbot) {
      return NextResponse.json(
        { error: "Chatbot not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ chatbot: updatedChatbot });
  } catch (error) {
    console.error("Failed to update chatbot:", error);
    return NextResponse.json(
      { error: "Failed to update chatbot" },
      { status: 500 }
    );
  }
} 