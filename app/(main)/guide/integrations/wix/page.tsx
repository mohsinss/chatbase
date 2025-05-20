"use client";

import Link from "next/link";
import Image from "next/image";

export default function WixIntegrationPage() {
  return (
    <div className="flex-1">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 mb-8">
        <Link href="/guide" className="hover:text-gray-900">Guide</Link>
        <span>›</span>
        <Link href="/guide/integrations" className="hover:text-gray-900">Integrations</Link>
        <span>›</span>
        <span className="text-gray-900">Wix</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 relative">
            <Image
              src="/integrations/wix-icon.svg"
              alt="Wix"
              fill
              className="rounded-lg"
            />
          </div>
          <h1 className="text-4xl font-bold">Wix Integration</h1>
        </div>
        <p className="text-xl text-gray-600">Add your Chatsa chatbot to your Wix website in just a few simple steps.</p>
      </div>

      {/* Content */}
      <div className="prose max-w-none mb-12">
        <h2>Step 1: Set Up Your Chatsa Chatbot</h2>
        <p>
          To begin the integration process, you&apos;ll need to sign into your Chatsa account. If you haven&apos;t created an account yet, sign up for a free account. Once logged in, proceed to set up your chatbot by uploading relevant data sources. These data sources can include files, text snippets, websites, or question-and-answer pairs, which will form the knowledge base for your chatbot.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
          <p>If you need help with setting up a functional Chatsa chatbot, here is a step-by-step guide for setting up and deploying your Chatsa chatbot.</p>
        </div>

        <h2>Step 2: Generate and Copy the Chatsa Chatbot Embed Code</h2>
        <ol>
          <li>
            <p>After configuring your chatbot, navigate to your dashboard page and select the specific bot you wish to embed. Clicking on the chosen bot should take you to the bot&apos;s preview page.</p>
          </li>
          <li>
            <p>On the chatbot preview page, locate and click on the Connect tab.</p>
          </li>
          <li>
            <p>Next, a new page will appear displaying the HTML code snippet for embedding your chatbot. Copy this code by clicking the &quot;Copy Script&quot; button.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>
        </ol>

        <h2>Step 3: Sign Into Your Wix Account and Embed Your Chatbot</h2>
        <ol>
          <li>
            <p>Sign in to your Wix website and head to your dashboard.</p>
          </li>
          <li>
            <p>On your dashboard, locate and click on Design Site in the top right corner of the page.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>
          <li>
            <p>Your site should load your site on the Wix website editor.</p>
          </li>
          <li>
            <p>Scroll down to any section of the website you wish to add the Chatsa chatbot.</p>
          </li>
          <li>
            <p>Click the big plus (Add Elements) button on the left sidebar of the Wix site editor.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>
          <li>
            <p>Scroll down to locate and click on Embed Code, followed by Popular Embeds and then Custom Code.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>
          <li>
            <p>The custom code widget should pop up, click + Add Custom Code in the top right</p>
          </li>
          <li>
            <p>Paste the code snippet into the custom code editor.</p>
          </li>
          <li>
            <p>Provide a name for your code.</p>
          </li>
          <li>
            <p>Choose an option under Add Code to Pages.</p>
          </li>
          <li>
            <p>Choose where to place your code under Place Code in</p>
          </li>
          <li>
            <p>Click Apply. Once you&apos;ve applied the changes, preview your website and you should see the floating Chatsa chat icon on your website.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>
        </ol>

        <div className="bg-green-50 border-l-4 border-green-400 p-4 my-8">
          <p className="text-green-700">
            Congratulations, your Chatsa chatbot is now live on your Wix website.
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
          <p className="text-yellow-700">
            <strong>Note:</strong> You can customize the appearance and colors of your bot on your Chatsa dashboard. To do this, go to your dashboard, choose a bot, click the Settings tab on the top of the page, and then click Chat Interface on the left sidebar to reveal the chatbot customization options.
          </p>
        </div>
      </div>

      {/* Connect Button */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Get Embed Code</h2>
        <p className="text-gray-600 mb-6">Copy the embed code to add your Chatsa chatbot to your Wix website</p>
        <button
          onClick={() => window.open('https://www.wix.com', '_blank')}
          className="inline-flex items-center gap-2 bg-[#0C6EFC] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0C6EFC]/90 transition-colors"
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