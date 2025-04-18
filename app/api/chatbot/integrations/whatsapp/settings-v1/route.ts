import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Chatbot from "@/models/Chatbot";

/**
 * GET handler for retrieving WhatsApp reaction settings for a chatbot
 * @param req Request object
 * @returns JSON response with WhatsApp settings or empty object
 */
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const chatbotId = url.searchParams.get("chatbotId");

        if (!chatbotId) {
            return NextResponse.json(
                { success: false, message: "Missing required parameter: chatbotId" },
                { status: 400 }
            );
        }

        await connectMongo();
        const chatbot = await Chatbot.findOne({ chatbotId });
        
        if (!chatbot) {
            return NextResponse.json(
                { success: false, message: "Chatbot not found" },
                { status: 404 }
            );
        }

        // Return WhatsApp settings or empty object if not set
        return NextResponse.json({
            ...chatbot?.settings?.whatsapp ?? {}
        });
    } catch (error) {
        console.error("Error retrieving WhatsApp settings:", error);
        return NextResponse.json(
            { success: false, message: "Failed to retrieve WhatsApp settings" },
            { status: 500 }
        );
    }
}

/**
 * POST handler for updating WhatsApp reaction settings for a chatbot
 * @param req Request object with settings in body
 * @returns JSON response with updated settings
 */
export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const chatbotId = url.searchParams.get("chatbotId");

        if (!chatbotId) {
            return NextResponse.json(
                { success: false, message: "Missing required parameter: chatbotId" },
                { status: 400 }
            );
        }

        const settings = await req.json();

        await connectMongo();

        const updatedChatbot = await Chatbot.findOneAndUpdate(
            { chatbotId },
            { $set: { "settings.whatsapp": settings } },
            { new: true, upsert: true }
        );

        if (!updatedChatbot) {
            return NextResponse.json(
                { success: false, message: "Update failed: Document not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            settings: updatedChatbot.settings?.whatsapp
        });
    } catch (error) {
        console.error("Error updating WhatsApp settings:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update WhatsApp settings" },
            { status: 500 }
        );
    }
}
