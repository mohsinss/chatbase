"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { IconSettings, IconSparkles, IconMessageCircle, IconShield, IconUsers, IconBell, IconWebhook, IconGlobe, IconClipboard } from "@tabler/icons-react";

const SETTINGS_TABS = [
  { id: "general", label: "General", icon: <IconSettings className="w-5 h-5" /> },
  { id: "ai", label: "AI", icon: <IconSparkles className="w-5 h-5" /> },
  { id: "chat-interface", label: "Chat Interface", icon: <IconMessageCircle className="w-5 h-5" /> },
  { id: "security", label: "Security", icon: <IconShield className="w-5 h-5" /> },
  { id: "leads", label: "Leads", icon: <IconUsers className="w-5 h-5" /> },
  { id: "notifications", label: "Notifications", icon: <IconBell className="w-5 h-5" /> },
  { id: "webhooks", label: "Webhooks", icon: <IconWebhook className="w-5 h-5" /> },
  { id: "custom-domain", label: "Custom Domain", icon: <IconGlobe className="w-5 h-5" /> },
];

const Settings = ({ 
  teamId, 
  chatbotId 
}: { 
  teamId: string;
  chatbotId: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentTab = pathname.split('/').pop() || 'general';
  const [chatbotName, setChatbotName] = useState("Chatbot 12/26/2024, 12:11:01 AM");
  const [creditLimitEnabled, setCreditLimitEnabled] = useState(false);

  const handleTabChange = (tabId: string) => {
    router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/settings/${tabId}`);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(chatbotId);
  };

  const renderGeneralContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">Chatbot ID</h3>
        <div className="flex items-center gap-2">
          <span className="text-lg">{chatbotId}</span>
          <button 
            onClick={handleCopyId}
            className="p-2 hover:bg-base-200 rounded-md"
          >
            <IconClipboard className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Number of characters</h3>
        <span className="text-lg">4,295</span>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Name</h3>
        <input
          type="text"
          value={chatbotName}
          onChange={(e) => setChatbotName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Credit Limit</h3>
            <p className="text-gray-500">Set a credit limit for this chatbot</p>
          </div>
          <div className="form-control">
            <input 
              type="checkbox" 
              className="toggle toggle-primary"
              checked={creditLimitEnabled}
              onChange={(e) => setCreditLimitEnabled(e.target.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      {/* Settings Type Tabs */}
      <div className="flex space-x-4 mb-8 overflow-x-auto pb-4">
        {SETTINGS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors whitespace-nowrap
              ${currentTab === tab.id 
                ? "bg-primary/10 text-primary" 
                : "text-gray-600 hover:bg-gray-100"}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg p-8 border">
        {currentTab === 'general' && renderGeneralContent()}
        {/* Add other tab contents as needed */}
      </div>
    </div>
  );
};

export default Settings; 