import { NextResponse } from "next/server";
import { google } from "googleapis";
import connectMongo from "@/libs/mongoose";
import GoogleIntegration from "@/models/GoogleIntegration";
import GoogleSheetConfig from "@/models/GoogleSheetConfig";

// This prevents the route from being prerendered during build
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await connectMongo();
    
    // Parse request body
    const body = await request.json();
    const { chatbotId, sheetId, sheetName } = body;
    
    if (!chatbotId || !sheetId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }
    
    // Get Google integration for this chatbot
    const googleIntegration = await GoogleIntegration.findOne({ chatbotId });
    
    if (!googleIntegration || !googleIntegration.accessToken) {
      return NextResponse.json({ error: "Google integration not found" }, { status: 404 });
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
    
    // Initialize Google Sheets API
    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
    
    // Verify access to the spreadsheet
    try {
      // Try to get spreadsheet info
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: sheetId,
        fields: 'properties.title,sheets.properties.title'
      });
      
      // Check if the specified sheet exists
      const sheetExists = spreadsheet.data.sheets?.some(
        sheet => sheet.properties?.title === sheetName
      );
      
      if (!sheetExists && sheetName) {
        // Create the sheet if it doesn't exist
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: sheetId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: sheetName
                  }
                }
              }
            ]
          }
        });
      }
      
      // Save or update the Google Sheet configuration
      let sheetConfig = await GoogleSheetConfig.findOne({ chatbotId });
      
      if (sheetConfig) {
        sheetConfig.sheetId = sheetId;
        sheetConfig.sheetName = sheetName || 'Orders';
        await sheetConfig.save();
      } else {
        sheetConfig = await GoogleSheetConfig.create({
          chatbotId,
          teamId: googleIntegration.teamId,
          sheetId,
          sheetName: sheetName || 'Orders'
        });
      }
      
      // Set up default columns if it's a new sheet
      if (!sheetExists && sheetName) {
        const defaultColumns = [
          'Order ID', 'Table Number', 'Timestamp', 'Customer Phone',
          'Items', 'Quantity', 'Total Amount', 'Status'
        ];
        
        await sheets.spreadsheets.values.update({
          spreadsheetId: sheetId,
          range: `${sheetName}!A1:H1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [defaultColumns]
          }
        });
      }
      
      return NextResponse.json({ 
        success: true,
        spreadsheetTitle: spreadsheet.data.properties?.title,
        sheetName: sheetName || 'Orders'
      });
    } catch (error) {
      console.error("Error connecting to Google Sheet:", error);
      return NextResponse.json({ error: "Failed to access the specified Google Sheet" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error connecting to Google Sheet:", error);
    return NextResponse.json({ error: "Failed to connect to Google Sheet" }, { status: 500 });
  }
}
