// src/app/api/webhook/instagram/route.ts
import { NextResponse } from 'next/server';
import connectMongo from '@/libs/mongoose';
import { 
  handleMessengerEvent,
  handleCommentEvent,
  handleLikeEvent
} from '@/components/webhook/instagram';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === 'your_verify_token') {
    return NextResponse.json(Number(challenge), { status: 200 });
  } else {
    return new NextResponse(null, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    // Parse the incoming request body
    const data = await request.json();

    // Log webhook data if enabled
    if (process.env.ENABLE_WEBHOOK_LOGGING_INSTAGRAM == "1") {
      try {
        const response = await fetch('http://webhook.mrcoders.org/instagram.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          console.error(`Webhook logging error: ${response.status}`);
        }
      } catch (error) {
        console.error('Webhook logging error:', JSON.stringify(data));
        // Continue execution even if logging fails
      }
    }

    if (!data?.entry?.length) {
      return NextResponse.json({ status: 'No entries found' }, { status: 200 });
    }

    await connectMongo();

    let result = {};

    // Handle direct messages
    if (data.entry[0]?.messaging?.length > 0) {
      result = await handleMessengerEvent(data);
    }

    // Handle comments
    else if (data.entry[0]?.changes?.length > 0 && data.entry[0]?.changes[0]?.field == "comments") {
      result = await handleCommentEvent(data);
    }

    // Handle likes
    else if (data.entry[0]?.changes?.length > 0 && data.entry[0]?.changes[0]?.field == "likes") {
      result = await handleLikeEvent(data);
    }

    // Respond with a 200 OK result
    return NextResponse.json({ result }, { status: 200 });
  } catch (error: any) {
    console.error('Error processing webhook event:', error);

    if (process.env.ENABLE_WEBHOOK_LOGGING_INSTAGRAM == "1") {
      try {
        await fetch('http://webhook.mrcoders.org/instagram-error.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(error),
        });
      } catch (logError) {
        console.error('Error logging webhook error:', logError);
      }
    }

    // Always return 200 to Instagram to prevent retries
    return NextResponse.json({ error: error.message }, { status: 200 });
  }
}
