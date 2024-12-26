"use client";

import { useRouter, useParams, usePathname } from "next/navigation";
import { IconSettings, IconBrain, IconMessages, IconShield, IconUsers, IconBell, IconWebhook, IconWorld, IconSparkles } from "@tabler/icons-react";

interface SettingsProps {
  teamId: string;
  chatbotId: string;
}

const Settings = ({ teamId, chatbotId }: SettingsProps) => {
  const router = useRouter();
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
            
            {currentTab === "general" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chatbot ID</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value="FRVvuMSAx1vKNDGk2OpJW"
                      readOnly
                      className="flex-1 p-2 border rounded-lg bg-gray-50"
                    />
                    <button className="p-2 border rounded-lg hover:bg-gray-50">
                      <IconSettings className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of characters</label>
                  <input
                    type="text"
                    value="4,295"
                    readOnly
                    className="w-full p-2 border rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value="Chatbot 12/26/2024, 12:11:01 AM"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Credit Limit</label>
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </div>
                </div>
              </div>
            )}

            {currentTab === "security" && (
              <div className="space-y-6">
                <h3>Security Settings</h3>
                {/* Add security settings content here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 