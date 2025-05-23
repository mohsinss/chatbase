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
  commingSoon?: boolean;
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

const IntegrationCard = ({
  title,
  description,
  icon,
  onClick,
  showDeviceIcon = false,
  isConnecting,
  connected,
  commingSoon
}: IntegrationCardProps) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 flex flex-col justify-between">
    <div>
      <div className={`w-12 h-12 rounded-full overflow-hidden ${connected ? '' : 'bg-gray-500'}`}>
        {icon.endsWith('.svg') ? (
          <img
            src={icon}
            alt={title}
            className={`object-contain w-full h-full ${connected ? '' : 'bg-gray-500'}`}
          // style={{ filter: connected ? 'invert(41%) sepia(99%) saturate(749%) hue-rotate(87deg) brightness(95%) contrast(89%)' : 'none' }}
          />
        ) : (
          <Image
            src={icon}
            alt={title}
            width={48}
            height={48}
            className="object-contain"
          />
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={onClick}
        className={`flex-1 px-4 py-2 text-center rounded-lg border transition-colors disabled:opacity-50
    ${connected ? 'bg-green-500 text-white border-green-600 hover:bg-green-600' : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300'}`}
        disabled={isConnecting || commingSoon}
      >
        {commingSoon
          ? "Coming Soon"
          : connected
            ? "Manage"
            : isConnecting
              ? "Connecting..."
              : "Connect"}
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

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.success && event.data.platform === 'x') {
        setConnectingTitle('');
        router.refresh();
        toast.success("Successfully connected to X!");
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [router]);

  // Unified connection handler for Facebook-based platforms
  const handleFacebookConnection = (platform: string, configId: string, responseType: string) => {
    window.FB.login((response: any) => {
      if (response.authResponse) {
        if (platform === "Messenger") {
          const code = response.authResponse.code;
          console.log(code);

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
        } else if (platform === "Instagram") {
          const accessToken = response.authResponse.accessToken;
          console.log(response.authResponse);

          fetch("/api/chatbot/integrations/instagram-page/save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_access_token: accessToken,
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
        } else if (platform === "Whatsapp") {
          // WhatsApp uses a different flow with embedded signup
          // The actual saving happens in the message event listener
          const code = response.authResponse.code;
          console.log(code);
          // No need to do anything here as the message event listener will handle it
        }
      } else {
        console.log(response);
        toast.error("Something went wrong with the connection.");
        setConnectingTitle('');
      }
    }, {
      config_id: configId,
      response_type: responseType,
      override_default_response_type: true,
      extras: {
        setup: {},
        featureType: '',
        sessionInfoVersion: '2',
      }
    });
  }

  const handleConnect = async (platform: string) => {
    //@ts-ignore
    if (chatbot?.integrations[platform.toLowerCase()]) {
      router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/connect/integrations/manage/${platform.toLowerCase()}`);
      return;
    }

    setConnectingTitle(platform);

    if (platform === "Whatsapp") {
      handleFacebookConnection(
        "Whatsapp",
        process.env.NEXT_PUBLIC_FACEBOOK_APP_CONFIGURATION_ID,
        'code'
      );
    } else if (platform === "Messenger") {
      handleFacebookConnection(
        "Messenger",
        process.env.NEXT_PUBLIC_FACEBOOK_APP_CONFIGURATION_ID_FOR_PAGE,
        'code'
      );
    } else if (platform === "Instagram") {
      handleFacebookConnection(
        "Instagram",
        process.env.NEXT_PUBLIC_FACEBOOK_APP_CONFIGURATION_ID_FOR_INSTAGRAM,
        'token,signed_request,graph_domain'
      );
    } else if (platform === "x") {
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        `/api/auth/x?chatbotId=${chatbotId}`,
        "X OAuth",
        `width=${width},height=${height},top=${top},left=${left}`
      );

      // Listen for messages from the popup window
      const popupTick = setInterval(() => {
        if (popup?.closed) {
          clearInterval(popupTick);
          setConnectingTitle('');
          router.refresh();
        }
      }, 500);

      setConnectingTitle('');
    } else if (platform === "Zapier") {
      window.open("https://zapier.com/apps/chatsa/integrations", "_blank");
      setConnectingTitle('');
    } else if (platform === "Snapchat") {
      // Implementation for Snapchat connection
      setConnectingTitle('');
    } else if (platform === "TikTok") {
      // Implementation for TikTok connection
      setConnectingTitle('');
    } else {
      setConnectingTitle('');
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
      showDeviceIcon: false,
      commingSoon: true,
    },
    {
      title: "Wordpress",
      description: "Use the official Chatsa plugin for Wordpress to add the chat widget to your website.",
      icon: "/integrations/wordpress.svg",
      onClick: () => handleConnect("Wordpress"),
      commingSoon: true,
    },
    {
      title: "Whatsapp",
      description: "Connect your chatbot to a WhatsApp number and let it respond to messages from your customers.",
      icon: "/integrations/whatsapp.svg",
      onClick: () => handleConnect("Whatsapp"),
      showDeviceIcon: false
    },
    {
      title: "Messenger",
      description: "Connect your chatbot to a facebook page and let it respond to messages from your customers.",
      icon: "/integrations/messenger.svg",
      onClick: () => handleConnect("Messenger"),
      showDeviceIcon: false
    },
    {
      title: "Instagram",
      description: "Connect your chatbot to a instagram page and let it respond to messages from your customers.",
      icon: "/integrations/instagram.svg",
      onClick: () => handleConnect("Instagram"),
      showDeviceIcon: false
    },
    {
      title: "X",
      description: "Connect your chatbot to a x page and let it respond to messages from your customers.",
      icon: "/integrations/x.svg",
      onClick: () => handleConnect("x"),
      showDeviceIcon: false,
      commingSoon: true,
    },
    {
      title: "Shopify",
      description: "Add your chatbot to your Shopify store to help customers with their questions.",
      icon: "/integrations/shopify.svg",
      onClick: () => handleConnect("Shopify"),
      commingSoon: true,
    },
    {
      title: "Snapchat",
      description: "Connect your chatbot to Snapchat and engage with your audience through Stories and Chat.",
      icon: "/integrations/snapchat.png",
      onClick: () => handleConnect("Snapchat"),
      showDeviceIcon: false,
      commingSoon: true,
    },
    {
      title: "TikTok",
      description: "Connect your chatbot to TikTok and interact with your followers through comments and messages.",
      icon: "/integrations/tiktok.png",
      onClick: () => handleConnect("TikTok"),
      showDeviceIcon: false,
      commingSoon: true,
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
