// app/api/whatsapp/send-verification/route.ts
import { NextResponse } from 'next/server';
import WhatsAppVerification from '@/models/WhatsAppVerification';
import { generateRandomCode } from '@/lib/utils'; // Implement your code generator
import connectDB from '@/lib/mongodb';

export async function POST(req: Request) {
  await connectDB();
  
  const { phoneNumber, wabaId, businessId, accessToken } = await req.json();

  // Generate verification code (6 digits)
  const verificationCode = generateRandomCode(6);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  // Save to MongoDB
  await WhatsAppVerification.create({
    phoneNumber,
    verificationCode,
    expiresAt,
    wabaId,
    businessId,
    accessToken,
    isVerified: false
  });

  // Send SMS using your preferred provider (Twilio, AWS SNS, etc.)
  await sendSMS(phoneNumber, `Your verification code is: ${verificationCode}`);

  return NextResponse.json({ success: true });
}

async function sendSMS(to: string, body: string) {
  // Implement using Twilio or other SMS service
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  const client = require('twilio')(accountSid, authToken);
  
  return client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: `+${to}`
  });
}