import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import WhatsAppNumber from "@/models/WhatsAppNumber";
import ChatbotConversation from "@/models/ChatbotConversation";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");

    await connectMongo();
    const chatConversation = await ChatbotConversation.findById(_id);

    if (!chatConversation) {
        return NextResponse.json({ error: "chatConversation is not found" }, { status: 404 });
    }

    return NextResponse.json(chatConversation);
}

export async function POST(req: Request) {
    const { _id, disable_auto_reply } = await req.json();

    if (typeof disable_auto_reply !== 'boolean') {
        return NextResponse.json({ error: "Invalid value for disable_auto_reply" }, { status: 400 });
    }

    await connectMongo();
    const chatConversation = await ChatbotConversation.findOneAndUpdate(
        { _id },
        { disable_auto_reply },
        { new: false }
    );

    if (!chatConversation) {
        return NextResponse.json({ error: "chatConversation is not found" }, { status: 404 });
    }

    return NextResponse.json(chatConversation);
}