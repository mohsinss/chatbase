import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import Chatbot from "@/models/Chatbot";
import DashboardNav from "@/components/DashboardNav";
import ChatbotTabs from "@/components/chatbot/ChatbotTabs";
import Reactions from "@/components/chatbot/reactions/Reactions";

interface ChatbotData {
  id: string;
  name: string;
  integrations: {
    [key: string]: boolean;
  };
}

export default async function ReactionsPage({ 
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

  // Serialize the chatbot data
  const serializedChatbot: ChatbotData = {
    id: chatbot.chatbotId,
    name: chatbot.name,
    integrations: chatbot.integrations || {},
  };

  return (
    <>
      <DashboardNav teamId={params.teamId} />
      <ChatbotTabs teamId={params.teamId} chatbotId={params.chatbotId} />
      <main className="">
        <Reactions chatbot={serializedChatbot} teamId={params.teamId} chatbotId={params.chatbotId} />
      </main>
    </>
  );
} 