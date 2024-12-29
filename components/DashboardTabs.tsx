"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import ChatbotsTab from "@/components/tabs/chatbot/ChatbotsTab";
import UsageTab from "@/components/tabs/usage/UsageTab";
import SettingsTab from "@/components/tabs/settings/SettingsTab";
// import { SettingsMenu } from "@/components/tabs/settings/SettingsMenu";

const TABS = [
  {
    id: "chatbots",
    label: "Chatbots",
    href: (teamId: string) => `/dashboard/${teamId}/chatbots`,
    component: ChatbotsTab,
  },
  {
    id: "usage",
    label: "Usage",
    href: (teamId: string) => `/dashboard/${teamId}/usage`,
    component: UsageTab,
  },
  {
    id: "settings",
    label: "Settings",
    href: (teamId: string) => `/dashboard/${teamId}/settings/general`,
    component: SettingsTab,
  },
] as const;

const DashboardTabs = ({ teamId }: { teamId: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract the current tab from the URL
  const pathParts = pathname.split('/');
  const currentTab = pathParts[3] || 'chatbots'; // [0]/dashboard/[1]teamId/[2]tab/[3]subtab

  return (
    <div className="w-full">
      {/* Centered Tab Buttons */}
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

      {/* Tab Content */}
      <div className="mt-8 max-w-7xl mx-auto px-4">
        {currentTab === "settings" ? (
          <div className="flex gap-8">
            {/* <SettingsMenu /> */}
            <div className="flex-1">
              <SettingsTab teamId={teamId} />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {currentTab === "chatbots" && <ChatbotsTab teamId={teamId} />}
            {currentTab === "usage" && <UsageTab teamId={teamId} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTabs; 