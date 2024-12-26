import OpenAI from 'openai';
import { NextRequest } from 'next/server';
import connectMongo from "@/libs/mongoose";
import ChatbotAISettings from "@/models/ChatbotAISettings";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Map internal model names to OpenAI model names
const MODEL_MAPPING: { [key: string]: string } = {
  'gpt-3.5-turbo': 'gpt-3.5-turbo',
  'gpt-4': 'gpt-4',
  'gpt-4-turbo': 'gpt-4-1106-preview',
  'gpt-4o': 'gpt-4',
  'gpt-4o-mini': 'gpt-4',  // or whatever the correct mapping should be
};

export async function POST(req: NextRequest) {
  try {
    const { messages, chatbotId } = await req.json();

    await connectMongo();
    const aiSettings = await ChatbotAISettings.findOne({ 
      chatbotId: chatbotId 
    });
    
    console.log('Query params:', { chatbotId });
    console.log('Found settings:', aiSettings);

    // Get the model name and map it to OpenAI model
    const internalModel = aiSettings?.model || 'gpt-3.5-turbo';
    const openAIModel = MODEL_MAPPING[internalModel] || 'gpt-3.5-turbo';

    const temperature = aiSettings?.temperature ?? 0.7;
    const maxTokens = aiSettings?.maxTokens ?? 500;
    const systemPrompt = aiSettings?.systemPrompt || 'You are a helpful AI assistant.';

    console.log('API Route - Using model:', {
      chatbotId,
      internalModel,
      openAIModel,
      temperature,
      maxTokens,
      systemPrompt,
      fromDatabase: !!aiSettings
    });

    const response = await openai.chat.completions.create({
      model: openAIModel,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature,
      max_tokens: maxTokens,
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Streaming error:', error);
    return new Response(JSON.stringify({ 
      error: 'Streaming failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 