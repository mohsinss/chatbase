import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Chatbot from "@/models/Chatbot";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const chatbotId = url.searchParams.get("chatbotId");

    await connectMongo();
    const chatbot = await Chatbot.findOne({ chatbotId });
    return NextResponse.json(chatbot?.settings?.facebook ?? {});
}

export async function POST(req: Request) {
    const url = new URL(req.url);
    const chatbotId = url.searchParams.get("chatbotId");
    const settings = await req.json();

    await connectMongo();

    const updatedChatbot = await Chatbot.findOneAndUpdate(
        { chatbotId },
        { $set: { "settings.facebook": settings } },
        { new: true, upsert: true }
    );

    if (!updatedChatbot) {
        return NextResponse.json({ success: false, message: "Update failed: Chatbot not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, settings: updatedChatbot.settings?.facebook });
}