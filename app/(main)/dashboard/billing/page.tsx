import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/libs/next-auth";
import PaymentManagement from "@/components/PaymentManagement";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";

export const metadata = {
  title: "Billing & Payments",
  description: "Manage your subscription, payment methods, and view invoice history",
};

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  await connectMongo();

  // Find the user's team
  // For simplicity, we're assuming the user is part of only one team
  // In a real app, you might want to allow the user to select which team's billing to view
  const teams = await Team.find({
    "members.email": session.user.email,
    "members.status": "Active",
  });

  if (!teams || teams.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Billing & Payments</h1>
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span>You are not a member of any team. Please create or join a team to manage billing.</span>
        </div>
      </div>
    );
  }

  // Get the first team (or you could add team selection UI)
  const team = teams[0];

  // Check if user is an admin of the team
  const isAdmin = team.members.some(
    (member: any) => member.email === session.user.email && member.role === "Admin"
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Billing & Payments</h1>
        <div className="badge badge-outline">{team.name}</div>
      </div>

      {isAdmin ? (
        <PaymentManagement teamId={team._id.toString()} />
      ) : (
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>Only team admins can manage billing and payments. Please contact your team administrator.</span>
        </div>
      )}
    </div>
  );
}
