import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import WhatsAppNumber from "@/models/WhatsAppNumber";
import Chatbot from "@/models/Chatbot";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { chatbotId, wabaId, phoneNumberId } = await req.json();

    // Check if all required parameters are provided
    if (!chatbotId || !wabaId || !phoneNumberId) {
      return NextResponse.json({ success: false, message: 'Missing required parameters' });
    }

    await connectMongo();

    // Subscribe App to webhook
    const response1 = await axios.post(`https://graph.facebook.com/v22.0/${wabaId}/subscribed_apps`, {}, {
      headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });
    if (!response1.data.success) {
      return NextResponse.json({ success: false, message: response1.data.error?.message || 'App Subscription failed.' });
    }

    // Register phone number to Business
    const response2 = await axios.post(`https://graph.facebook.com/v22.0/${phoneNumberId}/register`, {
      messaging_product: "whatsapp",
      pin: "111111"
    }, {
      headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });
    if (!response2.data.success) {
      return NextResponse.json({ success: false, message: response2.data.error?.message || 'Phone Number Registration failed.' });
    }

    // Retrive Phone Number and save.
    const response3 = await axios.get(`https://graph.facebook.com/v22.0/${phoneNumberId}`, {
      headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });
    const data = response3.data;

    // Find WhatsAppNumber with phoneNumberId and update it
    const whatsappNumber = await WhatsAppNumber.findOneAndUpdate(
      { phoneNumberId }, // find a document with phoneNumberId
      {
        // update these fields
        chatbotId,
        wabaId,
        phoneNumberId,
        verified_name: data.verified_name,
        code_verification_status: data.code_verification_status,
        display_phone_number: data.display_phone_number,
        quality_rating: data.quality_rating,
        platform_type: data.platform_type,
        last_onboarded_time: data.last_onboarded_time,
      },
      {
        new: true, // return the new WhatsAppNumber instead of the old one
        upsert: true, // make this update into an upsert
      }
    );

    // Find the Chatbot with chatbotId and update it
    const chatbot = await Chatbot.findOneAndUpdate(
      { chatbotId }, // find a document with chatbotId
      {
        // update the integrations field
        $set: { "integrations.whatsapp": true }
      },
      {
        new: true, // return the new Chatbot instead of the old one
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving WhatsApp credentials:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 