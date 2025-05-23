'use client'

import React from 'react';
import Link from 'next/link';
import Sidebar from '@/components/guide/Sidebar';

const CustomDomainsPage = () => {
  return (
    <main className="flex-1">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 mb-8">
        <Link href="/guide" className="hover:text-gray-900">Guide</Link>
        <span>›</span>
        <Link href="/guide/getting-started" className="hover:text-gray-900">Getting started</Link>
        <span>›</span>
        <span className="text-gray-900">Custom Domains</span>
      </div>
      
      <section className="prose max-w-none">
        <h1 className="text-4xl font-bold mb-8">Custom Domains</h1>

        {/* What Custom Domain Means Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold">What &ldquo;Custom Domain&rdquo; Means on Chatsa</h2>
          <p className="text-gray-600">
            When we say you can add a custom domain, it means you can host your chatbot on a subdomain that belongs to your company or brand, instead of Chatsa&apos;s default domain. For example, instead of your chatbot appearing on a URL like chatsa.co/yourbot, it could be hosted on yourbot.yourdomain.com. This feature enhances your brand&apos;s professionalism and trustworthiness by keeping everything under your domain.
          </p>

          <div className="mt-6">
            <p className="font-medium">By adding a custom subdomain:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Your chatbot becomes an integrated part of your website.</li>
              <li>Visitors&apos; traffic requests won&apos;t be redirected to an external Chatsa URL.</li>
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
                First, sign in to your Chatsa account using your credentials. If you don&apos;t have an account yet, you can easily create one by following the sign-up process on the website.
              </p>
            </div>

            {/* Step 2 */}
            <div>
              <h3 className="text-xl font-semibold">Navigate to Your Chatbot Settings</h3>
              <p>
                Once you&apos;re logged in, locate the chatbot you want to associate with a custom subdomain. This could be a newly created bot or an existing one.
              </p>
              <p>
                Open the settings tab for that specific chatbot. This is where you customize your bot&apos;s behavior, appearance, and technical configurations.
              </p>
            </div>

            {/* Step 3 */}
            <div>
              <h3 className="text-xl font-semibold">Locate the Domain Customization Option</h3>
              <p>
                In the bottom left corner of the settings tab, look for &ldquo;Custom Domain&rdquo; and click on it.
              </p>
            </div>

            {/* Step 4 */}
            <div>
              <h3 className="text-xl font-semibold">Enter Your Custom Subdomain</h3>
              <p>
                This is where you type in the subdomain (e.g., support.yourbusiness.com) that you own or have control over. Chatsa currently supports subdomains only, so you&apos;ll need to ensure you&apos;re using a subdomain on your website.
              </p>
              <p>
                Adding a custom subdomain gives your chatbot a professional look by branding it with your website&apos;s URL instead of Chatsa&apos;s default domain.
              </p>
            </div>

            {/* Step 5 */}
            <div>
              <h3 className="text-xl font-semibold">Configure DNS Settings</h3>
              <p>
                You might need to configure additional DNS settings like CNAME records. This step will link the custom subdomain to your chatbot, ensuring it works correctly when users visit the URL.
              </p>
              <p>
                Chatsa will provide specific DNS instructions for setting this up, which usually includes pointing the subdomain to Chatsa&apos;s servers.
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
                <li>Once you&apos;ve successfully configured the domain settings and DNS records, save your changes.</li>
                <li>It may take some time for the changes to propagate across the web (usually within a few minutes to 24 hours).</li>
                <li>Test the custom subdomain by entering it into a browser to ensure your chatbot loads correctly.</li>
              </ul>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default CustomDomainsPage; 