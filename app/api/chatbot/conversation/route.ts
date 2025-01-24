import { NextRequest } from 'next/server';
import connectMongo from "@/libs/mongoose";
import ChatbotConversation from "@/models/ChatbotConversation";

interface ChatMessage {
  content?: string;
  // Add other message properties if needed
}

export async function POST(req: NextRequest) {
  try {
    const { chatbotId, messages, createNew, conversationId } = await req.json();
    await connectMongo();

    let conversation;

    // Only create or update if there are actual messages
    const hasValidMessages = messages && messages.some((m: ChatMessage) => m.content?.trim());

    if (createNew) {
      // Create a new conversation only if needed
      conversation = await ChatbotConversation.create({
        chatbotId,
        messages: [],
      });
    } else if (conversationId && hasValidMessages) {
      // Update existing conversation only if there are valid messages
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

    // Find all conversations with actual messages
    const conversations = await ChatbotConversation.find({
      chatbotId,
      'messages.0': { $exists: true }, // Has at least one message
    }).sort({ updatedAt: -1 });

    // Additional filter for conversations with non-empty messages
    const validConversations = conversations.filter(conv => 
      conv.messages.some((m: ChatMessage) => m.content?.trim())
    );

    return new Response(JSON.stringify(validConversations), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch conversations' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}