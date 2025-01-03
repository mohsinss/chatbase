import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state'); // This is our chatbotId
    
    if (!code || !state) {
      throw new Error("Missing code or state parameter");
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://graph.facebook.com/v17.0/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        code,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/chatbot/integrations/whatsapp/callback`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(`Failed to get access token: ${JSON.stringify(tokenData)}`);
    }

    // Get WhatsApp Business Account ID
    const wabaResponse = await fetch('https://graph.facebook.com/v17.0/me/whatsapp_business_account', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const wabaData = await wabaResponse.json();

    // Store the credentials
    await connectMongo();
    await mongoose.connection.collection('chatbotIntegrations').insertOne({
      chatbotId: state,
      platform: "whatsapp",
      credentials: {
        accessToken: tokenData.access_token,
        wabaId: wabaData.data[0]?.id,
        expiresAt: new Date(Date.now() + (tokenData.expires_in * 1000)),
      },
      userId: session.user.id,
      createdAt: new Date()
    });

    // Close the popup and notify the parent window
    return new NextResponse(`
      <html>
        <body>
          <script>
            window.opener.postMessage({ 
              type: 'WHATSAPP_AUTH_SUCCESS',
              success: true 
            }, '*');
            window.close();
          </script>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error) {
    console.error("WhatsApp callback error:", error);
    return new NextResponse(`
      <html>
        <body>
          <script>
            window.opener.postMessage({ 
              type: 'WHATSAPP_AUTH_ERROR',
              error: 'Failed to connect WhatsApp'
            }, '*');
            window.close();
          </script>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
} 