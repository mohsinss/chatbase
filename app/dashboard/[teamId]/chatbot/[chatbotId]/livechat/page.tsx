import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import Chatbot from "@/models/Chatbot";
import ChatbotAISettings from "@/models/ChatbotAISettings";
import DashboardNav from "@/components/DashboardNav";
import ChatbotTabs from "@/components/chatbot/ChatbotTabs";
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
  params: { teamId: string; chatbotId: string } 
}) {
//   const session = await getServerSession(authOptions);
  
//   if (!session?.user?.id) {
//     redirect("/api/auth/signin");
//   }

  await connectMongo();
  const team = await Team.findOne({ teamId: params.teamId });
  const chatbot = await Chatbot.findOne({ chatbotId: params.chatbotId });
  const aiSettings = await ChatbotAISettings.findOne({ chatbotId: params.chatbotId });

  if (!team || !chatbot) {
    redirect("/dashboard");
  }

  console.log('AI Settings found:', aiSettings);

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
      <main className="min-h-[80vh]">
        <Playground chatbot={serializedChatbot} />
      </main>
    </>
  );
} 