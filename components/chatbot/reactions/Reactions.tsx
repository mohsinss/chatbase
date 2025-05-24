"use client";

import { useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { IconSettings, IconMessageCircle, IconBrandWhatsapp, IconBrandFacebook, IconBrandInstagram, IconBrandTwitter, IconBrandLinkedin, IconBrandSlack, IconBrandWordpress, IconBrandSpotify, IconBrandSnapchat, IconBrandTiktok } from "@tabler/icons-react";
import WhatsAppReactions from "./WhatsAppReactions";
import FacebookReactions from "./FacebookReactions";
import InstagramReactions from "./InstagramReactions";
import TwitterReactions from "./TwitterReactions";
import LinkedInReactions from "./LinkedInReactions";
import SlackReactions from "./SlackReactions";
import WordPressReactions from "./WordPressReactions";
import ShopifyReactions from "./ShopifyReactions";
import SnapchatReactions from "./SnapchatReactions";
import TikTokReactions from "./TikTokReactions";
import Publisher from "../publisher/Publisher";

interface ReactionsProps {
  chatbot: {
    id: string;
    name: string;
    integrations: {
      [key: string]: boolean;
    };
  };
  teamId: string;
  chatbotId: string;
}

const MAIN_TABS = [
  { id: "reactions", label: "Reactions" },
  { id: "publisher", label: "Publisher" },
];

const SIDEBAR_ITEMS = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: IconBrandWhatsapp,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    hoverColor: "hover:bg-green-100"
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: IconBrandFacebook,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    hoverColor: "hover:bg-blue-100"
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: IconBrandInstagram,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    hoverColor: "hover:bg-pink-100"
  },
  {
    id: "twitter",
    label: "Twitter",
    icon: IconBrandTwitter,
    color: "text-sky-500",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
    hoverColor: "hover:bg-sky-100"
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: IconBrandLinkedin,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    hoverColor: "hover:bg-blue-100"
  },
  {
    id: "slack",
    label: "Slack",
    icon: IconBrandSlack,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    hoverColor: "hover:bg-purple-100"
  },
  {
    id: "wordpress",
    label: "WordPress",
    icon: IconBrandWordpress,
    color: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    hoverColor: "hover:bg-gray-100"
  },
  {
    id: "shopify",
    label: "Shopify",
    icon: IconBrandSpotify,
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    hoverColor: "hover:bg-green-100"
  },
  {
    id: "snapchat",
    label: "Snapchat",
    icon: IconBrandSnapchat,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    hoverColor: "hover:bg-yellow-100"
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: IconBrandTiktok,
    color: "text-gray-900",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    hoverColor: "hover:bg-gray-100"
  },
];

const Reactions = ({ chatbot, teamId, chatbotId }: ReactionsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { subTab } = params;
  
  // Determine current main tab and sub tab
  const currentMainTab = subTab === "publisher" ? "publisher" : "reactions";
  const [activeReactionTab, setActiveReactionTab] = useState(
    currentMainTab === "reactions" ? (subTab as string || "whatsapp") : "whatsapp"
  );

  const handleMainTabClick = (tabId: string) => {
    if (tabId === "publisher") {
      router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/reactions/publisher`);
    } else {
      router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/reactions/reactions`);
    }
  };

  const handleReactionTabClick = (tabId: string) => {
    setActiveReactionTab(tabId);
    // Don't change URL for reaction sub-tabs, just update state
  };

  const renderReactionsContent = () => {
    switch (activeReactionTab) {
      case "whatsapp":
        return <WhatsAppReactions chatbot={chatbot}/>;
      case "facebook":
        return <FacebookReactions chatbot={chatbot} />;
      case "instagram":
        return <InstagramReactions chatbot={chatbot} />;
      case "twitter":
        return <TwitterReactions />;
      case "linkedin":
        return <LinkedInReactions chatbot={chatbot} />;
      case "slack":
        return <SlackReactions chatbot={chatbot} />;
      case "wordpress":
        return <WordPressReactions chatbot={chatbot} />;
      case "shopify":
        return <ShopifyReactions chatbot={chatbot} />;
      case "snapchat":
        return <SnapchatReactions />;
      case "tiktok":
        return <TikTokReactions />;
      default:
        return <WhatsAppReactions chatbot={chatbot}/>;
    }
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-6xl p-4 md:p-6">
        {/* Main Tab Navigation */}
        <div className="mb-6">
          <div className="flex justify-center space-x-4">
            {MAIN_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleMainTabClick(tab.id)}
                className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 border
                  ${currentMainTab === tab.id
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {currentMainTab === "reactions" ? (
          <div className="md:flex md:space-x-8">
            {/* Reactions Sidebar */}
            <div className="mb-6 md:mb-0 md:w-48">
              <div className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-visible">
                {SIDEBAR_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeReactionTab === item.id;
                  const connected = chatbot?.integrations?.[item.id] || 
                                  (item.id === 'facebook' && chatbot?.integrations?.['messenger']);
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleReactionTabClick(item.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap w-full border
                        ${isActive
                          ? `${item.bgColor} ${item.color} ${item.borderColor} shadow-sm`
                          : `text-gray-600 border-gray-200 ${item.hoverColor} hover:border-gray-300`
                        }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-gray-400'}`} />
                      <span className="font-medium">{item.label}</span>
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

            {/* Reactions Content */}
            <div className="flex-1">
              {renderReactionsContent()}
            </div>
          </div>
        ) : (
          /* Publisher Content */
          <div className="flex-1">
            <Publisher 
              teamId={teamId} 
              chatbotId={chatbotId} 
              chatbot={chatbot}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Reactions; 