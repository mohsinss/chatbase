"use client";

import Image from "next/image";
import { IconDeviceLaptop } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FacebookSDK from "@/components/facebook/FacebookSDK";

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

interface MetaBusinessResponse {
  url: string;
  status: string;
  error?: string;
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
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const messageEventListener = (event: MessageEvent) => {
      if (event.origin !== "https://www.facebook.com" && event.origin !== "https://web.facebook.com") return;
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'WA_EMBEDDED_SIGNUP') {
          console.log('WhatsApp Embedded Signup response:', data);

          // Handle successful signup
          if (data.status === 'success') {
            const credentials = {
              phoneNumberId: data.phone_number_id,
              wabaId: data.waba_id,
              // accessToken: data.access_token,
            };
            saveWhatsAppCredentials(credentials);
          } else {
            console.error('WhatsApp Embedded Signup failed:', data.error);
            alert('Failed to connect to WhatsApp. Please try again.');
          }
        }
      } catch (error) {
        console.error('Error parsing WhatsApp Embedded Signup response:', error);
      }
    };

    window.addEventListener('message', messageEventListener);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('message', messageEventListener);
    };
  }, []);

  const fbLoginCallback = (response: any) => {
    if (response.authResponse) {
      const code = response.authResponse.code;
      console.log('response: ', code);
    } else {
      console.log('response: ', response);
    }
  }

  const handleConnect = async (platform: string) => {
    if (platform === "whatsapp") {
      setIsConnecting(true);

      window.FB.login(fbLoginCallback, {
        config_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_CONFIGURATION_ID, // configuration ID goes here
        response_type: 'code', // must be set to 'code' for System User access token
        override_default_response_type: true, // when true, any response types passed in the "response_type" will take precedence over the default types
        extras: {
          setup: {},
          featureType: '',
          sessionInfoVersion: '2',
        }
      });
      // try {
      //   const response = await fetch("/api/chatbot/integrations/meta-business", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ 
      //       chatbotId,
      //       platform: "whatsapp"
      //     }),
      //   });

      //   if (!response.ok) {
      //     throw new Error("Failed to initiate Meta Business connection");
      //   }

      //   const data: MetaBusinessResponse = await response.json();

      //   if (data.error) {
      //     throw new Error(data.error);
      //   }

      //   window.location.href = data.url;

      // } catch (error) {
      //   console.error("WhatsApp connection error:", error);
      //   alert("Failed to connect to WhatsApp. Please try again.");
      // } finally {
      //   setIsConnecting(false);
      // }
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
      {/* <FacebookSDK/> */}
    </div>
  );
};

export default IntegrationsSection; 