import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import { getTeams } from "@/libs/teams";
import Link from "next/link";
import { IconUsers } from "@tabler/icons-react";
import ButtonCreateTeam from "@/components/ButtonCreateTeam";
import DashboardNav from "@/components/DashboardNav";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");

  const teams = await getTeams(session.user.id);

  return (
    <>
      <DashboardNav teamId={""} />
      <section className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Dashboard</h1>
          <p className="text-base-content/70">Select a team to manage chatbots and collections</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Teams */}
          {teams.map((team) => (
            <Link
              key={team.id}
              href={`/dashboard/${team.id}`}
              className="card bg-base-100 hover:bg-base-200 transition-colors border border-base-200 cursor-pointer"
            >
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconUsers className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="card-title text-lg">{team.name}</h2>
                    <p className="text-sm text-base-content/70">
                      {team.chatbotsCount || 0} chatbots
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* Create New Team Button */}
          <ButtonCreateTeam />
        </div>
      </section>
    </>
  );
}
