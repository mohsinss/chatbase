import connectMongo from "@/libs/mongoose";
import Chatbot from "@/models/Chatbot";
import ChatbotAISettings from "@/models/ChatbotAISettings";
import Playground from "@/components/chatbot/playground/Playground";

interface ChatbotData {
  id: string;
  name: string;
  settings?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
  };
}

export default async function ChatbotPage({ 
  params 
}: { 
  params: { chatbotId: string } 
}) {
  await connectMongo();
  let chatbot = await Chatbot.findOne({ chatbotId: params.chatbotId });
  let aiSettings = await ChatbotAISettings.findOne({ chatbotId: params.chatbotId });
  
  if(!chatbot || !aiSettings){
    const defaultChatbotId = process.env.DEFAULT_CHATBOT_ID;
    chatbot = await Chatbot.findOne({ chatbotId: defaultChatbotId });
    aiSettings = await ChatbotAISettings.findOne({ chatbotId: defaultChatbotId });
  }

  // Serialize the chatbot data with AI settings
  const serializedChatbot: ChatbotData = {
    id: chatbot.chatbotId,
    name: chatbot.name,
    settings: {
      model: aiSettings?.model || 'gpt-3.5-turbo',
      temperature: aiSettings?.temperature || 0.7,
      maxTokens: aiSettings?.maxTokens || 500,
      systemPrompt: aiSettings?.systemPrompt || '',
    }
  };

  return (
    <>
      <main className="w-full h-[100dvh] bg-white">
        <Playground chatbot={serializedChatbot} embed={true} standalone={true} mocking={false}/>
      </main>
    </>
  );
} 