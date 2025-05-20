import Dataset from "@/models/Dataset"
import Chatbot from "@/models/Chatbot"
import ChatbotAISettings from "@/models/ChatbotAISettings"
import Team from "@/models/Team"
import ChatbotAction from "@/models/ChatbotAction"
import { sendAnthropic } from '@/libs/anthropic';
import { sendGemini } from '@/libs/gemini';
import { MODEL_MAPPING } from '@/types';
import config from '@/config';
import OpenAI from 'openai';
import { O1_MODELS, O1_CONFIG } from '@/types/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const xai = new OpenAI({
  baseURL: 'https://api.x.ai/v1',
  apiKey: process.env.X_GROK_API_KEY,
});

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});
// Helper function to process messages for deepseek-reasoner
//@ts-ignore
function processMessagesForReasoner(systemPrompt, relevant_chunk, messages) {
  let formattedMessages = [{
    role: 'user',
    content: `${systemPrompt}\n${relevant_chunk}`
  }];

  // Process existing messages
  for (const msg of messages) {
    const lastMsg = formattedMessages[formattedMessages.length - 1];
    if (msg.role === lastMsg.role) {
      // Merge consecutive same-role messages
      lastMsg.content += `\n${msg.content}`;
    } else {
      formattedMessages.push(msg);
    }
  }

  return formattedMessages;
}

export const getAIResponse = async (chatbotId: string, messages: any, text: string, updatedPrompt?: string, params?: any) => {
  // Measure time for fetching AI settings and dataset
  const dataset = await Dataset.findOne({ chatbotId });
  const aiSettings = await ChatbotAISettings.findOne({ chatbotId });
  const chatbot = await Chatbot.findOne({ chatbotId })

  const team = await Team.findOne({ teamId: chatbot.teamId });

  if (team) {
    //@ts-ignore
    const creditLimit = config.stripe.plans[team.plan].credits;
    if (team.credits >= creditLimit) {
      return 'Credit is limited.';
    }
  }

  if (!dataset) {
    return "Can't find dataset.";
  }

  const options = {
    method: 'POST',
    headers: {
      'TR-Dataset': dataset.datasetId,
      Authorization: `Bearer ${process.env.TRIEVE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: text,
      search_type: 'semantic',
      page_size: 1
    })
  };

  const chunk_response = await fetch('https://api.trieve.ai/api/chunk/search', options)
  const chunk_response_data = await chunk_response.json();

  if (!chunk_response.ok) {
    console.error("Semantic search failed.", chunk_response_data);
    return "Semantic search failed.";
  }
  let relevant_chunk = "Please use the following information for answering.\n";
  for (let i = 0; i < chunk_response_data.chunks.length; i++) {
    relevant_chunk += chunk_response_data.chunks[i].chunk.chunk_html;
  }

  const internalModel = aiSettings?.model || 'gpt-3.5-turbo';
  const temperature = aiSettings?.temperature ?? 0.7;
  const maxTokens = aiSettings?.maxTokens ?? 500;
  const language = aiSettings?.language || 'en';
  let systemPrompt;

  systemPrompt = `${aiSettings?.systemPrompt || 'You are a helpful AI assistant.'} You must respond in ${language} language only.`;
  if (updatedPrompt) {
    systemPrompt += `\n\nThen only apply this prompt(${updatedPrompt}) if the response does not contain a JSON array\n\n`;
  }

  const enabledActions = await ChatbotAction.find({ chatbotId, enabled: true });
  const buttonActions = enabledActions.filter(action => action.type === 'button');

  if (params?.enableJsonResponse) {
    if (buttonActions.length > 0) {
      interface ButtonActionMetadata {
        buttonType?: string;
        buttonText?: string;
        url: string;
        instructions: string;
      }

      interface ButtonAction {
        metadata: ButtonActionMetadata[];
      }

      const buttonActionsPrompt = `
  Respond with a JSON array of recommended actions based on the user's message.
  Each item in the array should follow this structure:
  
  {
    "type": "button",
    "text": "Text for the button or link",
    "url": "https://...",
    "description": "give brief description for this link",
  }
  
  Choose from the following actions:
  
  ${buttonActions[0]?.metadata
          ?.map((action: ButtonActionMetadata, index: number) => {
            const type: string = action.buttonType || 'button';
            const text: string = action.buttonText || action.url;
            const url: string = action.url;
            const instructions: string = action.instructions;

            return `  ${index + 1}. Type: "${type}", Text: "${text}", URL: "${url}", When to use: "${instructions}"`;
          })
          .join('\n')}
  
  Make sure that Only return the JSON array of relevant actions (no description text or formatting, ignore other prompts).
  `;

      systemPrompt += buttonActionsPrompt;
    }

    if (chatbot?.integrations?.salla === true) {
      systemPrompt += `
  If the user asks about products on the Salla store, respond with a JSON array.
  Each item should look like this:
  
  {
    "type": "product",
    "name": "[Product Name]",
    "description": "[Short Description – 2 to 3 sentences]",
    "price": "[Amount] [Currency]",
    "image": "[Image URL]",
    "url": "[Product Page URL]"
  }
  
   Make sure that Only return the JSON array. Clicking the image or product name should go to the product URL, ignore other prompts.
  `;
    }
  }

  const todayData = "\nToday is " + Date().toString();

  systemPrompt += todayData;

  const encoder = new TextEncoder();
  let response_text = '';
  let stream;
  // Check model provider and handle accordingly
  if (internalModel.startsWith('claude-')) {
    console.log('Using Anthropic Model:', internalModel);
    stream = new ReadableStream({
      async start(controller) {
        try {
          const onContent = (text: string) => {
            response_text += text;
            const sseMessage = `data: ${JSON.stringify({ text })}\n\n`;
            controller.enqueue(encoder.encode(sseMessage));
          };

          await sendAnthropic(
            [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: relevant_chunk },
              ...messages,
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

    if (team) {
      team.credits += 1;
      await team.save();
    }

  } else if (internalModel.startsWith('gemini-')) {
    console.log('Using Gemini Model:', internalModel);

    stream = new ReadableStream({
      async start(controller) {
        try {
          const onContent = (text: string, confidenceScore: number) => {
            response_text += text;
            const sseMessage = `data: ${JSON.stringify({ text })}\n\n`;
            controller.enqueue(encoder.encode(sseMessage));
          };

          await sendGemini(
            [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: relevant_chunk },
              ...messages,
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

    if (team) {
      team.credits += 1;
      await team.save();
    }

  } else if (internalModel.startsWith('deepseek-')) {
    console.log('Using Deepseek Model:', MODEL_MAPPING[internalModel] || 'deepseek-chat');

    // For O1 models, prepend system message as a user message
    let formattedMessages;
    if (MODEL_MAPPING[internalModel] == 'deepseek-reasoner') {
      formattedMessages = processMessagesForReasoner(
        systemPrompt,
        relevant_chunk,
        messages,
      );
    } else {
      formattedMessages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: relevant_chunk },
        ...messages,
      ];
    }

    // Configure model-specific parameters
    const modelParams = {
      max_tokens: maxTokens,
      temperature,
      model: MODEL_MAPPING[internalModel] || 'deepseek-chat',
    };

    const response = await deepseek.chat.completions.create({
      ...modelParams,
      //@ts-ignore
      messages: formattedMessages,
      stream: true,
    });

    stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.choices[0]?.delta?.content || '';
            //@ts-ignore
            const reasonal_text = chunk.choices[0]?.delta?.reasoning_content || '';
            // log_probs_len++;
            // log_probs_sum += chunk.choices[0].logprobs?.content[0]?.logprob || 0.0;

            if (text) {
              response_text += text;
              const sseMessage = `data: ${JSON.stringify({ text })}\n\n`;
              controller.enqueue(encoder.encode(sseMessage));
            }
            if (reasonal_text) {
              const sseMessage = `reason: ${JSON.stringify({ reasonal_text })}\n\n`;
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

    if (team) {
      team.credits += 1;
      await team.save();
    }

  } else if (internalModel.startsWith('grok-')) {
    console.log('Using Grok Model:', MODEL_MAPPING[internalModel] || 'grok-2');

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: relevant_chunk },
      ...messages,
    ];

    // Configure model-specific parameters
    const modelParams = {
      max_tokens: maxTokens,
      temperature,
      model: MODEL_MAPPING[internalModel] || 'grok-2',
    };

    const response = await xai.chat.completions.create({
      ...modelParams,
      //@ts-ignore
      messages: formattedMessages,
      stream: true,
    });

    stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
              response_text += text;
            }
          }

          // Send confidence score as part of the response
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          // controller.enqueue(encoder.encode('score:' + confidenceScore));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    if (team) {
      team.credits += 1;
      await team.save();
    }
  } else {
    // For O1 models, prepend system message as a user message
    let formattedMessages;
    if (O1_MODELS.includes(internalModel)) {
      formattedMessages = [
        { role: 'user', content: systemPrompt },
        { role: 'user', content: relevant_chunk },
        ...messages,
      ];
    } else {
      formattedMessages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: relevant_chunk },
        ...messages,
      ];
    }

    // Configure model-specific parameters
    const modelParams = O1_MODELS.includes(internalModel)
      ? {
        max_completion_tokens: Math.min(
          maxTokens,
          O1_CONFIG[internalModel as keyof typeof O1_CONFIG].maxOutputTokens
        ),
        temperature: 1,
        model: O1_CONFIG[internalModel as keyof typeof O1_CONFIG].model,
        // logprobs: 5 // Adjust this number based on how many log probabilities you want
      }
      : {
        max_tokens: maxTokens,
        temperature,
        model: MODEL_MAPPING[internalModel] || 'gpt-3.5-turbo',
        // logprobs: 5 // Adjust this number based on how many log probabilities you want
      };

    const response = await openai.chat.completions.create({
      ...modelParams,
      //@ts-ignore
      messages: formattedMessages,
      stream: true,
    });

    stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.choices[0]?.delta?.content || '';

            if (text) {
              response_text += text;
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

    if (team) {
      team.credits += 1;
      await team.save();
    }
  }

  const reader = stream.getReader();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done } = await reader.read();
    if (done) {
      break;
    }
  }

  console.log("updatedPrompt", systemPrompt, response_text);

  return response_text;
}