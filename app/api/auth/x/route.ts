import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export async function GET(req: NextRequest) {
  const chatbotId = req.nextUrl.searchParams.get('chatbotId');

  const client = new TwitterApi({
    appKey: process.env.X_API_KEY!,
    appSecret: process.env.X_API_SECRET!,
  });

  const { url, oauth_token, oauth_token_secret } = await client.generateAuthLink(
    `${process.env.NEXTAUTH_URL}/api/auth/x/callback?chatbotId=${chatbotId}`
  );

  // Store oauth_token_secret temporarily (e.g., in cookies or database)
  const response = NextResponse.redirect(url);
  response.cookies.set('oauth_token_secret', oauth_token_secret, { httpOnly: true, secure: true });

  return response;
}