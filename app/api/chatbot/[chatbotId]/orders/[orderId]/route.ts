import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/libs/mongoose';
import Order from '@/models/Order';

export async function PUT(request: NextRequest, { params }: { params: { chatbotId: string; orderId: string } }) {
  try {
    const { chatbotId, orderId } = params;
    const body = await request.json();

    await connectMongo();

    // Find the order by chatbotId and orderId
    const order = await Order.findOne({ chatbotId, orderId });

    if (!order) {
      return NextResponse.json({
        success: false,
        message: 'Order not found'
      }, { status: 404 });
    }

    // Update order fields from body
    if (body.items) {
      order.items = body.items;
    }
    if (body.status) {
      order.status = body.status;
    }
    if (body.subtotal !== undefined) {
      order.subtotal = body.subtotal;
    }
    if (body.table !== undefined) {
      order.table = body.table;
    }
    // Add any other fields as needed

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({
      success: false,
      message: `Error: ${error.message}`
    }, { status: 500 });
  }
}
