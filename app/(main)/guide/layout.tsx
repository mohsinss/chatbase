"use client";

import { ReactNode, useState } from 'react';
import { IconChevronRight, IconMenu2 } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import SearchResults from './components/SearchResults';

const sidebarItems = [
    {
        title: "Reference",
        items: [
            {
                name: "Getting started",
                href: "/guide/getting-started",
                subItems: [
                    { name: 'Chatbot settings', href: '/guide/getting-started' },
                    { name: 'Response quality', href: '/guide/getting-started/response-quality' },
                    { name: 'Custom Domains', href: '/guide/getting-started/custom-domains' },
                    { name: 'Create and Manage Teams', href: '/guide/getting-started/teams' },
                ]
            },
            {
                name: "Integrations",
                href: "/guide/integrations",
                subItems: [
                    { name: "Whatsapp", href: "/guide/integrations/whatsapp" },
                    { name: "Messenger", href: "/guide/integrations/messenger" },
                    { name: "Instagram", href: "/guide/integrations/instagram" },
                    { name: "Cal.com", href: "/guide/integrations/calcom" },
                    { name: "Zapier", href: "/guide/integrations/zapier" },
                    { name: "Slack", href: "/guide/integrations/slack" },
                    { name: "Wix", href: "/guide/integrations/wix" },
                    { name: "Framer", href: "/guide/integrations/framer" },
                    { name: "Bubble", href: "/guide/integrations/bubble" },
                    { name: "WordPress", href: "/guide/integrations/wordpress" },
                    { name: "Weebly", href: "/guide/integrations/weebly" },
                    { name: "Webflow", href: "/guide/integrations/webflow" },
                    { name: "Shopify", href: "/guide/integrations/shopify" },
                ],
            },
        ],
    },
];

export default function Layout({ children }: { children: ReactNode }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setShowSearchResults(true);
    };

    const handleCloseSearch = () => {
        setShowSearchResults(false);
    };

    return (
        <div className="h-screen">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex gap-12 pt-16 h-screen relative">
                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md"
                    >
                        <IconMenu2 className="w-6 h-6" />
                    </button>

                    {/* Sidebar */}
                    <div className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform duration-200 ease-in-out lg:transform-none lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 shadow-lg lg:shadow-none`}>
                        <div className="h-full overflow-y-auto p-4">
                            {/* Search */}
                            <div className="mb-8">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        onFocus={() => setShowSearchResults(true)}
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
                            {sidebarItems.map((category) => (
                                <div key={category.title} className="mb-8">
                                    <h2 className="text-lg font-semibold mb-4">{category.title}</h2>
                                    <ul className="space-y-2">
                                        {category.items.map((item) => (
                                            <li key={item.name}>
                                                <div className='flex gap-1 items-center'>
                                                    <IconChevronRight
                                                        onClick={() => { setExpandedSections((prev) => ({ ...prev, [item.name]: !prev[item.name] })) }}
                                                        className={`w-4 h-4 cursor-pointer transition-transform ${expandedSections[item.name] ? 'rotate-90' : ''}`} />
                                                    <Link
                                                        href={item.href}
                                                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 py-1 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                                                        onClick={() => setIsSidebarOpen(false)}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </div>
                                                {expandedSections[item.name] && item.subItems && (
                                                    <ul className="ml-6 mt-2 space-y-2">
                                                        {item.subItems.map((subItem) => (
                                                            <li key={subItem.name}>
                                                                <Link
                                                                    href={subItem.href}
                                                                    className={`block py-1 px-3 rounded-lg transition-colors ${subItem.href === '/guide/integrations/framer'
                                                                        ? 'text-gray-900 bg-gray-50'
                                                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                                        }`}
                                                                    onClick={() => setIsSidebarOpen(false)}
                                                                >
                                                                    {subItem.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Overlay for mobile */}
                    {isSidebarOpen && (
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}

                    <div className='overflow-y-auto flex-1 pt-12 lg:pt-0'>
                        {children}
                    </div>
                </div>
            </div>

            {/* Search Results */}
            {showSearchResults && (
                <SearchResults 
                    query={searchQuery} 
                    onClose={handleCloseSearch}
                />
            )}
        </div>
    );
}