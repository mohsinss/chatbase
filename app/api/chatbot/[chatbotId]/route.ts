import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Chatbot from "@/models/Chatbot";

export async function GET(
  req: Request,
  { params }: { params: { chatbotId: string } }
) {
  try {
    await dbConnect();
    const chatbot = await Chatbot.findOne({ chatbotId: params.chatbotId });
    return NextResponse.json(chatbot);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch chatbot" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { chatbotId: string } }
) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const chatbot = await Chatbot.findOneAndUpdate(
      { chatbotId: params.chatbotId },
      { $set: body },
      { new: true }
    );

    return NextResponse.json(chatbot);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update chatbot" }, { status: 500 });
  }
} 