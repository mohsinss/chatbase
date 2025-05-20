
"use client";

import Link from "next/link";
import Image from "next/image";

export default function CalComIntegrationPage() {
  return (
    <div className="flex-1">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 mb-8">
        <Link href="/guide" className="hover:text-gray-900">Guide</Link>
        <span>›</span>
        <Link href="/guide/integrations" className="hover:text-gray-900">Integrations</Link>
        <span>›</span>
        <span className="text-gray-900">Cal.com</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 relative">
            <Image
              src="/integrations/cal-icon.svg"
              alt="Cal.com"
              fill
              className="rounded-lg"
            />
          </div>
          <h1 className="text-4xl font-bold">Cal.com Integration</h1>
        </div>
        <p className="text-xl text-gray-600">Connect your Chatsa chatbot with Cal.com to handle meeting scheduling.</p>
      </div>

      {/* Content */}
      <div className="prose max-w-none mb-12">
        <h2>Step 1: Connect Your Accounts</h2>
        <ol>
          <li>
            <p>Sign in to your Chatsa dashboard and navigate to the Integrations section.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>
          <li>
            <p>Find and click on the Cal.com integration card.</p>
          </li>
          <li>
            <p>Click "Connect" and sign in to your Cal.com account when prompted.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>
        </ol>

        <h2>Step 2: Configure Your Integration</h2>
        <ol>
          <li>
            <p>Select which calendars you want to sync with your chatbot.</p>
          </li>
          <li>
            <p>Configure your booking preferences and availability.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>
          <li>
            <p>Customize the booking flow and confirmation messages.</p>
          </li>
        </ol>

        <h2>Step 3: Test Your Integration</h2>
        <ol>
          <li>
            <p>Open your chatbot's preview mode.</p>
          </li>
          <li>
            <p>Try booking a test appointment to ensure everything works correctly.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>
        </ol>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
          <p className="text-yellow-700">
            <strong>Note:</strong> Make sure your Cal.com availability settings are up to date to ensure accurate scheduling.
          </p>
        </div>

        <div className="bg-green-50 border-l-4 border-green-400 p-4 my-8">
          <p className="text-green-700">
            Your Chatsa chatbot is now connected to Cal.com! Visitors can schedule meetings through your chatbot.
          </p>
        </div>
      </div>

      {/* Connect Button */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Connect to Cal.com</h2>
        <p className="text-gray-600 mb-6">Link your Cal.com account to enable scheduling through your chatbot</p>
        <button 
          onClick={() => window.open('https://cal.com', '_blank')}
          className="inline-flex items-center gap-2 bg-[#111827] text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Connect to Cal.com
        </button>
      </div>
    </div>
  );
}
