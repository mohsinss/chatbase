"use client";

import { useState } from "react";
import ChatbotsTab from "./chatbot/ChatbotsTab";
import UsageTab from "./usage/UsageTab";
import SettingsTab from "./settings/SettingsTab";

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

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState<string>(TABS[0].id);

  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component || TABS[0].component;

  return (
    <div className="w-full">
      {/* Tab Buttons */}
      <div className="flex border-b mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm transition-colors duration-150
              ${activeTab === tab.id 
                ? "text-primary border-b-2 border-primary" 
                : "text-base-content/60 hover:text-base-content"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default DashboardTabs; 