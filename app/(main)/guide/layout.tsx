"use client";

import { ReactNode, useState } from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';

const sidebarItems = [
    {
        title: "Reference",
        items: [
            {
                name: "Getting started",
                href: "/guide/getting-started",
                subItems: [
                    { name: 'Chatbot settings', href: '/guide/category/getting-started' },
                    { name: 'Response quality', href: '/guide/category/response-quality' },
                    { name: 'Custom Domains', href: '/guide/category/custom-domains' },
                    { name: 'Create and Manage Teams', href: '/guide/category/teams' },
                ]
            },
            {
                name: "Integrations",
                href: "/guide/integrations",
                subItems: [
                    { name: "Whatsapp", href: "/guide/integrations/whatsapp" },
                    { name: "Zapier", href: "/guide/integrations/zapier" },
                    { name: "Wix", href: "/guide/integrations/wix" },
                    { name: "Framer", href: "/guide/integrations/framer" },
                    { name: "Cal.com", href: "/guide/integrations/calcom" },
                    { name: "Slack", href: "/guide/integrations/slack" },
                    { name: "Bubble", href: "/guide/integrations/bubble" },
                    { name: "WordPress", href: "/guide/integrations/wordpress" },
                    { name: "Instagram", href: "/guide/integrations/instagram" },
                    { name: "Messenger", href: "/guide/integrations/messenger" },
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

    return (
        <div className="min-h-screen pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex gap-12">
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
                                                                className={`block py-1 px-3 rounded-lg transition-colors ${subItem.href === '/guide/category/integrations/framer'
                                                                    ? 'text-gray-900 bg-gray-50'
                                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                                    }`}
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
                    {children}
                </div>
            </div>
        </div>
    );
}
