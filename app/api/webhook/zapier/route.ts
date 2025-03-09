import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    // Get JSON payload from Zapier
    const eventData = await request.json();
  
    // Optional: Verify secret token from headers
    const ZAPIER_SECRET = process.env.ZAPIER_SECRET;
    const token = request.headers.get('x-zapier-secret');
  
    if (token !== ZAPIER_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    // Handle Zapier verification request (optional)
    if (eventData && eventData.type === 'test') {
      return Response.json({ success: true, message: 'Webhook verified successfully!' }, { status: 200 });
    }
  
    // Handle actual webhook event data
    console.log('Received webhook event:', eventData);
  
    // TODO: Add your custom logic here (e.g., save data to database, trigger actions, etc.)
  
    // Respond to Zapier to acknowledge receipt
    return Response.json({ success: true }, { status: 200 });
  }