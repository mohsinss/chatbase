"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconMessageCircle, IconTags, IconMoodSmile } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const SUB_TABS = [
  { id: "chats", label: "Chats", icon: <IconMessageCircle className="w-4 h-4" /> },
  { id: "topics", label: "Topics", icon: <IconTags className="w-4 h-4" /> },
  { id: "sentiment", label: "Sentiment", icon: <IconMoodSmile className="w-4 h-4" /> },
];

const Analytics = ({
  teamId,
  chatbotId
}: {
  teamId: string;
  chatbotId: string;
}) => {
  const pathname = usePathname();
  const currentSubTab = pathname.split('/').pop();
  // State to store analytics data
  const [analyticsData, setAnalyticsData] = useState({
    totalChats: 0,
    totalMessages: 0,
    // Add more fields if needed
  });

  useEffect(() => {
    // Fetch analytics data
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch(`/api/chatbot/analytics/${chatbotId}`);
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Failed to fetch analytics data", error);
      }
    };

    fetchAnalyticsData();
  }, [chatbotId]);

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Title and sub-navigation */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Analytics</h1>
        <div className="flex space-x-4">
          {SUB_TABS.map((tab) => (
            <Link
              key={tab.id}
              href={`/dashboard/${teamId}/chatbot/${chatbotId}/analytics/${tab.id}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${currentSubTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-100"}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Analytics Content */}
      <div className="space-y-8">
        {/* Date Range Picker */}
        <div className="flex justify-end">
          <button className="btn btn-outline">
            2024-12-19 ~ 2024-12-25
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center gap-2 text-primary mb-4">
                <IconMessageCircle className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold">{analyticsData.totalChats}</div>
              <div className="text-sm text-gray-600">Total chats</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center gap-2 text-primary mb-4">
                <IconMessageCircle className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold">{analyticsData.totalMessages}</div>
              <div className="text-sm text-gray-600">Total messages</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center gap-2 text-primary mb-4">
                <IconMessageCircle className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold">0</div>
              <div className="text-sm text-gray-600">Messages with thumbs up</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center gap-2 text-primary mb-4">
                <IconMessageCircle className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold">0</div>
              <div className="text-sm text-gray-600">Messages with thumbs down</div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="text-xl font-bold mb-4">Chats</h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>Analytics data for today might be delayed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 