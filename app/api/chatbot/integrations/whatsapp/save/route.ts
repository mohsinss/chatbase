import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { chatbotId, credentials } = await req.json();
    await connectMongo();

    // Save WhatsApp credentials to database
    await mongoose.connection.collection('chatbotIntegrations').insertOne({
      chatbotId,
      platform: "whatsapp",
      credentials: credentials,
      userId: session.user.id,
      createdAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving WhatsApp credentials:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 