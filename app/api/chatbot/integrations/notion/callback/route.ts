
const NOTION_CLIENT_ID = process.env.NOTION_CLIENT_ID!;
const NOTION_CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET!;
const NOTION_REDIRECT_URI = 'http://localhost:3000/api/chatbot/integrations/notion/callback';
const NOTION_TOKEN_URL = 'https://api.notion.com/v1/oauth/token';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  const html = `
    <html>
      <head>
        <script>
          (function() {
            function sendMessage() {
              if (window.opener) {
                window.opener.postMessage(
                  {
                    type: 'notion-auth-callback',
                    code: '${code}',
                    error: '${error}'
                  },
                  window.location.origin
                );
                window.close();
              } else {
                document.body.innerText = 'No opener window found.';
              }
            }
            window.onload = sendMessage;
          })();
        </script>
      </head>
      <body>
        <p>Processing authentication...</p>
      </body>
    </html>
  `;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
