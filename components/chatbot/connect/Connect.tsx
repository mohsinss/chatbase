"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { IconCode, IconShare, IconPuzzle } from "@tabler/icons-react";

const CONNECT_TABS = [
  { id: "embed", label: "Embed", icon: <IconCode className="w-5 h-5" /> },
  { id: "share", label: "Share", icon: <IconShare className="w-5 h-5" /> },
  { id: "integrations", label: "Integrations", icon: <IconPuzzle className="w-5 h-5" /> },
];

const Connect = ({ 
  teamId, 
  chatbotId 
}: { 
  teamId: string;
  chatbotId: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentTab = pathname.split('/').pop() || 'embed';

  const handleTabChange = (tabId: string) => {
    router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/connect/${tabId}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Connect</h1>

      {/* Connect Type Tabs */}
      <div className="flex space-x-4 mb-8">
        {CONNECT_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors
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
      <div className="space-y-6">
        {currentTab === 'embed' && (
          <div>
            <p className="text-lg mb-8">Chatbot is private, to share the chatbot change the visibility to public.</p>
            <button className="btn btn-primary">Make Public</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connect; 