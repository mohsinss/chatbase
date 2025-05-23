import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import DashboardNav from "@/components/DashboardNav";
import ChatbotCreator from "@/components/chatbot/ChatbotCreator";

export default async function CreateNewChatbot({ 
  params 
}: { 
  params: { teamId: string } 
}) {
  await connectMongo();
  const team = await Team.findOne({ teamId: params.teamId });

  if (!team) {
    redirect("/dashboard");
  }

  return (
    <>
      <DashboardNav teamId={params.teamId} />
      <main className="min-h-screen">
        <ChatbotCreator teamId={params.teamId} />
      </main>
    </>
  );
} 