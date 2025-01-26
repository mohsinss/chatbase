"use client";

import Link from "next/link";
import Image from "next/image";

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

export default function MessengerIntegrationPage() {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-12">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            {sidebarItems.map((category) => (
              <div key={category.title} className="mb-8">
                <h2 className="text-lg font-semibold mb-4">{category.title}</h2>
                <ul className="space-y-2">
                  {category.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 py-1 px-3 rounded-lg hover:bg-gray-50 transition-colors"
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
                                className={`block py-1 px-3 rounded-lg transition-colors ${
                                  subItem.href === '/guide/category/integrations/messenger'
                                    ? 'text-gray-900 bg-gray-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
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
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-gray-600 mb-8">
              <Link href="/guide" className="hover:text-gray-900">Guide</Link>
              <span>›</span>
              <Link href="/guide/category/integrations" className="hover:text-gray-900">Integrations</Link>
              <span>›</span>
              <span className="text-gray-900">Messenger</span>
            </div>

            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 relative">
                  <Image
                    src="/integrations/messenger.svg"
                    alt="Messenger"
                    fill
                    className="rounded-lg"
                  />
                </div>
                <h1 className="text-4xl font-bold">Messenger Integration</h1>
              </div>
              <p className="text-xl text-gray-600">Connect your Chatsa chatbot with Facebook Messenger to engage with your customers through your Facebook Page.</p>
            </div>

            {/* Content */}
            <div className="prose max-w-none mb-12">
              <p>
                Integrating Facebook Messenger with Chatsa allows your custom chatbot to communicate directly with customers via your Facebook Page&apos;s Messenger. 
                This integration enables automated responses while giving you the flexibility to take over conversations when needed.
              </p>

              <h2>Prerequisites</h2>
              <p>You will need the following:</p>
              <ul>
                <li>A Facebook Page (with admin access)</li>
                <li>A Meta Business Account</li>
              </ul>

              <h2>Integration Steps</h2>
              <ol className="space-y-8">
                <li>
                  <p>Navigate to your dashboard and select the chatbot you want to integrate.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>

                <li>
                  <p>Navigate to Connect {'->'} Integrations.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>

                <li>
                  <p>Find the Messenger card and click Connect.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>

                <li>
                  <p>Log in with your Facebook account that has admin access to your page.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>

                <li>
                  <p>Select the Facebook Page(s) you want to connect with your chatbot.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>

                <li>
                  <p>Review and grant the necessary permissions for the integration.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
              </ol>

              <h2>The Human Takeover Feature</h2>
              <p>
                Just like with Instagram, you can take over any conversation from your chatbot at any time. This allows you to provide 
                personal attention when needed while letting the chatbot handle routine inquiries.
              </p>

              <h3>To enable human takeover:</h3>
              <ol>
                <li>Navigate to Activity in your dashboard</li>
                <li>
                  <p>Filter the chat logs to show only Messenger conversations</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>
                  <p>Click the human takeover icon on any conversation</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>You can click the icon again to return control to the chatbot</li>
              </ol>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                <p className="text-yellow-700">
                  <strong>Note:</strong> Make sure to respond promptly when in human takeover mode. You can set up notifications 
                  to alert you when new messages arrive during human takeover.
                </p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 my-8">
                <p className="text-green-700">
                  Congratulations! Your Chatsa chatbot is now connected to Facebook Messenger. Your chatbot will automatically 
                  respond to messages sent to your Facebook Page.
                </p>
              </div>
            </div>

            {/* Connect Button */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Connect to Messenger</h2>
              <p className="text-gray-600 mb-6">Link your Facebook Page to start using Chatsa with Messenger</p>
              <button 
                onClick={() => window.open('https://www.facebook.com/pages', '_blank')}
                className="inline-flex items-center gap-2 bg-[#0084FF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#006acd] transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                Connect to Messenger
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 