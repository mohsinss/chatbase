"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconRefresh, IconFilter, IconDownload } from "@tabler/icons-react";

const SUB_TABS = [
  { id: "chat-logs", label: "Chat Logs", icon: "💬" },
  { id: "leads", label: "Leads", icon: "👥" },
];

const Activity = ({ 
  teamId, 
  chatbotId 
}: { 
  teamId: string;
  chatbotId: string;
}) => {
  const pathname = usePathname();
  const currentSubTab = pathname.split('/').pop();

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Title and sub-navigation */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Activity</h1>
        <div className="flex space-x-4">
          {SUB_TABS.map((tab) => (
            <Link
              key={tab.id}
              href={`/dashboard/${teamId}/chatbot/${chatbotId}/activity/${tab.id}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${currentSubTab === tab.id 
                  ? "bg-primary/10 text-primary" 
                  : "text-gray-600 hover:bg-gray-100"}`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Chat Logs Content */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chat Logs</h2>
          <div className="flex gap-2">
            <button className="btn btn-outline btn-sm gap-2">
              <IconRefresh className="w-4 h-4" />
              Refresh
            </button>
            <button className="btn btn-outline btn-sm gap-2">
              <IconFilter className="w-4 h-4" />
              Filter
            </button>
            <button className="btn btn-outline btn-sm gap-2">
              <IconDownload className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* No chats found message */}
        <div className="text-center py-12 text-gray-500">
          No chats found
        </div>
      </div>
    </div>
  );
};

export default Activity; 