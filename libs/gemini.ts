import { GoogleGenerativeAI } from "@google/generative-ai";

export const sendGemini = async (
  messages: any[],
  userId: string,
  onContent: (text: string, confidenceScore: number) => void,
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

    // Initialize chat with generation config
    const chat = geminiModel.startChat({
      generationConfig: {
        maxOutputTokens: max,
        temperature: temp,
      },
    });

    // Send system prompt first to set context and language
    if (systemMessage) {
      await chat.sendMessage([{
        text: `You are an AI assistant. You must strictly follow these instructions:
        1. You must ONLY respond in the language specified in the system prompt
        2. You must maintain the persona and behavior specified in the system prompt
        3. System prompt: ${systemMessage}`
      }]);
    }

    // Send conversation history
    for (let i = 0; i < userMessages.length - 1; i++) {
      const msg = userMessages[i];
      await chat.sendMessage([{
        text: msg.content
      }]);
    }

    // Send the last message and stream the response
    const lastMessage = userMessages[userMessages.length - 1];
    const result = await chat.sendMessageStream([{
      text: lastMessage.content
    }]);
    console.log("result")
    console.log(result)
    for await (const chunk of result.stream) {
      const text = chunk.text();
      const confidenceScore = 1;
      if (text) {
        onContent(text, confidenceScore);
      }
    }

  } catch (e) {
    console.error('Gemini Error:', e);
    throw e;
  }
}; 