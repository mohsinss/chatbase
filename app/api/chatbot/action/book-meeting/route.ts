import { NextRequest, NextResponse } from 'next/server';

const CALCOM_API_BASE = 'https://api.cal.com';
const CALCOM_API_KEY = process.env.CALCOM_API_KEY;
const CALCOM_API_VERSION = '2024-06-14';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${CALCOM_API_BASE}/v1/bookings?apiKey=${CALCOM_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'cal-api-version': CALCOM_API_VERSION,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Booking failed' }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}