'use client'

import React from 'react';
import Link from 'next/link';
import Sidebar from '@/components/guide/Sidebar';

const GettingStartedPage = () => {
  return (
    <main className="flex-1">
    {/* Breadcrumb */}
    <div className="flex items-center gap-2 text-gray-600 mb-8">
      <Link href="/guide" className="hover:text-gray-900">Guide</Link>
      <span>›</span>
      <span className="text-gray-900">Getting started</span>
    </div>
      <section className="prose max-w-none">
        <h1 className="text-4xl font-bold mb-8">Chatbot settings</h1>

        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold">General Settings</h2>
          <p className="text-lg text-gray-600">
            Your chatbot&apos;s settings page is its command center, a place where you can make key adjustments to your bot&apos;s behavior and functionality. Let&apos;s take a look at each setting and what it accomplishes.
          </p>
        </section>

        {/* Open AI Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold">Open AI</h2>

          {/* Instructions */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Instructions</h3>
            <p>The instructions allows you to establish the nature of your chatbot&apos;s interactions and give your bot a personality. You can adjust and modify the instructions to better suit your needs. For example, you can:</p>

            <div className="ml-6 mt-4 space-y-6">
              <div>
                <h4 className="font-semibold">Modify the bot&apos;s personality</h4>
                <p className="text-gray-600">If you&apos;d like your bot to have a casual and friendly tone, you can experiment with a phrase like this in your instructions: &ldquo;You are a friendly and casual AI Assistant.&rdquo;</p>
              </div>

              <div>
                <h4 className="font-semibold">Change how the bot responds to unknown queries</h4>
                <p className="text-gray-600">Instead of saying &ldquo;Hmm, I am not sure.&rdquo;, you might want it to say something like, &ldquo;I&apos;m sorry, I don&apos;t have the information you&apos;re looking for, please contact customer support.&rdquo;</p>
              </div>

              <div>
                <h4 className="font-semibold">Direct its focus on certain topics</h4>
                <p className="text-gray-600">If you want your bot to be a specialist in a certain area, you could add, &ldquo;You are an AI Assistant who specializes in providing information about environmental sustainability.&rdquo;</p>
              </div>

              <div>
                <h4 className="font-semibold">Define its boundaries</h4>
                <p className="text-gray-600">If you want to restrict your bot from providing certain types of information, you could specify, &ldquo;Do not share financial advice or information.&rdquo;</p>
              </div>
            </div>
          </div>

          {/* Model */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Model</h3>
            <p>This setting allows you to choose the AI model you prefer your chatbot to use. By default, it&apos;s set to the GPT-4o model, which uses one credit per message. You can opt to use any of the 10 available AI models:</p>

            <ul className="list-disc ml-6 mt-4 space-y-1">
              <li>GPT-4</li>
              <li>GPT-4 Turbo</li>
              <li>GPT-3.5 Turbo</li>
              <li>GPT-4o</li>
              <li>GPT-4o Mini</li>
              <li>Claude 3 Haiku</li>
              <li>Claude 3 Opus</li>
              <li>Claude 3.5 Sonnet</li>
              <li>Claude 3.7 Sonnet</li>
              <li>Gemini 1.5 Flash</li>
              <li>Gemini 1.5 Pro</li>
            </ul>
          </div>

          {/* Temperature */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Temperature</h3>
            <p>The temperature corresponds with the &ldquo;creativity&rdquo; of the bots responses. This value is set at zero, which instructs your chatbot to choose the most likely output when generating responses, resulting in more consistent and less random answers. You can adjust this number and experiment with the bot to fit your needs.</p>
          </div>
        </section>

        {/* Access Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold">Access</h2>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold">Visibility</h3>
              <p>You can set your chatbot visibility by selecting &apos;private&apos; or &apos;public&apos;. &apos;private&apos; means that only you have access to the bot, and cannot embed it on a site. &apos;public&apos; means that anyone with the link can chat with your chatbot if you send them the sharing link, and it can be embedded on your website.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Domains</h3>
              <p>Specify the website domains where you want to embed your chatbot in the text box here.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Usage Limit Settings</h3>
              <p>Chatsa offers rate limiting to prevent any abuse from users by limiting the number of messages sent from one device on the iframe and chat bubble. By default, it&apos;s set to allow 5 messages every 60 seconds, but you can adjust these values.</p>
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold">Additional Features</h2>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold">Leads</h3>
              <p>You can prompt a user to input their name, email address and/or phone number when opening the chatbot. The customer information is available to view in the dashboard under the &ldquo;Leads&rdquo; tab. You can download them in csv format, along with the conversation history in JSON format.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Chat Interface</h3>
              <p>You can adjust the user interface of the chatbot and improve the user experience by adjusting the &ldquo;initial messages&rdquo;, &ldquo;suggested messages&rdquo;, theme, logo, alignment, and colours.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Notification Settings</h3>
              <p>Your notification settings allow you to receive email updates with chat records from your bot. You can enable notifications by typing an email and clicking &ldquo;Add Email&rdquo;.</p>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold">Next steps</h2>
          <p className="mt-4">
            By understanding each setting and adjusting them according to your business needs, you can fully leverage the potential of your chatbot. Ensuring your bot is optimized and well-configured will provide your users with a smoother, more intuitive, and effective interaction experience.
          </p>
          <p className="mt-4">
            Check out our next article on Optimizing Chatbot Responses for more tips on optimizing user experience with Chatsa.
          </p>
        </section>
      </section>
    </main>
  );
};

export default GettingStartedPage; 