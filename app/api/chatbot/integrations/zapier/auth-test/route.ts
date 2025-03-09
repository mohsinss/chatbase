import { NextRequest, NextResponse } from 'next/server';
import Chatbot from '@/models/Chatbot';
import connectMongo from '@/libs/mongoose';

// Define an interface matching your Chatbot schema
interface ChatbotType {
    chatbotId: string;
    zapierKey: string;
    // add other fields if needed
}

export async function GET(request: NextRequest) {
    await connectMongo();

    const apiKey = request.headers.get('X-API-KEY') || request.nextUrl.searchParams.get('api_key');

    if (!apiKey) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chatbot = await Chatbot.findOne({ zapierKey: apiKey }).lean<ChatbotType>();

    if (!chatbot) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ success: true, chatbotId: chatbot.chatbotId }, { status: 200 });
}