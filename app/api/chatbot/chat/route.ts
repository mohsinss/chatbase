import OpenAI from 'openai';
import { NextRequest } from 'next/server';
import connectMongo from "@/libs/mongoose";
import ChatbotAISettings from "@/models/ChatbotAISettings";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL_MAPPING: { [key: string]: string } = {
  'gpt-3.5-turbo': 'gpt-3.5-turbo',
  'gpt-4': 'gpt-4',
  'gpt-4-turbo': 'gpt-4-1106-preview',
  'gpt-4o': 'gpt-4o',
  'gpt-4o-mini': 'gpt-4o-mini',
};

export async function POST(req: NextRequest) {
  try {
    const { messages, chatbotId } = await req.json();

    await connectMongo();
    const aiSettings = await ChatbotAISettings.findOne({ 
      chatbotId: chatbotId 
    }).lean();
    
    console.log('Found settings:', aiSettings);

    const internalModel = aiSettings?.model || 'gpt-3.5-turbo';
    const openAIModel = MODEL_MAPPING[internalModel] || 'gpt-3.5-turbo';
    const temperature = aiSettings?.temperature ?? 0.7;
    const maxTokens = aiSettings?.maxTokens ?? 500;
    const language = aiSettings?.language || 'en';

    const systemPrompt = `${aiSettings?.systemPrompt || 'You are a helpful AI assistant.'} You must respond in ${language} language only.`;

    console.log('API Route - Using settings:', {
      chatbotId,
      internalModel,
      openAIModel,
      temperature,
      maxTokens,
      systemPrompt,
      language,
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

    // Create a text encoder
    const encoder = new TextEncoder();

    // Create a transform stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
              // Format the chunk as a Server-Sent Event
              const sseMessage = `data: ${JSON.stringify({ text })}\n\n`;
              controller.enqueue(encoder.encode(sseMessage));
            }
          }
          // Send a done message
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    // Return the stream with appropriate headers
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Transfer-Encoding': 'chunked'
      },
    });
  } catch (error) {
    console.error('Streaming error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Streaming failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 