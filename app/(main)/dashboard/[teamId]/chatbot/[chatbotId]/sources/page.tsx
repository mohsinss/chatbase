import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import Chatbot from "@/models/Chatbot";
import DashboardNav from "@/components/DashboardNav";
import ChatbotTabs from "@/components/chatbot/ChatbotTabs";
import Sources from "@/components/chatbot/sources/Sources";
import { convertToJSON } from "@/lib/utils";

export default async function SourcesPage({ 
  params 
}: { 
  params: { teamId: string; chatbotId: string } 
}) {
  await connectMongo();
  const team = await Team.findOne({ teamId: params.teamId });
  const chatbot = await Chatbot.findOne({ chatbotId: params.chatbotId });

  if (!team || !chatbot) {
    redirect("/dashboard");
  }

  return (
    <>
      <DashboardNav teamId={params.teamId} />
      <ChatbotTabs teamId={params.teamId} chatbotId={params.chatbotId} />
      <main className="min-h-screen">
        <Sources teamId={params.teamId} chatbotId={params.chatbotId} chatbot={convertToJSON(chatbot)} team={convertToJSON(team)}/>
      </main>
    </>
  );
} 