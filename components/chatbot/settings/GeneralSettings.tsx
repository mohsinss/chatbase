"use client";

import { useState, useEffect } from "react"
import { Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Notification } from "@/components/ui/notification"

interface GeneralSettingsProps {
  chatbotId: string;
}

const GeneralSettings = ({ chatbotId }: GeneralSettingsProps) => {
  const [name, setName] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [creditLimit, setCreditLimit] = useState(false);
  const [creditLimitValue, setCreditLimitValue] = useState<number | null>(null);
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
      const response = await fetch(`/api/chatbot/settings?chatbotId=${chatbotId}`);
      const data = await response.json();
      
      if (data) {
        setName(data.name || "");
        setCharacterCount(data.characterCount || 0);
        setCreditLimit(data.creditLimitEnabled || false);
        setCreditLimitValue(data.creditLimit || null);
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
      const response = await fetch("/api/chatbot/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatbotId,
          name,
          characterCount,
          creditLimitEnabled: creditLimit,
          creditLimit: creditLimitValue,
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setNotification({
      message: "Copied to clipboard",
      type: "success"
    });
  }

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="w-full max-w-3xl mx-auto space-y-8">
        {/* General Section */}
        <Card className="p-6 space-y-6">
          <h1 className="text-2xl font-semibold">General</h1>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Chatbot ID
              </label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono">{chatbotId}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copyToClipboard(chatbotId)}
                  title="Copy ID"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Number of characters
              </label>
              <p className="text-lg">{characterCount.toLocaleString()}</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">
                    Credit Limit
                  </label>
                </div>
                <Switch
                  checked={creditLimit}
                  onCheckedChange={setCreditLimit}
                />
              </div>
              
              {creditLimit && (
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Enter credit limit"
                    value={creditLimitValue || ""}
                    onChange={(e) => setCreditLimitValue(Number(e.target.value))}
                  />
                  <p className="text-sm text-gray-500">
                    Enter the maximum number of credits this chatbot can use
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <div className="space-y-6">
          <h2 className="text-red-500 text-center">DANGER ZONE</h2>
          
          <Card className="border-red-200">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-red-500 mb-2">Delete All Conversations</h3>
                  <p className="text-gray-600">
                    Once you delete all your conversations, there is no going back. Please be certain.
                  </p>
                  <p className="text-gray-600">
                    All the conversations on this chatbot will be deleted. <span className="font-semibold">This action is not reversible</span>
                  </p>
                </div>
                <Button variant="destructive">Delete</Button>
              </div>
            </div>
          </Card>

          <Card className="border-red-200">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-red-500 mb-2">Delete Chatbot</h3>
                  <p className="text-gray-600">
                    Once you delete your chatbot, there is no going back. Please be certain.
                  </p>
                  <p className="text-gray-600">
                    All your uploaded data will be deleted. <span className="font-semibold">This action is not reversible</span>
                  </p>
                </div>
                <Button variant="destructive">Delete</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default GeneralSettings; 