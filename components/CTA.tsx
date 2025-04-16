"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

// Domain configuration
const ENGLISH_DOMAIN = process.env.NEXT_PUBLIC_ENGLISH_DOMAIN || 'chatsa.co';
const ARABIC_DOMAIN = process.env.NEXT_PUBLIC_ARABIC_DOMAIN || 'chat.sa';
const DEFAULT_DOMAIN = process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || 'chatsa.co';

const ctaContent = {
  en: {
    title: "Transform Your Website with AI-Powered Conversations",
    description: "Join thousands of businesses already using ChatSa to improve customer engagement, boost conversions, and provide 24/7 support.",
    buttonText: "Get Started Free",
    footerText: "No credit card required. Free plan available."
  },
  ar: {
    title: "حول موقعك مع المحادثات المدعومة بالذكاء الاصطناعي",
    description: "انضم إلى آلاف الشركات التي تستخدم بالفعل ChatSa لتحسين تفاعل العملاء، وزيادة التحويلات، وتقديم الدعم على مدار الساعة.",
    buttonText: "ابدأ مجاناً",
    footerText: "لا تحتاج إلى بطاقة ائتمان. خطة مجانية متاحة."
  }
};

const CTASection = () => {
  const [isArabic, setIsArabic] = useState(false);

  useEffect(() => {
    const checkDomain = () => {
      const hostname = window.location.hostname;
      const isArabicDomain = hostname === ARABIC_DOMAIN;
      setIsArabic(isArabicDomain);
    };
    
    checkDomain();
  }, []);

  const content = isArabic ? ctaContent.ar : ctaContent.en;

  return (
    <section className="py-24 px-4 relative overflow-hidden" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-95"></div>
      
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <Sparkles className="h-10 w-10 text-white/80 mx-auto mb-6" />
        
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          {content.title}
        </h2>
        
        <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
          {content.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 hover-lift">
            {content.buttonText}
            <ArrowRight className={`h-4 w-4 ${isArabic ? 'mr-2' : 'ml-2'}`} />
          </Button>
          {/* <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-6 hover-lift">
            Request Demo
          </Button> */}
        </div>
        
        <p className="text-white/80 mt-6">
          {content.footerText}
        </p>
      </div>
    </section>
  );
};

export default CTASection;
