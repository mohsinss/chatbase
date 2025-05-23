import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import DashboardNav from "@/components/DashboardNav";
import DashboardTabs from "@/components/DashboardTabs";
import Team from "@/models/Team";
import connectMongo from "@/libs/mongoose";

interface PageProps {
  params: {
    teamId: string;
    subtab: string;
  };
}

export default async function SettingsPage({ params }: PageProps) {
  await connectMongo();
  const team = await Team.findOne({ teamId: params.teamId });

  if (!team) {
    redirect("/dashboard");
  }

  return (
    <>
      <DashboardNav teamId={params.teamId} />
      <main className="min-h-screen">
        <section className="max-w-7xl mx-auto pt-8">
          <DashboardTabs teamId={params.teamId} team={JSON.stringify(team)}/>
        </section>
      </main>
    </>
  );
} 