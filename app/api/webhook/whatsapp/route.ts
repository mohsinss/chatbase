import axios from 'axios';
import WhatsAppNumber from '@/models/WhatsAppNumber';
import connectMongo from "@/libs/mongoose";
import { sendAnthropic } from '@/libs/anthropic';
import { sendGemini } from '@/libs/gemini';
import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import ChatbotAISettings from "@/models/ChatbotAISettings";
import Chatbot from '@/models/Chatbot';
import Dataset from "@/models/Dataset";
import Team from '@/models/Team';
import config from '@/config';
import ChatbotConversation from '@/models/ChatbotConversation';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
  'gemini-1.5-pro': 'gemini-1.5-pro',
  // Deepseek models
  'deepseek-chat': 'deepseek-chat',
  'deepseek-reasoner': 'deepseek-reasoner',
};

// Add model type mapping with specific O1 model versions
const O1_MODELS = ['o1', 'o1-mini'];
const O1_CONFIG = {
  'o1': {
    maxOutputTokens: 100000,
    contextWindow: 200000,
    model: 'o1'
  },
  'o1-mini': {
    maxOutputTokens: 65536,
    contextWindow: 128000,
    model: 'o1-mini'
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === 'your_verify_token') {
    return NextResponse.json(Number(challenge), { status: 200 });
  } else {
    return new NextResponse(null, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    // Parse the incoming request body
    const data = await request.json();
    if (data?.entry?.length > 0) {
      if (data?.entry[0]?.changes?.length > 0) {
        if (data?.entry[0]?.changes[0].value?.messages?.length > 0) {
          if (data?.entry[0]?.changes[0]?.value?.messages[0]?.type == "text") {
            // Send data to the specified URL
            const response = await fetch('http://webhook.mrcoders.org/whatsapp.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });

            // Check if the request was successful
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            await connectMongo();

            const from = data?.entry[0]?.changes[0]?.value?.messages[0]?.from;
            const timestamp = data?.entry[0]?.changes[0]?.value?.messages[0]?.timestamp;
            const currentTimestamp = (new Date().getTime()) / 1000;
            const phone_number_id = data?.entry[0]?.changes[0]?.value?.metadata.phone_number_id;
            const text = data?.entry[0]?.changes[0]?.value?.messages[0]?.text?.body;
            const message_id = data?.entry[0]?.changes[0]?.value?.messages[0]?.id;

            if (timestamp + 60 < currentTimestamp) {
              return NextResponse.json({ status: 'Delievery denied coz long delay' }, { status: 200 });
            }

            let messages = [{ role: 'user', content: text }];

            // Fetch the existing WhatsAppNumber model
            const whatsappNumber = await WhatsAppNumber.findOne({ phoneNumberId: phone_number_id });
            if (!whatsappNumber) {
              // Respond with a 200 OK status
              return NextResponse.json({ status: "Whatsapp Number doesn't registered to the site." }, { status: 200 });
            }
            const chatbotId = whatsappNumber.chatbotId;

            // Measure time for fetching AI settings and dataset
            const aiSettings = await ChatbotAISettings.findOne({ chatbotId });
            const chatbot = await Chatbot.findOne({ chatbotId })
            const dataset = await Dataset.findOne({ chatbotId });

            const team = await Team.findOne({ teamId: chatbot.teamId });

            if (team) {
              //@ts-ignore
              const creditLimit = config.stripe.plans[team.plan].credits;
              if (team.credits >= creditLimit) {
                return NextResponse.json({ status: 'Credit is limited.' }, { status: 200 });
              }
            }

            if (!dataset) {
              return NextResponse.json({ status: "Can't find dataset." }, { status: 200 });
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
              return NextResponse.json({ status: "Semantic search failed." }, { status: 200 });
            }
            let relevant_chunk = "Please use the following information for answering.\n";
            for (let i = 0; i < chunk_response_data.chunks.length; i++) {
              relevant_chunk += chunk_response_data.chunks[i].chunk.chunk_html;
            }

            const internalModel = aiSettings?.model || 'gpt-3.5-turbo';
            const temperature = aiSettings?.temperature ?? 0.7;
            const maxTokens = aiSettings?.maxTokens ?? 500;
            const language = aiSettings?.language || 'en';
            const systemPrompt = `${aiSettings?.systemPrompt || 'You are a helpful AI assistant.'} You must respond in ${language} language only.`;

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
                    let log_probs_len = 0;
                    let log_probs_sum = 0.0;
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
                logprobs: true,
              });

              stream = new ReadableStream({
                async start(controller) {
                  try {
                    let log_probs_len = 0;
                    let log_probs_sum = 0.0;
                    for await (const chunk of response) {
                      const text = chunk.choices[0]?.delta?.content || '';
                      log_probs_len++;
                      log_probs_sum += chunk.choices[0].logprobs?.content[0]?.logprob || 0.0;

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

            // mark message as read
            const response1 = await axios.post(`https://graph.facebook.com/v22.0/${phone_number_id}/messages`, {
              messaging_product: "whatsapp",
              status: "read",
              message_id
            }, {
              headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
            });

            // send text msg to from number
            const response2 = await axios.post(`https://graph.facebook.com/v22.0/${phone_number_id}/messages`, {
              messaging_product: "whatsapp",
              to: from,
              text: {
                body: response_text
              }
            }, {
              headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
            });

            // Find existing conversation or create a new one
            let conversation = await ChatbotConversation.findOne({ chatbotId, platform: "whatsapp", "metadata.from": from, "metadata.to": whatsappNumber.display_phone_number });
            if (conversation) {
              // Update existing conversation
              conversation.messages.push({ role: "user", content: text });
              conversation.messages.push({ role: "assistant", content: response_text });
            } else {
              // Create new conversation
              conversation = new ChatbotConversation({
                chatbotId,
                platform: "whatsapp",
                metadata: { from, to: whatsappNumber.display_phone_number },
                messages: [{ role: "user", content: text },
                { role: "assistant", content: response_text }
                ]
              });
            }

            await conversation.save();

          }
        }
      }
    }

    // Respond with a 200 OK status
    return NextResponse.json({ status: 'OK' }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook event:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}