import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (!code || !state) {
      throw new Error("Missing required parameters");
    }

    // Verify state parameter
    const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://graph.facebook.com/v19.0/oauth/access_token', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const tokenData = await tokenResponse.json();

    // Store the access token securely
    // Update your database with the WhatsApp integration details

    // Redirect back to the integrations page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/chatbot/${decodedState.chatbotId}/connect`);

  } catch (error) {
    console.error("Meta callback error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/error?message=Failed to connect WhatsApp`);
  }
} 