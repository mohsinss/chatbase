import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ChatbotConversation from "@/models/ChatbotConversation";

export async function GET(
    req: Request,
    { params }: { params: { chatbotId: string } }
  ) {
    try {
      await dbConnect();
      const totalChats = await ChatbotConversation.countDocuments({ chatbotId: params.chatbotId });

      // Get total number of messages for the given chatbotId
      const totalMessages = await ChatbotConversation.aggregate([
        { $match: { chatbotId: params.chatbotId } },
        { $unwind: '$messages' },
        { $count: 'totalMessages' }
      ]);

      return NextResponse.json({
        totalChats,
        totalMessages: totalMessages[0] ? totalMessages[0].totalMessages : 0
      });
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch chatbot" }, { status: 500 });
    }
  }