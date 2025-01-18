'use client'

import React from 'react';
import Link from 'next/link';
import Sidebar from '@/components/guide/Sidebar';

const ResponseQualityPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Breadcrumb */}
      <div className="bg-white border-b fixed top-0 w-full z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/guide" className="text-gray-600">Guide</Link>
            <span className="text-gray-400">/</span>
            <Link href="/guide/getting-started" className="text-gray-600">Getting started</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">Response quality</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 flex pt-16">
        <Sidebar />
        {/* Main Content */}
        <main className="flex-1 py-8 ml-64">
          <section className="prose max-w-none">
            <h1 className="text-4xl font-bold mb-8">Response quality</h1>
            
            <p className="text-lg text-gray-600 mb-12">
              With Chatsa, you have multiple ways to mitigate this issue and fine-tune your chatbot&apos;s responses. Here&apos;s how you can optimize the responses of your chatbot.
            </p>

            {/* Refine Instructions Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold">Refine the Chatbot&apos;s Instructions</h2>
              <p>
                The instructions shapes your chatbot&apos;s behavior and responses. To ensure your bot only answers questions about the given document, specify this in the instructions. For instance, you can state, &ldquo;You will only provide answers based on the information in [document name].&rdquo; The default is the following:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 my-4">
                <p className="text-gray-700">
                  I want you to act as a support agent. Your name is &ldquo;AI Assistant&rdquo;. You will provide me with answers from the given info. If the answer is not included, say exactly &ldquo;Hmm, I am not sure.&rdquo; and stop after that. Refuse to answer any question not about the info. Never break character.
                </p>
              </div>
              <p>
                You can find more information about the instructions in the previous article, <Link href="/guide/category/getting-started/chatbot-settings" className="text-blue-600 hover:text-blue-800">Chatbot Settings</Link>
              </p>
            </section>

            {/* Data Sources Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold">Ensure Readability of Uploaded Data Sources</h2>
              <p>
                The quality of your chatbot&apos;s responses largely depends on the quality of the data sources you provide. Chatsa uses readable text to generate responses, so ensure that the websites or PDFs you upload contain readable text. Note that Chatsa can&apos;t process images, videos, or non-textual elements in documents. Some websites are not scraper friendly, so if you see your chatbot is unable to answer questions on your website, this might be the case. You can work-around this by copy and pasting information as text into the data sources, or uploading it as a PDF instead.
              </p>
            </section>

            {/* Revise Feature Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold">Utilize the &ldquo;Revise&rdquo; Feature and Q&A Data Type</h2>
              <p>
                The &ldquo;revise&rdquo; feature is accessible from the dashboard in your conversation history. It is a tool for tweaking responses.
              </p>
              <p className="mt-4">
                If you&apos;re not satisfied with how your chatbot answered a particular query, you can use this feature to alter the response to fix it for the future. Additionally, using the Q&A data type can help your chatbot generate better answers by referring to pre-set questions and answers. The responses you revise will appear in the Q&A tab under &ldquo;Manage&rdquo;
              </p>
            </section>

            {/* GPT-4o Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold">Leverage the Power of GPT-4o</h2>
              <p>
                If you want your chatbot to generate more nuanced and sophisticated responses, consider using the GPT-4o model. It is the most sophisticated GPT model available, producing more accurate and contextually aware responses. You can change what language model you use.
              </p>
            </section>

            {/* Document Mapping Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold">Create a Document Mapping Website URLs to Page Names</h2>
              <p>
                If you notice your bot produces fake URLs that lead to 404 errors, try to make a PDF document that maps all of the correct URLs with the page names. This can be very helpful if your chatbot operates on a website with multiple pages. Having a document that maps URLs to page names can help your chatbot better understand user queries related to different pages. Here is an example of a mapping inputted as text in the data sources:
              </p>
              <p className="mt-4">
                Additionally, you can add these links in Q&A format, and follow the suggestions previously mentioned.
              </p>
            </section>

            {/* Next Steps Section */}
            <section className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold">Next Steps</h2>
              <p>
                By implementing these strategies, you can significantly enhance your Chatsa chatbot&apos;s ability to provide useful responses, leading to more successful interactions.
              </p>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ResponseQualityPage; 