"use client";

import Link from "next/link";
import Image from "next/image";

export default function SlackIntegrationPage() {
  return (
    <div className="flex-1">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 mb-8">
        <Link href="/guide" className="hover:text-gray-900">Guide</Link>
        <span>›</span>
        <Link href="/guide/integrations" className="hover:text-gray-900">Integrations</Link>
        <span>›</span>
        <span className="text-gray-900">Slack</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 relative">
            <Image
              src="/integrations/slack.svg"
              alt="Slack"
              fill
              className="rounded-lg"
            />
          </div>
          <h1 className="text-4xl font-bold">Slack Integration</h1>
        </div>
        <p className="text-xl text-gray-600">Connect your Chatsa chatbot with Slack to enhance team communication and automate responses.</p>
      </div>

      {/* Content */}
      <div className="prose max-w-none mb-12">
        <h2>Overview</h2>
        <p>
          The Slack integration allows your Chatsa chatbot to interact directly within your Slack workspace.
          Team members can interact with the chatbot in channels or through direct messages, getting instant access to your knowledge base.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
          <p>Before you begin, make sure you have admin access to your Slack workspace and your Chatsa chatbot is properly configured.</p>
        </div>

        <h2>Key Features</h2>
        <ul>
          <li>Direct message support with your chatbot</li>
          <li>Channel-based interactions</li>
          <li>Automatic responses to questions</li>
          <li>Custom command triggers</li>
          <li>Rich message formatting</li>
        </ul>

        <h2>Step 1: Connect Your Slack Workspace</h2>
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
            <p>Find and click on the Slack integration card.</p>
          </li>
          <li>
            <p>Click &quot;Add to Slack&quot; to begin the authorization process.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>
          <li>
            <p>Select your Slack workspace and authorize the Chatsa app.</p>
          </li>
        </ol>

        <h2>Step 2: Configure Your Slack Integration</h2>
        <ol>
          <li>
            <p>Choose which channels your chatbot can access.</p>
          </li>
          <li>
            <p>Set up command triggers and keywords.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>
          <li>
            <p>Configure response settings and formatting preferences.</p>
          </li>
        </ol>

        <h2>Step 3: Test Your Integration</h2>
        <ol>
          <li>
            <p>Send a direct message to your chatbot.</p>
          </li>
          <li>
            <p>Try using command triggers in a channel.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>
          <li>
            <p>Verify that responses are formatted correctly.</p>
          </li>
        </ol>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
          <p className="text-yellow-700">
            <strong>Note:</strong> Make sure to inform your team members about the chatbot&apos;s capabilities and how to interact with it effectively.
            Consider creating a channel specifically for chatbot testing and feedback.
          </p>
        </div>

        <h2>Usage Examples</h2>
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <p className="font-semibold">Direct Message:</p>
          <code>@Chatsa What&apos;s our refund policy?</code>

          <p className="font-semibold">Channel Command:</p>
          <code>/ask What are our office hours?</code>

          <p className="font-semibold">Mention in Thread:</p>
          <code>@Chatsa can you help with this customer&apos;s question?</code>
        </div>

        <div className="bg-green-50 border-l-4 border-green-400 p-4 my-8">
          <p className="text-green-700">
            Your Chatsa chatbot is now ready to assist your team in Slack!
            Team members can start asking questions and getting instant answers from your knowledge base.
          </p>
        </div>
      </div>

      {/* Connect Button */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Connect to Slack</h2>
        <p className="text-gray-600 mb-6">Link your Slack workspace to start using Chatsa with Slack</p>
        <button
          onClick={() => window.open("https://slack.com/oauth/v2/authorize", "_blank")}
          className="inline-flex items-center gap-2 bg-[#4A154B] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#611f69] transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 15a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2h2v2zm1 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-5zm2-7a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2v2H9zm0 1a2 2 0 0 1 2 2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5zm7 2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2v-2zm-1 0a2 2 0 0 1-2 2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2a2 2 0 0 1 2 2v7zm-2 7a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-2h2zm0-1a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-5z" />
          </svg>
          Add to Slack
        </button>
      </div>
    </div>
  );
} 