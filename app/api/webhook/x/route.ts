import crypto from 'crypto';
import { NextResponse } from 'next/server';
import axios from 'axios';
// Securely store your secret in environment variables
const consumerSecret = process.env.CONSUMER_SECRET;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const crcToken = searchParams.get('crc_token');

    if (crcToken) {
        const hash = crypto
            .createHmac('sha256', consumerSecret)
            .update(crcToken)
            .digest('base64');
        const responseToken = 'sha256=' + hash;

        return Response.json({ response_token: responseToken });
    } else {
        return new Response('Error: crc_token missing', { status: 400 });
    }
}

export async function POST(req: Request) {
    const body = await req.json();
    console.log('Event received:', body);
    return new Response(null, { status: 200 });
}

// Specify Node.js runtime for crypto module
export const runtime = 'nodejs';
