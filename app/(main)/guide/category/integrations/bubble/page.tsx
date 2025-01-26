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
              <h2>Step 1: Set Up Your Chatsa Chatbot</h2>
              <p>
                To integrate your Chatsa AI chatbot into your Bubble application, begin by logging into your Chatsa account. 
                If you haven&apos;t already created an account, you can sign up for a free account. After signing in, you can configure your bot 
                within the Chatsa platform by uploading relevant data sources, such as files, text snippets, websites, or question-and-answer pairs, 
                which the bot can use to build its knowledge base.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
                <p>Here is a step-by-step roadmap for successfully deploying your Chatsa chatbot.</p>
              </div>

              <h2>Step 2: Generate and Copy Your Chatsa Chatbot Embed Code</h2>
              <ol>
                <li>
                  <p>Every chatbot you create on Chatsa has a unique embed code you can use to embed it on your website. Once you&apos;ve set up your chatbot on Chatsa, navigate to your Dashboard page, and select the specific bot you wish to integrate with your Bubble application.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>
                  <p>Clicking on the bot should take you to the bot&apos;s playground page. From there, proceed to the Connect tab.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>
                  <p>Up next, a new page should come up, click on Copy Script to copy the code snippet.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
              </ol>

              <h2>Step 3: Embed Chatsa Chatbot on Your Bubble App</h2>
              <ol>
                <li>
                  <p>Once you&apos;ve copied your Chatsa embed code, sign into your Bubble account and head to your account dashboard.</p>
                </li>
                <li>
                  <p>On your dashboard, pick out the Bubble app or website you wish to embed the chatbot on and click the Launch Editor button next to it.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>
                  <p>Once your Bubble Editor comes up, scroll down to the section of the page you want to add the embed code.</p>
                </li>
                <li>
                  <p>On the left sidebar of the editor, locate the HTML component and drag it to the section of the page.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>
                  <p>Double-click on the HTML component to reveal the code editor.</p>
                </li>
                <li>
                  <p>Paste the embed code on the editor and you should automatically see a floating chatbot icon on the bottom left corner of the editing canvas.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>
                  <p>You can now preview your Bubble app to test your chatbot.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
              </ol>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 my-8">
                <p className="text-green-700">
                  Congratulations, your Chatsa chatbot is now live on your Bubble app!
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                <p className="text-yellow-700">
                  <strong>Note:</strong> You can customize the appearance and colors of your bot on your Chatsa dashboard. 
                  To do this, go to your dashboard, choose a bot, click the Settings tab on the top of the page, and then click Chat Interface 
                  on the left sidebar to reveal the chatbot customization options.
                </p>
              </div>
            </div>

            {/* Connect Button */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Get Embed Code</h2>
              <p className="text-gray-600 mb-6">Copy the embed code to add your Chatsa chatbot to your Bubble application</p>
              <button 
                onClick={() => window.open('https://bubble.io', '_blank')}
                className="inline-flex items-center gap-2 bg-[#2C2C2C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
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