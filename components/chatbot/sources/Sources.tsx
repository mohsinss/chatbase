"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { IconFile, IconAlignLeft, IconGlobe, IconMessageQuestion, IconBrandNotion } from "@tabler/icons-react";

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
        return (
          <div className="bg-white rounded-lg p-8 border">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <IconFile className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Drag & drop files here, or click to select files</h3>
              <p className="text-gray-500 mb-4">Supported File Types: .pdf, .doc, .docx, .txt</p>
              <p className="text-gray-500">If you are uploading a PDF, make sure you can select/highlight the text.</p>
            </div>
          </div>
        );
      // Add other tab contents as needed
      default:
        return <div>Content for {currentTab}</div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Sources</h1>

      {/* Source Type Tabs */}
      <div className="flex space-x-4 mb-8">
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