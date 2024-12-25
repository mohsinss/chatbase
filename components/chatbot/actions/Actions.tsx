"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { IconPuzzle, IconBolt } from "@tabler/icons-react";

const ACTION_TABS = [
  { id: "actions", label: "Actions", icon: <IconBolt className="w-5 h-5" /> },
  { id: "integrations", label: "Integrations", icon: <IconPuzzle className="w-5 h-5" /> },
];

const Actions = ({ 
  teamId, 
  chatbotId 
}: { 
  teamId: string;
  chatbotId: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentTab = pathname.split('/').pop() || 'actions';

  const handleTabChange = (tabId: string) => {
    router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/actions${tabId === 'actions' ? '' : `/${tabId}`}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Actions</h1>
        <button className="btn btn-primary">Create custom action</button>
      </div>

      {/* Action Type Tabs */}
      <div className="flex space-x-4 mb-8">
        {ACTION_TABS.map((tab) => (
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

      {/* Search Bar */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search actions..."
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Form Action Card */}
        <div className="border rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-pink-100 rounded-lg">
              <IconBolt className="w-6 h-6 text-pink-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Form</h3>
              <p className="text-gray-600 mb-4">Collect leads from your website</p>
              <button className="btn btn-outline btn-sm">Create Action</button>
            </div>
          </div>
        </div>

        {/* Button Action Card */}
        <div className="border rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <IconPuzzle className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Button</h3>
              <p className="text-gray-600 mb-4">Custom button to trigger your own links</p>
              <button className="btn btn-outline btn-sm">Create Action</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Actions; 