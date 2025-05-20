"use client";

import Link from "next/link";
import { useState } from "react";


export default function GuidePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex-1">
      <h1 className="text-4xl font-bold mb-4">Guide</h1>
      <p className="text-gray-600 text-lg mb-8">
        A collection of deep-dive guides to help you make the most of chatbase.
      </p>

      {/* Reference Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Reference</h2>
        <p className="text-gray-600 mb-8">Get to know chatbase</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Getting Started Card */}
          <Link href="/guide/getting-started" className="block">
            <div className="group relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-blue-500 transition-colors">
              <div className="flex items-center gap-6">
                {/* Decorative illustration */}
                <div className="w-24 h-24 flex-shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-full h-full text-blue-500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 3V21M12 3L8 7M12 3L16 7M3 12H21M3 12L7 8M3 12L7 16M21 12L17 8M21 12L17 16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Getting Started</h2>
                  <p className="text-gray-600">Learn the basics and set up your first chatbot</p>
                </div>
                {/* Arrow icon */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                  <svg
                    className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Integrations Card */}
          <Link
            href="/guide/integrations"
            className="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="grid grid-cols-3 gap-2">
                  {/* Integration icons */}
                  {['whatsapp', 'slack', 'google', 'notion', 'chatbase', 'zapier'].map((icon) => (
                    <div
                      key={icon}
                      className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"
                    >
                      {/* Add actual icons here */}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Integrations</h3>
                <svg
                  className="w-5 h-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 