/**
 * WhatsApp webhook route handler
 */
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from "@/libs/mongoose";
import { extractMessageData } from '@/components/webhook/whatsapp/utils/helpers';
import { logWebhookData, logWebhookError } from '@/components/webhook/whatsapp/utils/logging';
import { handleTextMessage } from '@/components/webhook/whatsapp/handlers/textMessageHandler';
import { handleInteractiveMessage } from '@/components/webhook/whatsapp/handlers/interactiveMessageHandler';

/**
 * Handle GET request for webhook verification
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Verify token
  if (mode === 'subscribe' && token === 'your_verify_token') {
    return NextResponse.json(Number(challenge), { status: 200 });
  } else {
    return new NextResponse(null, { status: 403 });
  }
}

/**
 * Handle POST request for webhook events
 */
export async function POST(request: Request) {
  let data;
  try {
    // Parse the incoming request body with error handling
    try {
      data = await request.json();
    } catch (parseError) {
      console.error('Error parsing webhook request body:', parseError);
      // Log the raw request body for debugging
      const rawBody = await request.text();
      console.error('Raw request body:', rawBody.substring(0, 1000)); // Log first 1000 chars to avoid huge logs
      
      // Return a 200 response to acknowledge receipt to WhatsApp platform
      return NextResponse.json({ 
        error: 'Failed to parse request body',
        message: parseError.message
      }, { status: 200 });
    }

    // Log webhook data if enabled
    await logWebhookData(data);

    // Ensure MongoDB connection
    await connectMongo();

    // Extract message data
    const messageData = extractMessageData(data);
    
    // If no valid message data, return success
    if (!messageData) {
      return NextResponse.json({ status: 'No valid message data' }, { status: 200 });
    }

    const { 
      from, 
      phoneNumberId, 
      messageId, 
      timestamp, 
      type, 
      text, 
      interactive 
    } = messageData;

    let result;

    // Handle different message types
    if (type === 'text' && text) {
      result = await handleTextMessage(
        from,
        phoneNumberId,
        messageId,
        timestamp,
        text
      );
    } 
    else if (type === 'interactive' && interactive) {
      result = await handleInteractiveMessage(
        from,
        phoneNumberId,
        messageId,
        interactive
      );
    }
    else {
      // Unsupported message type
      result = {
        success: true,
        message: `Unsupported message type: ${type}`
      };
    }

    // Always respond with 200 OK to acknowledge receipt
    return NextResponse.json({ 
      status: 'OK', 
      result: result || 'No handler for this message type'
    }, { status: 200 });
  } catch (error) {
    // Log error
    await logWebhookError(error);
    
    // Always return 200 to acknowledge receipt to WhatsApp platform
    return NextResponse.json({ 
      error: 'An error occurred processing the webhook',
      message: error.message
    }, { status: 200 });
  }
}
