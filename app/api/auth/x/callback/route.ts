// app/api/chatbot/integrations/x/callback/route.ts (Next.js 14 App Router)
import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

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

  console.log('x.callback')
  console.log(accessToken, accessSecret)
  // Save these credentials securely in your database associated with chatbotId
  // ...

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