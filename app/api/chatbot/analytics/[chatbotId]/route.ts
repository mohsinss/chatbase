import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ChatbotConversation from "@/models/ChatbotConversation";

export async function POST(
    req: Request,
    { params }: { params: { chatbotId: string } }
  ) {
    try {
      await dbConnect();
      
      // Extract date range from request body
      const { startDate, endDate } = await req.json();

      // Convert dates to ISO format if necessary, or set to default if not provided
      const start = startDate ? new Date(startDate) : new Date(0); // Default to epoch start if no startDate
      const end = endDate ? new Date(endDate) : new Date(); // Default to current date if no endDate

      const totalChats = await ChatbotConversation.countDocuments({
        chatbotId: params.chatbotId,
        createdAt: { $gte: start, $lte: end } // Filter by date range
      });

      // Get total number of messages for the given chatbotId within the date range
      const totalMessages = await ChatbotConversation.aggregate([
        { $match: { 
            chatbotId: params.chatbotId,
            createdAt: { $gte: start, $lte: end } // Filter by date range
          } 
        },
        { $unwind: '$messages' },
        { $count: 'totalMessages' }
      ]);

      return NextResponse.json({
        totalChats,
        totalMessages: totalMessages[0] ? totalMessages[0].totalMessages : 0
      });
    } catch (error) {
      return NextResponse.json({ 
        error: "Failed to fetch chatbot chat analytics", 
        details: error.message
      }, { status: 500 });
    }
  }