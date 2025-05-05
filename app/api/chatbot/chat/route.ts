import { NextRequest, NextResponse } from 'next/server';
import connectMongo from "@/libs/mongoose";
import ChatbotAISettings from "@/models/ChatbotAISettings";
import Chatbot from '@/models/Chatbot';
import Dataset from "@/models/Dataset";
import Team from '@/models/Team';
import ChatbotAction from '@/models/ChatbotAction';
import config from '@/config';
import { translateText, translateJsonFields } from '@/components/chatbot/api/translation';

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

export async function OPTIONS(req: NextRequest) {
  return handleOptionsRequest();
}

export async function POST(req: NextRequest) {
  try {
    const {
      messages,
      selectedOption,
      optionIndex,
      nodeId,
      chatbotId,
      mocking,
      mockingdata,
      dataAction,
      metadata
    } = await req.json();

    await connectMongo();

    // Measure time for fetching AI settings and dataset
    const fetchStart = Date.now();
    const aiSettings = await ChatbotAISettings.findOne({ chatbotId });
    const chatbot = await Chatbot.findOne({ chatbotId });
    const dataset = await Dataset.findOne({ chatbotId });
    const enabledActions = await ChatbotAction.find({ chatbotId, enabled: true });

    console.log(`Fetching AI settings and dataset took ${Date.now() - fetchStart}ms`);

    const team = await Team.findOne({ teamId: chatbot.teamId });

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

    if (!dataset) {
      return setCorsHeaders(NextResponse.json(
        { error: "No dataset found for this chatbot" },
        { status: 404 }
      ));
    }

    // Handle question flow logic
    const questionFlowResponse = await handleQuestionFlow(dataset, nodeId, optionIndex, messages);
    if (questionFlowResponse) {
      return questionFlowResponse;
    }

    const internalModel = aiSettings?.model || 'gpt-3.5-turbo';

    // Handle direct actions if dataAction is provided
    if (internalModel.startsWith('gpt-') && dataAction && enabledActions?.length > 0) {
      const orderManagementAction = enabledActions.find(action => action.type === 'ordermanagement');

      if (orderManagementAction && ['get_categories', 'get_menu', 'get_menus', 'add_to_cart', 'track_order', 'submit_order'].includes(dataAction)) {
        try {
          // Import the order management functions
          const { getCategories, getMenus, getMenu, addToCart, submitOrder, getOrders } = await import('@/components/chatbot/api/order-management');

          // Determine target language from orderAction metadata
          const targetLanguage = orderManagementAction?.metadata?.language || 'en';
          let result;

          // Call the appropriate function based on dataAction
          switch (dataAction) {
            case 'get_categories':
              result = await getCategories(chatbotId);
              break;

            case 'get_menus':
              result = await getMenus(chatbotId, metadata?.category);
              break;

            case 'get_menu':
              result = await getMenu(chatbotId, metadata?.itemId, metadata?.category);
              break;

            // case 'add_to_cart':
            //   const quantity = metadata?.quantity ? parseInt(metadata.quantity, 10) : 1;
            //   result = await addToCart(chatbotId, metadata?.itemId, quantity);
            //   break;

            case 'track_order':
              result = await getOrders(chatbotId, metadata?.orderId);
              break;
          }

          if (result) {
            // if (targetLanguage !== 'en') {
            //   if (typeof result === 'string') {
            //     result = await translateText(result, targetLanguage);
            //   } else if (typeof result === 'object') {
            //     result = await translateJsonFields(result, targetLanguage);
            //   }
            // }
            
            // Return the result directly
            return setCorsHeaders(new Response(
              JSON.stringify({ message: result }),
              {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }
            ));
          }
        } catch (error) {
          console.error('Direct action error:', error);
          // Continue with AI processing if direct action fails
        }
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
        search_type: 'semantic',
        page_size: 1
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
    relevant_chunk = "";

    const temperature = aiSettings?.temperature ?? 0.7;
    const maxTokens = aiSettings?.maxTokens ?? 500;
    const language = aiSettings?.language || 'en';

    let systemPrompt = `${aiSettings?.systemPrompt || 'You are a helpful AI assistant.'} You must respond in ${language} language only. Please provide the result in HTML format that can be embedded in a <div> tag.`;

    if (internalModel.startsWith('gpt-') && enabledActions?.length > 0) {
      const calComActions = enabledActions.filter(action => action.type === 'calcom');
      const orderManagementAction = enabledActions.filter(action => action.type === 'ordermanagement');
      if (orderManagementAction.length > 0) {
        const OMLanguage = orderManagementAction[0]?.metadata?.language || 'en';
        systemPrompt = `${orderManagementSystemPrompt}\n You must respond in ${OMLanguage} language only. Please provide the result in HTML format that can be embedded in a <div> tag.`;;
      } else if (calComActions.length > 0) {
        const calComActionsPrompt = `
When a user asks for available slots, use the "getAvailableSlots" function.
Choose the correct "calUrl" from the available actions list:
  Meeting Actions List:
${calComActions.map((action, index) => `          ${index + 1}. "${action.url}" for '${action.instructions}'`).join('\n')}
        Match the user's request to the correct "calUrl" before calling the function.
    `;
        systemPrompt += calComActionsPrompt;
      }
    }

    const confidencePrompt = "\nFor your response, how confident are you in its accuracy on a scale from 0 to 100? Please make sure to put only this value at the very end of your response, formatted as ':::100' with no extra text following it.";
    const todayData = "\nToday is " + Date().toString();

    systemPrompt += todayData + confidencePrompt;

    // Check model provider and handle accordingly
    if (internalModel.startsWith('claude-')) {
      return await handleAnthropicRequest(
        systemPrompt,
        relevant_chunk,
        messages,
        'user-1',
        maxTokens,
        temperature,
        internalModel,
        team
      );
    } else if (internalModel.startsWith('gemini-')) {
      return await handleGeminiRequest(
        systemPrompt,
        relevant_chunk,
        messages,
        'user-1',
        maxTokens,
        temperature,
        internalModel,
        team
      );
    } else if (internalModel.startsWith('deepseek-')) {
      return await handleDeepseekRequest(
        systemPrompt,
        relevant_chunk,
        messages,
        maxTokens,
        temperature,
        internalModel,
        team
      );
    } else if (internalModel.startsWith('grok-')) {
      return await handleGrokRequest(
        systemPrompt,
        relevant_chunk,
        messages,
        maxTokens,
        temperature,
        internalModel,
        team
      );
    } else {
      return await handleOpenAIRequest(
        systemPrompt,
        relevant_chunk,
        messages,
        maxTokens,
        temperature,
        internalModel,
        team,
        enabledActions
      );
    }
  } catch (error) {
    console.error('Streaming error:', error);
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