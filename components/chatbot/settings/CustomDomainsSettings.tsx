"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";

interface CustomDomainsSettingsProps {
  chatbotId: string;
}

export default function CustomDomainsSettings({ chatbotId }: CustomDomainsSettingsProps) {
  const [isPremium, setIsPremium] = React.useState(false); // This would come from user's plan info

  const handleUpgrade = () => {
    // Redirect to upgrade page or show upgrade modal
    window.location.href = "/pricing"; // Or your upgrade URL
  };

  return (
    <Card className="p-6 space-y-6 max-w-3xl mx-auto">
      <div className="space-y-6">
        {!isPremium ? (
          <div className="text-center space-y-6 py-8">
            <h3 className="text-xl text-gray-900">
              Custom domains are not available for your plan.
            </h3>
            <p className="text-gray-600 max-w-xl mx-auto">
              Upgrade to be able to use your own custom domains for the embed script,
              iframe, and chatbot link.
            </p>
            <button
              onClick={handleUpgrade}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Upgrade now
            </button>
          </div>
        ) : (
          // Premium plan UI would go here
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium">Custom Domain</label>
              <input
                type="text"
                placeholder="chat.yourdomain.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
              <p className="text-sm text-gray-500">
                Enter your custom domain to use for the chatbot interface.
              </p>
            </div>

            <div className="flex justify-end">
              <button 
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 