import { NextResponse } from "next/server";
import { google } from "googleapis";
import connectMongo from "@/libs/mongoose";
import GoogleIntegration from "@/models/GoogleIntegration";

// Prevent prerendering
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      return errorResponse('Missing required parameters.');
    }

    let chatbotId: string | undefined, teamId: string | undefined;
    try {
      const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
      chatbotId = decodedState.chatbotId;
      teamId = decodedState.teamId;
    } catch (err) {
      console.error("Error decoding state:", err);
      return errorResponse('Invalid state parameter.');
    }

    if (!chatbotId || !teamId) {
      return errorResponse('Missing chatbotId or teamId in state.');
    }

    const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/chatbot/integrations/google/callback';

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      REDIRECT_URI
    );

    // Exchange the code for tokens
    let tokens;
    try {
      const response = await oauth2Client.getToken({ code, redirect_uri: REDIRECT_URI });
      tokens = response.tokens;
      oauth2Client.setCredentials(tokens);
    } catch (err) {
      console.error("Error exchanging code for tokens:", err);
      return errorResponse('Failed to exchange code for tokens.');
    }

    // Fetch user info
    let email = '';
    try {
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const userInfo = await oauth2.userinfo.get();
      email = userInfo.data.email || '';
    } catch (err) {
      console.error("Error fetching user info:", err);
      return errorResponse('Failed to fetch user information.');
    }

    // Save or update the Google integration
    try {
      let googleIntegration = await GoogleIntegration.findOne({ chatbotId });

      if (googleIntegration) {
        googleIntegration.accessToken = tokens.access_token || googleIntegration.accessToken;
        googleIntegration.refreshToken = tokens.refresh_token || googleIntegration.refreshToken;
        googleIntegration.expiryDate = tokens.expiry_date || googleIntegration.expiryDate;
        googleIntegration.email = email;
        await googleIntegration.save();
      } else {
        await GoogleIntegration.create({
          chatbotId,
          teamId,
          accessToken: tokens.access_token || '',
          refreshToken: tokens.refresh_token || '',
          expiryDate: tokens.expiry_date || 0,
          email
        });
      }
    } catch (err) {
      console.error("Error saving Google integration:", err);
      return errorResponse('Failed to save integration.');
    }

    return successResponse('Authentication Successful! You can now close this window.');
  } catch (err) {
    console.error("Unexpected error:", err);
    return errorResponse('An unexpected error occurred.');
  }
}

// Helpers for standard HTML responses
function errorResponse(message: string) {
  return new Response(
    `<html><body>
      <h1>Authentication Failed</h1>
      <p>${message}</p>
      <script>
        // Send message to parent window before closing
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({ type: 'GOOGLE_AUTH_FAILURE', status: 'error', message: '${message}' }, '*');
        }
        // Close the window after a short delay to ensure message is sent
        setTimeout(() => window.close(), 300);
      </script>
    </body></html>`,
    { status: 400, headers: { 'Content-Type': 'text/html' } }
  );
}

function successResponse(message: string) {
  return new Response(
    `<html><body>
      <h1>${message}</h1>
      <script>
        // Send message to parent window before closing
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', status: 'success' }, '*');
        }
        // Close the window after a short delay to ensure message is sent
        setTimeout(() => window.close(), 300);
      </script>
    </body></html>`,
    { status: 200, headers: { 'Content-Type': 'text/html' } }
  );
}
