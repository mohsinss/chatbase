"use client";

import PaymentManagement from "@/components/PaymentManagement";

interface BillingTabProps {
  teamId: string;
  team?: any;
}

const BillingTab = ({ teamId, team }: BillingTabProps) => {
  // Check if user is an admin of the team
  const isAdmin = team?.members?.some(
    (member: any) => 
      member.email === (typeof window !== 'undefined' ? localStorage.getItem('userEmail') : '') && 
      member.role === "Admin"
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Billing & Payments</h1>
        <div className="badge badge-outline">{team?.name}</div>
      </div>

      {isAdmin ? (
        <PaymentManagement teamId={teamId} />
      ) : (
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>Only team admins can manage billing and payments. Please contact your team administrator.</span>
        </div>
      )}
    </div>
  );
};

export default BillingTab;
