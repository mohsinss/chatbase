"use client";

import Link from "next/link";
import Image from "next/image";
import ButtonSignin from "@/components/ButtonSignin";

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

export default function BubbleIntegrationPage() {
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
                                  subItem.href === '/guide/category/integrations/bubble'
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
              <span className="text-gray-900">Bubble</span>
            </div>

            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 relative">
                  <Image
                    src="/integrations/bubble-icon.png"
                    alt="Bubble"
                    fill
                    className="rounded-lg"
                  />
                </div>
                <h1 className="text-4xl font-bold">Bubble Integration</h1>
              </div>
              <p className="text-xl text-gray-600">Add your Chatsa chatbot to your Bubble application in just a few simple steps.</p>
            </div>

            {/* Content */}
            <div className="prose max-w-none mb-12">
              <h2>Step 1: Create Your Chatsa Bot</h2>
              <p>
                First, log into your Chatsa account. If you don't have one yet, sign up for free. Once logged in, 
                you can set up your bot by adding your data sources - files, text, websites, or Q&A pairs - to build its knowledge base.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
                <p>Follow this roadmap to get your Chatsa bot up and running.</p>
              </div>

              <h2>Step 2: Get Your Bot's Embed Code</h2>
              <ol>
                <li>
                  <p>Go to your Chatsa Dashboard and select the bot you want to add to Bubble.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>
                  <p>Open the bot's playground and go to the Connect tab.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>
                  <p>Click Copy Script to get your embed code.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
              </ol>

              <h2>Step 3: Add Bot to Your Bubble App</h2>
              <ol>
                <li>
                  <p>Log into your Bubble account and open your dashboard.</p>
                </li>
                <li>
                  <p>Select your app and click Launch Editor.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>
                  <p>Go to the page section where you want the bot to appear.</p>
                </li>
                <li>
                  <p>Find the HTML element in the left sidebar and drag it to your page.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>
                  <p>Double-click the HTML element to open the editor.</p>
                </li>
                <li>
                  <p>Paste your embed code - you'll see the bot icon appear in the bottom left corner.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>
                  <p>Preview your app to test the bot.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
              </ol>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 my-8">
                <p className="text-green-700">
                  Your Chatsa bot is now live on your Bubble app!
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                <p className="text-yellow-700">
                  <strong>Pro Tip:</strong> Customize your bot's look in Chatsa's dashboard. Go to Settings → Chat Interface to change colors and appearance.
                </p>
              </div>
            </div>

            {/* Connect Button */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Get Started with Chatsa</h2>
              <p className="text-gray-600 mb-6">Create your free account and start building your bot</p>
              <ButtonSignin 
                text="Sign Up Free"
                extraStyle="inline-flex items-center gap-2 bg-[#2C2C2C] hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 