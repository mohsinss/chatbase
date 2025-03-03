import connectMongo from "@/libs/mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import ChatbotConversation from '@/models/ChatbotConversation';
import { NextRequest, NextResponse } from 'next/server';
import FacebookPage from "@/models/FacebookPage";
import axios from "axios";

export async function POST(req: Request) {
    const { from, to, text } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Fetch the existing WhatsAppNumber model
    const facebookPage = await FacebookPage.findOne({ name: to });
    if (!facebookPage) {
        // Respond with a 200 OK status
        return NextResponse.json({ status: "facebookPage doesn't registered to the site." }, { status: 200 });
    }
    const chatbotId = facebookPage.chatbotId;
    const pageId = facebookPage.pageId;

    // send text msg to from number
    const response2 = await axios.post(`https://graph.facebook.com/v22.0/${pageId}/messages?access_token=${facebookPage.access_token}`, {
        messaging_type: "RESPONSE",
        message: {
            text: text
        },
        recipient: {
            id: from
        },
    }, {
        headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });

    // Find existing conversation or create a new one
    let conversation = await ChatbotConversation.findOne({ chatbotId, platform: "facebook", "metadata.from": from, "metadata.to": to });
    if (conversation) {
        // Update existing conversation
        conversation.messages.push({ role: "assistant", content: text, from: session.user.name });
    } else {
        return NextResponse.json({ error: "Can't find conversation." }, { status: 200 });
    }

    const res = await conversation.save();

    return NextResponse.json({ success: true }, { status: 200 });
}