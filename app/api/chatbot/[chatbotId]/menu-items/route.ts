import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/libs/mongoose';
import ChatbotAction from '@/models/ChatbotAction';

export async function GET(request: NextRequest, { params }: { params: { chatbotId: string } }) {
  try {
    const { chatbotId } = params;

    await connectMongo();

    // Find the order management action for this chatbot
    const omAction = await ChatbotAction.findOne({
      chatbotId,
      type: 'ordermanagement',
      enabled: true
    });

    if (!omAction || !omAction.metadata || !omAction.metadata.menuItems) {
      return NextResponse.json({
        success: false,
        message: 'No menu items found for this chatbot'
      }, { status: 404 });
    }

    // Return the menu items
    return NextResponse.json({
      success: true,
      menuItems: omAction.metadata.menuItems
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json({
      success: false,
      message: `Error: ${error.message}`
    }, { status: 500 });
  }
}
