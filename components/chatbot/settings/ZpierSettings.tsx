
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";

interface ZapierSettingsProps {
  chatbotId: string;
}

const ZapierSettings = ({ chatbotId }: ZapierSettingsProps) => {
  const [zapierKey, setZapierKey] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchZapierSettings();
  }, [chatbotId]);

  const fetchZapierSettings = async () => {
    try {
      const response = await fetch(`/api/chatbot/zapier-settings?chatbotId=${chatbotId}`);
      const data = await response.json();
      if (data) {
        setZapierKey(data.zapierKey || "");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load Zapier settings")
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/chatbot/zapier-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatbotId, zapierKey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save");
      }

      toast.success("Zapier settings saved successfully");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save Zapier settings");
    }
    setLoading(false);
  };

  const generateKey = () => {
    const newApiKey = `zap_${crypto.randomUUID().replace(/-/g, "")}`;
    setZapierKey(newApiKey);
    toast.success("New API key generated");
  };

  return (
    <Card className="p-6 space-y-6 max-w-3xl mx-auto">
      <h3 className="text-xl font-semibold">Zapier Integration</h3>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">
          Zapier API Key
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={zapierKey}
            onChange={(e) => setZapierKey(e.target.value)}
            placeholder="Enter your Zapier API Key"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <Button type="button" variant="outline" onClick={generateKey}>
            Generate New Key
          </Button>
        </div>
        <p className="text-sm text-gray-500">Provide your Zapier API key to enable integrations.</p>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Card>
  );
};

export default ZapierSettings;
