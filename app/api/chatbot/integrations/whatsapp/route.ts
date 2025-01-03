import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { chatbotId } = await req.json();

    // Meta OAuth URL for WhatsApp Business API
    const authUrl = `https://www.facebook.com/v17.0/dialog/oauth?` + 
      `client_id=${process.env.META_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(process.env.NEXTAUTH_URL + '/api/chatbot/integrations/whatsapp/callback')}` +
      `&scope=whatsapp_business_management,whatsapp_business_messaging,business_management` +
      `&state=${chatbotId}` +
      `&response_type=code` +
      `&display=popup`;

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("WhatsApp integration error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 