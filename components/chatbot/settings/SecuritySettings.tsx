"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CustomNotification } from '@/components/ui/notification';

interface SecuritySettingsProps {
  chatbotId: string;
}

export default function SecuritySettings({ chatbotId }: SecuritySettingsProps) {
  const [domainRestriction, setDomainRestriction] = useState(false);
  const [messageLimit, setMessageLimit] = useState("20");
  const [timeLimit, setTimeLimit] = useState("240");
  const [limitMessage, setLimitMessage] = useState("Too many messages in a row");
  const [visibility, setVisibility] = useState("public");
  const [allowedDomains, setAllowedDomains] = useState("");
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
      const response = await fetch(`/api/chatbot/security-settings?chatbotId=${chatbotId}`);
      const data = await response.json();
      
      if (data) {
        setDomainRestriction(data.domainRestriction || false);
        setMessageLimit(data.messageLimit || "20");
        setTimeLimit(data.timeLimit || "240");
        setLimitMessage(data.limitMessage || "Too many messages in a row");
        setVisibility(data.visibility || "public");
        setAllowedDomains(data.allowedDomains || "");
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
      const response = await fetch("/api/chatbot/security-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatbotId,
          domainRestriction,
          messageLimit,
          timeLimit,
          limitMessage,
          visibility,
          allowedDomains,
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
    setMessageLimit("20");
    setTimeLimit("240");
    setLimitMessage("Too many messages in a row");
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
              (this limit will not be applied to you on chatbase.co, only on your website for
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
            <Button 
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
} 