import { NextRequest, NextResponse } from 'next/server';
import ZapierHookUrl from '@/models/ZapierHookUrl';
import Lead from '@/models/Lead';
import connectMongo from '@/libs/mongoose';
import Chatbot from '@/models/Chatbot';

// Define an interface matching your Chatbot schema
interface ChatbotType {
    chatbotId: string;
    zapierKey: string;
    // add other fields if needed
}

// Helper function to validate API key
async function validateApiKey(request: NextRequest) {
    const apiKeyFromHeader = request.headers.get('X-API-KEY');
    const apiKeyFromQuery = request.nextUrl.searchParams.get('api_key');
    const apiKey = apiKeyFromHeader || apiKeyFromQuery;

    if (!apiKey) return false;

    await connectMongo();

    const chatbot = await Chatbot.findOne({ zapierKey: apiKey }).lean<ChatbotType>();

    if (!chatbot) {
        return false;
    }

    return chatbot.chatbotId;
}

// POST handler for subscribing (Zapier integration)
export async function GET(request: NextRequest) {
    if (!(await validateApiKey(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const recentLeads = await Lead.find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

    return NextResponse.json(recentLeads, { status: 200 });
}

// POST handler for subscribing (Zapier integration)
export async function POST(request: NextRequest) {
    const chatbotId = await validateApiKey(request);
    if (!chatbotId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reqData = await request.json();
    const { hookUrl } = reqData;

    console.log(reqData);

    if (!hookUrl || !chatbotId ) {
        console.log('Missing required fields');
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        const newHook = await ZapierHookUrl.create({ hookUrl, chatbotId });
        return NextResponse.json({ message: 'Zapier hook subscribed successfully', data: newHook }, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Hook URL already subscribed' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Subscription failed', details: error.message }, { status: 500 });
    }
}

// DELETE handler for unsubscribing (Zapier integration)
export async function DELETE(request: NextRequest) {
    if (!validateApiKey(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { hookUrl } = await request.json();

    if (!hookUrl) {
        return NextResponse.json({ error: 'hookUrl is required' }, { status: 400 });
    }

    try {
        const deletedHook = await ZapierHookUrl.findOneAndDelete({ hookUrl });

        if (!deletedHook) {
            return NextResponse.json({ error: 'Hook URL not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Zapier hook unsubscribed successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Unsubscription failed', details: error.message }, { status: 500 });
    }
}