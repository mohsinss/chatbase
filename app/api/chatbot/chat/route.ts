import { NextRequest, NextResponse } from 'next/server';
import connectMongo from "@/libs/mongoose";
import ChatbotAISettings from "@/models/ChatbotAISettings";
import Chatbot from '@/models/Chatbot';
import Dataset from "@/models/Dataset";
import Team from '@/models/Team';
import ChatbotAction from '@/models/ChatbotAction';
import config from '@/config';
import { translateText, translateJsonFields } from '@/components/chatbot/api/translation';
import OpenAI from 'openai';

// Import modular components
import {
  setCorsHeaders,
  handleOptionsRequest,
  handleAnthropicRequest,
  handleGeminiRequest,
  handleDeepseekRequest,
  handleGrokRequest,
  handleOpenAIRequest,
  handleQuestionFlow,
  orderManagementSystemPrompt
} from '@/components/chatbot/api';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define platform-specific prompts
const PLATFORM_PROMPTS = {
  whatsapp: "You are a friendly and professional WhatsApp chatbot for a business. Keep responses concise and helpful, using emojis occasionally. Focus on providing clear, actionable information.",
  twitter: "You are a Twitter chatbot. Keep responses short and engaging, using hashtags and emojis when appropriate. Be conversational and witty.",
  facebook: "You are a Facebook chatbot. Be friendly and community-focused. Provide detailed, helpful responses and encourage engagement.",
  instagram: "You are an Instagram chatbot. Be trendy and visually descriptive. Use emojis and casual language. Focus on lifestyle and visual aspects.",
  web: "You are a professional website chatbot. Be formal and helpful. Provide clear, structured information and guide users effectively.",
};

// Default gym information
const DEFAULT_GYM_INFO = {
  name: "Golden Gym",
  membershipPlans: {
    basic: "$29/month",
    premium: "$49/month",
    vip: "$79/month"
  },
  classes: ["HIIT", "Yoga", "Spin", "Zumba", "Boxing"],
  trainers: "12 certified personal trainers",
  facilities: "New Technogym equipment, treadmills, cable machines, functional training area",
  hours: "Mon-Fri: 5AM-11PM, Sat: 7AM-10PM, Sun: 8AM-8PM",
  location: "123 Fitness Street",
  contact: "555-0123"
};

export async function OPTIONS(req: NextRequest) {
  return handleOptionsRequest();
}

export async function POST(req: NextRequest) {
  try {
    const { platform, message, language, customData } = await req.json();
    
    if (!platform || !message) {
      return NextResponse.json(
        { error: 'Platform and message are required' },
        { status: 400 }
      );
    }
    
    const platformPrompt = PLATFORM_PROMPTS[platform as keyof typeof PLATFORM_PROMPTS] || PLATFORM_PROMPTS.web;
    
    // Construct system prompt based on whether custom data is provided
    const systemPrompt = customData
      ? `${platformPrompt}\n\nUse the following information to answer questions:\n${customData}`
      : `${platformPrompt}\n\nUse the following information about ${DEFAULT_GYM_INFO.name} to answer questions:\n` +
        `Membership Plans: ${Object.entries(DEFAULT_GYM_INFO.membershipPlans).map(([plan, price]) => `${plan}: ${price}`).join(', ')}\n` +
        `Classes: ${DEFAULT_GYM_INFO.classes.join(', ')}\n` +
        `Trainers: ${DEFAULT_GYM_INFO.trainers}\n` +
        `Facilities: ${DEFAULT_GYM_INFO.facilities}\n` +
        `Hours: ${DEFAULT_GYM_INFO.hours}\n` +
        `Location: ${DEFAULT_GYM_INFO.location}\n` +
        `Contact: ${DEFAULT_GYM_INFO.contact}`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });
    
    const response = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}