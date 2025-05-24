"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  IconBrandWhatsapp,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandSnapchat,
  IconChevronDown,
  IconChevronUp,
  IconSend,
  IconCalendar,
  IconDeviceFloppy,
  IconList,
  IconLayoutGrid,
  IconCalendarEvent,
  IconTemplate,
  IconPaperclip
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import FacebookPublisher from "./FacebookPublisher";
import { Post } from "./types";
import { PostSection } from "./PostSection";

const PUBLISHER_TABS = [
  { 
    id: "whatsapp", 
    label: "WhatsApp", 
    icon: <IconBrandWhatsapp className="w-5 h-5" />,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    hoverColor: "hover:bg-green-100"
  },
  { 
    id: "messenger", 
    label: "Facebook", 
    icon: <IconBrandFacebook className="w-5 h-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    hoverColor: "hover:bg-blue-100"
  },
  { 
    id: "twitter", 
    label: "Twitter", 
    icon: <IconBrandTwitter className="w-5 h-5" />,
    color: "text-sky-500",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
    hoverColor: "hover:bg-sky-100"
  },
  { 
    id: "instagram", 
    label: "Instagram", 
    icon: <IconBrandInstagram className="w-5 h-5" />,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    hoverColor: "hover:bg-pink-100"
  },
  { 
    id: "snapchat", 
    label: "Snapchat", 
    icon: <IconBrandSnapchat className="w-5 h-5" />,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    hoverColor: "hover:bg-yellow-100"
  },
];

const VIEW_OPTIONS = [
  { id: "list", label: "List", icon: <IconList className="w-5 h-5" /> },
  { id: "calendar", label: "Calendar", icon: <IconCalendarEvent className="w-5 h-5" /> },
  { id: "grid", label: "Grid", icon: <IconLayoutGrid className="w-5 h-5" /> },
];

// Mock data for posts
// const MOCK_POSTS: Post[] = [
//   { id: '1', title: 'Welcome message', content: 'Welcome to our service!', status: 'published', date: '2023-10-15' },
//   { id: '2', title: 'Holiday promotion', content: 'Special holiday offers!', status: 'scheduled', date: '2023-12-01' },
//   { id: '3', title: 'Product update', content: 'New features coming soon', status: 'draft', date: '2023-11-20' },
//   { id: '4', title: 'Customer survey', content: 'Help us improve our service', status: 'scheduled', date: '2023-11-10' },
//   { id: '5', title: 'Black Friday sale', content: 'Biggest discounts of the year!', status: 'draft', date: '2023-11-24' },
// ];


interface PublisherProps {
  teamId: string;
  chatbotId: string;
  domain?: string;
  chatbot?: any;
}

const Publisher = ({
  teamId,
  chatbotId,
  domain,
  chatbot
}: PublisherProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentTab, setCurrentTab] = useState('whatsapp');
  const [posts, setPosts] = useState<Post[]>([]);

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/chatbot/publisher/posts?chatbotId=${chatbotId}&platform=${currentTab}`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      }
    };

    fetchPosts();
  }, [chatbotId, currentTab]);

  const isConnected = chatbot?.integrations?.[currentTab] || 
                    (currentTab === 'messenger' && chatbot?.integrations?.['facebook']);
  const currentTabData = PUBLISHER_TABS.find(tab => tab.id === currentTab);

  // Debug: Let's check what's happening with the connection status
  console.log('Current tab:', currentTab);
  console.log('Chatbot integrations:', chatbot?.integrations);
  console.log('Is connected:', isConnected);

  const renderNotConnectedMessage = () => {
    if (!currentTabData) return null;
    
    return (
      <div className={`p-8 text-center ${currentTabData.bgColor} ${currentTabData.borderColor} border rounded-lg`}>
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${currentTabData.color} ${currentTabData.bgColor}`}>
            {currentTabData.icon}
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${currentTabData.color} mb-2`}>
              {currentTabData.label} Not Connected
            </h3>
            <p className="text-gray-600 mb-4">
              Connect your {currentTabData.label} account to start publishing content.
            </p>
            <button className={`px-4 py-2 ${currentTabData.color} ${currentTabData.borderColor} border rounded-lg ${currentTabData.hoverColor} transition-colors`}>
              Connect {currentTabData.label}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-6xl p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Publisher</h1>

        <div className="md:flex md:space-x-8">
          <div className="mb-6 md:mb-0 md:w-48">
            <div className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-visible">
              {PUBLISHER_TABS.map((tab) => {
                const connected = chatbot?.integrations?.[tab.id] || 
                                (tab.id === 'messenger' && chatbot?.integrations?.['facebook']);
                const isActive = currentTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap w-full border
                      ${isActive
                        ? `${tab.bgColor} ${tab.color} ${tab.borderColor} shadow-sm`
                        : `text-gray-600 border-gray-200 ${tab.hoverColor} hover:border-gray-300`
                      }`}
                  >
                    <span className={isActive ? tab.color : 'text-gray-400'}>
                      {tab.icon}
                    </span>
                    <span className="font-medium">{tab.label}</span>
                    {connected ? (
                      <span className="ml-auto text-xs font-semibold text-green-600 bg-green-100 rounded-full px-2 py-1">
                        ●
                      </span>
                    ) : (
                      <span className="ml-auto text-xs font-semibold text-gray-400 bg-gray-100 rounded-full px-2 py-1">
                        ○
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1">
            {currentTab === "messenger" && (
              <div className={`${currentTabData?.bgColor} ${currentTabData?.borderColor} border rounded-lg p-6`}>
                {!isConnected && (
                  <div className={`mb-6 p-4 text-center bg-white ${currentTabData?.borderColor} border rounded-lg`}>
                    <div className="flex items-center justify-center space-x-3">
                      <div className={`${currentTabData?.color}`}>
                        {currentTabData?.icon}
                      </div>
                      <div>
                        <span className={`font-semibold ${currentTabData?.color}`}>
                          {currentTabData?.label} Not Connected
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          Connect your {currentTabData?.label} account to start publishing content.
                        </p>
                      </div>
                      <button className={`px-4 py-2 ${currentTabData?.color} ${currentTabData?.borderColor} border rounded-lg ${currentTabData?.hoverColor} transition-colors`}>
                        Connect {currentTabData?.label}
                      </button>
                    </div>
                  </div>
                )}
                <FacebookPublisher chatbotId={chatbotId} />
              </div>
            )}
            {currentTab !== "messenger" && (
              <>
                {isConnected ? (
                  <div className="p-8 text-center text-gray-500 border border-gray-200 rounded-lg">
                    <div className="flex flex-col items-center space-y-4">
                      <div className={`p-4 rounded-full ${currentTabData?.color} ${currentTabData?.bgColor}`}>
                        {currentTabData?.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          {currentTabData?.label} Publisher
                        </h3>
                        <p className="text-gray-500">
                          Publisher UI for {currentTab} is coming soon.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  renderNotConnectedMessage()
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Publisher;
