import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Chatbot from "@/models/Chatbot";
import ChatbotAISettings from "@/models/ChatbotAISettings";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatbotId } = await req.json();

    if (!chatbotId) {
      return NextResponse.json({ error: "Chatbot ID is required" }, { status: 400 });
    }

    await connectMongo();
    
    // Delete the chatbot and its associated data
    await Promise.all([
      Chatbot.deleteOne({ chatbotId }),
      ChatbotAISettings.deleteOne({ chatbotId }),
      // Add other collections that need to be cleaned up
    ]);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Chatbot deletion error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete chatbot" },
      { status: 500 }
    );
  }
} 