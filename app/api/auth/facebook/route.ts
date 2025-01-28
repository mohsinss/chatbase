import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const { token } = await request.json();

  try {
    // Exchange for long-lived token
    const { data } = await axios.get(
      `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${token}`
    );

    return NextResponse.json({
      accessToken: data.access_token,
      expiresIn: data.expires_in
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Token exchange failed' },
      { status: 500 }
    );
  }
}