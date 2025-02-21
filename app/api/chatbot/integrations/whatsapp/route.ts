import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import WhatsAppNumber from "@/models/WhatsAppNumber";
import axios from "axios";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { phoneNumberId, wabaId } = await req.json();

    // Check if chatbotId is provided
    if (!phoneNumberId) {
      return new NextResponse("PhoneNumberId is missing.", { status: 400 });
    }

    // Check if wabaId is provided
    if (!wabaId) {
      return new NextResponse("wabaId is missing.", { status: 400 });
    }
    
    // UnSubscribe App to webhook
    const response1 = await axios.delete(`https://graph.facebook.com/v22.0/${wabaId}/subscribed_apps`, {
      headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });
    if (!response1.data.success) {
      return NextResponse.json({ success: false, message: response1.data.error?.message || 'App Subscription failed.' });
    }

    // Deregister phone number to Business
    const response2 = await axios.post(`https://graph.facebook.com/v22.0/${phoneNumberId}/deregister`, {}, {
      headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });
    if (!response2.data.success) {
      return NextResponse.json({ success: false, message: response2.data.error?.message || 'Phone Number Registration failed.' });
    }

    await connectMongo();
    const result = await WhatsAppNumber.deleteOne({ phoneNumberId });

    if (result.deletedCount > 0) {
      return NextResponse.json({ message: "Deleted successfully" });
    } else {
      return new NextResponse("Not Found", { status: 404 });
    }
  } catch (error) {
    console.error("WhatsApp integration error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const chatbotId = url.searchParams.get("chatbotId");

  await connectMongo();
  const WhatsAppNumbers = await WhatsAppNumber.find({ chatbotId });
  return NextResponse.json(WhatsAppNumbers);

}

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