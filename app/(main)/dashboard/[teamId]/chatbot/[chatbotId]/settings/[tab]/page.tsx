import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import Chatbot from "@/models/Chatbot";
import DashboardNav from "@/components/DashboardNav";
import ChatbotTabs from "@/components/chatbot/ChatbotTabs";
import Settings from "@/components/chatbot/settings/Settings";

interface PageProps {
  params: {
    teamId: string;
    chatbotId: string;
    tab: string;
  };
}

interface TeamData {
  plan: string;
}

export default async function SettingsPage({ params }: PageProps) {
  await connectMongo();
  const team = await Team.findOne({ teamId: params.teamId });
  const chatbot = await Chatbot.findOne({ chatbotId: params.chatbotId });

  if (!team || !chatbot) {
    redirect("/dashboard");
  }

  // Serialize the chatbot data with AI settings
  const serializedTeam: TeamData = {
    plan: team.plan
  };

  return (
    <>
      <DashboardNav teamId={params.teamId} />
      <ChatbotTabs teamId={params.teamId} chatbotId={params.chatbotId} />
      <main className="min-h-screen ">
        <Settings team={serializedTeam} teamId={params.teamId} chatbotId={params.chatbotId} />
      </main>
    </>
  );
} 