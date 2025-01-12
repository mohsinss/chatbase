"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
  {
    title: "Reference",
    items: [
      {
        name: "Getting started",
        href: "/guide/category/getting-started",
      },
      {
        name: "Integrations",
        href: "/guide/category/integrations",
      },
      // Add more reference items as needed
    ],
  },
  // Add more categories if needed
];

export default function GuidePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 flex gap-8">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Navigation */}
          {categories.map((category) => (
            <div key={category.title} className="mb-8">
              <h2 className="text-lg font-semibold mb-4">{category.title}</h2>
              <ul className="space-y-2">
                {category.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 py-1 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
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
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Main Content */}
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
              <Link
                href="/guide/category/getting-started"
                className="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src="/path-to-dashboard-image.png"
                      alt="Dashboard preview"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Getting started</h3>
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

              {/* Integrations Card */}
              <Link
                href="/guide/category/integrations"
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
      </div>
    </div>
  );
} 