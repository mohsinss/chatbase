import { NextResponse } from 'next/server';

// TODO: Implement token retrieval from database for the chatbot/user
const getNotionAccessToken = async (chatbotId: string): Promise<string | null> => {
  // Placeholder: return null or a dummy token
  return null;
};

// TODO: Implement actual Notion API calls to fetch pages/databases content
const fetchNotionData = async (accessToken: string) => {
  // Placeholder: return dummy data
  return {
    pages: [
      {
        id: 'dummy-page-1',
        title: 'Sample Notion Page',
        content: 'This is sample content from Notion page.',
        charCount: 35,
      },
    ],
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
