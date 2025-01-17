import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatbotId, platform } = await req.json();

    // Generate state parameter to prevent CSRF
    const state = Buffer.from(JSON.stringify({
      chatbotId,
      platform,
      timestamp: Date.now()
    })).toString('base64');

    // Store state in session or database for verification
    
    // Construct Meta Business Platform OAuth URL
    const metaOAuthUrl = new URL('https://www.facebook.com/v19.0/dialog/oauth');
    metaOAuthUrl.searchParams.append('client_id', process.env.META_APP_ID!);
    metaOAuthUrl.searchParams.append('redirect_uri', `${process.env.NEXT_PUBLIC_APP_URL}/api/chatbot/integrations/meta-callback`);
    metaOAuthUrl.searchParams.append('state', state);
    metaOAuthUrl.searchParams.append('response_type', 'code');
    metaOAuthUrl.searchParams.append('scope', 'whatsapp_business_management,whatsapp_business_messaging');

    return NextResponse.json({ 
      url: metaOAuthUrl.toString(),
      status: "success" 
    });

  } catch (error) {
    console.error("Meta Business connection error:", error);
    return NextResponse.json(
      { error: "Failed to initiate Meta Business connection" },
      { status: 500 }
    );
  }
} 