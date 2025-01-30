// src/app/api/webhook/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // const body = await request.json();
  
  // Verify webhook challenge
  // const mode = request.nextUrl.searchParams.get('hub.mode');
  // const token = request.nextUrl.searchParams.get('hub.verify_token');
  // const challenge = request.nextUrl.searchParams.get('hub.challenge');
 

  // Handle incoming messages
  return NextResponse.json({
    aaa:1,
  });
}