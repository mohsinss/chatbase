import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { chatbotId: string; orderId: string } }
) {
  try {
    await dbConnect();
    const { chatbotId, orderId } = params;
    const body = await request.json();
    
    // Validate status
    const validStatuses = ['received', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    // Find and update the order
    const updatedOrder = await Order.findOneAndUpdate(
      { chatbotId, orderId },
      { $set: { status: body.status } },
      { new: true }
    );
    
    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ order: updatedOrder }, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { chatbotId: string; orderId: string } }
) {
  try {
    await dbConnect();
    const { chatbotId, orderId } = params;
    
    // Find the order
    const order = await Order.findOne({ chatbotId, orderId });
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
