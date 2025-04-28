import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Chatbot from '@/models/Chatbot';
import WhatsAppNumber from '@/models/WhatsAppNumber';

export async function POST(
  request: NextRequest,
  { params }: { params: { chatbotId: string; orderId: string } }
) {
  try {
    await dbConnect();
    const { chatbotId, orderId } = params;
    const body = await request.json();
    
    // Find the order
    const order = await Order.findOne({ chatbotId, orderId });
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Verify this is a WhatsApp order
    if (order.portal !== 'whatsapp') {
      return NextResponse.json(
        { error: 'This is not a WhatsApp order' },
        { status: 400 }
      );
    }
    
    // Get the chatbot to find associated WhatsApp number
    const chatbot = await Chatbot.findOne({ _id: chatbotId });
    
    if (!chatbot) {
      return NextResponse.json(
        { error: 'Chatbot not found' },
        { status: 404 }
      );
    }
    
    // Find the WhatsApp number associated with this chatbot
    const whatsappNumber = await WhatsAppNumber.findOne({ 
      chatbotId: chatbotId 
    });
    
    if (!whatsappNumber) {
      return NextResponse.json(
        { error: 'No WhatsApp number found for this chatbot' },
        { status: 404 }
      );
    }
    
    // Get customer phone number from order metadata
    if (!order.metadata || !order.metadata.customerPhone) {
      return NextResponse.json(
        { error: 'Customer phone number not found in order metadata' },
        { status: 400 }
      );
    }
    
    const customerPhone = order.metadata.customerPhone;
    
    // Prepare message content
    const message = body.message || `Your order #${orderId} status has been updated to: ${order.status}`;
    
    // Send WhatsApp message using Meta API
    try {
      const response = await fetch(`https://graph.facebook.com/v17.0/${whatsappNumber.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${whatsappNumber.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: customerPhone,
          type: 'text',
          text: {
            body: message
          }
        })
      });
      
      const result = await response.json();
      
      // Update order metadata to include notification history
      const notifications = order.metadata.notifications || [];
      notifications.push({
        timestamp: new Date(),
        message: message,
        status: response.ok ? 'sent' : 'failed',
        response: result
      });
      
      await Order.updateOne(
        { chatbotId, orderId },
        { 
          $set: { 
            'metadata.notifications': notifications 
          } 
        }
      );
      
      if (!response.ok) {
        console.error('WhatsApp API error:', result);
        return NextResponse.json(
          { error: 'Failed to send WhatsApp notification', details: result },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'WhatsApp notification sent successfully',
        result: result
      }, { status: 200 });
      
    } catch (apiError) {
      console.error('Error sending WhatsApp notification:', apiError);
      return NextResponse.json(
        { error: 'Failed to send WhatsApp notification', details: apiError },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing notification request:', error);
    return NextResponse.json(
      { error: 'Failed to process notification request' },
      { status: 500 }
    );
  }
}
