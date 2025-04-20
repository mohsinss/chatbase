import { NextResponse } from "next/server";
import { google } from "googleapis";
import connectMongo from "@/libs/mongoose";
import GoogleIntegration from "@/models/GoogleIntegration";

// This prevents the route from being prerendered during build
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await connectMongo();
    
    // Get chatbotId from query params
    const { searchParams } = new URL(request.url);
    const chatbotId = searchParams.get('chatbotId');
    
    if (!chatbotId) {
      return NextResponse.json({ error: "Missing chatbotId parameter" }, { status: 400 });
    }
    
    // Check if there's an existing Google integration for this chatbot
    const googleIntegration = await GoogleIntegration.findOne({ chatbotId });
    
    if (!googleIntegration || !googleIntegration.accessToken) {
      return NextResponse.json({ connected: false });
    }
    
    // Initialize OAuth2 client with the stored credentials
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    oauth2Client.setCredentials({
      access_token: googleIntegration.accessToken,
      refresh_token: googleIntegration.refreshToken,
      expiry_date: googleIntegration.expiryDate
    });
    
    // Check if the token is still valid
    try {
      // Make a test request to Google API
      const drive = google.drive({ version: 'v3', auth: oauth2Client });
      await drive.about.get({ fields: 'user' });
      
      return NextResponse.json({ 
        connected: true,
        email: googleIntegration.email || 'Google Account'
      });
    } catch (error) {
      console.error("Error validating Google token:", error);
      
      // Try to refresh the token
      try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        
        // Update the stored credentials
        googleIntegration.accessToken = credentials.access_token;
        googleIntegration.expiryDate = credentials.expiry_date;
        await googleIntegration.save();
        
        return NextResponse.json({ 
          connected: true,
          email: googleIntegration.email || 'Google Account'
        });
      } catch (refreshError) {
        console.error("Error refreshing Google token:", refreshError);
        return NextResponse.json({ connected: false });
      }
    }
  } catch (error) {
    console.error("Error checking Google integration status:", error);
    return NextResponse.json({ error: "Failed to check integration status" }, { status: 500 });
  }
}
