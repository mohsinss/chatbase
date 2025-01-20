"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ButtonSignin from "./ButtonSignin";
import Image from "next/image";
import Announcement from "./Announcement";
const links = [
  {
    href: "/affiliates",
    label: "Affiliates",
    external: false,
  },
  {
    href: "/pricing",
    label: "Pricing",
  },
  {
    href: "/resources",
    label: "Resources",
    hasDropdown: true,
  },
];

const resourcesDropdown = [
  {
    title: "Guide",
    description: "Find out everything on how to use chatbase, and unlock its full potential.",
    href: "/guide",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: "Blog",
    description: "Learn more about chatbase by reading our latest articles.",
    href: "/blog",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Docs",
    description: "Explore our API and learn how to integrate chatbase with your app.",
    href: "/docs",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: "Changelog",
    description: "Stay up to date with the latest updates and features.",
    href: "/changelog",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showResources, setShowResources] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-[32px] w-full bg-white z-40 transition-all duration-200 ${
      isScrolled ? 'border-b border-gray-100 shadow-sm' : ''
    }`}>
      {/* <Announcement /> */}
      <nav className="max-w-7xl mx-auto flex items-center justify-between h-16 px-8">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <Image 
            src="/icon.png" 
            alt="ChatSA Logo" 
            width={32} 
            height={32}
          />
          ChatSA
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            link.hasDropdown ? (
              <div key={link.href} className="relative">
                <button
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                  onClick={() => setShowResources(!showResources)}
                >
                  {link.label}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showResources && (
                  <div className="absolute top-full left-0 w-[480px] mt-2 bg-white rounded-lg shadow-lg border border-gray-100 p-6">
                    <div className="grid grid-cols-1 gap-4">
                      {resourcesDropdown.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-shrink-0 text-gray-600">
                            {item.icon}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{item.title}</div>
                            <div className="text-sm text-gray-500">{item.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-gray-900"
              >
                {link.label}
              </Link>
            )
          ))}
        </div>

        {/* Dashboard Button */}
        <Link 
          href="/dashboard" 
          className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          Dashboard
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
        </Link>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden px-4 py-2 bg-white border-t border-gray-200">
          {links.map((link) => 
            link.hasDropdown ? (
              <div key={link.href}>
                {resourcesDropdown.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 py-2 text-gray-600 hover:text-gray-900"
                  >
                    <div className="w-5 h-5">{item.icon}</div>
                    {item.title}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-600 hover:text-gray-900"
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            href="/dashboard"
            className="block py-2 text-gray-600 hover:text-gray-900"
          >
            Dashboard
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
