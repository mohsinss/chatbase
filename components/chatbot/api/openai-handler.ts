import { openai } from './clients';
import { setCorsHeaders } from './cors';
import { O1_MODELS, O1_CONFIG } from './models';
import { tools } from './tools';
import { MODEL_MAPPING } from '@/types';
import { getAvailableSlots } from '@/lib/calcom';

export async function handleOpenAIRequest(
  systemPrompt: string,
  relevant_chunk: string,
  messages: any[],
  maxTokens: number,
  temperature: number,
  internalModel: string,
  team: any
) {
  console.log('Using OpenAI Model:', MODEL_MAPPING[internalModel] || 'gpt-3.5-turbo');
  const encoder = new TextEncoder();
  
  // Format messages based on model type
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
      }
    : {
        max_tokens: maxTokens,
        temperature,
        model: MODEL_MAPPING[internalModel] || 'gpt-3.5-turbo',
      };

  const response = await openai.chat.completions.create({
    ...modelParams,
    messages: formattedMessages,
    tools,
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let functionCallData: any = null;
        let assistantMessage = "";

        for await (const chunk of response) {
          const choice = chunk.choices[0];

          if (choice.delta.tool_calls) {
            functionCallData = functionCallData || { name: "", arguments: "" };
            const toolCall = choice.delta.tool_calls[0];

            if (toolCall.function.name) {
              functionCallData.name = toolCall.function.name;
            }
            if (toolCall.function.arguments) {
              functionCallData.arguments += toolCall.function.arguments;
            }
          } else if (choice.delta.content) {
            assistantMessage += choice.delta.content;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: choice.delta.content })}\n\n`));
          }
        }

        if (functionCallData) {
          const args = JSON.parse(functionCallData.arguments);
          console.log(functionCallData.name, args);

          if (functionCallData.name === "getAvailableSlots") {
            const formatDateHour = (isoString: string) => isoString.slice(0, 13);

            const dateFromFormatted = formatDateHour(args.dateFrom);
            const dateToFormatted = formatDateHour(args.dateTo);
            const meetingUrl = args.calUrl;
            const [username, eventType] = meetingUrl.replace("https://cal.com/", "").split("/");
            const slotsResponse = await getAvailableSlots(username, eventType, dateFromFormatted, dateToFormatted);

            const hasSlots = slotsResponse && Object.keys(slotsResponse).some(date => slotsResponse[date].length > 0);
            const slotsMessage = hasSlots
              ? `I have found available slots between ${dateFromFormatted} and ${dateToFormatted}.`
              : `I have not found available slots between ${dateFromFormatted} and ${dateToFormatted}.`;

            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: slotsMessage, slots: hasSlots ? slotsResponse : {}, meetingUrl })}\n\n`));
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
