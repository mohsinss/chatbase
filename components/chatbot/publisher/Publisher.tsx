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
  { id: "whatsapp", label: "WhatsApp", icon: <IconBrandWhatsapp className="w-5 h-5 text-green-500" /> },
  { id: "messenger", label: "Facebook", icon: <IconBrandFacebook className="w-5 h-5 text-blue-500" /> },
  { id: "twitter", label: "Twitter", icon: <IconBrandTwitter className="w-5 h-5 text-blue-400" /> },
  { id: "instagram", label: "Instagram", icon: <IconBrandInstagram className="w-5 h-5 text-pink-500" /> },
  { id: "snapchat", label: "Snapchat", icon: <IconBrandSnapchat className="w-5 h-5 text-yellow-500" /> },
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
  const currentTab = pathname.split('/').pop() || 'whatsapp';

  const [posts, setPosts] = useState<Post[]>([]);

  const handleTabChange = (tabId: string) => {
    if (!chatbot?.integrations?.[tabId]) {
      alert(`The ${tabId.charAt(0).toUpperCase() + tabId.slice(1)} is not connected to this bot.`);
      return;
    }
    router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/publisher/${tabId}`);
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

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-6xl p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-4">Publisher</h1>

        <div className="md:flex md:space-x-8">
          <div className="mb-6 md:mb-0 md:w-48">
            <div className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-visible">
              {PUBLISHER_TABS.map((tab) => {
                const connected = chatbot?.integrations?.[tab.id];
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    disabled={!connected}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap w-full
                      ${currentTab === tab.id
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:bg-gray-100"}
                      ${!connected ? "opacity-50 cursor-not-allowed" : ""}`}
                    title={!connected ? `${tab.label} is not connected` : undefined}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {/* {connected && (
                      <span className="ml-auto text-xs font-semibold text-green-600 bg-green-100 rounded px-1.5 py-0.5">
                        Connected
                      </span>
                    )}
                    {!connected && (
                      <span className="ml-auto text-xs font-semibold text-gray-500 bg-gray-200 rounded px-1.5 py-0.5">
                        Not Connected
                      </span>
                    )} */}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1">
            {currentTab === "messenger" && <FacebookPublisher chatbotId={chatbotId} />}
            {/* TODO: Add other platform-specific publisher components here */}
            {currentTab !== "messenger" && (
              <div className="p-4 text-center text-gray-500">
                Publisher UI for {currentTab} is not implemented yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Publisher;
