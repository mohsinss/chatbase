
"use client";

import Link from "next/link";
import Image from "next/image";

export default function InstagramIntegrationPage() {
  return (
    <div className="flex-1">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 mb-8">
        <Link href="/guide" className="hover:text-gray-900">Guide</Link>
        <span>›</span>
        <Link href="/guide/integrations" className="hover:text-gray-900">Integrations</Link>
        <span>›</span>
        <span className="text-gray-900">Instagram</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 relative">
            <Image
              src="/integrations/instagram.svg"
              alt="Instagram"
              fill
              className="rounded-lg"
            />
          </div>
          <h1 className="text-4xl font-bold">Instagram Integration</h1>
        </div>
        <p className="text-xl text-gray-600">Connect your Chatsa chatbot with Instagram to engage with your customers through direct messages.</p>
      </div>

      {/* Content */}
      <div className="prose max-w-none mb-12">
        <p>
          Integrating Instagram with Chatsa allows your custom chatbot to communicate directly with customers via your Instagram pages. 
          This integration also enables you to take over the conversation whenever you want and communicate with users yourself through 
          Instagram's direct messaging. It provides a seamless and efficient way to handle inquiries and automate responses, while 
          giving you the freedom to interact with your customers whenever you choose.
        </p>

        <h2>Prerequisites</h2>
        <p>You will need the following:</p>
        <ul>
          <li>An Instagram Professional Account</li>
          <li>A Facebook Page connected to that account</li>
        </ul>

        <h2>Connecting Instagram</h2>
        <ol className="space-y-8">
          <li>
            <p>First navigate to the instagram page settings for you Professional Account, then under 'How others can interact with you', 
            click on Messages and story replies {'->'} Message controls {'->'} Allow Access to Messages</p>
          </li>

          <li>
            <p>Navigate to your dashboard, and pick a chatbot.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>Navigate to Connect {'->'} Integrations.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>Click on Connect then I understand.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>Click on Continue.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>Login on Get Started. This will allow you to login to instagram and turn your account to a Professional Account if it is not already.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>Choose the businesses affiliated with you Instagram page. If you have no business select Opt in all current future businesses.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>Choose the Facebook Page(s) linked to your Instagram.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>Select the Instagram page(s) you want to integrate.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>

          <li>
            <p>Click save.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>
        </ol>

        <h2>The Human Takeover Feature</h2>
        <p>
          The human takeover feature allows you to takeover the chat whenever you would like and chat with users yourself! 
          It works on a conversation level meaning you would be able to choose a specific conversation from the dashboard and 
          stop the chatbot from answering that conversation.
        </p>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
          <p className="text-yellow-700">
            <strong>Note:</strong> Some conversations may not have the human takeover icon, that happens when you delete a page 
            from the integrations dashboard. You would still have access to your conversations in the chat logs, but since the 
            integration was deleted you will not have access to the takeover feature since this page's integration was deleted. 
            This will also happen if you delete a page and add it again, so be careful when deleting pages from the Instagram dashboard.
          </p>
        </div>

        <h3>To enable human takeover for a specific conversation:</h3>
        <ol>
          <li>Navigate to Activity either through the Navbar or through the messenger dashboard.</li>
          <li>
            <p>In the Chat logs section make sure to show only Instagram chats.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>
          <li>
            <p>Click the human takeover icon.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                [Image Placeholder]
              </div>
            </div>
          </li>
          <li>You can click the icon again to restore access to the chatbot.</li>
        </ol>

        <h2>Connecting different chatbots to different pages</h2>
        <p>
          With the Chatsa Instagram integration, you can connect different chatbots to various pages. This capability allows 
          multiple chatbots to manage different Instagram pages, providing specialized interactions for each page.
        </p>

        <h3>Steps to adding different chatbots to different pages:</h3>
        <ol>
          <li>
            After connecting the first page(s) you should now have access to the manage Instagram pages integrations page. 
            Navigate to the chatbot you want to connect then Activity {'->'} Integrations {'->'} manage.
          </li>
          <li>
            Click the Manage button to navigate to the dashboard. If you want to connect another chatbot to an already 
            connected page, click, then delete the page.
          </li>
          <li>Navigate to the chatbot you want to integrate to the page deleted, then reinitialize the integrations steps.</li>
        </ol>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
          <p className="text-yellow-700">
            <strong>Note:</strong> If you deleted a chatbot it will be selected in the integration steps, don't deselect any 
            chatbot you want to stay connected to the instagram or facebook integrations on Chatsa as deselecting the chatbot 
            will result in disabling that chatbot for Chatsa.
          </p>
        </div>

        <div className="bg-green-50 border-l-4 border-green-400 p-4 my-8">
          <p className="text-green-700">
            Now this brings an end to the Instagram integration guide, for any further questions please do not hesitate to contact us.
          </p>
        </div>
      </div>

      {/* Connect Button */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Connect to Instagram</h2>
        <p className="text-gray-600 mb-6">Link your Instagram Professional Account to start using Chatsa with Instagram</p>
        <button 
          onClick={() => window.open('https://www.instagram.com', '_blank')}
          className="inline-flex items-center gap-2 bg-[#E4405F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#d62e50] transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
          </svg>
          Connect to Instagram
        </button>
      </div>
    </div>
  );
}
