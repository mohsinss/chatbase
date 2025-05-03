import { NextRequest, NextResponse } from 'next/server';
import { Order } from '@/models/Order';
import connectMongo from '@/libs/mongoose';

export async function GET(req: NextRequest, { params }: { params: { chatbotId: string } }) {
  await connectMongo();
  const { searchParams } = new URL(req.url);
  const portal = searchParams.get('portal');

  try {
    const query: any = { chatbotId: params.chatbotId };
    if (portal) {
      query.portal = portal;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { chatbotId: string } }) {
  await connectMongo();
  const body = await req.json();

  try {
    const order = await Order.create({
      ...body,
      chatbotId: params.chatbotId
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
