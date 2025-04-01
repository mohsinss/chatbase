"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CustomNotification } from './GeneralSettings'
import { Card } from "@/components/ui/card";

interface NotificationsSettingsProps {
  chatbotId: string;
}

export default function NotificationsSettings({ chatbotId }: NotificationsSettingsProps) {
  const [dailyLeads, setDailyLeads] = useState(false);
  const [dailyConversations, setDailyConversations] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, [chatbotId]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/chatbot/notification-settings?chatbotId=${chatbotId}`);
      const data = await response.json();
      
      if (data) {
        setDailyLeads(data.dailyLeads || false);
        setDailyConversations(data.dailyConversations || false);
      }
    } catch (error) {
      setNotification({
        message: "Failed to load settings",
        type: "error"
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/chatbot/notification-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatbotId,
          dailyLeads,
          dailyConversations,
        }),
      });

      if (!response.ok) throw new Error();

      setNotification({
        message: "Settings saved successfully",
        type: "success"
      });
    } catch (error) {
      setNotification({
        message: "Failed to save settings",
        type: "error"
      });
    }
    setLoading(false);
  };

  return (
    <>
      {notification && (
        <CustomNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <Card className="p-6 space-y-6 max-w-3xl mx-auto">
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
            <Button 
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
} 