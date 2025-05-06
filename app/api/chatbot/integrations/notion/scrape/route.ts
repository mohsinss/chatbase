import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import NotionIntegration from '@/models/NotionIntegration';
import { scrapeNotionPages } from '@/libs/notionScraper';
import { addToTrieve } from '@/libs/trieve';

mongoose.connect(process.env.MONGODB_URI || '');

export async function POST(request: NextRequest) {
  try {
    const { chatbotId } = await request.json();

    if (!chatbotId) {
      return NextResponse.json({ error: 'Missing chatbotId' }, { status: 400 });
    }

    const notionIntegration = await NotionIntegration.findOne({ chatbotId: new mongoose.Types.ObjectId(chatbotId) });
    if (!notionIntegration) {
      return NextResponse.json({ error: 'Notion integration not found for chatbot' }, { status: 404 });
    }

    const accessToken = notionIntegration.accessToken;

    // Scrape Notion pages using access token
    const pagesContent = await scrapeNotionPages(accessToken);

    // Add scraped content to Trieve vector store
    await addToTrieve(chatbotId, pagesContent);

    // Update lastSyncTime
    notionIntegration.lastSyncTime = new Date();
    await notionIntegration.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
