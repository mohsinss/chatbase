"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";

interface SecuritySettingsProps {
  chatbotId: string;
}

export default function SecuritySettings({ chatbotId }: SecuritySettingsProps) {
  const [domainRestriction, setDomainRestriction] = React.useState(false);
  const [messageLimit, setMessageLimit] = React.useState("20");
  const [timeLimit, setTimeLimit] = React.useState("240");
  const [limitMessage, setLimitMessage] = React.useState("Too many messages in a row");
  const [visibility, setVisibility] = React.useState("public");
  const [allowedDomains, setAllowedDomains] = React.useState("");

  const handleSave = async () => {
    try {
      // Save security settings to backend
    } catch (error) {
      console.error("Failed to save security settings:", error);
    }
  };

  const handleReset = () => {
    setMessageLimit("20");
    setTimeLimit("240");
    setLimitMessage("Too many messages in a row");
  };

  return (
    <Card className="p-6 space-y-6 max-w-3xl mx-auto">
      <div className="space-y-6">
        {/* Visibility Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Visibility</label>
            <select 
              value={visibility} 
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="private">private</option>
              <option value="public">public</option>
            </select>
          </div>
          <div className="text-sm text-gray-500 space-y-2">
            <p>{'\'private\': No one can access your chatbot except you (your account)'}</p>
            <p>
              {'\'public\': Other people can chat with your chatbot if you send them the link. You can also embed it on your website so your website visitors are able to use it.'}
            </p>
          </div>
        </div>

        {/* Domain Restriction Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Only allow the iframe and widget on specific domains
            </label>
            <input
              type="checkbox"
              checked={domainRestriction}
              onChange={(e) => setDomainRestriction(e.target.checked)}
              className="h-4 w-4"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Allowed Domains</label>
            <textarea
              placeholder="example.com"
              className="w-full min-h-[100px] rounded-md border border-gray-300 px-3 py-2"
              disabled={!domainRestriction}
              value={allowedDomains}
              onChange={(e) => setAllowedDomains(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Enter each domain in a new line
              <br />
              Domains you want to embed your chatbot on. Your chatbot visibility has to be &apos;public&apos; for this to work.
            </p>
          </div>
        </div>

        {/* Rate Limiting Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Rate Limiting</label>
            <button 
              onClick={handleReset}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Reset
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-sm font-medium">Limit to</label>
            <input
              type="number"
              value={messageLimit}
              onChange={(e) => setMessageLimit(e.target.value)}
              className="w-20 rounded-md border border-gray-300 px-3 py-2"
            />
            <label className="whitespace-nowrap text-sm font-medium">messages every</label>
            <input
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              className="w-20 rounded-md border border-gray-300 px-3 py-2"
            />
            <label className="text-sm font-medium">seconds.</label>
          </div>

          <p className="text-sm text-gray-500">
            Limit the number of messages sent from one device on the iframe and chat bubble
            (this limit will not be applied to you on chatsa.co, only on your website for
            your users to prevent abuse).
          </p>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Message to show when limit is hit</label>
            <input
              type="text"
              value={limitMessage}
              onChange={(e) => setLimitMessage(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </Card>
  );
} 