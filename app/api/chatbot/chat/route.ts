import { sendAnthropic } from '@/libs/anthropic';
import { sendGemini } from '@/libs/gemini';
import OpenAI from 'openai';
import { NextRequest } from 'next/server';
import connectMongo from "@/libs/mongoose";
import ChatbotAISettings from "@/models/ChatbotAISettings";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL_MAPPING: { [key: string]: string } = {
  // OpenAI models
  'gpt-4o': 'gpt-4o',
  'gpt-4o-mini': 'gpt-4o-mini',
  'o1': 'o1',
  'o1-mini': 'o1-mini',
  'gpt-3.5-turbo': 'gpt-3.5-turbo',
  // Anthropic models (latest versions)
  'claude-3-5-sonnet-20241022': 'claude-3-5-sonnet-20241022',
  'claude-3-5-haiku-20241022': 'claude-3-5-haiku-20241022',
  'claude-3-opus-20240229': 'claude-3-opus-20240229',
  // Gemini models
  'gemini-2.0-flash-exp': 'gemini-2.0-flash-exp',
  'gemini-1.5-flash': 'gemini-1.5-flash',
  'gemini-1.5-flash-8b': 'gemini-1.5-flash-8b',
  'gemini-1.5-pro': 'gemini-1.5-pro'
};

export async function POST(req: NextRequest) {
  try {
    const { messages, chatbotId } = await req.json();

    await connectMongo();
    const aiSettings = await ChatbotAISettings.findOne({ 
      chatbotId: chatbotId 
    }).lean();
    
    const internalModel = aiSettings?.model || 'gpt-3.5-turbo';
    const temperature = aiSettings?.temperature ?? 0.7;
    const maxTokens = aiSettings?.maxTokens ?? 500;
    const language = aiSettings?.language || 'en';
    const systemPrompt = `${aiSettings?.systemPrompt || 'You are a helpful AI assistant.'} You must respond in ${language} language only.`;

    // Add detailed logging
    console.log('Chat Request Details:', {
      selectedModel: internalModel,
      mappedModel: MODEL_MAPPING[internalModel],
      provider: internalModel.startsWith('claude-') ? 'Anthropic' : 
               internalModel.startsWith('gemini-') ? 'Gemini' : 'OpenAI',
      temperature,
      maxTokens,
      language,
      systemPrompt
    });

    const encoder = new TextEncoder();

    // Check model provider and handle accordingly
    if (internalModel.startsWith('claude-')) {
      console.log('Using Anthropic Model:', internalModel);
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const onContent = (text: string) => {
              const sseMessage = `data: ${JSON.stringify({ text })}\n\n`;
              controller.enqueue(encoder.encode(sseMessage));
            };

            await sendAnthropic(
              [
                { role: 'system', content: systemPrompt },
                ...messages
              ],
              'user-1',
              onContent,
              maxTokens,
              temperature,
              internalModel
            );

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
    } else if (internalModel.startsWith('gemini-')) {
      console.log('Using Gemini Model:', internalModel);
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const onContent = (text: string) => {
              const sseMessage = `data: ${JSON.stringify({ text })}\n\n`;
              controller.enqueue(encoder.encode(sseMessage));
            };

            await sendGemini(
              [
                { role: 'system', content: systemPrompt },
                ...messages
              ],
              'user-1',
              onContent,
              maxTokens,
              temperature,
              internalModel
            );

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
    } else {
      console.log('Using OpenAI Model:', MODEL_MAPPING[internalModel] || 'gpt-3.5-turbo');
      // OpenAI models
      const response = await openai.chat.completions.create({
        model: MODEL_MAPPING[internalModel] || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature,
        max_tokens: maxTokens,
        stream: true,
      });

      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of response) {
              const text = chunk.choices[0]?.delta?.content || '';
              if (text) {
                const sseMessage = `data: ${JSON.stringify({ text })}\n\n`;
                controller.enqueue(encoder.encode(sseMessage));
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
    }
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