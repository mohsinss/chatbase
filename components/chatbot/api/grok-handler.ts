import { xai } from './clients';
import { setCorsHeaders } from './cors';
import { MODEL_MAPPING } from '@/types';

export async function handleGrokRequest(
  systemPrompt: string,
  relevant_chunk: string,
  messages: any[],
  maxTokens: number,
  temperature: number,
  internalModel: string,
  team: any
) {
  console.log('Using Grok Model:', MODEL_MAPPING[internalModel] || 'grok-2');
  const encoder = new TextEncoder();
  
  // Format messages
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
    messages: formattedMessages,
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
