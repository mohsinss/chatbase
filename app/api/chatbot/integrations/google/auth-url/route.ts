import { NextResponse } from "next/server";
import { google } from "googleapis";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";

// This prevents the route from being prerendered during build
export const dynamic = 'force-dynamic';

// Google OAuth2 configuration
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/chatbot/integrations/google/callback';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

// Define the scopes we need for Google Sheets
const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/userinfo.email'
];

export async function GET(request: Request) {
  try {
    await connectMongo();
    
    // Get chatbotId and teamId from query params
    const { searchParams } = new URL(request.url);
    const chatbotId = searchParams.get('chatbotId');
    const teamId = searchParams.get('teamId');
    
    if (!chatbotId || !teamId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }
    
    // Generate a state parameter to include chatbotId and teamId
    const state = Buffer.from(JSON.stringify({ chatbotId, teamId })).toString('base64');
    
    // Generate the authentication URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      state: state,
      prompt: 'consent', // Force to get refresh token
      redirect_uri: REDIRECT_URI // Explicitly include redirect_uri
    });
    
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("Error generating Google auth URL:", error);
    return NextResponse.json({ error: "Failed to generate authentication URL" }, { status: 500 });
  }
}
