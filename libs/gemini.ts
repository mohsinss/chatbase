import { GoogleGenerativeAI } from "@google/generative-ai";

export const sendGemini = async (
  messages: any[],
  userId: string,
  onContent: (text: string) => void,
  max = 8000,
  temp = 0.7,
  model = "gemini-1.5-pro"
) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  const geminiModel = genAI.getGenerativeModel({ model });

  console.log('Ask Gemini >>>', model);
  messages.forEach((m) => console.log(` - ${m.role.toUpperCase()}: ${m.content}`));

  try {
    // Extract system message and user messages
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const userMessages = messages.filter(m => m.role !== 'system');

    // Format messages for Gemini
    const formattedHistory = userMessages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // Start chat with history
    const chat = geminiModel.startChat({
      generationConfig: {
        maxOutputTokens: max,
        temperature: temp,
      },
    });

    // Add system prompt if present
    if (systemMessage) {
      await chat.sendMessage([{ text: systemMessage }]);
    }

    // Send the last user message and stream the response
    const lastMessage = userMessages[userMessages.length - 1].content;
    const result = await chat.sendMessageStream([{ text: lastMessage }]);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        onContent(text);
      }
    }

  } catch (e) {
    console.error('Gemini Error:', e);
    throw e;
  }
}; 