import { NextResponse } from 'next/server'
import { ChatbotBrandingSettingsSchema, ChatbotBrandingSettingsModel } from '@/models/ChatbotBrandingSettings'
import dbConnect from "@/lib/dbConnect"
import mongoose from 'mongoose'

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const chatbotId = searchParams.get('chatbotId');

    if (!chatbotId) {
      return NextResponse.json({ error: 'Chatbot ID is required' }, { status: 400 });
    }

    // Try to migrate this record if header fields are missing
    await migrateHeaderTextIfNeeded(chatbotId);

    // Get document directly using Mongoose
    const settings = await mongoose.connection.db.collection('chatbotbrandingsettings').findOne({ chatbotId });
    console.log('[GET] Raw DB settings:', JSON.stringify(settings, null, 2));
    console.log('[GET] headerText value:', settings?.headerText);
    
    // Create a response object that guarantees header fields exist
    const response = settings 
      ? { 
          ...settings, 
          headerText: settings.headerText || "",
          headerTextColor: settings.headerTextColor || "#ffffff",
          headerFontSize: settings.headerFontSize || "3rem",
          headerFontFamily: settings.headerFontFamily || "Inter, sans-serif"
        }
      : { 
          headerText: "",
          headerTextColor: "#ffffff",
          headerFontSize: "3rem",
          headerFontFamily: "Inter, sans-serif"
        };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching branding settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to migrate headerText field if missing
async function migrateHeaderTextIfNeeded(chatbotId: string) {
  try {
    await dbConnect();
    
    // Check if document exists and needs migration
    const doc = await mongoose.connection.db.collection('chatbotbrandingsettings').findOne({ chatbotId });
    
    const updateFields: Record<string, string> = {};
    let needsMigration = false;
    
    // Check each field that needs migration
    if (doc) {
      if (doc.headerText === undefined) {
        updateFields['headerText'] = "";
        needsMigration = true;
      }
      if (doc.headerTextColor === undefined) {
        updateFields['headerTextColor'] = "#ffffff";
        needsMigration = true;
      }
      if (doc.headerFontSize === undefined) {
        updateFields['headerFontSize'] = "3rem";
        needsMigration = true;
      }
      if (doc.headerFontFamily === undefined) {
        updateFields['headerFontFamily'] = "Inter, sans-serif";
        needsMigration = true;
      }
      
      if (needsMigration) {
        console.log(`[MIGRATION] Adding missing header fields to document for chatbotId ${chatbotId}`, updateFields);
        
        // Update directly with MongoDB driver
        const result = await mongoose.connection.db.collection('chatbotbrandingsettings').updateOne(
          { chatbotId },
          { $set: updateFields }
        );
        
        console.log(`[MIGRATION] Migration result:`, result);
      }
    }
  } catch (error) {
    console.error('[MIGRATION] Error during migration:', error);
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { chatbotId, ...settings } = body;

    console.log('[POST] Input data:', JSON.stringify(settings, null, 2));
    console.log('[POST] Input headerText:', settings.headerText);

    if (!chatbotId) {
      return NextResponse.json({ error: 'Chatbot ID is required' }, { status: 400 });
    }

    // Validate the settings against our schema
    const validatedSettings = ChatbotBrandingSettingsSchema.parse(settings);
    console.log('[POST] Validated settings headerText:', validatedSettings.headerText);

    // Make sure header fields are explicitly set
    const updateData = { 
      ...validatedSettings,
      headerText: validatedSettings.headerText || "",
      headerTextColor: validatedSettings.headerTextColor || "#ffffff",
      headerFontSize: validatedSettings.headerFontSize || "3rem",
      headerFontFamily: validatedSettings.headerFontFamily || "Inter, sans-serif"
    };
    
    console.log('[POST] Update data being sent to MongoDB:', updateData);
    console.log('[POST] headerText in update data:', updateData.headerText);

    // Update using MongoDB native driver directly
    await mongoose.connection.db.collection('chatbotbrandingsettings').updateOne(
      { chatbotId },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        },
        $setOnInsert: { 
          createdAt: new Date() 
        }
      },
      { upsert: true }
    );
    
    // Add a second update specifically for the header fields that need special handling
    const headerFields = {
      headerText: updateData.headerText,
      headerTextColor: updateData.headerTextColor,
      headerFontSize: updateData.headerFontSize,
      headerFontFamily: updateData.headerFontFamily
    };
    
    await mongoose.connection.db.collection('chatbotbrandingsettings').updateOne(
      { chatbotId },
      { $set: headerFields }
    );
    console.log('[POST] Performed dedicated header fields update');
    
    // Directly query the database to get the full document
    const updatedDoc = await mongoose.connection.db.collection('chatbotbrandingsettings').findOne({ chatbotId });
    console.log('[POST] Raw doc from MongoDB:', updatedDoc);
    
    // Create a response with header fields guaranteed
    const response = {
      ...updatedDoc,
      ...headerFields
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error saving branding settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 