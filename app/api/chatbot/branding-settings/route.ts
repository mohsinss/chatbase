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

    // Try to migrate this record if headerText is missing
    await migrateHeaderTextIfNeeded(chatbotId);

    // Get document directly using Mongoose
    const settings = await mongoose.connection.db.collection('chatbotbrandingsettings').findOne({ chatbotId });
    console.log('[GET] Raw DB settings:', JSON.stringify(settings, null, 2));
    console.log('[GET] headerText value:', settings?.headerText);
    
    // Create a response object that guarantees headerText exists
    const response = settings 
      ? { 
          ...settings, 
          headerText: settings.headerText || "" 
        }
      : { headerText: "" };
    
    console.log('[GET] Final response being sent:', response);
    
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
    
    if (doc && doc.headerText === undefined) {
      console.log(`[MIGRATION] Adding headerText field to document for chatbotId ${chatbotId}`);
      
      // Update directly with MongoDB driver
      const result = await mongoose.connection.db.collection('chatbotbrandingsettings').updateOne(
        { chatbotId },
        { $set: { headerText: "" } }
      );
      
      console.log(`[MIGRATION] Migration result:`, result);
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

    // Make sure headerText is explicitly set as its own field
    const updateData = { 
      ...validatedSettings,
      headerText: validatedSettings.headerText || ""
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
    
    // Add a second update specifically for the headerText field
    if (updateData.headerText !== undefined) {
      await mongoose.connection.db.collection('chatbotbrandingsettings').updateOne(
        { chatbotId },
        { $set: { headerText: updateData.headerText } }
      );
      console.log('[POST] Performed dedicated headerText update');
    }
    
    // Directly query the database to get the full document
    const updatedDoc = await mongoose.connection.db.collection('chatbotbrandingsettings').findOne({ chatbotId });
    console.log('[POST] Raw doc from MongoDB:', updatedDoc);
    
    // Create a response with headerText guaranteed
    const response = {
      ...updatedDoc,
      headerText: updateData.headerText
    };
    
    console.log('[POST] Final response being sent:', response);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error saving branding settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 