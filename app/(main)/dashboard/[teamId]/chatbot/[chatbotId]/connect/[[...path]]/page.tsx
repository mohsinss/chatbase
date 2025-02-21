import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import Chatbot from "@/models/Chatbot";
import DashboardNav from "@/components/DashboardNav";
import ChatbotTabs from "@/components/chatbot/ChatbotTabs";
import Connect from "@/components/chatbot/connect/Connect";

interface ChatbotData {
  integrations: Object
}

export default async function ConnectPage({ 
  params 
}: { 
  params: { teamId: string; chatbotId: string; path?: string[] } 
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
    integrations: chatbot.integrations
  };

  return (
    <>
      <DashboardNav teamId={params.teamId} />
      <ChatbotTabs teamId={params.teamId} chatbotId={params.chatbotId} />
      <main className="min-h-screen">
        <Connect chatbot={serializedChatbot} teamId={params.teamId} chatbotId={params.chatbotId} domain={process.env.LIVE_DOMAIN}/>
      </main>
    </>
  );
}