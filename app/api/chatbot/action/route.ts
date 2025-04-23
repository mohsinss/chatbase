import { NextRequest, NextResponse } from 'next/server';
import ChatbotAction from '@/models/ChatbotAction';
import connectMongo from '@/libs/mongoose';

// Create a new ChatbotAction
export async function POST(req: NextRequest) {
  await connectMongo();
  const { chatbotId, name, url, instructions, enabled, metadata, type } = await req.json();

  // Check if an action with type=ordermanagement already exists for this chatbotId
  if (type === 'ordermanagement') {
    const existingAction = await ChatbotAction.findOne({ 
      chatbotId, 
      type: 'ordermanagement' 
    });

    if (existingAction) {
      return NextResponse.json({ 
        error: 'Only one action of type ordermanagement is allowed per chatbot' 
      }, { status: 400 });
    }
  }

  const action = await ChatbotAction.create({
    chatbotId,
    name,
    url,
    instructions,
    enabled,
    metadata,
    type
  });

  return NextResponse.json(action, { status: 201 });
}

// Get all ChatbotActions for a specific chatbotId
export async function GET(req: NextRequest) {
    await connectMongo();
    const actionId = req.nextUrl.searchParams.get('actionId');
  
    if (actionId) {
      const action = await ChatbotAction.findById(actionId);
  
      if (!action) {
        return NextResponse.json({ error: 'Action not found' }, { status: 404 });
      }
  
      return NextResponse.json(action);
    }
  
    const chatbotId = req.nextUrl.searchParams.get('chatbotId');
  
    if (!chatbotId) {
      return NextResponse.json({ error: 'chatbotId or actionId is required' }, { status: 400 });
    }
  
    const actions = await ChatbotAction.find({ chatbotId });
  
    return NextResponse.json(actions);
  }

// Update a ChatbotAction by actionId
export async function PUT(req: NextRequest) {
  await connectMongo();
  const { actionId, name, url, instructions, enabled, metadata, type } = await req.json();

  const action = await ChatbotAction.findByIdAndUpdate(
    actionId,
    { name, url, instructions, enabled, metadata, type },
    { new: true }
  );

  if (!action) {
    return NextResponse.json({ error: 'Action not found' }, { status: 404 });
  }

  return NextResponse.json(action);
}

// Delete a ChatbotAction by actionId
export async function DELETE(req: NextRequest) {
  await connectMongo();
  const actionId = req.nextUrl.searchParams.get('actionId');

  if (!actionId) {
    return NextResponse.json({ error: 'actionId is required' }, { status: 400 });
  }

  const action = await ChatbotAction.findByIdAndDelete(actionId);

  if (!action) {
    return NextResponse.json({ error: 'Action not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Action deleted' });
}
