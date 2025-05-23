import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import Chatbot from "@/models/Chatbot";
import DashboardNav from "@/components/DashboardNav";
import ChatbotTabs from "@/components/chatbot/ChatbotTabs";
import Actions from "@/components/chatbot/actions/Actions";
import ChatbotAISettings from "@/models/ChatbotAISettings";

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

export default async function ActionsPage({ 
  params 
}: { 
  params: { teamId: string; chatbotId: string; subTab: string } 
}) {
  await connectMongo();
  const team = await Team.findOne({ teamId: params.teamId });
  const chatbot = await Chatbot.findOne({ chatbotId: params.chatbotId });

  if (!team || !chatbot) {
    redirect("/dashboard");
  }
  await connectMongo();
  const aiSettings = await ChatbotAISettings.findOne({ chatbotId: params.chatbotId });

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
      <DashboardNav teamId={params.teamId} />
      <ChatbotTabs teamId={params.teamId} chatbotId={params.chatbotId} />
      <main className="min-h-[calc(100vh-200px)]">
        <Actions teamId={params.teamId} chatbotId={params.chatbotId} chatbot={serializedChatbot} subTab={params.subTab}/>
      </main>
    </>
  );
} 