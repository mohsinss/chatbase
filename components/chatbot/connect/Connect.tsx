"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { IconCode, IconShare, IconPuzzle } from "@tabler/icons-react";
import EmbedSection from './EmbedSection';
import ShareSection from './ShareSection';
import IntegrationsSection from './IntegrationsSection';
import WhatsappManagement from "./management/WhatsappManagement";
import MessengerManagement from "./management/MessengerManagement";
import InstagramManagement from "./management/InstagramManagement";
import XManagement from "./management/XManagement";

const CONNECT_TABS = [
  { id: "embed", label: "Embed", icon: <IconCode className="w-5 h-5" /> },
  { id: "share", label: "Share", icon: <IconShare className="w-5 h-5" /> },
  { id: "integrations", label: "Integrations", icon: <IconPuzzle className="w-5 h-5" /> },
];

interface ChatbotData {
  integrations: Object
}

const Connect = ({
  teamId,
  chatbotId,
  domain,
  chatbot
}: {
  teamId: string;
  chatbotId: string;
  domain: string;
  chatbot: ChatbotData
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentTab = pathname.split('/').pop() || 'embed';
  console.log(pathname, "pathname")

  const handleTabChange = (tabId: string) => {
    router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/connect/${tabId}`);
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-6xl p-8">
        <h1 className="text-2xl font-bold mb-8">Connect</h1>

        {/* Responsive Nav */}
        <div className="md:flex md:space-x-8">
          {/* Nav Menu - Side on desktop, Top on mobile */}
          <div className="mb-8 md:mb-0 md:w-48">
            <div className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-visible">
              {CONNECT_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap w-full
                    ${currentTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-100"}`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {currentTab === 'embed' && <EmbedSection chatbotId={chatbotId} domain={domain} />}
            {currentTab === 'share' && <ShareSection chatbotId={chatbotId} domain={domain} />}
            {currentTab === 'integrations' && <IntegrationsSection teamId={teamId} chatbot={chatbot} chatbotId={chatbotId} />}
            {currentTab === 'whatsapp' && <WhatsappManagement chatbotId={chatbotId} domain={domain} teamId={teamId} />}
            {currentTab === 'messenger' && <MessengerManagement chatbotId={chatbotId} domain={domain} teamId={teamId} />}
            {currentTab === 'instagram' && <InstagramManagement chatbotId={chatbotId} domain={domain} teamId={teamId} />}
            {currentTab === 'x' && <XManagement chatbotId={chatbotId} domain={domain} teamId={teamId} />}
          </div>
        </div>
      </div>
      {/* <FacebookSDK/> */}
    </div>
  );
};

export default Connect; 