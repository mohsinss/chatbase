'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarSections = [
  {
    title: 'Getting started',
    isExpanded: true,
    items: [
      { id: 'chatbot-settings', title: 'Chatbot settings', path: '/guide/category/getting-started' },
      { id: 'response-quality', title: 'Response quality', path: '/guide/category/response-quality' },
      { id: 'custom-domains', title: 'Custom Domains', path: '/guide/category/custom-domains' },
      { id: 'teams', title: 'Create and Manage Teams', path: '/guide/category/teams' },
    ]
  },
  {
    title: 'Integrations',
    isExpanded: false,
    items: []
  }
];

const Sidebar = () => {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = React.useState({
    'Getting started': true,
    'Integrations': false
  });

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <aside className="w-64 flex-shrink-0 fixed top-16 h-[calc(100vh-4rem)] overflow-y-auto py-8 pr-8">
      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
      <nav className="space-y-6">
        <div>
          <h2 className="font-medium text-gray-900 mb-4">Reference</h2>
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-2">
              <button 
                onClick={() => toggleSection(section.title)}
                className="flex items-center w-full text-left py-1 group"
              >
                <svg
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    expandedSections[section.title] ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                <span className={`ml-2 ${
                  expandedSections[section.title] 
                    ? 'text-gray-900 font-medium' 
                    : 'text-gray-600 group-hover:text-gray-900'
                }`}>
                  {section.title}
                </span>
              </button>
              {expandedSections[section.title] && (
                <div className="ml-6 mt-1 space-y-2">
                  {section.items.map((item) => (
                    <Link
                      key={item.id}
                      href={item.path}
                      className={`block py-1 text-sm transition-colors ${
                        pathname === item.path
                          ? 'text-blue-600 font-medium'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar; 