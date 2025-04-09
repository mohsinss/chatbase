import { NextResponse } from 'next/server'
import { ChatbotBrandingSettingsSchema, ChatbotBrandingSettingsModel } from '@/models/ChatbotBrandingSettings'
import dbConnect from "@/lib/dbConnect"

export async function GET(request: Request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const chatbotId = searchParams.get('chatbotId')

    if (!chatbotId) {
      return NextResponse.json({ error: 'Chatbot ID is required' }, { status: 400 })
    }

    const settings = await ChatbotBrandingSettingsModel.findOne({ chatbotId }).lean()
    return NextResponse.json(settings || {})
  } catch (error) {
    console.error('Error fetching branding settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    const { chatbotId, ...settings } = body

    if (!chatbotId) {
      return NextResponse.json({ error: 'Chatbot ID is required' }, { status: 400 })
    }

    // Validate the settings against our schema
    const validatedSettings = ChatbotBrandingSettingsSchema.parse(settings)

    // Update or create settings
    const updatedSettings = await ChatbotBrandingSettingsModel.findOneAndUpdate(
      { chatbotId },
      validatedSettings,
      { new: true, upsert: true }
    ).lean()

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error('Error saving branding settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 