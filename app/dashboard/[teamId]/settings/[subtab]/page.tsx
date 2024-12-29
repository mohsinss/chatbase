import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import DashboardNav from "@/components/DashboardNav";
import SideNav from "@/components/tabs/SideNav";
import { SettingsMenu } from "@/components/tabs/settings/SettingsMenu";
import GeneralSettings from "@/components/tabs/settings/GeneralSettings";
import { ApiKeysSettings } from "@/components/tabs/settings/ApiKeysSettings";
import { BillingSettings } from "@/components/tabs/settings/BillingSettings";
import { MembersSettings } from "@/components/tabs/settings/MembersSettings";
import { OpenAISettings } from "@/components/tabs/settings/OpenAISettings";
import { PlansSettings } from "@/components/tabs/settings/PlansSettings";

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

  const getSettingsComponent = (subtab: string) => {
    switch (subtab) {
      case "general":
        return <GeneralSettings />;
      case "members":
        return <MembersSettings teamId={params.teamId} />;
      case "plans":
        return <PlansSettings teamId={params.teamId} />;
      case "billing":
        return <BillingSettings teamId={params.teamId} />;
      case "api-keys":
        return <ApiKeysSettings teamId={params.teamId} />;
      case "openai-key":
        return <OpenAISettings teamId={params.teamId} />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <>
      <DashboardNav teamId={params.teamId} />
      <SideNav teamId={params.teamId} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <SettingsMenu />
          <div className="flex-1">
            {getSettingsComponent(params.subtab)}
          </div>
        </div>
      </div>
    </>
  );
} 