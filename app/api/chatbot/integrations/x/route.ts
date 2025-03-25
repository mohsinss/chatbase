import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import X from "@/models/X";
import Chatbot from "@/models/Chatbot";
import axios from "axios";

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { userId, chatbotId } = await req.json();

        // Check if userId is provided
        if (!userId) {
            return new NextResponse("userId is missing.", { status: 400 });
        }

        // Check if chatbotId is provided
        if (!userId) {
            return new NextResponse("chatbotId is missing.", { status: 400 });
        }

        await connectMongo();
        const result = await X.deleteOne({ userId });

        if (result.deletedCount > 0) {
            // Check if there are any more numbers for this chatbotId
            const remainingNumbers = await X.find({ chatbotId });
            if (remainingNumbers.length === 0) {
                // Find the Chatbot with chatbotId and update integrations.whatsapp to false
                const chatbot = await Chatbot.findOneAndUpdate(
                    { chatbotId }, // find a document with chatbotId
                    {
                        // update the integrations field
                        $set: { "integrations.x": false }
                    },
                    {
                        new: true, // return the new Chatbot instead of the old one
                    }
                );
            }

            return NextResponse.json({ message: "Deleted successfully" });
        } else {
            return new NextResponse("Not Found", { status: 404 });
        }
    } catch (error) {
        console.error("WhatsApp number deletion error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    const chatbotId = url.searchParams.get("chatbotId");

    await connectMongo();
    const Xs = await X.find({ chatbotId });
    return NextResponse.json(Xs);
}