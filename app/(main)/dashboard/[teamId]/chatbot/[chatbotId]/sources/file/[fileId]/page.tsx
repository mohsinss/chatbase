import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import Chatbot from "@/models/Chatbot";
import DashboardNav from "@/components/DashboardNav";
import ChatbotTabs from "@/components/chatbot/ChatbotTabs";
import Dataset from "@/models/Dataset";
import SourceFile from "@/components/chatbot/sources/file/SourceFile";
import { convertToJSON } from "@/lib/utils";

export default async function FilePage({
  params
}: {
  params: { teamId: string; chatbotId: string, fileId: string }
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  await connectMongo();
  const team = await Team.findOne({ teamId: params.teamId });
  const chatbot = await Chatbot.findOne({ chatbotId: params.chatbotId });
  const dataset = await Dataset.findOne({ chatbotId: params.chatbotId });

  if (!team || !chatbot || !dataset) {
    redirect("/dashboard");
  }

  const file = dataset.files.find((f: any) => f._id?.toString() === params.fileId);
  console.log(file)

  if (!file) {
    redirect("/dashboard");
  }

  return (
    <>
      <DashboardNav teamId={params.teamId} />
      <ChatbotTabs teamId={params.teamId} chatbotId={params.chatbotId} />
      <main className="min-h-screen">
        <SourceFile
          datasetId={dataset.datasetId}
          teamId={params.teamId}
          chatbotId={params.chatbotId}
          chatbot={convertToJSON(chatbot)}
          team={convertToJSON(team)}
          file={convertToJSON(file)}
        />
      </main>
    </>
  );
}
