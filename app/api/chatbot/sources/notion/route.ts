import { NextResponse } from 'next/server';

import mongoose from 'mongoose';
import NotionIntegration from '@/models/NotionIntegration';

// Retrieve Notion access token from database for the chatbot
const getNotionAccessToken = async (chatbotId: string): Promise<string | null> => {
  const notionIntegration = await NotionIntegration.findOne({ chatbotId });
  if (!notionIntegration) {
    return null;
  }
  return notionIntegration.accessToken;
};

// Fetch Notion pages content using Notion API
const fetchNotionData = async (accessToken: string) => {
  // Implement actual Notion API calls to fetch pages/databases content
  // For simplicity, reuse the libs/notionScraper function if possible
  const { scrapeNotionPages } = await import('@/libs/notionScraper');
  const pages = await scrapeNotionPages(accessToken);

  // Format the data as needed for frontend consumption
  return {
    pages: pages.map((page: any) => ({
      id: page.id,
      title: `Notion Page ${page?.title}`, // Placeholder, ideally fetch title from Notion API
      content: '', // Placeholder, ideally fetch content from Notion API
      charCount: 0, // Placeholder, calculate actual char count
      ...page
    })),
  };
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const chatbotId = url.searchParams.get('chatbotId');

  if (!chatbotId) {
    return new Response('Missing chatbotId parameter', { status: 400 });
  }

  const accessToken = await getNotionAccessToken(chatbotId);

  if (!accessToken) {
    return new Response('Notion account not connected', { status: 403 });
  }

  try {
    const notionData = await fetchNotionData(accessToken);
    return NextResponse.json(notionData);
  } catch (err) {
    return new Response(`Failed to fetch Notion data: ${err}`, { status: 500 });
  }
}
