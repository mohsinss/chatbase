
"use client";

import Link from "next/link";
import Image from "next/image";

export default function BubbleIntegrationPage() {
  return (
    <div className="flex-1">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 mb-8">
        <Link href="/guide" className="hover:text-gray-900">Guide</Link>
        <span>›</span>
        <Link href="/guide/integrations" className="hover:text-gray-900">Integrations</Link>
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
    </div>
  );
}
