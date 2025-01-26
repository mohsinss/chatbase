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

export default function ZapierIntegrationPage() {
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
                                  subItem.href === '/guide/category/integrations/zapier'
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
              <span className="text-gray-900">Zapier</span>
            </div>

            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 relative">
                  <Image
                    src="/integrations/zapier.svg"
                    alt="Zapier"
                    fill
                    className="rounded-lg"
                  />
                </div>
                <h1 className="text-4xl font-bold">Zapier Integration</h1>
              </div>
              <p className="text-xl text-gray-600">Connect your Chatsa bot with thousands of apps using Zapier&apos;s powerful automation platform.</p>
            </div>

            {/* Content */}
            <div className="prose max-w-none mb-12">
              <h2>Step 1: Sign Into Your Chatsa Account and Set Up Your Chatbot</h2>
              <ol>
                <li>Sign up for a free Chatsa account.</li>
                <li>Log in and go to the bot creation page.</li>
                <li>Upload training data like text, documents, websites or Q&A pairs.</li>
                <li>Train and test your bot until its responses meet your requirements.</li>
              </ol>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
                <p>Not familiar with creating a Chatsa chatbot? Here is a step-by-step guide to building a chatbot with Chatsa.</p>
              </div>

              <h2>What You Can Do With Zapier Integration</h2>
              <p>You can automate a lot of things with Chatsa and Zapier, it all boils down to what you want to achieve and your creativity. Here are some of the things you can do:</p>

              <h3>1. Draft responses to customer emails</h3>
              <ul>
                <li>Send new customer emails from your inbox to Chatsa.</li>
                <li>Using your company&apos;s documentation, Chatsa can draft a relevant response.</li>
                <li>Automatically save the AI-generated response as a draft in your email client or send it directly.</li>
              </ul>

              <h3>2. Categorize and prioritize incoming support emails</h3>
              <ul>
                <li>Connect Chatsa with your email client (e.g., Gmail, Outlook).</li>
                <li>Chatsa can analyze the tone and content of incoming emails.</li>
                <li>Categorize emails as urgent, non-urgent, or by specific topics.</li>
                <li>Add notes or tasks to your project management tool or spreadsheet for follow-up.</li>
              </ul>

              <h3>3. Add AI-generated instructions or solutions to support tickets</h3>
              <ul>
                <li>Integrate Chatsa with tools like Jira, Intercom, or Zendesk</li>
                <li>When a new support ticket is created, send the details to Chatsa</li>
                <li>Chatsa can analyze the issue using your documentation and suggest initial solutions or step-by-step instructions</li>
                <li>Automatically add the AI-generated response or context to the support ticket</li>
              </ul>

              <h3>4. Analyze customer feedback forms</h3>
              <ul>
                <li>Integrate Chatsa with form tools like Typeform or Google Forms</li>
                <li>Chatsa can analyze the feedback for intent, tone, and sentiment</li>
                <li>Generate summaries or insights from the feedback</li>
                <li>Send the analysis to your support team via email, Slack, or a spreadsheet</li>
              </ul>

              <h2>Step 2: Set Up Chatsa to Collect Leads</h2>
              <ol>
                <li>
                  <p>Sign in to your Chatsa account and head to your account dashboard.</p>
                </li>
                <li>
                  <p>Click on the chatbot you want to set up lead collection for.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>
                  <p>Click on the Settings tab at the top of the page, and then Leads on the left sidebar.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>
                  <p>Toggle on the switch beside each lead form field.</p>
                </li>
                <li>
                  <p>Click Save on the bottom right corner of the page to apply the changes.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
              </ol>

              <h2>Step 3: Connect Chatsa to Zapier</h2>
              <p>This step assumes that you have an active Zapier account. We&apos;ll set up Zapier to receive leads from your Chatsa chatbot and add them to a Google Docs file.</p>

              <h3>Step 1: Set Up a Trigger</h3>
              <ol>
                <li>
                  <p>Sign in to your Zapier account.</p>
                </li>
                <li>
                  <p>Click on Create and then Zaps on the top left corner of the Zapier app homepage.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>
                  <p>On the Zap editor click on Trigger.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>
                  <p>Search for Chatsa and select it.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>
                  <p>Select &quot;Form Submission&quot; as the Event and click Continue.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>
                  <p>Click Sign in to authenticate your Chatsa account.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
              </ol>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                <p className="text-yellow-700">
                  <strong>Note:</strong> To get your API keys, head to your account dashboard and click on the Settings tab at the top of the page. Click on API keys on the left sidebar and then copy out your API keys if you have one or click on Create API Key to create a new one.
                </p>
                <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    [Image Placeholder]
                  </div>
                </div>
              </div>

              <h3>Step 2: Set up an Action to Automate</h3>
              <ol>
                <li>
                  <p>Search for Google Docs in the apps list and select it.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>
                  <p>Select &quot;Append Text to Document&quot; as the Event and click Continue.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>
                  <p>Sign into your Google account and select the target document.</p>
                </li>
                <li>
                  <p>Configure the text format and click Continue.</p>
                  <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      [Image Placeholder]
                    </div>
                  </div>
                </li>
                <li>
                  <p>Test the setup and click Publish to go live.</p>
                </li>
              </ol>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 my-8">
                <p className="text-green-700">
                  With that, any time any lead is captured by your Chatsa chatbot on your website, it will automatically be added to your target Google docs file.
                </p>
              </div>
            </div>

            {/* Connect Button */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Connect to Zapier</h2>
              <p className="text-gray-600 mb-6">Link your Zapier account to start automating your Chatsa workflows</p>
              <button 
                onClick={() => window.open('https://zapier.com/apps/chatsa/integrations', '_blank')}
                className="inline-flex items-center gap-2 bg-[#FF4A00] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#FF4A00]/90 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm4.293-14.707L11 12.586V6a1 1 0 10-2 0v7c0 .266.105.52.293.707l6 6a.997.997 0 001.414 0 .999.999 0 000-1.414l-5.293-5.293 5.293-5.293a.999.999 0 10-1.414-1.414z"/>
                </svg>
                Connect to Zapier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 