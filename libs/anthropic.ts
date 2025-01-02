import Anthropic from '@anthropic-ai/sdk';

export const sendAnthropic = async (
  messages: any[],
  userId: string,
  onContent: (text: string) => void,
  max = 8000,
  temp = 0.7,
  model = "claude-3-sonnet-20240229"
) => {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  console.log('Ask Claude >>>', model);
  messages.forEach((m) => console.log(` - ${m.role.toUpperCase()}: ${m.content}`));

  // Extract system message if present
  const systemMessage = messages.find(m => m.role === 'system')?.content || '';
  const userMessages = messages.filter(m => m.role !== 'system');

  try {
    const response = await anthropic.messages.create({
      model: model,
      messages: userMessages.map(m => ({
        role: m.role,
        content: m.content
      })),
      system: systemMessage,
      max_tokens: max,
      temperature: temp,
      stream: true,
    });

    for await (const chunk of response) {
      if (chunk.type === 'content_block_delta') {
        const delta = chunk.delta;
        if ('text' in delta) {
          const text = delta.text || '';
          if (text) {
            onContent(text);
          }
        }
      }
    }

  } catch (e) {
    console.error('Anthropic Error:', e);
    throw e;
  }
}; 