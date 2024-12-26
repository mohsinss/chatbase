"use client";

import { useRouter, useParams, usePathname } from "next/navigation";
import { IconSettings, IconBrain, IconMessages, IconShield, IconUsers, IconBell, IconWebhook, IconWorld, IconSparkles } from "@tabler/icons-react";
import GeneralSettings from "./GeneralSettings";
import AISettings from "./AISettings";
import ChatInterfaceSettings from "./ChatInterfaceSettings";
import SecuritySettings from "./SecuritySettings";

interface SettingsProps {
  teamId: string;
  chatbotId: string;
}

export default function Settings({ teamId, chatbotId }: SettingsProps) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  // Extract the current tab from the pathname
  const currentTab = pathname.split('/').pop() || "general";

  const tabs = [
    { id: "general", name: "General", icon: <IconSettings className="w-5 h-5" /> },
    { id: "ai", name: "AI", icon: <IconSparkles className="w-5 h-5" /> },
    { id: "chat-interface", name: "Chat Interface", icon: <IconMessages className="w-5 h-5" /> },
    { id: "security", name: "Security", icon: <IconShield className="w-5 h-5" /> },
    { id: "leads", name: "Leads", icon: <IconUsers className="w-5 h-5" /> },
    { id: "notifications", name: "Notifications", icon: <IconBell className="w-5 h-5" /> },
    { id: "webhooks", name: "Webhooks", icon: <IconWebhook className="w-5 h-5" /> },
    { id: "custom-domains", name: "Custom Domains", icon: <IconWorld className="w-5 h-5" /> },
  ];

  const handleTabClick = (tabId: string) => {
    router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/settings/${tabId}`);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {/* Mobile Tabs */}
      <div className="sm:hidden overflow-x-auto">
        <div className="flex space-x-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2 p-2 whitespace-nowrap rounded-lg hover:bg-gray-100 text-gray-700
                       ${currentTab === tab.id ? 'bg-violet-50 text-violet-600' : ''}`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar - hidden on mobile */}
        <div className="hidden sm:block w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700
                       ${currentTab === tab.id ? 'bg-violet-50 text-violet-600' : ''}`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 sm:ml-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold mb-6">{tabs.find(tab => tab.id === currentTab)?.name}</h2>
            
            {currentTab === "general" && <GeneralSettings chatbotId={chatbotId} />}
            {currentTab === "ai" && <AISettings chatbotId={chatbotId} />}
            {currentTab === "chat-interface" && <ChatInterfaceSettings chatbotId={chatbotId} />}

            {currentTab === "security" && <SecuritySettings chatbotId={chatbotId} />}
          </div>
        </div>
      </div>
    </div>
  );
} 