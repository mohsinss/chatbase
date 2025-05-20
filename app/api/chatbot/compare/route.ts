import { NextRequest, NextResponse } from 'next/server';
import connectMongo from "@/libs/mongoose";
import ChatbotAISettings from "@/models/ChatbotAISettings";
import Chatbot from '@/models/Chatbot';
import Dataset from "@/models/Dataset";
import Team from '@/models/Team';
import { setCorsHeaders } from '@/components/chatbot/api';
import config from '@/config';

import {
  handleAnthropicRequest,
  handleGeminiRequest,
  handleDeepseekRequest,
  handleGrokRequest,
  handleOpenAIRequest,
} from '@/components/chatbot/api';

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const {
      messages,
      chatbotId,
      language,
      model,
      temperature,
      maxTokens,
      systemPrompt,
      instructions,
      confidenceScoring,
    } = await req.json();

    await connectMongo();

    // Fetch AI settings, chatbot, dataset, and team info based on chatbotId
    const aiSettings = await ChatbotAISettings.findOne({ chatbotId });
    const chatbot = await Chatbot.findOne({ chatbotId });
    const dataset = await Dataset.findOne({ chatbotId });
    const enabledActions: any[] = []; // No actions used in compare route currently
    const team = chatbot ? await Team.findOne({ teamId: chatbot.teamId }) : null;

    if (team) {
      //@ts-ignore
      const creditLimit = config.stripe.plans[team.plan].credits;
      if (team.credits >= creditLimit) {
        return setCorsHeaders(new Response(
          JSON.stringify({
            error: 'limit reached, upgrade for more messages.',
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        ));
      }
    }

    const options = {
      method: 'POST',
      headers: {
        'TR-Dataset': dataset.datasetId,
        Authorization: `Bearer ${process.env.TRIEVE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: messages[messages.length - 1].content,
        search_type: 'fulltext',
        page_size: 4
      })
    };

    const chunk_response = await fetch('https://api.trieve.ai/api/chunk/search', options)
    const chunk_response_data = await chunk_response.json();

    if (!chunk_response.ok) {
      console.error("semantic search failed:", chunk_response_data);
      throw new Error(chunk_response_data.message || "semantic search failed.");
    }

    let relevant_chunk = "Please use the following information for answering.\n";
    for (let i = 0; i < chunk_response_data.chunks.length; i++) {
      relevant_chunk += chunk_response_data.chunks[i].chunk.chunk_html;
    }

    // Compose system prompt with instructions and language
    let finalSystemPrompt = systemPrompt || aiSettings?.systemPrompt || 'You are a helpful AI assistant.';
    if (language) {
      finalSystemPrompt += ` You must respond in ${language} language only. Please provide the result in HTML format that can be embedded in a <div> tag.`;
    }
    if (instructions) {
      finalSystemPrompt += `\n${instructions}`;
    }

    // Add confidence scoring prompt if requested
    if (confidenceScoring) {
      finalSystemPrompt += "\nFor your response, how confident are you in its accuracy on a scale from 0 to 100? Please make sure to put only this value at the very end of your response, formatted as ':::100' with no extra text following it.";
    }

    // Determine model provider and call appropriate handler
    if (model.startsWith('claude-')) {
      return await handleAnthropicRequest(
        finalSystemPrompt,
        relevant_chunk,
        messages,
        'user-1',
        maxTokens,
        temperature,
        model,
        team
      );
    } else if (model.startsWith('gemini-')) {
      return await handleGeminiRequest(
        finalSystemPrompt,
        relevant_chunk,
        messages,
        'user-1',
        maxTokens,
        temperature,
        model,
        team
      );
    } else if (model.startsWith('deepseek-')) {
      return await handleDeepseekRequest(
        finalSystemPrompt,
        relevant_chunk,
        messages,
        maxTokens,
        temperature,
        model,
        team
      );
    } else if (model.startsWith('grok-')) {
      return await handleGrokRequest(
        finalSystemPrompt,
        relevant_chunk,
        messages,
        maxTokens,
        temperature,
        model,
        team
      );
    } else {
      return await handleOpenAIRequest(
        finalSystemPrompt,
        relevant_chunk,
        messages,
        maxTokens,
        temperature,
        model,
        team,
        enabledActions
      );
    }
  } catch (error) {
    console.error('Compare route streaming error:', error);
    return setCorsHeaders(new Response(
      JSON.stringify({
        error: 'Streaming failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    ));
  }
}
