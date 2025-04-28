import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export async function GET(
  request: NextRequest,
  { params }: { params: { chatbotId: string } }
) {
  try {
    await dbConnect();
    const { chatbotId } = params;
    
    // Get query parameters
    const url = new URL(request.url);
    const portal = url.searchParams.get('portal');
    const status = url.searchParams.get('status');
    
    // Build query
    const query: any = { chatbotId };
    
    if (portal) {
      query.portal = portal;
    }
    
    if (status) {
      query.status = status;
    }
    
    // Fetch orders
    const orders = await Order.find(query)
      .sort({ timestamp: -1 })
      .limit(100);
    
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
