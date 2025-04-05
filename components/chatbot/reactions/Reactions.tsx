"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { IconSettings, IconMessageCircle, IconBrandWhatsapp, IconBrandFacebook, IconBrandInstagram, IconBrandTwitter, IconBrandLinkedin } from "@tabler/icons-react";
import WhatsAppReactions from "./WhatsAppReactions";
import FacebookReactions from "./FacebookReactions";
import InstagramReactions from "./InstagramReactions";
import TwitterReactions from "./TwitterReactions";
import LinkedInReactions from "./LinkedInReactions";

interface ReactionsProps {
  chatbot: {
    id: string;
    name: string;
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
];

const Reactions = ({ chatbot, teamId, chatbotId }: ReactionsProps) => {
  const params = useParams();
  const { subTab } = params;
  const [activeTab, setActiveTab] = useState(subTab || "whatsapp");

  const renderContent = () => {
    switch (activeTab) {
      case "whatsapp":
        return <WhatsAppReactions />;
      case "facebook":
        return <FacebookReactions />;
      case "instagram":
        return <InstagramReactions />;
      case "twitter":
        return <TwitterReactions />;
      case "linkedin":
        return <LinkedInReactions />;
      default:
        return <WhatsAppReactions />;
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900">Reactions</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your chatbot reactions</p>
        </div>
        <nav className="mt-4">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium ${
                  activeTab === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${item.color}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Reactions; 