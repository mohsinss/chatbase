import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import DashboardNav from "@/components/DashboardNav";

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

  if (!team) {
    redirect("/dashboard");
  }

  return (
    <>
      <DashboardNav teamId={params.teamId} />
      <main className="min-h-screen p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Chatbot Settings</h1>
          {/* Add your chatbot settings UI here */}
        </div>
      </main>
    </>
  );
} 