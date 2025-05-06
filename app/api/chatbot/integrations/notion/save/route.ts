import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import NotionIntegration from '@/models/NotionIntegration';

mongoose.connect(process.env.MONGODB_URI || '');

export async function POST(request: NextRequest) {
  try {
    const { chatbotId, code } = await request.json();

    if (!chatbotId || !code) {
      return NextResponse.json({ error: 'Missing chatbotId or code' }, { status: 400 });
    }

    // Exchange the authorization code for an access token with Notion API
    const NOTION_CLIENT_ID = process.env.NOTION_CLIENT_ID!;
    const NOTION_CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET!;
    const NOTION_REDIRECT_URI = process.env.NOTION_REDIRECT_URI!;
    const NOTION_TOKEN_URL = 'https://api.notion.com/v1/oauth/token';

    const tokenResponse = await fetch(NOTION_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${NOTION_CLIENT_ID}:${NOTION_CLIENT_SECRET}`).toString('base64'),
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: NOTION_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      return NextResponse.json({ error: `Failed to get access token: ${JSON.stringify(errorData)}` }, { status: 500 });
    }

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      return NextResponse.json({ error: 'No access token received' }, { status: 500 });
    }
    // Upsert NotionIntegration document with access token and refresh token if available
    const result = await NotionIntegration.findOneAndUpdate(
      { chatbotId },
      {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiry: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : undefined,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, message: 'Notion integration saved successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
