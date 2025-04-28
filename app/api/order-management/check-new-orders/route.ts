/**
 * API endpoint for checking new orders
 * This endpoint is designed to be triggered by a cron job
 */
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from "@/libs/mongoose";
import Order from '@/models/Order';
import ChatbotAction from '@/models/ChatbotAction';
import { sendTextMessage } from '@/components/webhook/whatsapp/services/whatsappService';

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectMongo();

    // Fetch all enabled order management actions
    const omActions = await ChatbotAction.find({
      type: 'ordermanagement',
      enabled: true
    });

    if (!omActions || omActions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No enabled order management actions found',
        ordersChecked: 0,
        notificationsSent: 0
      }, { status: 200 });
    }

    // Calculate the time threshold for recent orders (last 2 hours)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    // Fetch all recent orders with status 'delivered' or 'ready' updated within last 2 hours
    const recentOrders = await Order.find({
      status: { $in: ['delivered', 'ready'] },
      updatedAt: { $gte: twoHoursAgo },
      'metadata.followUpSent': { $ne: true }
    });

    if (!recentOrders || recentOrders.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No new completed orders found',
        ordersChecked: 0,
        notificationsSent: 0
      }, { status: 200 });
    }

    let notificationsSent = 0;
    let ordersChecked = 0;

    // Process each order
    for (const order of recentOrders) {
      try {
        // Find the matching order management action for this order's chatbotId
        const omAction = omActions.find(action => action.chatbotId === order.chatbotId);

        if (!omAction) {
          continue; // No enabled action for this chatbotId
        }

        const followUpSettings = omAction.metadata?.followUpSettings;

        if (!followUpSettings || !followUpSettings.enabled) {
          continue; // Follow-up disabled for this chatbot
        }

        // Check if enough time has passed since order updated to send follow-up
        const followUpTimeWindow = followUpSettings.timeWindow || 30; // default 30 minutes
        const orderUpdatedAt = order.updatedAt || order.timestamp || new Date();
        const now = new Date();
        const minutesSinceUpdate = (now.getTime() - orderUpdatedAt.getTime()) / (1000 * 60);

        if (minutesSinceUpdate < followUpTimeWindow) {
          continue; // Not enough time passed yet
        }

        // Only send follow-up if WhatsApp info is available
        if (order.metadata?.whatsappInfo) {
          const { phoneNumberId, from } = order.metadata.whatsappInfo;

          // Use the follow-up message template from settings or default
          const followUpTemplate = followUpSettings.messageTemplate ||
            "Thank you for your order! We hope you enjoyed your meal. Would you like to order anything else, such as dessert or drinks?";

          // Send follow-up message
          await sendTextMessage(
            phoneNumberId,
            from,
            followUpTemplate
          );

          // Mark order as followed up
          order.metadata = {
            ...order.metadata,
            followUpSent: true,
            followUpTimestamp: new Date()
          };

          await order.save();
          notificationsSent++;
        }

        ordersChecked++;
      } catch (orderError) {
        console.error(`Error processing follow-up for order ${order.orderId}:`, orderError);
        // Continue with next order
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${ordersChecked} orders, sent ${notificationsSent} follow-up notifications`,
      ordersChecked,
      notificationsSent
    }, { status: 200 });

  } catch (error) {
    console.error('Error checking new orders:', error);
    return NextResponse.json({
      success: false,
      message: `Error: ${error.message}`
    }, { status: 500 });
  }
}
