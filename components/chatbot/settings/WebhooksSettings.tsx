"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CustomNotification } from './GeneralSettings'
import { Card } from "@/components/ui/card";

interface WebhooksSettingsProps {
  chatbotId: string;
}

export default function WebhooksSettings({ chatbotId }: WebhooksSettingsProps) {
  const [leadsSubmitted, setLeadsSubmitted] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
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
      const response = await fetch(`/api/chatbot/webhook-settings?chatbotId=${chatbotId}`);
      const data = await response.json();
      
      if (data) {
        setLeadsSubmitted(data.leadsSubmitted || false);
        setWebhookUrl(data.webhookUrl || "");
      }
    } catch (error) {
      setNotification({
        message: "Failed to load settings",
        type: "error"
      });
    }
  };

  const handleCreateWebhook = async () => {
    if (!leadsSubmitted) {
      setNotification({
        message: "At least one event must be selected",
        type: "error"
      });
      return;
    }
    if (!webhookUrl) {
      setNotification({
        message: "URL is required",
        type: "error"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/chatbot/webhook-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatbotId,
          leadsSubmitted,
          webhookUrl,
        }),
      });

      if (!response.ok) throw new Error();

      setNotification({
        message: "Webhook created successfully",
        type: "success"
      });
    } catch (error) {
      setNotification({
        message: "Failed to create webhook",
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
        <div className="space-y-8">
          {/* Events Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Events</h3>
            <p className="text-gray-600">
              Select the events the webhook will listen to. At least one must be selected.
            </p>

            {/* Events Selection */}
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="leads-submitted"
                  checked={leadsSubmitted}
                  onChange={(e) => setLeadsSubmitted(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <div>
                  <label 
                    htmlFor="leads-submitted" 
                    className="block text-base font-medium text-gray-900"
                  >
                    Leads submitted
                  </label>
                  <span className="text-sm text-gray-500">leads.submit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Endpoint Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Endpoint</h3>
            <p className="text-gray-600">
              Webhooks events will be sent as POST request to this URL.
            </p>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://mywebsite.com/webhooks"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Create Button */}
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleCreateWebhook}
              disabled={loading}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
            >
              {loading ? "Creating..." : "Create Webhook"}
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
} 