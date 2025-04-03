import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import Chatbot from "@/models/Chatbot";
import DashboardNav from "@/components/DashboardNav";
import ChatbotTabs from "@/components/chatbot/ChatbotTabs";
import Activity from "@/components/chatbot/activity/Activity";

interface ChatbotData {
  id: string;
  name: string;
}

export default async function ActivityPage({ 
  params 
}: { 
  params: { teamId: string; chatbotId: string; subTab: string } 
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

  // Serialize the chatbot data with AI settings
  const serializedChatbot: ChatbotData = {
    id: chatbot.chatbotId,
    name: chatbot.name,
  };

  return (
    <>
      <DashboardNav teamId={params.teamId} />
      <ChatbotTabs teamId={params.teamId} chatbotId={params.chatbotId} />
      <main className="">
        <Activity chatbot={serializedChatbot} teamId={params.teamId} chatbotId={params.chatbotId} />
      </main>
    </>
  );
} 