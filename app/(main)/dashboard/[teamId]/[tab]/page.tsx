import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import DashboardTabs from "@/components/DashboardTabs";
import DashboardNav from "@/components/DashboardNav";

const VALID_TABS = ["chatbots", "usage", "settings"];

export default async function TeamTabPage({
  params
}: {
  params: { teamId: string; tab: string }
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  // Validate tab
  if (!VALID_TABS.includes(params.tab)) {
    redirect(`/dashboard/${params.teamId}/chatbots`);
  }

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
          <DashboardTabs teamId={params.teamId} team={JSON.stringify(team)} />
        </section>
      </main>
    </>
  );
}
