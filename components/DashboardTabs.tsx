"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import ChatbotsTab from "@/components/tabs/chatbot/ChatbotsTab";
import UsageTab from "@/components/tabs/usage/UsageTab";
import SettingsTab from "@/components/tabs/settings/SettingsTab";

const TABS = [
  {
    id: "chatbots",
    label: "Chatbots",
    component: ChatbotsTab,
  },
  {
    id: "usage",
    label: "Usage",
    component: UsageTab,
  },
  {
    id: "settings",
    label: "Settings",
    component: SettingsTab,
  },
] as const;

const DashboardTabs = ({ teamId }: { teamId: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract the current tab from the URL or default to 'chatbots'
  const currentTab = pathname.split('/').pop() || 'chatbots';
  const [activeTab, setActiveTab] = useState<string>(currentTab);

  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/dashboard/${teamId}/${tabId}`);
  };

  // Sync with URL changes
  useEffect(() => {
    const tab = pathname.split('/').pop();
    if (tab && TABS.some(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [pathname]);

  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component || TABS[0].component;

  return (
    <div className="w-full">
      {/* Centered Tab Buttons */}
      <div className="flex justify-center border-b mb-4">
        <div className="flex space-x-1 md:space-x-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-3 md:px-6 py-2 font-medium text-sm transition-colors duration-150 whitespace-nowrap
                ${activeTab === tab.id 
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
      <div className="mt-8 max-w-4xl mx-auto px-4">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default DashboardTabs; 