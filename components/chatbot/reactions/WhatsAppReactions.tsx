"use client";

import { IconBrandWhatsapp, IconLoader } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface WhatsAppReactionsProps {
  chatbot: {
    integrations: {
      [key: string]: boolean;
    };
    id: string;
    name: string;
  };
}

const WhatsAppReactions = ({ chatbot }: WhatsAppReactionsProps) => {
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
  const [settingsData, setSettingsData] = useState<{ prompt: string; delay: number } | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    fetchSettings(chatbot.id);
    setIsConnected(!!chatbot?.integrations?.['whatsapp']);
  }, [chatbot]);

  const saveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const response = await fetch(`/api/chatbot/integrations/whatsapp/settings-v1?chatbotId=${chatbot.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: settingsData?.prompt,
          delay: settingsData?.delay,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save settings");
      }

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
    setIsSavingSettings(false);
  };

  const fetchSettings = async (id: string) => {
    setIsFetchingSettings(true);
    try {
      const response = await fetch(`/api/chatbot/integrations/whatsapp/settings-v1?chatbotId=${chatbot.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to fetch settings");
      }

      setSettingsData(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to fetch settings.");
    }
    setIsFetchingSettings(false);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // TODO: Implement actual Facebook connection logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to Facebook:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <>
      {/* Fixed WhatsApp header */}
      <div className="">
        <div className="bg-[#25D366] text-white p-6">
          <div className="flex items-center gap-3 justify-between">
            <div className="flex gap-2">
              <IconBrandWhatsapp className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-2xl font-semibold">WhatsApp Reactions</h1>
                <p className="mt-1 text-white/80">Manage your WhatsApp chatbot reactions and settings.</p>
              </div>
            </div>
            <div className="flex justify-end items-center gap-4">
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className={`px-4 py-2 rounded-lg text-sm font-medium h-10 transition-colors ${isConnected
                  ? "bg-[#42B72A] text-white border border-green-200"
                  : "bg-[#1877F2] text-white hover:opacity-90"
                  }`}
              >
                {isConnected ? "Already Connected to Whatsapp" : isConnecting ? "Connecting..." : "Connect to Whatsapp"}
              </button>
              <button
                onClick={saveSettings}
                disabled={isSavingSettings}
                className={`px-4 py-2 rounded-lg text-sm font-medium h-10 transition-colors ${isSavingSettings
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {isSavingSettings ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content with top padding for fixed header */}
      <div className="flex flex-1 gap-2 flex-col overflow-y-auto p-6 bg-[#F7F9F9]">
        {isFetchingSettings && <div className="bg-white p-6 rounded-lg shadow-sm">
          <IconLoader className="animate-spin w-8 h-8 mx-auto" />
        </div>}
        {!isFetchingSettings && <>
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prompt</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                    value={settingsData?.prompt}
                    onChange={(e) => setSettingsData({ ...settingsData, prompt: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={settingsData?.delay}
                    onChange={(e) => setSettingsData({ ...settingsData, delay: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>
        </>}
      </div>
    </>
  );
};

export default WhatsAppReactions; 