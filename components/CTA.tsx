"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from 'framer-motion';

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
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto relative z-10 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <Sparkles className="h-10 w-10 text-white/80 mx-auto mb-6" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-white mb-6"
        >
          {content.title}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-xl text-white/90 mb-10 max-w-3xl mx-auto"
        >
          {content.description}
        </motion.p>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 hover-lift">
              {content.buttonText}
              <ArrowRight className={`h-4 w-4 ${isArabic ? 'mr-2' : 'ml-2'}`} />
            </Button>
          </motion.div>
          {/* <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-6 hover-lift">
              Request Demo
            </Button>
          </motion.div> */}
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-white/80 mt-6"
        >
          {content.footerText}
        </motion.p>
      </motion.div>
    </section>
  );
};

export default CTASection;
