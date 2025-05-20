"use client";

import Link from "next/link";
import Image from "next/image";

export default function WeeblyIntegrationPage() {
  return (
    <div className="flex-1">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 mb-8">
        <Link href="/guide" className="hover:text-gray-900">Guide</Link>
        <span>›</span>
        <Link href="/guide/integrations" className="hover:text-gray-900">Integrations</Link>
        <span>›</span>
        <span className="text-gray-900">Weebly</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 relative">
            <Image
              src="/integrations/weebly.svg"
              alt="Weebly"
              fill
              className="rounded-lg"
            />
          </div>
          <h1 className="text-4xl font-bold">Weebly Integration</h1>
        </div>
        <p className="text-xl text-gray-600">Add your Chatsa chatbot to your Weebly website using our embed code.</p>
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
            <p>Select the chatbot you want to add to your Weebly site.</p>
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

        <h2>Step 2: Add the Embed Code to Your Weebly Site</h2>
        <ol className="space-y-8">
          <li>
            <p>Log into your Weebly account and open your site editor.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>Drag and drop the &quot;Embed Code&quot; element from the left sidebar onto your page.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>Click on the element to edit it and paste your Chatsa embed code.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>Click Save and Publish your site.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>
        </ol>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
          <p className="text-yellow-700">
            <strong>Note:</strong> The chatbot will appear on every page where you add the embed code.
            For site-wide integration, consider adding it to your site&apos;s footer or header section.
          </p>
        </div>

        <h2>Step 3: Test Your Integration</h2>
        <ol>
          <li>
            <p>Preview your Weebly site to ensure the chatbot appears correctly.</p>
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
            Congratulations! Your Chatsa chatbot is now live on your Weebly website.
            Visitors can now interact with your chatbot and get instant responses to their questions.
          </p>
        </div>
      </div>

      {/* Connect Button */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Get Embed Code</h2>
        <p className="text-gray-600 mb-6">Copy the embed code to add your Chatsa chatbot to your Weebly website</p>
        <button
          onClick={() => window.open('https://www.weebly.com', '_blank')}
          className="inline-flex items-center gap-2 bg-[#2990EA] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2175c7] transition-colors"
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