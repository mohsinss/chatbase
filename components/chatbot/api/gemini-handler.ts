import { sendGemini } from '@/libs/gemini';
import { setCorsHeaders } from './cors';

export async function handleGeminiRequest(
  systemPrompt: string,
  relevant_chunk: string,
  messages: any[],
  userId: string,
  maxTokens: number,
  temperature: number,
  internalModel: string,
  team: any
) {
  console.log('Using Gemini Model:', internalModel);
  const encoder = new TextEncoder();
  
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
          ],
          userId,
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
}
