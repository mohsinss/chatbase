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

  const { accessToken, accessSecret } = await client.login(oauth_verifier);

  await X.create({
    chatbotId,
    accessToken,
    accessSecret,
  });

  // Find the Chatbot with chatbotId and update it
  const chatbot = await Chatbot.findOneAndUpdate(
    { chatbotId }, // find a document with chatbotId
    {
      // update the integrations field
      $set: { "integrations.x": true }
    },
    {
      new: true, // return the new Chatbot instead of the old one
    }
  );

  // Return a simple HTML page that closes the popup window automatically
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