import { sendAnthropic } from '@/libs/anthropic';
import { sendGemini } from '@/libs/gemini';
import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from "@/libs/mongoose";
import ChatbotAISettings from "@/models/ChatbotAISettings";
import Chatbot from '@/models/Chatbot';
import Dataset from "@/models/Dataset";
import Team from '@/models/Team';
import ChatbotConversation from '@/models/ChatbotConversation';
import config from '@/config';
import { MODEL_MAPPING } from '@/types';
import { sampleFlow } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const xai = new OpenAI({
  baseURL: 'https://api.x.ai/v1',
  apiKey: process.env.X_GROK_API_KEY,
});

// Helper function to process messages for deepseek-reasoner
//@ts-ignore
function processMessagesForReasoner(systemPrompt, relevant_chunk, messages, confidencePrompt) {
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

  // Handle confidence prompt
  const lastMsg = formattedMessages[formattedMessages.length - 1];
  // const confidenceMessage = {
  //   role: 'user',
  //   content: confidencePrompt
  // };

  // if (lastMsg.role === 'user') {
  //   lastMsg.content += `\n${confidencePrompt}`;
  // } else {
  //   formattedMessages.push(confidenceMessage);
  // }

  return formattedMessages;
}

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

const allowedOrigins = ['*']; // Add your allowed origins here

const setCorsHeaders = (res: Response) => {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
};

export async function OPTIONS(req: NextRequest) {
  const res = NextResponse.json({}, { status: 200 });
  return setCorsHeaders(res);
}

export async function POST(req: NextRequest) {
  try {
    const { messages, selectedOption, optionIndex, nodeId, chatbotId, conversationId } = await req.json();

    await connectMongo();

    if (!conversationId) {
      return setCorsHeaders(new Response(
        JSON.stringify({
          error: 'conversationId is missing.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      ));
    }

    // Measure time for fetching AI settings and dataset
    const fetchStart = Date.now();
    const aiSettings = await ChatbotAISettings.findOne({ chatbotId });
    const chatbot = await Chatbot.findOne({ chatbotId });
    const dataset = await Dataset.findOne({ chatbotId });
    const conversation = await ChatbotConversation.findById(conversationId);

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

    const { questionFlow, questionFlowEnable, questionAiIResponseEnable, restartQFTimeoutMins } = dataset;
    const isAiResponseEnabled = questionAiIResponseEnable !== undefined ? questionAiIResponseEnable : true;

    let nextNode = null;

    if (questionFlowEnable && questionFlow) {

      const { nodes, edges } = (questionFlow && questionFlow.nodes && questionFlow.edges) ? questionFlow : sampleFlow;

      // If only one message and no nodeId, set nodeId to first node
      if (!nodeId && messages.length == 0) {
        // Find the top parent node (node without incoming edges)
        //@ts-ignore
        const childNodeIds = new Set(edges.map(edge => edge.target));
        //@ts-ignore
        const topParentNode = nodes.find(node => !childNodeIds.has(node.id));
        nextNode = topParentNode;
      }

      if (nodeId) {
        // User selected an option or initial message, find next node based on selected option or initial node
        //@ts-ignore
        const nextEdge = edges.find(edge => edge.source === nodeId && edge.sourceHandle === optionIndex?.toString());
        //@ts-ignore
        nextNode = nodes.find(node => node.id === nextEdge?.target);
      }

      if (!nextNode && !isAiResponseEnabled) {
        // Find the top parent node (node without incoming edges)
        //@ts-ignore
        const childNodeIds = new Set(edges.map(edge => edge.target));
        //@ts-ignore
        const topParentNode = nodes.find(node => !childNodeIds.has(node.id));
        nextNode = topParentNode;
      }

      if (nextNode) {
        const responsePayload: any = {
          message: nextNode.data.message || '',
          question: nextNode.data.question || '',
          options: nextNode.data.options || [],
          image: nextNode.data.image || '',
          nextNodeId: nextNode.id,
        };

        return setCorsHeaders(NextResponse.json(responsePayload, { status: 200 }));
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

    const internalModel = aiSettings?.model || 'gpt-3.5-turbo';
    const temperature = aiSettings?.temperature ?? 0.7;
    const maxTokens = aiSettings?.maxTokens ?? 500;
    const language = aiSettings?.language || 'en';
    // const systemPrompt = `${aiSettings?.systemPrompt || 'You are a helpful AI assistant.'} You must respond in italian language only.`;
    let systemPrompt = `${aiSettings?.systemPrompt || 'You are a helpful AI assistant.'} You must respond in ${language} language only. Please provide the result in HTML format that can be embedded in a <div> tag.`;

    const confidencePrompt = "\nFor your response, how confident are you in its accuracy on a scale from 0 to 100? Please make sure to put only this value at the very end of your response, formatted as ':::100' with no extra text following it.";
    systemPrompt += confidencePrompt;

    console.log("systemPrompt", systemPrompt)
    // Add detailed logging
    // console.log('Chat Request Details:', {
    //   selectedModel: internalModel,
    //   mappedModel: MODEL_MAPPING[internalModel],
    //   provider: internalModel.startsWith('claude-') ? 'Anthropic' :
    //     internalModel.startsWith('gemini-') ? 'Gemini' : 'OpenAI',
    //   temperature,
    //   maxTokens,
    //   language,
    //   systemPrompt
    // });

    const encoder = new TextEncoder();

    // Measure time for model processing
    const modelProcessingStart = Date.now();
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
                { role: 'user', content: relevant_chunk },
                ...messages,
                // { role: 'user', content: confidencePrompt }
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

      return setCorsHeaders(new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }));
    } else if (internalModel.startsWith('gemini-')) {
      console.log('Using Gemini Model:', internalModel);

      const stream = new ReadableStream({
        async start(controller) {
          try {
            const onContent = (text: string, confidenceScore: number) => {
              const sseMessage = `data: ${JSON.stringify({ text })}\n\n`;
              controller.enqueue(encoder.encode(sseMessage));
            };

            await sendGemini(
              [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: relevant_chunk },
                ...messages,
                // { role: 'user', content: confidencePrompt }
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

      return setCorsHeaders(new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }));
    } else if (internalModel.startsWith('deepseek-')) {
      console.log('Using Deepseek Model:', MODEL_MAPPING[internalModel] || 'deepseek-chat');

      // For O1 models, prepend system message as a user message
      let formattedMessages;
      if (MODEL_MAPPING[internalModel] == 'deepseek-reasoner') {
        formattedMessages = processMessagesForReasoner(
          systemPrompt,
          relevant_chunk,
          messages,
          confidencePrompt
        );
      } else {
        formattedMessages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: relevant_chunk },
          ...messages,
          // { role: 'user', content: confidencePrompt }
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
        messages: formattedMessages,
        stream: true,
      });

      console.log(`Model processing took ${Date.now() - modelProcessingStart}ms`);

      const stream = new ReadableStream({
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
                const sseMessage = `data: ${JSON.stringify({ text })}\n\n`;
                controller.enqueue(encoder.encode(sseMessage));
              }
              if (reasonal_text) {
                const sseMessage = `reason: ${JSON.stringify({ reasonal_text })}\n\n`;
                controller.enqueue(encoder.encode(sseMessage));
              }
            }

            // Calculate average log probability
            // const averageLogProb = log_probs_sum / log_probs_len;
            // let confidenceScore;
            // if (averageLogProb === 0) {
            //   confidenceScore = 100; // If average is zero, confidence is perfect (100%)
            // } else {
            //   confidenceScore = (1 + averageLogProb) * 100; // Adjust as needed
            // }

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

      return setCorsHeaders(new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }));
    } else if (internalModel.startsWith('grok-')) {
      console.log('Using Grok Model:', MODEL_MAPPING[internalModel] || 'grok-2');

      // For O1 models, prepend system message as a user message
      const formattedMessages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: relevant_chunk },
        ...messages,
        // { role: 'user', content: confidencePrompt }
      ];

      // Configure model-specific parameters
      const modelParams = {
        max_tokens: maxTokens,
        temperature,
        model: MODEL_MAPPING[internalModel] || 'grok-2',
      };

      const response = await xai.chat.completions.create({
        ...modelParams,
        messages: formattedMessages,
        stream: true,
      });

      console.log(`Model processing took ${Date.now() - modelProcessingStart}ms`);

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

      return setCorsHeaders(new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }));
    } else {
      let assistantId = conversation?.metadata?.openaiAssistantId;
      let threadId = conversation?.metadata?.openaiThreadId;

      // Validate existing assistant and thread IDs
      let validAssistantId = assistantId;
      let validThreadId = threadId;

      // Verify assistant ID exists and is valid
      if (assistantId) {
        try {
          await openai.beta.assistants.retrieve(assistantId);
        } catch (error) {
          console.log('Invalid assistant ID, creating new assistant');
          const newAssistant = await openai.beta.assistants.create({
            name: `${dataset.name || 'Chatbot'} Assistant`,
            instructions: aiSettings?.systemPrompt || 'You are a helpful AI assistant.',
            model: MODEL_MAPPING[internalModel] || 'gpt-3.5-turbo',
            // tools: [{ type: "retrieval" }],
            // file_ids: dataset.fileIds || []
          });
          validAssistantId = newAssistant.id;
        }
      } else {
        // Create new assistant if none exists
        const newAssistant = await openai.beta.assistants.create({
          name: `${dataset.name || 'Chatbot'} Assistant`,
          instructions: aiSettings?.systemPrompt || 'You are a helpful AI assistant.',
          model: MODEL_MAPPING[internalModel] || 'gpt-3.5-turbo',
          // tools: [{ type: "retrieval" }],
          // file_ids: dataset.fileIds || []
        });
        validAssistantId = newAssistant.id;
      }

      // Verify thread ID exists and is valid
      if (threadId) {
        try {
          await openai.beta.threads.retrieve(threadId);
        } catch (error) {
          console.log('Invalid thread ID, creating new thread');
          const newThread = await openai.beta.threads.create();
          validThreadId = newThread.id;
        }
      } else {
        const newThread = await openai.beta.threads.create();
        validThreadId = newThread.id;
      }

      // Update conversation with valid IDs if needed
      if (conversation && (!assistantId || !threadId || assistantId !== validAssistantId || threadId !== validThreadId)) {
        await ChatbotConversation.findByIdAndUpdate(
          conversation._id,
          {
            metadata: {
              ...conversation.metadata,
              openaiAssistantId: validAssistantId,
              openaiThreadId: validThreadId
            }
          },
          { new: true }
        );
      }

      // Add the user's message to the thread
      await openai.beta.threads.messages.create(validThreadId, {
        role: "user",
        content: messages[messages.length - 1].content,
      });

      // Run the assistant
      const run = await openai.beta.threads.runs.create(validThreadId, {
        assistant_id: validAssistantId,
      });


      console.log('Using OpenAI Model:', MODEL_MAPPING[internalModel] || 'gpt-3.5-turbo');

      // For O1 models, prepend system message as a user message
      let formattedMessages;
      if (O1_MODELS.includes(internalModel)) {
        formattedMessages = [
          { role: 'user', content: systemPrompt },
          { role: 'user', content: relevant_chunk },
          ...messages,
          // { role: 'user', content: confidencePrompt }
        ];
      } else {
        formattedMessages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: relevant_chunk },
          ...messages,
          // { role: 'user', content: confidencePrompt }
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
        messages: formattedMessages,
        stream: true,
      });

      console.log(`Model processing took ${Date.now() - modelProcessingStart}ms`);

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

      return setCorsHeaders(new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }));
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