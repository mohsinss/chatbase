import connectMongo from "@/libs/mongoose";
import ChatbotConversation from '@/models/ChatbotConversation';
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function GET(request: Request) {
    await connectMongo();

    const chatbotId = "8_7wHq7EZZCTegegq5zSK";
    const from = "380663761344";
    const text = "received text";
    const response_text = "response text";

    const data = await openai.models.list({
    });

    // Find existing conversation or create a new one
    // let conversation = await ChatbotConversation.findOne({ chatbotId, platform: "whatsapp", "metadata.from": from });
    // if (conversation) {
    //     // Update existing conversation
    //     conversation.messages.push({ role: "user", content: text });
    //     conversation.messages.push({ role: "assistant", content: response_text });
    // } else {
    //     // Create new conversation
    //     conversation = new ChatbotConversation({
    //         chatbotId,
    //         platform: "whatsapp",
    //         metadata: { from },
    //         messages: [{ role: "user", content: text },
    //         { role: "assistant", content: response_text }
    //         ]
    //     });
    // }
    // const res = await conversation.save();

    return NextResponse.json({ data }, { status: 200 });
}