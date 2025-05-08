import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import DashboardTabs from "@/components/DashboardTabs";
import DashboardNav from "@/components/DashboardNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function TeamPage({ 
  params, 
  searchParams 
}: { 
  params: { teamId: string },
  searchParams: { welcome?: string }
}) {
  const session = await getServerSession(authOptions);
  await connectMongo();
  let team = await Team.findOne({ teamId: params.teamId });
  
  // Check if this is a new user being welcomed
  const showWelcome = searchParams.welcome === 'true';
  
  return (
    <>
      <DashboardNav teamId={params.teamId} />
      <main className="min-h-screen">
        {showWelcome && (
          <div className="bg-primary/10 border-l-4 border-primary p-4 mx-auto max-w-7xl mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-primary">Welcome to your new team!</h3>
                <div className="mt-2 text-sm text-primary/80">
                  <p>Your team has been created automatically. You can now create chatbots, manage settings, and invite team members.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <section className="max-w-7xl mx-auto pt-8">
          <DashboardTabs teamId={params.teamId} team={JSON.stringify(team)}/>
        </section>
      </main>
    </>
  );
}
