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
            return NextResponse.json({ error: "Missing required parameter: chatbotId" }, { status: 400 });
        }

        // Get Google integration for this chatbot
        const googleIntegration = await GoogleIntegration.findOne({ chatbotId });

        if (!googleIntegration) {
            return NextResponse.json({ error: "Google integration not found" }, { status: 404 });
        }

        // Initialize OAuth2 client
        const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/chatbot/integrations/google/callback';

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            REDIRECT_URI
        );

        // Set credentials
        oauth2Client.setCredentials({
            access_token: googleIntegration.accessToken,
            refresh_token: googleIntegration.refreshToken,
            expiry_date: googleIntegration.expiryDate
        });

        // Initialize Google Drive API
        const drive = google.drive({ version: 'v3', auth: oauth2Client });
        const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

        // Search for Google Sheets files
        const response = await drive.files.list({
            q: "mimeType='application/vnd.google-apps.spreadsheet'",
            fields: 'nextPageToken, files(id, name)',
            spaces: 'drive',
            pageSize: 50,
            orderBy: 'modifiedTime desc' // optional
        });

        const files = response.data.files || [];
        
        // For each spreadsheet, get the sheet names
        const sheetsWithInfo = await Promise.all(
            files.map(async (file) => {
                try {
                    const sheetInfo = await sheets.spreadsheets.get({
                        spreadsheetId: file.id!,
                        fields: 'sheets.properties'
                    });

                    // Get all sheet names from the spreadsheet
                    const sheetNames = sheetInfo.data.sheets?.map(sheet => sheet.properties?.title) || [];

                    // Return formatted strings for each sheet: "spreadsheetId|sheetName|spreadsheetTitle"
                    return sheetNames.map(sheetName =>
                        `${file.id}|${sheetName}|${file.name}`
                    );
                } catch (error) {
                    console.error(`Error getting sheet names for ${file.id}:`, error);
                    return [`${file.id}|Sheet1|${file.name}`]; // Default to Sheet1 if we can't get sheet names
                }
            })
        );

        // Flatten the array of arrays
        const allSheets = sheetsWithInfo.flat();

        return NextResponse.json({ sheets: allSheets });
    } catch (error) {
        console.error("Error listing Google Sheets:", error);
        return NextResponse.json({ error: "Failed to list Google Sheets" }, { status: 500 });
    }
}
