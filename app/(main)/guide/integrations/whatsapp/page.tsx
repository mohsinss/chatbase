"use client";

import Link from "next/link";
import Image from "next/image";
import ButtonSignin from "@/components/ButtonSignin";

export default function WhatsappIntegrationPage() {
  return (
    <div className="flex-1">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 mb-8">
        <Link href="/guide" className="hover:text-gray-900">Guide</Link>
        <span>›</span>
        <Link href="/guide/integrations" className="hover:text-gray-900">Integrations</Link>
        <span>›</span>
        <span className="text-gray-900">WhatsApp</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 relative">
            <Image
              src="/integrations/whatsapp.svg"
              alt="WhatsApp"
              fill
              className="rounded-lg"
            />
          </div>
          <h1 className="text-4xl font-bold">WhatsApp Integration</h1>
        </div>
        <p className="text-xl text-gray-600">Connect your Chatsa bot with WhatsApp to engage with your customers on their preferred messaging platform.</p>
      </div>

      {/* Content */}
      <div className="prose max-w-none mb-12">
        <p>
          Integrating WhatsApp with Chatsa allows your custom chatbot to communicate directly with customers via WhatsApp, providing a seamless and efficient way to handle inquiries and automate responses. This guide will walk you through the necessary steps to connect your chatbot to a WhatsApp phone number, ensuring smooth and effective customer interactions.
        </p>

        <h2>Before we start</h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-yellow-700">
            The WhatsApp phone number integrated with the chatbot can only be used by the chatbot, and can&apos;t be used on WhatsApp or WhatsApp business. If you already use the phone number with WhatsApp, you must delete your account in the app first.
          </p>
        </div>

        <h3>To delete WhatsApp</h3>
        <ol>
          <li>Navigate to WhatsApp or WhatsApp Business app.</li>
          <li>Navigate to Settings {'->'} Account.</li>
          <li>Select Delete my account. This may take a few minutes, but after that, the number will be available to use.</li>
        </ol>

        <h3>If you previously used WhatsApp through Meta Developer for business</h3>
        <ol>
          <li>Navigate to you Whatsapp Business Account and login.</li>
          <li>Choose the phone number you would like to integrate.</li>
          <li>Navigate to Settings {'->'} Two-step verification and choose turn off two-step verification.</li>
        </ol>

        <h2>Integration Steps</h2>
        <ol className="space-y-8">
          <li>
            <p>Navigate to the Chatbot you would like to integrate with WhatsApp.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 relative max-w-2xl mx-auto">
              <img
                src="/integrations/whatsapp/1.png"
                alt="Navigate to the Chatbot you would like to integrate with WhatsApp"
                className="rounded-lg w-full"
              />
            </div>
          </li>

          <li>
            <p>Navigate to Dashboard {'->'} [Chatbot] {'->'} Connect {'->'} Integrations.</p>
          </li>

          <li>
            <p>Click Connect on the WhatsApp integration card.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 relative max-w-2xl mx-auto">
              <img
                src="/integrations/whatsapp/2.png"
                alt="Click Connect on the WhatsApp integration card"
                className="rounded-lg w-full"
              />
            </div>
          </li>

          <li>
            <p>Log in with your personal Facebook Account.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 relative max-w-2xl mx-auto">
              <img
                src="/integrations/whatsapp/3.png"
                alt="Log in with your personal Facebook Account"
                className="rounded-lg w-full"
              />
            </div>
          </li>

          <li>
            <p>Click Get started</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 relative max-w-2xl mx-auto">
              <img
                src="/integrations/whatsapp/4.png"
                alt="Click Get started"
                className="rounded-lg w-full"
              />
            </div>
          </li>

          <li>
            <p>Choose or create a business profile.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 relative max-w-2xl mx-auto">
              <img
                src="/integrations/whatsapp/5.png"
                alt="Choose or create a business profile"
                className="rounded-lg w-full"
              />
            </div>
          </li>

          <li>
            <p>Create a WhatsApp business profile or select an existing one.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 relative max-w-2xl mx-auto">
              <img
                src="/integrations/whatsapp/6.png"
                alt="Create a WhatsApp business profile or select an existing one"
                className="rounded-lg w-full"
              />
            </div>
          </li>

          <li>
            <p>Fill in the information for the Business profile.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 relative max-w-2xl mx-auto">
              <img
                src="/integrations/whatsapp/7.png"
                alt="Fill in the information for the Business profile"
                className="rounded-lg w-full"
              />
            </div>
          </li>

          <li>
            <p>Add a phone number, it is recommended to have only one associate number in this profile.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 relative max-w-2xl mx-auto">
              <img
                src="/integrations/whatsapp/8.png"
                alt="Add a phone number"
                className="rounded-lg w-full"
              />
            </div>
          </li>

          <li>
            <p>Click Continue.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 relative max-w-2xl mx-auto">
              <img
                src="/integrations/whatsapp/10.png"
                alt="Click Continue"
                className="rounded-lg w-full"
              />
            </div>
          </li>

          <li>
            <p>Wait a few seconds for information verification.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 relative max-w-2xl mx-auto">
              <img
                src="/integrations/whatsapp/11.png"
                alt="Wait for information verification"
                className="rounded-lg w-full"
              />
            </div>
          </li>

          <li>
            <p>Click on Finish.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 relative max-w-2xl mx-auto">
              <img
                src="/integrations/whatsapp/12.png"
                alt="Click on Finish"
                className="rounded-lg w-full"
              />
            </div>
          </li>
        </ol>

        <h2>Optional Settings</h2>
        <ol className="space-y-8">
          <li>
            <p>You can modify your WhatsApp bot styling or delete your phone number by clicking the &quot;I&quot; icon next to WhatsApp or by navigating to the manage WhatsApp page.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 relative max-w-2xl mx-auto">
              <img
                src="/integrations/whatsapp/13.png"
                alt="Modify WhatsApp bot styling"
                className="rounded-lg w-full"
              />
            </div>
          </li>

          <li>
            <p>Navigate to Profile and update your WhatsApp settings then click the Save button.</p>
            <div className="bg-gray-100 rounded-lg p-4 my-4 relative max-w-2xl mx-auto">
              <img
                src="/integrations/whatsapp/15.png"
                alt="Update WhatsApp settings"
                className="rounded-lg w-full"
              />
            </div>
          </li>
        </ol>

        <div className="bg-green-50 border-l-4 border-green-400 p-4 my-8">
          <p className="text-green-700">
            Now that your integration is active you can send 1000 free messages monthly. Make sure to add a payment method on your Meta billing settings to be able to send more than 1000 messages per month.
          </p>
        </div>

        <p className="text-lg font-semibold text-green-600">
          Congratulations! You finished integrating your Chatsa chatbot to WhatsApp, your chatbot is now ready to reply to all the messages received through your WhatsApp!
        </p>
      </div>

      {/* Connect Button */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Connect to WhatsApp</h2>
        <p className="text-gray-600 mb-6">Link your WhatsApp Business account to start using Chatsa with WhatsApp</p>
        <ButtonSignin
          text="Connect to WhatsApp"
          extraStyle="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        />
      </div>
    </div>
  );
} 