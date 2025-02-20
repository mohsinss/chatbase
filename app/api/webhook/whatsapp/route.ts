// src/app/api/webhook/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

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

    // Process the incoming message or message status
    console.log('Received webhook event:', data);
    // Send data to the specified URL
    const response = await fetch('http://webhook.mrcoders.org/whatsapp.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (data?.entry?.changes?.value?.messages[0]?.type == "text") {
      const from = data?.entry?.changes?.value?.messages[0]?.from;
      const phone_number_id = data?.entry?.changes?.value?.metadata.phone_number_id;
      const text = data?.entry?.changes?.value?.messages[0]?.text?.body;
      
      const response1 = await axios.post(`https://graph.facebook.com/v22.0/${phone_number_id}/messages`, {
        messaging_product: "whatsapp",
        to: from,
        text: {
            body: text
        }
      }, {
        headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
      });
      
    }

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Respond with a 200 OK status
    return NextResponse.json({ status: 'OK' }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}