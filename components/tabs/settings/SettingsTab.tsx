"use client";

import { useParams } from "next/navigation";
import { SettingsMenu } from "./SettingsMenu";
import GeneralSettings from "./GeneralSettings";
import { MembersSettings } from "./MembersSettings";
import { PlansSettings } from "./PlansSettings";
import { BillingSettings } from "./BillingSettings";
import { ApiKeysSettings } from "./ApiKeysSettings";
import { OpenAISettings } from "./OpenAISettings";

interface SettingsTabProps {
  teamId: string;
  team?: any;
}

const SettingsTab = ({ teamId, team }: SettingsTabProps) => {
  const params = useParams();
  const currentSubTab = params.subtab as string || "general";

  const getSettingsComponent = () => {
    switch (currentSubTab) {
      case "general":
        return <GeneralSettings teamId={teamId} />;
      case "members":
        return <MembersSettings teamId={teamId} team={team}/>;
      case "plans":
        return <PlansSettings teamId={teamId} />;
      case "billing":
        return <BillingSettings teamId={teamId} team={team}/>;
      case "api-keys":
        return <ApiKeysSettings teamId={teamId} />;
      case "openai-key":
        return <OpenAISettings teamId={teamId} />;
      default:
        return <GeneralSettings teamId={teamId} />;
    }
  };

  return (
    <div className="flex gap-8">
      <SettingsMenu />
      <div className="flex-1 mb-4">
        {getSettingsComponent()}
      </div>
    </div>
  );
};

export default SettingsTab; 