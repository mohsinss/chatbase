import connectMongo from "@/libs/mongoose";
import ChatbotConversation from '@/models/ChatbotConversation';
import { NextRequest, NextResponse } from 'next/server';
import WhatsAppNumber from "@/models/WhatsAppNumber";
import axios from "axios";

export async function POST(req: Request) {
    const { from, to, text } = await req.json();
    await connectMongo();

    // Fetch the existing WhatsAppNumber model
    const whatsappNumber = await WhatsAppNumber.findOne({ display_phone_number: to });
    if (!whatsappNumber) {
        // Respond with a 200 OK status
        return NextResponse.json({ status: "Whatsapp Number doesn't registered to the site." }, { status: 200 });
    }
    const chatbotId = whatsappNumber.chatbotId;
    const phone_number_id = whatsappNumber.phoneNumberId;

    // send text msg to from number
    const response2 = await axios.post(`https://graph.facebook.com/v22.0/${phone_number_id}/messages`, {
        messaging_product: "whatsapp",
        to: from,
        text: {
            body: text
        }
    }, {
        headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });

    // Find existing conversation or create a new one
    let conversation = await ChatbotConversation.findOne({ chatbotId, platform: "whatsapp", "metadata.from": from, "metadata.to": whatsappNumber.display_phone_number });
    if (conversation) {
        // Update existing conversation
        conversation.messages.push({ role: "assistant", content: text });
    } else {
        return NextResponse.json({ error: "Can't find conversation." }, { status: 200 });
    }

    const res = await conversation.save();

    return NextResponse.json({ success: true }, { status: 200 });
}