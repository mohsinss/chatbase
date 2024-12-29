import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import DashboardNav from "@/components/DashboardNav";
import DashboardTabs from "@/components/DashboardTabs";

interface PageProps {
  params: {
    teamId: string;
    subtab: string;
  };
}

export default async function SettingsPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  return (
    <>
      <DashboardNav teamId={params.teamId} />
      <DashboardTabs teamId={params.teamId} />
    </>
  );
} 