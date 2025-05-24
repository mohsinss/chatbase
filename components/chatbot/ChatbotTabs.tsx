"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Base interface for common properties
interface TabCommon {
  id: string;
  label: string;
  badge?: string;
}

// Type for tabs with subroutes
interface TabWithSubRoutes extends TabCommon {
  subRoutes: ReadonlyArray<{ id: string; label: string }>;
  defaultSubRoute?: string;
}

// Type for tabs with default subroute
interface TabWithDefaultSubRoute extends TabCommon {
  defaultSubRoute: string;
  subRoutes?: undefined;
}

// Type for simple tabs
interface SimpleTab extends TabCommon {
  subRoutes?: undefined;
  defaultSubRoute?: undefined;
}

// Union type for all possible tab types
type Tab = TabWithSubRoutes | TabWithDefaultSubRoute | SimpleTab;

const TABS: ReadonlyArray<Tab> = [
  { id: "playground", label: "Playground" },
  { 
    id: "activity", 
    label: "Activity",
    subRoutes: [
      { id: "chat-logs", label: "Chat Logs" },
      { id: "leads", label: "Leads" }
    ],
    defaultSubRoute: "chat-logs",
  },
  { 
    id: "reactions", 
    label: "Reactions",
    subRoutes: [
      { id: "reactions", label: "Reactions" },
      { id: "publisher", label: "Publisher" }
    ],
    defaultSubRoute: "reactions",
  },
  { 
    id: "analytics", 
    label: "Analytics",
    subRoutes: [
      { id: "chats", label: "Chats" },
      { id: "topics", label: "Topics" },
      { id: "sentiment", label: "Sentiment" }
    ],
    defaultSubRoute: "chats",
  },
  { id: "sources", label: "Knowledge Base" },
  { 
    id: "actions", 
    label: "Actions", 
    badge: "New",
    subRoutes: [
      { id: "main", label: "Actions" },
      { id: "integrations", label: "Integrations" }
    ],
    defaultSubRoute: "main",
  },
  // { id: "contacts", label: "Contacts", badge: "New" },
  // { id: "publisher", label: "Publisher", badge: "New", defaultSubRoute: "whatsapp" },
  { id: "connect", label: "Connect", defaultSubRoute: "embed" },
  { 
    id: "settings", 
    label: "Settings",
    defaultSubRoute: "general"
  },
] as const;

export type TabId = (typeof TABS)[number]["id"];

const ChatbotTabs = ({ 
  teamId, 
  chatbotId 
}: { 
  teamId: string;
  chatbotId: string;
}) => {
  const pathname = usePathname();
  const pathParts = pathname.split('/');
  const currentTab = pathParts[pathParts.length - 2] || 'playground';
  const currentSubRoute = pathParts[pathParts.length - 1];

  const getTabHref = (tab: Tab): string => {
    if (tab.id === 'playground') {
      return `/dashboard/${teamId}/chatbot/${chatbotId}`;
    }

    if ('defaultSubRoute' in tab && tab.defaultSubRoute) {
      return `/dashboard/${teamId}/chatbot/${chatbotId}/${tab.id}/${tab.defaultSubRoute}`;
    }
    
    if (tab.id === 'connect') {
      return `/dashboard/${teamId}/chatbot/${chatbotId}/${tab.id}/embed`;
    }
    
    return `/dashboard/${teamId}/chatbot/${chatbotId}/${tab.id}`;
  };

  return (
    <div className="border-b">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex justify-center space-x-1 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <Link
              key={tab.id}
              href={getTabHref(tab)}
              className={`px-4 py-2 relative flex items-center gap-2 text-sm font-medium transition-colors
                ${(currentTab === tab.id || (tab.id === 'playground' && pathParts.length === 5)) 
                  ? "text-purple-600 border-b-2 border-purple-800" 
                  : "text-gray-600 hover:text-gray-900"
                }`}
            >
              {tab.label}
              {tab.badge && (
                <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${
                  (currentTab === tab.id || (tab.id === 'playground' && pathParts.length === 5))
                    ? "bg-purple-100 text-purple-600"
                    : "bg-primary/10 text-primary"
                }`}>
                  {tab.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatbotTabs;