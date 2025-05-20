"use client";

import Link from "next/link";
import Image from "next/image";

export default function ShopifyIntegrationPage() {
  return (
    <div className="flex-1">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 mb-8">
        <Link href="/guide" className="hover:text-gray-900">Guide</Link>
        <span>›</span>
        <Link href="/guide/integrations" className="hover:text-gray-900">Integrations</Link>
        <span>›</span>
        <span className="text-gray-900">Shopify</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 relative">
            <Image
              src="/integrations/shopify.svg"
              alt="Shopify"
              fill
              className="rounded-lg"
            />
          </div>
          <h1 className="text-4xl font-bold">Shopify Integration</h1>
        </div>
        <p className="text-xl text-gray-600">Add your Chatsa chatbot to your Shopify store to provide instant customer support.</p>
      </div>

      {/* Content */}
      <div className="prose max-w-none mb-12">
        <h2>Step 1: Get Your Chatbot Embed Code</h2>
        <ol className="space-y-8">
          <li>
            <p>Head over to your Dashboard page and click on the bot you want to embed on your Shopify website.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>On the playground page, click on Connect at the top of the page.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>Click on Copy Iframe to copy the chatbot embed code.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>
        </ol>

        <h2>Step 2: Add the Embed Code to Your Shopify Store</h2>
        <ol className="space-y-8">
          <li>
            <p>Log into your Shopify account and head to your Shopify admin page.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>On the left sidebar of the admin page, click on Online Store and then click on Pages.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>Click on the page where you want to embed the chatbot.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>Click the source code icon on the top right corner of the editor.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>Paste the embed code and click Save.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>Click the source code icon again to return to the visual editor.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>
        </ol>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
          <p className="text-yellow-700">
            <strong>Note:</strong> You can customize the appearance and colors of your bot on your Chatsa dashboard.
            To do this, go to your dashboard, choose a bot, click the Settings tab on the top of the page, and then click Chat Interface
            on the left sidebar to reveal the chatbot customization options.
          </p>
        </div>

        <div className="bg-green-50 border-l-4 border-green-400 p-4 my-8">
          <p className="text-green-700">
            Congratulations! Your Chatsa chatbot is now live on your Shopify store.
            You can view your page to see how the chatbot appears on your live site.
          </p>
        </div>
      </div>

      {/* Connect Button */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Get Embed Code</h2>
        <p className="text-gray-600 mb-6">Copy the embed code to add your Chatsa chatbot to your Shopify store</p>
        <button
          onClick={() => window.open('https://shopify.com', '_blank')}
          className="inline-flex items-center gap-2 bg-[#96BF47] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#7da039] transition-colors"
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