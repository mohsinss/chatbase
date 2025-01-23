import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import DashboardTabs from "@/components/DashboardTabs";
import DashboardNav from "@/components/DashboardNav";

export default async function TeamPage({ params }: { params: { teamId: string } }) {
  await connectMongo();
  let team = await Team.findOne({ teamId: params.teamId });
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