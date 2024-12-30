import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Conversation from "@/models/Conversation";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await req.json();

    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 });
    }

    await connectMongo();
    await Conversation.deleteOne({ _id: conversationId });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Conversation deletion error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete conversation" },
      { status: 500 }
    );
  }
} 