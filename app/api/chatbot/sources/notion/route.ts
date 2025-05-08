import { NextResponse } from 'next/server';

import mongoose from 'mongoose';
import NotionIntegration from '@/models/NotionIntegration';

// Extract plain text content from blocks
const extractPlainText = (block: any): string => {
  if (!block) return '';
  if (block.type === 'paragraph' && block.paragraph?.rich_text) {
    return block.paragraph.rich_text.map((rt: any) => rt.plain_text).join('');
  }
  if (block.type === 'heading_1' && block.heading_1?.rich_text) {
    return block.heading_1.rich_text.map((rt: any) => rt.plain_text).join('');
  }
  if (block.type === 'heading_2' && block.heading_2?.rich_text) {
    return block.heading_2.rich_text.map((rt: any) => rt.plain_text).join('');
  }
  if (block.type === 'heading_3' && block.heading_3?.rich_text) {
    return block.heading_3.rich_text.map((rt: any) => rt.plain_text).join('');
  }
  if (block.type === 'bulleted_list_item' && block.bulleted_list_item?.rich_text) {
    return block.bulleted_list_item.rich_text.map((rt: any) => rt.plain_text).join('');
  }
  if (block.type === 'numbered_list_item' && block.numbered_list_item?.rich_text) {
    return block.numbered_list_item.rich_text.map((rt: any) => rt.plain_text).join('');
  }
  // Add more block types as needed
  return '';
};

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
  const { scrapeNotionPagesWithContent } = await import('@/libs/notionScraper');
  const pagesWithContent = await scrapeNotionPagesWithContent(accessToken);

  // Format the data as needed for frontend consumption
  return {
    pages: pagesWithContent.map(({ page, blocks }: any) => {
      const contentText = blocks.map(extractPlainText).join('\n');

      return {
        id: page.id,
        title: page.properties?.title?.title?.[0]?.plain_text || 'Untitled',
        content: contentText,
        charCount: contentText.length,
        lastEditedTime: page.last_edited_time,
        ...page
      };
    }),
  };
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const chatbotId = url.searchParams.get('chatbotId');

  if (!chatbotId) {
    return NextResponse.json(
      { error: "Missing chatbotId parameter" },
      { status: 400 }
    );
  }

  const accessToken = await getNotionAccessToken(chatbotId);

  if (!accessToken) {
    return NextResponse.json(
      { error: "Notion account not connected" },
      { status: 403 }
    );
  }

  try {
    console.log('accessToken', accessToken)
    const notionData = await fetchNotionData(accessToken);
    return NextResponse.json(notionData);
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to fetch Notion data: ${err}` },
      { status: 500 }
    );
  }
}
