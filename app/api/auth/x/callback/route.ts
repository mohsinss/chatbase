// app/api/chatbot/integrations/x/callback/route.ts (Next.js 14 App Router)
import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import X from '@/models/X';
import Chatbot from '@/models/Chatbot';

export async function GET(req: NextRequest) {
  const oauth_token = req.nextUrl.searchParams.get('oauth_token');
  const oauth_verifier = req.nextUrl.searchParams.get('oauth_verifier');
  const chatbotId = req.nextUrl.searchParams.get('chatbotId');

  const oauth_token_secret = req.cookies.get('oauth_token_secret')?.value;

  if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
    return new NextResponse('Missing OAuth parameters', { status: 400 });
  }

  const client = new TwitterApi({
    appKey: process.env.X_API_KEY!,
    appSecret: process.env.X_API_SECRET!,
    accessToken: oauth_token,
    accessSecret: oauth_token_secret,
  });

  // Complete login and get access tokens
  const { accessToken, accessSecret, client: loggedInClient } = await client.login(oauth_verifier);

  // Fetch user information
  const userData = await loggedInClient.currentUser();

  // Save user data along with tokens
  await X.findOneAndUpdate(
    { userId: userData.id_str },
    {
      chatbotId,
      accessToken,
      accessSecret,
      userId: userData.id_str,
      username: userData.screen_name,
      name: userData.name,
      profileImageUrl: userData.profile_image_url_https,
    },
    {
      new: true,
      upsert: true,
    }
  );

  // Update Chatbot's integration flag
  await Chatbot.findOneAndUpdate(
    { chatbotId },
    { $set: { "integrations.x": true } },
    { new: true }
  );

  // Subscribe user to webhook for Account Activity
  try {
    const appClient = new TwitterApi({
      appKey: process.env.X_API_KEY!,
      appSecret: process.env.X_API_SECRET!,
      accessToken,
      accessSecret,
    });

    const envName = process.env.X_ENV_NAME!; // e.g., 'dev'
    await appClient.v1.post(`account_activity/all/${envName}/subscriptions.json`);
    console.log(`Webhook subscription successful for user ${userData.screen_name}`);
  } catch (error) {
    console.error('Webhook subscription failed:', error);
    // Optional: return error response or continue
  }
  
  // Close popup window
  return new NextResponse(`
    <html>
      <body>
        <script>
          window.opener.postMessage({ success: true, platform: 'x' }, '*');
          window.close();
        </script>
      </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' },
  });
}
