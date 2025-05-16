import { NextRequest, NextResponse } from 'next/server';
import SallaIntegration from '@/models/SallaIntegration';
import connectMongo from '@/libs/mongoose';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chatbotId = searchParams.get('chatbotId');
    if (!chatbotId) {
      return NextResponse.json({ error: 'Missing chatbotId parameter' }, { status: 400 });
    }

    await connectMongo();

    // Find the SallaIntegration document where settings.chatbotId matches the provided chatbotId
    const sallaIntegration = await SallaIntegration.findOne({ 'settings.chatbotId': chatbotId });

    if (!sallaIntegration) {
      return NextResponse.json({ error: 'Salla integration not found' }, { status: 404 });
    }

    return NextResponse.json({ sallaIntegration });
  } catch (error) {
    console.error('Error fetching Salla integration:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}