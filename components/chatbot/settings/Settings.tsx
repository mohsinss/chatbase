"use client";

import { useRouter, useParams, usePathname } from "next/navigation";
import { IconSettings, IconSparkles, IconMessages, IconShield, IconZeppelin, IconUsers, IconBell, IconWebhook, IconWorld } from "@tabler/icons-react";
import GeneralSettings from "./GeneralSettings";
import AISettings from "./AISettings";
import ChatInterfaceSettings from "./ChatInterfaceSettings";
import SecuritySettings from "./SecuritySettings";
import LeadsSettings from "./LeadsSettings";
import NotificationsSettings from "./NotificationsSettings";
import WebhooksSettings from "./WebhooksSettings";
import CustomDomainsSettings from "./CustomDomainsSettings";
import ZapierSettings from "./ZpierSettings";
import toast from "react-hot-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface SettingsProps {
  teamId: string;
  chatbotId: string;
  team: TeamData;
}

interface TeamData {
  plan: string;
}

export default function Settings({ team, teamId, chatbotId }: SettingsProps) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

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
    { id: "zapier", name: "Zapier", icon: <IconZeppelin className="w-5 h-5" /> },
  ];

  const handleTabClick = (tabId: string) => {
    router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/settings/${tabId}`);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <Menu className="h-4 w-4 mr-2" />
          {isSidebarCollapsed ? 'Expand' : 'Collapse'}
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-50
          bg-white rounded-lg border p-2
          transform transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'w-12 lg:w-64' : 'w-64'}
          top-20 lg:top-0
        `}>
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center ${isSidebarCollapsed ? 'justify-center lg:justify-start' : 'justify-start'} gap-2 w-full px-2 lg:px-4 py-2 text-sm font-medium rounded-lg transition-colors
                  ${currentTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
                title={isSidebarCollapsed ? tab.name : undefined}
              >
                {tab.icon}
                <span className={`${isSidebarCollapsed ? 'hidden lg:inline' : 'inline'}`}>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 lg:ml-0">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-2xl font-semibold mb-6">{tabs.find(tab => tab.id === currentTab)?.name}</h2>

            {currentTab === "general" && <GeneralSettings chatbotId={chatbotId} teamId={teamId} />}
            {currentTab === "ai" && <AISettings team={team} chatbotId={chatbotId} />}
            {currentTab === "chat-interface" && <ChatInterfaceSettings chatbotId={chatbotId} />}
            {currentTab === "security" && <SecuritySettings chatbotId={chatbotId} />}
            {currentTab === "leads" && <LeadsSettings chatbotId={chatbotId} />}
            {currentTab === "notifications" && <NotificationsSettings chatbotId={chatbotId} />}
            {currentTab === "webhooks" && <WebhooksSettings chatbotId={chatbotId} />}
            {currentTab === "custom-domains" && <CustomDomainsSettings chatbotId={chatbotId} />}
            {currentTab === "zapier" && <ZapierSettings chatbotId={chatbotId} />}
          </div>
        </div>
      </div>
    </div>
  );
} 