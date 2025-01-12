"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ButtonSignin from "./ButtonSignin";

const links = [
  {
    href: "/affiliates",
    label: "Affiliates",
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

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
      <nav className="max-w-7xl mx-auto flex items-center justify-between h-16 px-8">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          ChatSA
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-gray-900"
            >
              <span className="flex items-center gap-1">
                {link.label}
                {link.hasDropdown && (
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
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                )}
              </span>
            </Link>
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
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-gray-600 hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
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
