import { deepseek } from './clients';
import { setCorsHeaders } from './cors';
import { processMessagesForReasoner } from './helpers';
import { MODEL_MAPPING } from '@/types';

export async function handleDeepseekRequest(
  systemPrompt: string,
  relevant_chunk: string,
  messages: any[],
  maxTokens: number,
  temperature: number,
  internalModel: string,
  team: any
) {
  console.log('Using Deepseek Model:', MODEL_MAPPING[internalModel] || 'deepseek-chat');
  const encoder = new TextEncoder();
  
  // For O1 models, prepend system message as a user message
  let formattedMessages;
  if (MODEL_MAPPING[internalModel] == 'deepseek-reasoner') {
    formattedMessages = processMessagesForReasoner(
      systemPrompt,
      relevant_chunk,
      messages,
      '' // confidencePrompt is not used
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
    messages: formattedMessages,
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let log_probs_len = 0;
        let log_probs_sum = 0.0;
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || '';
          //@ts-ignore
          const reasonal_text = chunk.choices[0]?.delta?.reasoning_content || '';

          if (text) {
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

  return setCorsHeaders(new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  }));
}
