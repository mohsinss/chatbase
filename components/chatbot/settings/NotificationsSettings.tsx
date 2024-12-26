"use client";

import * as React from "react";

interface NotificationsSettingsProps {
  chatbotId: string;
}

export default function NotificationsSettings({ chatbotId }: NotificationsSettingsProps) {
  const [dailyLeads, setDailyLeads] = React.useState(false);
  const [dailyConversations, setDailyConversations] = React.useState(false);

  const handleSave = async () => {
    try {
      // Save notification settings to backend
    } catch (error) {
      console.error("Failed to save notification settings:", error);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="space-y-6">
        {/* Daily Leads Email */}
        <div className="flex items-center justify-between py-4 border-b">
          <label className="text-lg text-gray-700">
            Receive email with daily leads
          </label>
          <div className="relative inline-block w-12 h-6">
            <input
              type="checkbox"
              checked={dailyLeads}
              onChange={(e) => setDailyLeads(e.target.checked)}
              className="peer sr-only"
              id="daily-leads-toggle"
            />
            <label
              htmlFor="daily-leads-toggle"
              className={`absolute cursor-pointer rounded-full w-12 h-6 
                        ${dailyLeads ? 'bg-violet-600' : 'bg-gray-200'}
                        transition-colors duration-300 ease-in-out
                        before:content-[''] before:absolute before:w-4 before:h-4 
                        before:bg-white before:rounded-full before:top-1 before:left-1
                        before:transition-transform before:duration-300 before:ease-in-out
                        peer-checked:before:translate-x-6`}
            />
          </div>
        </div>

        {/* Daily Conversations Email */}
        <div className="flex items-center justify-between py-4 border-b">
          <label className="text-lg text-gray-700">
            Receive email with daily conversations
          </label>
          <div className="relative inline-block w-12 h-6">
            <input
              type="checkbox"
              checked={dailyConversations}
              onChange={(e) => setDailyConversations(e.target.checked)}
              className="peer sr-only"
              id="daily-conversations-toggle"
            />
            <label
              htmlFor="daily-conversations-toggle"
              className={`absolute cursor-pointer rounded-full w-12 h-6 
                        ${dailyConversations ? 'bg-violet-600' : 'bg-gray-200'}
                        transition-colors duration-300 ease-in-out
                        before:content-[''] before:absolute before:w-4 before:h-4 
                        before:bg-white before:rounded-full before:top-1 before:left-1
                        before:transition-transform before:duration-300 before:ease-in-out
                        peer-checked:before:translate-x-6`}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
} 