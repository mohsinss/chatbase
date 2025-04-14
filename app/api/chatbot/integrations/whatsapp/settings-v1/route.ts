import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import WhatsAppNumber from "@/models/WhatsAppNumber";
import Chatbot from "@/models/Chatbot";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const chatbotId = url.searchParams.get("chatbotId");

    await connectMongo();
    const chatbot = await Chatbot.findOne({ chatbotId });
    return NextResponse.json(chatbot?.settings ?? {});
}

export async function POST(req: Request) {
    const url = new URL(req.url);
    const chatbotId = url.searchParams.get("chatbotId");
    const settings = await req.json();

    await connectMongo();

    const updatedChatbot = await Chatbot.findOneAndUpdate(
        { chatbotId },
        { settings },
        { new: true, upsert: true }
    );

    if (!updatedChatbot) {
        return NextResponse.json({ success: false, message: "Update failed: Document not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, settings: updatedChatbot.settings });
}