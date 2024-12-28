"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CustomNotification } from './GeneralSettings'

interface LeadsSettingsProps {
  chatbotId: string;
}

export default function LeadsSettings({ chatbotId }: LeadsSettingsProps) {
  const [title, setTitle] = useState("Let us know how to contact you");
  const [nameEnabled, setNameEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [phoneEnabled, setPhoneEnabled] = useState(true);
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
      const response = await fetch(`/api/chatbot/leads-settings?chatbotId=${chatbotId}`);
      const data = await response.json();
      
      if (data) {
        setTitle(data.title || "Let us know how to contact you");
        setNameEnabled(data.nameEnabled ?? true);
        setEmailEnabled(data.emailEnabled ?? true);
        setPhoneEnabled(data.phoneEnabled ?? true);
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
      const response = await fetch("/api/chatbot/leads-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatbotId,
          title,
          nameEnabled,
          emailEnabled,
          phoneEnabled,
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

  const handleReset = () => {
    setTitle("Let us know how to contact you");
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
      <div className="w-full max-w-2xl">
        <div className="space-y-6">
          <p className="text-sm text-gray-500">
            Note: Leads form only appears when chatting through the iframe or the chat bubble.
          </p>

          {/* Title Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-base font-medium">Title</label>
              <button 
                onClick={handleReset}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Reset
              </button>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Enter form title"
            />
          </div>

          {/* Fields Section */}
          <div className="space-y-4">
            {/* Name Field */}
            <div className="flex items-center justify-between py-4 border-t">
              <label className="text-base font-medium">Name</label>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={nameEnabled}
                  onChange={(e) => setNameEnabled(e.target.checked)}
                  className="peer sr-only"
                  id="name-toggle"
                />
                <label
                  htmlFor="name-toggle"
                  className={`absolute cursor-pointer rounded-full w-12 h-6 
                            ${nameEnabled ? 'bg-violet-600' : 'bg-gray-200'}
                            transition-colors duration-300 ease-in-out
                            before:content-[''] before:absolute before:w-4 before:h-4 
                            before:bg-white before:rounded-full before:top-1 before:left-1
                            before:transition-transform before:duration-300 before:ease-in-out
                            peer-checked:before:translate-x-6`}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="flex items-center justify-between py-4 border-t">
              <label className="text-base font-medium">Email</label>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={(e) => setEmailEnabled(e.target.checked)}
                  className="peer sr-only"
                  id="email-toggle"
                />
                <label
                  htmlFor="email-toggle"
                  className={`absolute cursor-pointer rounded-full w-12 h-6 
                            ${emailEnabled ? 'bg-violet-600' : 'bg-gray-200'}
                            transition-colors duration-300 ease-in-out
                            before:content-[''] before:absolute before:w-4 before:h-4 
                            before:bg-white before:rounded-full before:top-1 before:left-1
                            before:transition-transform before:duration-300 before:ease-in-out
                            peer-checked:before:translate-x-6`}
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="flex items-center justify-between py-4 border-t">
              <label className="text-base font-medium">Phone</label>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={phoneEnabled}
                  onChange={(e) => setPhoneEnabled(e.target.checked)}
                  className="peer sr-only"
                  id="phone-toggle"
                />
                <label
                  htmlFor="phone-toggle"
                  className={`absolute cursor-pointer rounded-full w-12 h-6 
                            ${phoneEnabled ? 'bg-violet-600' : 'bg-gray-200'}
                            transition-colors duration-300 ease-in-out
                            before:content-[''] before:absolute before:w-4 before:h-4 
                            before:bg-white before:rounded-full before:top-1 before:left-1
                            before:transition-transform before:duration-300 before:ease-in-out
                            peer-checked:before:translate-x-6`}
                />
              </div>
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
      </div>
    </>
  );
} 