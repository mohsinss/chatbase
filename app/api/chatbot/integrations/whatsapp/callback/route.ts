// import { headers } from 'next/headers';
// import { NextResponse } from 'next/server';

// export const dynamic = 'force-dynamic'; // This is the key line to fix the error
// export const runtime = 'edge'; // Optional: Use edge runtime for better performance

// export async function POST(request: Request) {
//   const headersList = headers();
  
//   try {
//     const body = await request.json();
    
//     // Your WhatsApp webhook handling logic here
    
//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (error) {
//     console.error('WhatsApp webhook error:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

// export async function GET(request: Request) {
//   const headersList = headers();
//   const mode = request.nextUrl.searchParams.get('hub.mode');
//   const token = request.nextUrl.searchParams.get('hub.verify_token');
//   const challenge = request.nextUrl.searchParams.get('hub.challenge');

//   // Verify webhook
//   if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
//     return new Response(challenge, { status: 200 });
//   }

//   return new Response('Forbidden', { status: 403 });
// } .