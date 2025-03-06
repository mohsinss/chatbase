"use client";

import Image from "next/image";
import { IconDeviceLaptop } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FacebookSDK from "@/components/facebook/FacebookSDK";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
  showDeviceIcon?: boolean;
  isConnecting: boolean;
  connected: boolean;
}

interface ChatbotData {
  integrations: Object
}

interface WhatsAppAuthResponse {
  authUrl: string;
}

interface MetaBusinessResponse {
  url: string;
  status: string;
  error?: string;
}

const IntegrationCard = ({ title, description, icon, onClick, showDeviceIcon = false, isConnecting, connected }: IntegrationCardProps) => (
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
        {connected ? "Manage" : isConnecting ? "Connecting..." : "Connect"}
      </button>
      {showDeviceIcon && (
        <button className="p-2 rounded-lg border border-gray-200 hover:border-gray-300">
          <IconDeviceLaptop className="w-5 h-5 text-gray-600" />
        </button>
      )}
    </div>
  </div>
);

const IntegrationsSection = ({ chatbotId, chatbot, teamId }: { teamId: string, chatbotId: string, chatbot: ChatbotData }) => {
  const router = useRouter();
  const [connectingTitle, setConnectingTitle] = useState('');

  useEffect(() => {
    const messageEventListener = (event: MessageEvent) => {
      if (event.origin !== "https://www.facebook.com" && event.origin !== "https://web.facebook.com") return;
      try {
        console.log(event.data)
        const data = JSON.parse(event.data);
        if (data.type === 'WA_EMBEDDED_SIGNUP') {
          console.log('WhatsApp Embedded Signup response:', data);

          // Handle successful signup
          if (data.event === 'FINISH') {
            const credentials = {
              phoneNumberId: data.data.phone_number_id,
              wabaId: data.data.waba_id,
              // accessToken: data.access_token,
            };
            saveWhatsAppCredentials(credentials);
          } else {
            console.error('WhatsApp Embedded Signup failed:', data.error);
            toast.error(data.error);
            setConnectingTitle('');
          }
        } else {
          console.log(data)
          setConnectingTitle('')
        }
      } catch (error) {
        console.log(error)
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
      console.log(code)
    } else {
      console.log(response);
      setConnectingTitle('');
    }
  }

  const instagramLoginCallback = (response: any) => {
    if (response.authResponse) {
      const code = response.authResponse.code;
      console.log(code)
      fetch("/api/chatbot/integrations/instagram-page/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          chatbotId
        }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
        .then((data) => {
          setConnectingTitle('');

          router.refresh();
          toast.success("Successfully connected to Instagram!");
        })
        .catch((error) => {
          setConnectingTitle('');
          console.error("Error saving Instagram credentials:", error);
          toast.error(error?.message || "Failed to save Instagram. Please check integration guide again.");
        });
    } else {
      console.log(response);
      toast.error("Sth went wrong.");
      setConnectingTitle('');
    }
  }

  const fbLoginCallbackForFB = (response: any) => {
    if (response.authResponse) {
      const code = response.authResponse.code;
      console.log(code)
      fetch("/api/chatbot/integrations/facebook-page/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          chatbotId
        }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
        .then((data) => {
          setConnectingTitle('');

          router.refresh();
          toast.success("Successfully connected to Messenger!");
        })
        .catch((error) => {
          setConnectingTitle('');
          console.error("Error saving FB page credentials:", error);
          toast.error("Failed to save FB page. Please check integration guide again.");
        });
    } else {
      console.log(response);
      toast.error("Sth went wrong.");
      setConnectingTitle('');
    }
  }

  const handleConnect = async (platform: string) => {
    //@ts-ignore
    if (chatbot?.integrations[platform.toLowerCase()]) {
      router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/connect/integrations/manage/${platform.toLowerCase()}`);
      return;
    }

    setConnectingTitle(platform);

    if (platform === "Whatsapp") {
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
    } else if (platform === "Messenger") {
      window.FB.login(fbLoginCallbackForFB, {
        config_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_CONFIGURATION_ID_FOR_PAGE, // configuration ID goes here
        response_type: 'code', // must be set to 'code' for System User access token
        override_default_response_type: true, // when true, any response types passed in the "response_type" will take precedence over the default types
        extras: {
          setup: {},
          featureType: '',
          sessionInfoVersion: '2',
        }
      });
    } else if (platform === "Instagram") {
      window.FB.login(instagramLoginCallback, {
        config_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_CONFIGURATION_ID_FOR_INSTAGRAM, // configuration ID goes here
        response_type: 'code', // must be set to 'code' for System User access token
        override_default_response_type: true, // when true, any response types passed in the "response_type" will take precedence over the default types
        extras: {
          setup: {},
          featureType: '',
          sessionInfoVersion: '2',
        }
      });
    } else {
      const clientId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
      const redirectUri = encodeURIComponent('https://chatsa.co/api/auth/instagram/callback');
      const scope = encodeURIComponent('instagram_basic,instagram_manage_messages,pages_show_list,pages_messaging');
      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  
      window.location.href = authUrl;
      console.log(`Connecting to ${platform}...`);
      setConnectingTitle("");
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
          ...credentials,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save WhatsApp credentials");
      }

      router.refresh();
      toast.success("Successfully connected to WhatsApp!");
    } catch (error) {
      console.error("Error saving WhatsApp credentials:", error);
      toast.error("Failed to save WhatsApp Number. Please check integration guide again.");
    }
    setConnectingTitle('');
  };

  const integrations = [
    {
      title: "Zapier",
      description: "Connect your chatbot with thousands of apps using Zapier.",
      icon: "/integrations/zapier.svg",
      onClick: () => handleConnect("Zapier")
    },
    {
      title: "Slack",
      description: "Connect your chatbot with Slack, mention it, and have it reply to any message.",
      icon: "/integrations/slack.svg",
      onClick: () => handleConnect("Slack"),
      showDeviceIcon: true
    },
    {
      title: "Wordpress",
      description: "Use the official Chatsa plugin for Wordpress to add the chat widget to your website.",
      icon: "/integrations/wordpress.svg",
      onClick: () => handleConnect("Wordpress")
    },
    {
      title: "Whatsapp",
      description: "Connect your chatbot to a WhatsApp number and let it respond to messages from your customers.",
      icon: "/integrations/whatsapp.svg",
      onClick: () => handleConnect("Whatsapp"),
      showDeviceIcon: true
    },
    {
      title: "Messenger",
      description: "Connect your chatbot to a facebook page and let it respond to messages from your customers.",
      icon: "/integrations/messenger.svg",
      onClick: () => handleConnect("Messenger"),
      showDeviceIcon: true
    },
    {
      title: "Instagram",
      description: "Connect your chatbot to a instagram page and let it respond to messages from your customers.",
      icon: "/integrations/instagram.svg",
      onClick: () => handleConnect("Instagram"),
      showDeviceIcon: true
    },
    {
      title: "Shopify",
      description: "Add your chatbot to your Shopify store to help customers with their questions.",
      icon: "/integrations/shopify.svg",
      onClick: () => handleConnect("Shopify")
    }
  ];

  return (
    <div className="w-full max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <IntegrationCard
            key={integration.title}
            {...integration}
            isConnecting={integration.title == connectingTitle}
            //@ts-ignore
            connected={chatbot?.integrations[integration.title.toLowerCase()] || false}
          />
        ))}
        {connectingTitle != "" && (
          // Show the spinner when loading
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationsSection; 