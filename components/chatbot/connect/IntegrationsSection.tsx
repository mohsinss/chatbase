"use client";

import Image from "next/image";
import { IconDeviceLaptop } from "@tabler/icons-react";
import { useState } from "react";

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
  showDeviceIcon?: boolean;
  isConnecting: boolean;
}

interface WhatsAppAuthResponse {
  authUrl: string;
}

const IntegrationCard = ({ title, description, icon, onClick, showDeviceIcon = false, isConnecting }: IntegrationCardProps) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
    <div className="w-12 h-12">
      <Image
        src={icon}
        alt={title}
        width={48}
        height={48}
        className="object-contain"
      />
    </div>
    
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
    </div>

    <div className="flex items-center gap-2">
      <button
        onClick={onClick}
        className="flex-1 px-4 py-2 text-center rounded-lg border border-gray-200 hover:border-gray-300 transition-colors disabled:opacity-50"
        disabled={isConnecting}
      >
        {isConnecting ? "Connecting..." : "Connect"}
      </button>
      {showDeviceIcon && (
        <button className="p-2 rounded-lg border border-gray-200 hover:border-gray-300">
          <IconDeviceLaptop className="w-5 h-5 text-gray-600" />
        </button>
      )}
    </div>
  </div>
);

const IntegrationsSection = ({ chatbotId }: { chatbotId: string }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async (platform: string) => {
    if (platform === "whatsapp") {
      setIsConnecting(true);
      try {
        const response = await fetch("/api/chatbot/integrations/whatsapp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chatbotId }),
        });

        if (!response.ok) {
          throw new Error("Failed to connect to WhatsApp");
        }

        const data: WhatsAppAuthResponse = await response.json();
        
        // Open WhatsApp authentication window
        const authWindow = window.open(
          data.authUrl,
          "WhatsApp Authentication",
          "width=600,height=600"
        );

        // Handle authentication callback
        window.addEventListener("message", async (event) => {
          if (event.data.type === "WHATSAPP_AUTH_SUCCESS") {
            authWindow?.close();
            // Save WhatsApp credentials
            await saveWhatsAppCredentials(event.data.credentials);
          }
        });

      } catch (error) {
        console.error("WhatsApp connection error:", error);
        alert("Failed to connect to WhatsApp. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    } else {
      console.log(`Connecting to ${platform}...`);
    }
  };

  const saveWhatsAppCredentials = async (credentials: any) => {
    try {
      const response = await fetch("/api/chatbot/integrations/whatsapp/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatbotId,
          credentials,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save WhatsApp credentials");
      }

      alert("Successfully connected to WhatsApp!");
    } catch (error) {
      console.error("Error saving WhatsApp credentials:", error);
      alert("Failed to save WhatsApp connection. Please try again.");
    }
  };

  const integrations = [
    {
      title: "Zapier",
      description: "Connect your chatbot with thousands of apps using Zapier.",
      icon: "/integrations/zapier.svg",
      onClick: () => handleConnect("zapier")
    },
    {
      title: "Slack",
      description: "Connect your chatbot with Slack, mention it, and have it reply to any message.",
      icon: "/integrations/slack.svg",
      onClick: () => handleConnect("slack"),
      showDeviceIcon: true
    },
    {
      title: "Wordpress",
      description: "Use the official Chatsa plugin for Wordpress to add the chat widget to your website.",
      icon: "/integrations/wordpress.svg",
      onClick: () => handleConnect("wordpress")
    },
    {
      title: "Whatsapp",
      description: "Connect your chatbot to a WhatsApp number and let it respond to messages from your customers.",
      icon: "/integrations/whatsapp.svg",
      onClick: () => handleConnect("whatsapp"),
      showDeviceIcon: true
    },
    {
      title: "Messenger",
      description: "Connect your chatbot to a facebook page and let it respond to messages from your customers.",
      icon: "/integrations/messenger.svg",
      onClick: () => handleConnect("messenger"),
      showDeviceIcon: true
    },
    {
      title: "Instagram",
      description: "Connect your chatbot to a instagram page and let it respond to messages from your customers.",
      icon: "/integrations/instagram.svg",
      onClick: () => handleConnect("instagram"),
      showDeviceIcon: true
    },
    {
      title: "Shopify",
      description: "Add your chatbot to your Shopify store to help customers with their questions.",
      icon: "/integrations/shopify.svg",
      onClick: () => handleConnect("shopify")
    }
  ];

  return (
    <div className="w-full max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <IntegrationCard
            key={integration.title}
            {...integration}
            isConnecting={isConnecting}
          />
        ))}
      </div>
    </div>
  );
};

export default IntegrationsSection; 