"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Announcement from "./Announcement";
import ButtonSignin from "./ButtonSignin";
import { Menu, X } from "lucide-react";
import { useRouter } from 'next/navigation';

// Domain configuration
const ENGLISH_DOMAIN = process.env.NEXT_PUBLIC_ENGLISH_DOMAIN || 'chatsa.co';
const ARABIC_DOMAIN = process.env.NEXT_PUBLIC_ARABIC_DOMAIN || 'chat.sa';
const DEFAULT_DOMAIN = process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || 'chatsa.co';

const links = {
  en: [
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
  ],
  ar: [
    {
      href: "/affiliates",
      label: "الشركاء",
      external: false,
    },
    {
      href: "/pricing",
      label: "الأسعار",
    },
    {
      href: "/resources",
      label: "الموارد",
      hasDropdown: true,
    },
  ]
};

const resourcesDropdown = {
  en: [
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
  ],
  ar: [
    {
      title: "الدليل",
      description: "اكتشف كل شيء عن كيفية استخدام chatbase، واستفد من إمكانياته الكاملة.",
      href: "/guide",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: "المدونة",
      description: "تعرف على المزيد عن chatbase من خلال قراءة أحدث مقالاتنا.",
      href: "/blog",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: "الوثائق",
      description: "استكشف واجهة برمجة التطبيقات الخاصة بنا وتعلم كيفية دمج chatbase مع تطبيقك.",
      href: "/docs",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      title: "سجل التغييرات",
      description: "ابق على اطلاع بأحدث التحديثات والميزات.",
      href: "/changelog",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    const checkDomain = () => {
      const hostname = window.location.hostname;
      const isArabicDomain = hostname === ARABIC_DOMAIN;
      setIsArabic(isArabicDomain);
    };
    
    window.addEventListener('scroll', handleScroll);
    checkDomain();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if we're on the landing page (home page)
    if (window.location.pathname === '/') {
      // Scroll to pricing section on same page
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to dedicated pricing page
      router.push('/pricing');
    }
    
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

  const currentLinks = isArabic ? links.ar : links.en;
  const currentResources = isArabic ? resourcesDropdown.ar : resourcesDropdown.en;

  const brandName = isArabic ? "Chat.SA" : "ChatSa";

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 md:px-8 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Image 
            src="/chatbase-icon.png" 
            alt={brandName} 
            width={40} 
            height={40} 
            className={`${isArabic ? "ml-2" : "mr-2"} cursor-pointer`}
            onClick={() => router.push('/')}
          />
          <span 
            className="text-xl font-bold cursor-pointer" 
            onClick={() => router.push('/')}
          >
            {brandName}
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center flex-1 mx-8">
          <div className={`flex items-center justify-center gap-8 ${isArabic ? "flex-row-reverse" : ""}`}>
            <a href="#features" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap">
              {isArabic ? "المميزات" : "Features"}
            </a>
            <Link href="/guide" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap">
              {isArabic ? "الدليل" : "Guide"}
            </Link>
            <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap">
              {isArabic ? "المدونة" : "Blog"}
            </Link>
            <a href="#pricing" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap" onClick={handlePricingClick}>
              {isArabic ? "الأسعار" : "Pricing"}
            </a>
            <Link href="/chatbot-templates" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap">
              {isArabic ? "القوالب" : "Templates"}
            </Link>
          </div>
        </nav>
        
        {/* Auth Buttons */}
        <div className={`hidden md:flex items-center gap-4 ${isArabic ? "flex-row-reverse" : ""}`}>
          <ButtonSignin 
            text={isArabic ? "تسجيل الدخول" : "Sign in"}
            extraStyle="text-gray-700 hover:text-blue-600 bg-transparent hover:bg-transparent whitespace-nowrap"
          />
          <ButtonSignin 
            text={isArabic ? "ابدأ الآن" : "Get started"}
            extraStyle="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
          />
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg p-4 animate-fade-in">
          <nav className={`flex flex-col space-y-4 ${isArabic ? "items-end" : ""}`}>
            <a 
              href="#features" 
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {isArabic ? "المميزات" : "Features"}
            </a>
            <Link 
              href="/guide" 
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {isArabic ? "الدليل" : "Guide"}
            </Link>
            <Link 
              href="/blog" 
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {isArabic ? "المدونة" : "Blog"}
            </Link>
            <a 
              href="#pricing" 
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              onClick={handlePricingClick}
            >
              {isArabic ? "الأسعار" : "Pricing"}
            </a>
            <Link 
              href="/chatbot-templates" 
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {isArabic ? "القوالب" : "Templates"}
            </Link>
            <div className={`flex flex-col space-y-2 ${isArabic ? "items-end" : ""}`}>
              <ButtonSignin 
                text={isArabic ? "تسجيل الدخول" : "Sign in"}
                extraStyle="w-full text-gray-700 hover:text-blue-600 bg-transparent hover:bg-transparent"
              />
              <ButtonSignin 
                text={isArabic ? "ابدأ الآن" : "Get started"}
                extraStyle="w-full bg-blue-600 hover:bg-blue-700 text-white"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
