// app/api/whatsapp/verify-code/route.ts
import { NextResponse } from 'next/server';
import WhatsAppConnectButton from '@/components/facebook/WhatsappConnectionButton';
import WhatsAppVerification from '@/models/WhatsAppVerification';
import connectMongo from "@/libs/mongoose";

export async function POST(req: Request) {
  await connectMongo();
  
  const { phoneNumber, code } = await req.json();
  
  const verification = await WhatsAppVerification.findOne({
    phoneNumber,
    verificationCode: code,
    expiresAt: { $gt: new Date() }
  });

  if (!verification) {
    return NextResponse.json(
      { error: 'Invalid or expired code' },
      { status: 400 }
    );
  }

  // Update verification status
  await WhatsAppVerification.updateOne(
    { _id: verification._id },
    { isVerified: true }
  );

  // Register phone number with WhatsApp Business API
  await registerWhatsAppNumber(
    verification.wabaId,
    verification.phoneNumber,
    verification.accessToken
  );

  return NextResponse.json({ success: true });
}

async function registerWhatsAppNumber(
  wabaId: string,
  phoneNumber: string,
  accessToken: string
) {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${wabaId}/phone_numbers`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        verified_name: 'Your Business Name',
        code: '123456' // Replace with actual code if needed
      })
    }
  );

  if (!response.ok) {
    throw new Error('Failed to register phone number');
  }
}