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
        href: "/guide/integrations",
        isExpanded: true,
        subItems: [
          { name: "Whatsapp", href: "/guide/integrations/whatsapp" },
          { name: "Zapier", href: "/guide/integrations/zapier" },
          { name: "Wix", href: "/guide/integrations/wix" },
          { name: "Framer", href: "/guide/integrations/framer" },
          { name: "Cal.com", href: "/guide/integrations/calcom" },
          { name: "Slack", href: "/guide/integrations/slack" },
          { name: "Bubble", href: "/guide/integrations/bubble" },
          { name: "WordPress", href: "/guide/integrations/wordpress" },
          { name: "Instagram", href: "/guide/integrations/instagram" },
          { name: "Messenger", href: "/guide/integrations/messenger" },
          { name: "Weebly", href: "/guide/integrations/weebly" },
          { name: "Webflow", href: "/guide/integrations/webflow" },
          { name: "Shopify", href: "/guide/integrations/shopify" },
        ],
      },
    ],
  },
];

export default function FramerIntegrationPage() {
  return (
    <div className="flex-1">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 mb-8">
        <Link href="/guide" className="hover:text-gray-900">Guide</Link>
        <span>›</span>
        <Link href="/guide/integrations" className="hover:text-gray-900">Integrations</Link>
        <span>›</span>
        <span className="text-gray-900">Framer</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 relative">
            <Image
              src="/integrations/framer.svg"
              alt="Framer"
              fill
              className="rounded-lg"
            />
          </div>
          <h1 className="text-4xl font-bold">Framer Integration</h1>
        </div>
        <p className="text-xl text-gray-600">Add your Chatsa chatbot to your Framer website using our embed code.</p>
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
            <p>Select the chatbot you want to add to your Framer site.</p>
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

        <h2>Step 2: Add the Embed Code to Your Framer Site</h2>
        <ol className="space-y-8">
          <li>
            <p>Sign in to your Framer website and head to your project dashboard.</p>
          </li>

          <li>
            <p>Click on the website project you wish to embed your Chatsa chatbot.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>After clicking through to open the website project, locate the page you wish to embed your chatbot on the left side of the editor and click the three-dot icon next to the name of the page.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>Click &quot;Settings&quot; to open the settings for that page.</p>
          </li>

          <li>
            <p>On the Settings page, scroll down to find the section labeled &quot;Custom Code&quot;.</p>
          </li>

          <li>
            <p>Right under the Custom Code section, paste your Chatsa chatbot embed code in the first box labeled &quot;Start of &lt;head&gt; tag&quot; and click Save on the top right corner of the panel.</p>
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
            <p>Preview your Framer site to ensure the chatbot appears correctly.</p>
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
            Congratulations! Your Chatsa chatbot is now live on your Framer website.
            Visitors can now interact with your chatbot and get instant responses to their questions.
          </p>
        </div>
      </div>

      {/* Connect Button */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Get Embed Code</h2>
        <p className="text-gray-600 mb-6">Copy the embed code to add your Chatsa chatbot to your Framer website</p>
        <button
          onClick={() => window.open('https://framer.com', '_blank')}
          className="inline-flex items-center gap-2 bg-[#0055FF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0044cc] transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Get Embed Code
        </button>
      </div>
    </div>
  );
} 