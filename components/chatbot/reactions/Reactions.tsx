"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

const SIDEBAR_ITEMS = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: IconBrandWhatsapp,
    color: "text-green-500",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: IconBrandFacebook,
    color: "text-blue-500",
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: IconBrandInstagram,
    color: "text-pink-500",
  },
  {
    id: "twitter",
    label: "Twitter",
    icon: IconBrandTwitter,
    color: "text-blue-400",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: IconBrandLinkedin,
    color: "text-blue-600",
  },
  {
    id: "slack",
    label: "Slack",
    icon: IconBrandSlack,
    color: "text-purple-500",
  },
  {
    id: "wordpress",
    label: "WordPress",
    icon: IconBrandWordpress,
    color: "text-gray-600",
  },
  {
    id: "shopify",
    label: "Shopify",
    icon: IconBrandSpotify,
    color: "text-green-600",
  },
  {
    id: "snapchat",
    label: "Snapchat",
    icon: IconBrandSnapchat,
    color: "text-yellow-500",
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: IconBrandTiktok,
    color: "text-black",
  },
];

const Reactions = ({ chatbot, teamId, chatbotId }: ReactionsProps) => {
  const router = useRouter();
  const params = useParams();
  const { subTab } = params;
  const [activeTab, setActiveTab] = useState(subTab || "whatsapp");

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/reactions/${tabId}`);
  };

  const renderContent = () => {
    switch (activeTab) {
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
    <div className="flex h-screen flex-row">
      {/* Sidebar - Fixed */}
      <div className="w-[70px] md:w-48 bg-white border-r border-gray-200 transition-all duration-200">
        <div className="p-3 hidden md:block">
          <h2 className="text-base font-semibold text-gray-900">Reactions</h2>
          <p className="text-xs text-gray-500 mt-1">Manage your chatbot reactions</p>
        </div>
        <nav className="overflow-y-auto scrollbar-thin">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-center md:justify-start px-2 md:px-3 py-4 text-sm font-medium ${
                  activeTab === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className={`w-7 h-7 md:w-5 md:h-5 ${item.color} ${activeTab === item.id ? 'md:mr-2' : ''} drop-shadow-md hover:drop-shadow-lg transition-all`} />
                <span className="hidden md:inline text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content - With offset for fixed sidebar */}
      <div className="flex-1 overflow-hidden h-screen p-0 flex flex-col">
        {renderContent()}
      </div>
    </div>
  );
};

export default Reactions; 