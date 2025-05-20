"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const sidebarItems = [
  {
    title: "Reference",
    items: [
      {
        name: "Getting started",
        href: "/guide/category/getting-started",
      },
      {
        name: "Integrations",
        href: "/guide/category/integrations",
        isExpanded: true,
        subItems: [
          { name: "Whatsapp", href: "/guide/category/integrations/whatsapp" },
          { name: "Zapier", href: "/guide/category/integrations/zapier" },
          { name: "Wix", href: "/guide/category/integrations/wix" },
          { name: "Framer", href: "/guide/category/integrations/framer" },
          { name: "Cal.com", href: "/guide/category/integrations/calcom" },
          { name: "Slack", href: "/guide/category/integrations/slack" },
          { name: "Bubble", href: "/guide/category/integrations/bubble" },
          { name: "WordPress", href: "/guide/category/integrations/wordpress" },
          { name: "Instagram", href: "/guide/category/integrations/instagram" },
          { name: "Messenger", href: "/guide/category/integrations/messenger" },
          { name: "Weebly", href: "/guide/category/integrations/weebly" },
          { name: "Webflow", href: "/guide/category/integrations/webflow" },
          { name: "Shopify", href: "/guide/category/integrations/shopify" },
        ],
      },
    ],
  },
];

const integrations = [
  {
    title: "Whatsapp",
    description: "This guide provides a step-by-step process for integrating WhatsApp with Chatsa.",
    href: "/guide/category/integrations/whatsapp",
    icons: {
      platform: "/integrations/whatsapp.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Zapier",
    description: "A Step-by-step guide on how to integrate your Chatsa bot with Zapier",
    href: "/guide/category/integrations/zapier",
    icons: {
      platform: "/integrations/zapier.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Wix",
    description: "A quick guide on how to add a Chatsa chatbot on your Wix website",
    href: "/guide/category/integrations/wix",
    icons: {
      platform: "/integrations/wix-icon.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Framer",
    description: "Learn how to seamlessly integrate a Chatsa chatbot into your Framer website with these step-by-step instructions",
    href: "/guide/category/integrations/framer",
    icons: {
      platform: "/integrations/framer-icon.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Cal.com",
    description: "How to set up the Cal.com integration with your Chatsa chatbot",
    href: "/guide/category/integrations/calcom",
    icons: {
      platform: "/integrations/cal-icon.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Slack",
    description: "How to add a Chatsa chatbot to Slack for seamless team communication",
    href: "/guide/category/integrations/slack",
    icons: {
      platform: "/integrations/slack.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Bubble",
    description: "How to embed a Chatsa chatbot on your Bubble web app",
    href: "/guide/category/integrations/bubble",
    icons: {
      platform: "/integrations/bubble-icon.png",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "WordPress",
    description: "Let&apos;s walk you through how to embed a Chatsa chatbot on your WordPress website",
    href: "/guide/category/integrations/wordpress",
    icons: {
      platform: "/integrations/wordpress.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Instagram",
    description: "This guide provides a step-by-step process for integrating Instagram with Chatbase.",
    href: "/guide/category/integrations/instagram",
    icons: {
      platform: "/integrations/instagram.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Messenger",
    description: "This guide provides a step-by-step process for integrating Messenger with Chatbase.",
    href: "/guide/category/integrations/messenger",
    icons: {
      platform: "/integrations/messenger.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Weebly",
    description: "How to add a Chatsa chatbot to your Weebly website",
    href: "/guide/category/integrations/weebly",
    icons: {
      platform: "/integrations/weebly-icon.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Webflow",
    description: "How to add a Chatsa chatbot to your Webflow website",
    href: "/guide/category/integrations/webflow",
    icons: {
      platform: "/integrations/webflow-icon.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  },
  {
    title: "Shopify",
    description: "How to add a Chatsa chatbot to your Shopify website or store",
    href: "/guide/category/integrations/shopify",
    icons: {
      platform: "/integrations/shopify.svg",
      chatbase: "/integrations/chatbase-icon.svg"
    }
  }
];

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 flex gap-8">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Navigation */}
          {sidebarItems.map((category) => (
            <div key={category.title} className="mb-8">
              <h2 className="text-lg font-semibold mb-4">{category.title}</h2>
              <ul className="space-y-2">
                {category.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 py-1 px-3 rounded-lg transition-colors ${
                        item.href === '/guide/category/integrations'
                          ? 'text-gray-900 bg-gray-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${item.isExpanded ? 'rotate-90' : ''}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      {item.name}
                    </Link>
                    {item.isExpanded && item.subItems && (
                      <ul className="ml-6 mt-2 space-y-2">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              href={subItem.href}
                              className="block text-gray-600 hover:text-gray-900 py-1 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Main Content */}
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
      </div>
    </div>
  );
} 