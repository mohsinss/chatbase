import { NextRequest } from 'next/server';
import connectMongo from "@/libs/mongoose";
import ChatbotConversation from "@/models/ChatbotConversation";

export async function POST(req: NextRequest) {
  try {
    const { chatbotId, messages, createNew, conversationId } = await req.json();
    await connectMongo();

    let conversation;

    if (createNew) {
      // Create a new conversation
      conversation = await ChatbotConversation.create({
        chatbotId,
        messages: [],
      });
    } else if (conversationId) {
      // Update existing conversation
      conversation = await ChatbotConversation.findByIdAndUpdate(
        conversationId,
        { messages },
        { new: true }
      );
    }

    return new Response(JSON.stringify(conversation), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to save conversation' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const chatbotId = req.nextUrl.searchParams.get('chatbotId');
    await connectMongo();

    // Find all conversations for this chatbot, sorted by latest first
    const conversations = await ChatbotConversation.find({ chatbotId })
      .sort({ updatedAt: -1 });

    return new Response(JSON.stringify(conversations), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch conversations' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 