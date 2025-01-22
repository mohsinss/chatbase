"use client";

import { useRouter, usePathname } from "next/navigation";
import ChatbotsTab from "@/components/tabs/chatbot/ChatbotsTab";
import UsageTab from "@/components/tabs/usage/UsageTab";
import SettingsTab from "@/components/tabs/settings/SettingsTab";
import Team from "@/models/Team";

interface TabComponentProps {
  teamId: string;
  team?: any;
}

const TABS = [
  {
    id: "chatbots",
    label: "Chatbots",
    href: (teamId: string) => `/dashboard/${teamId}/chatbots`,
    component: (props: TabComponentProps) => <ChatbotsTab {...props} />,
  },
  {
    id: "usage",
    label: "Usage",
    href: (teamId: string) => `/dashboard/${teamId}/usage`,
    component: (props: TabComponentProps) => <UsageTab {...props} />,
  },
  {
    id: "settings",
    label: "Settings",
    href: (teamId: string) => `/dashboard/${teamId}/settings/general`,
    component: (props: TabComponentProps) => <SettingsTab {...props} />,
  },
] as const;

const DashboardTabs = ({ teamId, team }: TabComponentProps) => {
  const router = useRouter();
  const pathname = usePathname();
  
  const pathParts = pathname.split('/');
  const currentTab = pathParts[3] || 'chatbots';

  const ActiveComponent = TABS.find(tab => tab.id === currentTab)?.component;

  return (
    <div className="w-full">
      <div className="flex justify-center border-b mb-4">
        <div className="flex space-x-1 md:space-x-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => router.push(tab.href(teamId))}
              className={`px-3 md:px-6 py-2 font-medium text-sm transition-colors duration-150 whitespace-nowrap
                ${currentTab === tab.id 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-base-content/60 hover:text-base-content"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 max-w-7xl mx-auto px-4">
        {ActiveComponent && (
          <ActiveComponent teamId={teamId} team={team}/>
        )}
      </div>
    </div>
  );
};

export default DashboardTabs; 