import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import Chatbot from "@/models/Chatbot";
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
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  await connectMongo();
  const team = await Team.findOne({ teamId: params.teamId });
  const chatbot = await Chatbot.findOne({ chatbotId: params.chatbotId });

  if (!team || !chatbot) {
    redirect("/dashboard");
  }

  // Serialize the chatbot data
  const serializedChatbot: ChatbotData = {
    id: chatbot._id.toString(),
    name: chatbot.name,
    settings: {
      model: chatbot.settings?.model,
      temperature: chatbot.settings?.temperature,
      maxTokens: chatbot.settings?.maxTokens,
      systemPrompt: chatbot.settings?.systemPrompt,
    }
  };

  return (
    <>
      <DashboardNav teamId={params.teamId} />
      <ChatbotTabs teamId={params.teamId} chatbotId={params.chatbotId} />
      <main className="min-h-screen">
        <Playground chatbot={serializedChatbot} />
      </main>
    </>
  );
} 