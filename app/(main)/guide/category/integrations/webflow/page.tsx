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

export default function WebflowIntegrationPage() {
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
                                  subItem.href === '/guide/category/integrations/webflow'
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
              <span className="text-gray-900">Webflow</span>
            </div>

            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 relative">
                  <Image
                    src="/integrations/webflow.svg"
                    alt="Webflow"
                    fill
                    className="rounded-lg"
                  />
                </div>
                <h1 className="text-4xl font-bold">Webflow Integration</h1>
              </div>
              <p className="text-xl text-gray-600">Add your Chatsa chatbot to your Webflow website using our embed code.</p>
            </div>

            {/* Content */}
            <div className="prose max-w-none mb-12">
              <h2>Step 1: Get Your Chatbot Embed Code</h2>
              <ol className="space-y-8">
                <li>
                  <p>Log into your Chatsa account and navigate to your dashboard.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>

                <li>
                  <p>Select the chatbot you want to add to your Webflow site.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>

                <li>
                  <p>Click on the Connect tab and copy your embed code.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
              </ol>

              <h2>Step 2: Add the Embed Code to Your Webflow Site</h2>
              <ol className="space-y-8">
                <li>
                  <p>Log into your Webflow account and open your project.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>

                <li>
                  <p>Click on the Pages panel in the left sidebar.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>

                <li>
                  <p>Select the page where you want to add the chatbot (or select the template page for site-wide integration).</p>
                </li>

                <li>
                  <p>Click on the Settings icon (gear) in the top right corner.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>

                <li>
                  <p>In the settings panel, scroll down to the Custom Code section.</p>
                </li>

                <li>
                  <p>Paste your Chatsa embed code into the &quot;Footer Code&quot; field.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>

                <li>
                  <p>Click Save and close the settings panel.</p>
                </li>

                <li>
                  <p>Publish your changes by clicking the Publish button in the top right.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
              </ol>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                <p className="text-yellow-700">
                  <strong>Note:</strong> If you want the chatbot to appear on all pages, add the embed code to your template page. 
                  For specific pages only, add it to individual page settings.
                </p>
              </div>

              <h2>Step 3: Test Your Integration</h2>
              <ol>
                <li>
                  <p>Visit your published Webflow site to ensure the chatbot appears correctly.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>
                  <p>Try sending a test message to verify the chatbot is working properly.</p>
                </li>
                <li>
                  <p>Check that the chatbot styling matches your website&apos;s design.</p>
                </li>
              </ol>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 my-8">
                <p className="text-green-700">
                  Congratulations! Your Chatsa chatbot is now live on your Webflow website. 
                  Visitors can now interact with your chatbot and get instant responses to their questions.
                </p>
              </div>
            </div>

            {/* Connect Button */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Get Embed Code</h2>
              <p className="text-gray-600 mb-6">Copy the embed code to add your Chatsa chatbot to your Webflow website</p>
              <button 
                onClick={() => window.open('https://webflow.com', '_blank')}
                className="inline-flex items-center gap-2 bg-[#4353FF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3544cc] transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Get Embed Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 