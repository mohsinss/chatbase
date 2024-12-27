"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { IconFile, IconAlignLeft, IconGlobe, IconMessageQuestion, IconBrandNotion } from "@tabler/icons-react";
import { FileUpload } from "./FileUpload";

const SOURCE_TABS = [
  { id: "files", label: "Files", icon: <IconFile className="w-5 h-5" /> },
  { id: "text", label: "Text", icon: <IconAlignLeft className="w-5 h-5" /> },
  { id: "website", label: "Website", icon: <IconGlobe className="w-5 h-5" /> },
  { id: "qa", label: "Q&A", icon: <IconMessageQuestion className="w-5 h-5" /> },
  { id: "notion", label: "Notion", icon: <IconBrandNotion className="w-5 h-5" /> },
];

const Sources = ({ 
  teamId, 
  chatbotId 
}: { 
  teamId: string;
  chatbotId: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'files';

  const handleTabChange = (tabId: string) => {
    router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/sources?tab=${tabId}`);
  };

  const renderContent = () => {
    switch (currentTab) {
      case "files":
        return <FileUpload teamId={teamId} chatbotId={chatbotId} />;
      // Add other tab contents as needed
      default:
        return <div>Content for {currentTab}</div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Sources</h1>

      {/* Source Type Tabs */}
      <div className="flex justify-center space-x-4 mb-8">
        {SOURCE_TABS.map((tab) => (
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
      {renderContent()}
    </div>
  );
};

export default Sources; 