"use client";

import * as React from "react";

interface WebhooksSettingsProps {
  chatbotId: string;
}

export default function WebhooksSettings({ chatbotId }: WebhooksSettingsProps) {
  const [leadsSubmitted, setLeadsSubmitted] = React.useState(false);
  const [webhookUrl, setWebhookUrl] = React.useState("");

  const handleCreateWebhook = async () => {
    try {
      // Create webhook in backend
      if (!leadsSubmitted) {
        // Show error: At least one event must be selected
        return;
      }
      if (!webhookUrl) {
        // Show error: URL is required
        return;
      }
    } catch (error) {
      console.error("Failed to create webhook:", error);
    }
  };

  return (
    <div className="w-full max-w-2xl">
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
          <button 
            onClick={handleCreateWebhook}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Create Webhook
          </button>
        </div>
      </div>
    </div>
  );
} 