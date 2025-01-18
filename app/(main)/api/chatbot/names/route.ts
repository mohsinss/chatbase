import { NextResponse } from 'next/server'
import ChatbotSettings from '@/models/ChatbotSettings'
import dbConnect from '@/lib/dbConnect'

export async function POST(req: Request) {
  try {
    await dbConnect()
    const { chatbotIds } = await req.json()

    const chatbots = await ChatbotSettings.find(
      { chatbotId: { $in: chatbotIds } },
      'chatbotId name'
    )

    const names = chatbots.reduce((acc, chatbot) => ({
      ...acc,
      [chatbot.chatbotId]: chatbot.name
    }), {})

    return NextResponse.json({ names })
  } catch (error) {
    console.error('Failed to fetch chatbot names:', error)
    return NextResponse.json({ error: 'Failed to fetch chatbot names' }, { status: 500 })
  }
} 