// src/app/api/webhook/route.ts
import { NextResponse } from 'next/server';

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

    // Respond with a 200 OK status
    return NextResponse.json({ status: 'OK' }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}