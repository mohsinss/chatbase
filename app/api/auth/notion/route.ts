import { NextResponse } from 'next/server';

const NOTION_CLIENT_ID = process.env.NOTION_CLIENT_ID!;
const NOTION_REDIRECT_URI = process.env.NOTION_REDIRECT_URI!;
const NOTION_OAUTH_URL = 'https://api.notion.com/v1/oauth/authorize';

export async function GET(request: Request) {
  const params = new URLSearchParams({
    client_id: NOTION_CLIENT_ID,
    redirect_uri: NOTION_REDIRECT_URI,
    response_type: 'code',
    owner: 'user',
  });

  const authorizationUrl = `${NOTION_OAUTH_URL}?${params.toString()}`;

  return NextResponse.redirect(authorizationUrl);
}
