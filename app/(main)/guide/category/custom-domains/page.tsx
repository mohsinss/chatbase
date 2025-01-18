'use client'

import React from 'react';
import Link from 'next/link';
import Sidebar from '@/components/guide/Sidebar';

const CustomDomainsPage = () => {
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
            <span className="text-gray-900">Custom Domains</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 flex pt-16">
        <Sidebar />
        {/* Main Content */}
        <main className="flex-1 py-8 ml-64">
          <section className="prose max-w-none">
            <h1 className="text-4xl font-bold mb-8">Custom Domains</h1>

            {/* What Custom Domain Means Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold">What "Custom Domain" Means on Chatsa</h2>
              <p className="text-gray-600">
                When we say you can add a custom domain, it means you can host your chatbot on a subdomain that belongs to your company or brand, instead of Chatsa's default domain. For example, instead of your chatbot appearing on a URL like chatsa.co/yourbot, it could be hosted on yourbot.yourdomain.com. This feature enhances your brand's professionalism and trustworthiness by keeping everything under your domain.
              </p>

              <div className="mt-6">
                <p className="font-medium">By adding a custom subdomain:</p>
                <ul className="list-disc ml-6 mt-2 space-y-2">
                  <li>Your chatbot becomes an integrated part of your website.</li>
                  <li>Visitors' traffic requests won't be redirected to an external Chatsa URL.</li>
                  <li>It improves the user experience with consistent branding across your website and chatbot interactions.</li>
                </ul>
              </div>
            </section>

            {/* Step by Step Guide Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold">Step-by-Step Guide to Adding a Custom Subdomain to Your Chatbot on Chatsa</h2>
              
              <div className="space-y-8 mt-6">
                {/* Step 1 */}
                <div>
                  <h3 className="text-xl font-semibold">Log Into Your Chatsa Account</h3>
                  <p>
                    First, sign in to your Chatsa account using your credentials. If you don't have an account yet, you can easily create one by following the sign-up process on the website.
                  </p>
                </div>

                {/* Step 2 */}
                <div>
                  <h3 className="text-xl font-semibold">Navigate to Your Chatbot Settings</h3>
                  <p>
                    Once you're logged in, locate the chatbot you want to associate with a custom subdomain. This could be a newly created bot or an existing one.
                  </p>
                  <p>
                    Open the settings tab for that specific chatbot. This is where you customize your bot's behavior, appearance, and technical configurations.
                  </p>
                </div>

                {/* Step 3 */}
                <div>
                  <h3 className="text-xl font-semibold">Locate the Domain Customization Option</h3>
                  <p>
                    In the bottom left corner of the settings tab, look for "Custom Domain" and click on it.
                  </p>
                </div>

                {/* Step 4 */}
                <div>
                  <h3 className="text-xl font-semibold">Enter Your Custom Subdomain</h3>
                  <p>
                    This is where you type in the subdomain (e.g., support.yourbusiness.com) that you own or have control over. Chatsa currently supports subdomains only, so you'll need to ensure you're using a subdomain on your website.
                  </p>
                  <p>
                    Adding a custom subdomain gives your chatbot a professional look by branding it with your website's URL instead of Chatsa's default domain.
                  </p>
                </div>

                {/* Step 5 */}
                <div>
                  <h3 className="text-xl font-semibold">Configure DNS Settings</h3>
                  <p>
                    You might need to configure additional DNS settings like CNAME records. This step will link the custom subdomain to your chatbot, ensuring it works correctly when users visit the URL.
                  </p>
                  <p>
                    Chatsa will provide specific DNS instructions for setting this up, which usually includes pointing the subdomain to Chatsa's servers.
                  </p>
                  <div className="space-y-4 mt-4">
                    <p className="font-medium">Step 1:</p>
                    {/* Add image here */}
                    
                    <p className="font-medium">Step 2:</p>
                    {/* Add image here */}
                    
                    <p className="font-medium">Step 3:</p>
                    {/* Add image here */}
                  </div>
                </div>

                {/* Step 6 */}
                <div>
                  <h3 className="text-xl font-semibold">Save and Test Your Chatbot</h3>
                  <ul className="list-disc ml-6 mt-2 space-y-2">
                    <li>Once you've successfully configured the domain settings and DNS records, save your changes.</li>
                    <li>It may take some time for the changes to propagate across the web (usually within a few minutes to 24 hours).</li>
                    <li>Test the custom subdomain by entering it into a browser to ensure your chatbot loads correctly.</li>
                  </ul>
                </div>
              </div>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CustomDomainsPage; 