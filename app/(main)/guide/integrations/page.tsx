"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const integrations = [
  {
    title: "Whatsapp",
    description: "This guide provides a step-by-step process for integrating WhatsApp with Chatsa.",
    href: "/guide/integrations/whatsapp",
    icons: {
      platform: "/integrations/whatsapp.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Zapier",
    description: "A Step-by-step guide on how to integrate your Chatsa bot with Zapier",
    href: "/guide/integrations/zapier",
    icons: {
      platform: "/integrations/zapier.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Wix",
    description: "A quick guide on how to add a Chatsa chatbot on your Wix website",
    href: "/guide/integrations/wix",
    icons: {
      platform: "/integrations/wix-icon.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Framer",
    description: "Learn how to seamlessly integrate a Chatsa chatbot into your Framer website with these step-by-step instructions",
    href: "/guide/integrations/framer",
    icons: {
      platform: "/integrations/framer-icon.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Cal.com",
    description: "How to set up the Cal.com integration with your Chatsa chatbot",
    href: "/guide/integrations/calcom",
    icons: {
      platform: "/integrations/cal-icon.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Slack",
    description: "How to add a Chatsa chatbot to Slack for seamless team communication",
    href: "/guide/integrations/slack",
    icons: {
      platform: "/integrations/slack.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Bubble",
    description: "How to embed a Chatsa chatbot on your Bubble web app",
    href: "/guide/integrations/bubble",
    icons: {
      platform: "/integrations/bubble-icon.png",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "WordPress",
    description: "Let&apos;s walk you through how to embed a Chatsa chatbot on your WordPress website",
    href: "/guide/integrations/wordpress",
    icons: {
      platform: "/integrations/wordpress.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Instagram",
    description: "This guide provides a step-by-step process for integrating Instagram with Chatbase.",
    href: "/guide/integrations/instagram",
    icons: {
      platform: "/integrations/instagram.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Messenger",
    description: "This guide provides a step-by-step process for integrating Messenger with Chatbase.",
    href: "/guide/integrations/messenger",
    icons: {
      platform: "/integrations/messenger.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Weebly",
    description: "How to add a Chatsa chatbot to your Weebly website",
    href: "/guide/integrations/weebly",
    icons: {
      platform: "/integrations/weebly-icon.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Webflow",
    description: "How to add a Chatsa chatbot to your Webflow website",
    href: "/guide/integrations/webflow",
    icons: {
      platform: "/integrations/webflow-icon.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Shopify",
    description: "How to add a Chatsa chatbot to your Shopify website or store",
    href: "/guide/integrations/shopify",
    icons: {
      platform: "/integrations/shopify.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  }
];

export default function IntegrationsPage() {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-2 text-gray-600 mb-8">
        <Link href="/guide" className="hover:text-gray-900">Guide</Link>
        <span>›</span>
        <span className="text-gray-900">Integrations</span>
      </div>

      <h1 className="text-4xl font-bold mb-8">Integrations</h1>

      <div className="grid gap-6">
        {integrations.map((integration) => (
          <Link
            key={integration.title}
            href={integration.href}
            className="block bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="grid grid-cols-2">
              <div className="p-8 flex items-center justify-center bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 relative">
                    <Image
                      src={integration.icons.chatbase}
                      alt="Chatsa"
                      fill
                      className="rounded-lg"
                    />
                  </div>
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                  <div className="w-16 h-16 relative">
                    <Image
                      src={integration.icons.platform}
                      alt={integration.title}
                      fill
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <h2 className="text-2xl font-semibold mb-2">{integration.title}</h2>
                <p className="text-gray-600">{integration.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 