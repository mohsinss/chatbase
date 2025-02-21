import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth"; // Ensure this is correctly set up
import connectMongo from "@/libs/mongoose"; // Ensure this is correctly set up
import Chatbot from "@/models/Chatbot"; // Ensure this model is correctly defined

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // Access session immediately
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Access URL parameters immediately
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('teamId');

    // Validate teamId parameter
    if (!teamId) {
      return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
    }

    // Connect to MongoDB
    await connectMongo();

    // Fetch chatbots for the given team ID and created by the current user
    const chatbots = await Chatbot.find({ 
      teamId,
      // createdBy: session.user.id
    })
      .select('chatbotId name createdAt sourcesCount')
      .sort({ createdAt: -1 });

    return NextResponse.json({ chatbots });

  } catch (error) {
    console.error("Chatbot list error:", error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to list chatbots",
        details: error instanceof Error ? error.stack : undefined // Optional for debugging
      },
      { status: 500 }
    );
  }
}
