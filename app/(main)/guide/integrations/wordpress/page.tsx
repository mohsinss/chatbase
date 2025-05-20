"use client";

import Link from "next/link";
import Image from "next/image";

export default function WordPressIntegrationPage() {
  return (
    <div className="flex-1">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 mb-8">
        <Link href="/guide" className="hover:text-gray-900">Guide</Link>
        <span>›</span>
        <Link href="/guide/integrations" className="hover:text-gray-900">Integrations</Link>
        <span>›</span>
        <span className="text-gray-900">WordPress</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 relative">
            <Image
              src="/integrations/wordpress.svg"
              alt="WordPress"
              fill
              className="rounded-lg"
            />
          </div>
          <h1 className="text-4xl font-bold">WordPress Integration</h1>
        </div>
        <p className="text-xl text-gray-600">Add your Chatsa chatbot to your WordPress website using our plugin.</p>
      </div>

      {/* Content */}
      <div className="prose max-w-none mb-12">
        <h2>Step 1: Install the Chatsa Plugin</h2>
        <ol className="space-y-8">
          <li>
            <p>Log into your WordPress admin dashboard.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>Navigate to Plugins {'->'} Add New and search for &quot;Chatsa&quot;</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>Click Install Now next to the &quot;Chatsa for WordPress&quot; plugin</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>After installation, click &quot;Activate&quot; to enable the plugin</p>
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
            Congratulations! Your Chatsa chatbot is now live on your WordPress website.
            Visitors can now interact with your chatbot and get instant responses to their questions.
          </p>
        </div>
      </div>

      {/* Connect Button */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Get WordPress Plugin</h2>
        <p className="text-gray-600 mb-6">Download our official WordPress plugin to add your Chatsa chatbot to your website</p>
        <button
          onClick={() => window.open('https://wordpress.org/plugins/', '_blank')}
          className="inline-flex items-center gap-2 bg-[#21759B] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1b5f7d] transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Plugin
        </button>
      </div>
    </div>
  );
} 