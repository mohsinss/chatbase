"use client";

import React, { useState, useEffect } from 'react';
import { Bot, Zap, Database, File, Clock, Globe, Code, Lock } from "lucide-react";
import { motion } from 'framer-motion';

// Domain configuration
const ENGLISH_DOMAIN = process.env.NEXT_PUBLIC_ENGLISH_DOMAIN || 'chatsa.co';
const ARABIC_DOMAIN = process.env.NEXT_PUBLIC_ARABIC_DOMAIN || 'chat.sa';
const DEFAULT_DOMAIN = process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || 'chatsa.co';

const features = {
  en: [
    {
      illustration: (
        <div className="w-full h-24 relative overflow-hidden transform transition-transform duration-300 group-hover:rotate-2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_107%,#fdf4ff_0%,#e0f2fe_45%,#ede9fe_80%)] transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute h-12 w-12 -top-6 -left-6 bg-purple-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute h-16 w-16 -bottom-8 -right-6 bg-blue-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
          </div>
          <div className="relative h-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
            <Bot className="h-10 w-10 text-blue-600 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
          </div>
        </div>
      ),
      title: "Instant AI Chatbot",
      description: "Create a custom chatbot based on your data in just 2 minutes. No coding required.",
    },
    {
      illustration: (
        <div className="w-full h-24 relative overflow-hidden transform transition-transform duration-300 group-hover:rotate-2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_107%,#f5f3ff_0%,#dbeafe_45%,#ede9fe_80%)] transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute h-14 w-14 -top-7 -right-7 bg-indigo-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute h-12 w-12 -bottom-6 -left-6 bg-blue-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
          </div>
          <div className="relative h-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
            <Database className="h-10 w-10 text-indigo-600 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
          </div>
        </div>
      ),
      title: "Train on Your Data",
      description: "Upload documents, PDFs, or connect to your website to train your bot on your specific content.",
    },
    {
      illustration: (
        <div className="w-full h-24 relative overflow-hidden transform transition-transform duration-300 group-hover:rotate-2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_107%,#eef2ff_0%,#e0f2fe_45%,#f0f9ff_80%)] transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute h-16 w-16 -bottom-8 -right-8 bg-sky-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute h-12 w-12 -top-6 -left-6 bg-blue-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
          </div>
          <div className="relative h-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
            <Globe className="h-10 w-10 text-sky-600 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
          </div>
        </div>
      ),
      title: "Website Integration",
      description: "Seamlessly add your chatbot to any website with a simple embed code.",
    },
    {
      illustration: (
        <div className="w-full h-24 relative overflow-hidden transform transition-transform duration-300 group-hover:rotate-2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_107%,#f0f9ff_0%,#e0f2fe_45%,#eff6ff_80%)] transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute h-14 w-14 -top-7 -left-7 bg-blue-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute h-12 w-12 -bottom-6 -right-6 bg-sky-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
          </div>
          <div className="relative h-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
            <Clock className="h-10 w-10 text-blue-600 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
          </div>
        </div>
      ),
      title: "Always Up-to-Date",
      description: "Keep your chatbot current with automatic updates and continuous learning.",
    },
    {
      illustration: (
        <div className="w-full h-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_107%,#f0f9ff_0%,#e0f2fe_45%,#ecfeff_80%)]" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute h-16 w-16 -bottom-8 -left-8 bg-cyan-200 rounded-full" />
            <div className="absolute h-12 w-12 -top-6 -right-6 bg-blue-200 rounded-full" />
          </div>
          <div className="relative h-full flex items-center justify-center">
            <Zap className="h-10 w-10 text-cyan-600" strokeWidth={1.5} />
          </div>
        </div>
      ),
      title: "Advanced AI Models",
      description: "Leverage cutting-edge AI from Anthropic, OpenAI, DeepSeek, Grok, and more for powerful, natural conversations.",
    },
    {
      illustration: (
        <div className="w-full h-24 relative overflow-hidden transform transition-transform duration-300 group-hover:rotate-2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_107%,#ecfeff_0%,#e0f2fe_45%,#f0f9ff_80%)] transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute h-14 w-14 -top-7 -right-7 bg-blue-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute h-12 w-12 -bottom-6 -left-6 bg-cyan-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
          </div>
          <div className="relative h-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
            <File className="h-10 w-10 text-blue-600 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
          </div>
        </div>
      ),
      title: "Multiple File Types",
      description: "Upload PDFs, DOCs, TXTs, and more to build your knowledge base.",
    },
    {
      illustration: (
        <div className="w-full h-24 relative overflow-hidden transform transition-transform duration-300 group-hover:rotate-2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_107%,#f5f3ff_0%,#ede9fe_45%,#faf5ff_80%)] transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute h-16 w-16 -bottom-8 -right-8 bg-purple-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute h-12 w-12 -top-6 -left-6 bg-violet-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
          </div>
          <div className="relative h-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
            <Code className="h-10 w-10 text-violet-600 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
          </div>
        </div>
      ),
      title: "API Access",
      description: "Access your chatbot via API for custom integrations and advanced use cases.",
    },
    {
      illustration: (
        <div className="w-full h-24 relative overflow-hidden transform transition-transform duration-300 group-hover:rotate-2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_107%,#eef2ff_0%,#e0f2fe_45%,#ede9fe_80%)] transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute h-14 w-14 -top-7 -left-7 bg-indigo-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute h-12 w-12 -bottom-6 -right-6 bg-blue-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
          </div>
          <div className="relative h-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
            <Lock className="h-10 w-10 text-indigo-600 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
          </div>
        </div>
      ),
      title: "Privacy Focused",
      description: "Your data stays private and secure with enterprise-grade security measures.",
    },
  ],
  ar: [
    {
      illustration: (
        <div className="w-full h-24 relative overflow-hidden transform transition-transform duration-300 group-hover:rotate-2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_107%,#fdf4ff_0%,#e0f2fe_45%,#ede9fe_80%)] transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute h-12 w-12 -top-6 -left-6 bg-purple-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute h-16 w-16 -bottom-8 -right-6 bg-blue-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
          </div>
          <div className="relative h-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
            <Bot className="h-10 w-10 text-blue-600 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
          </div>
        </div>
      ),
      title: "روبوت محادثة ذكي فوري",
      description: "أنشئ روبوت محادثة مخصصًا بناءً على بياناتك في دقيقتين فقط. لا حاجة للبرمجة.",
    },
    {
      illustration: (
        <div className="w-full h-24 relative overflow-hidden transform transition-transform duration-300 group-hover:rotate-2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_107%,#f5f3ff_0%,#dbeafe_45%,#ede9fe_80%)] transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute h-14 w-14 -top-7 -right-7 bg-indigo-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute h-12 w-12 -bottom-6 -left-6 bg-blue-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
          </div>
          <div className="relative h-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
            <Database className="h-10 w-10 text-indigo-600 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
          </div>
        </div>
      ),
      title: "التدريب على بياناتك",
      description: "قم بتحميل المستندات وملفات PDF أو الربط بموقعك الإلكتروني لتدريب الروبوت على محتواك المحدد.",
    },
    {
      illustration: (
        <div className="w-full h-24 relative overflow-hidden transform transition-transform duration-300 group-hover:rotate-2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_107%,#eef2ff_0%,#e0f2fe_45%,#f0f9ff_80%)] transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute h-16 w-16 -bottom-8 -right-8 bg-sky-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute h-12 w-12 -top-6 -left-6 bg-blue-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
          </div>
          <div className="relative h-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
            <Globe className="h-10 w-10 text-sky-600 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
          </div>
        </div>
      ),
      title: "دمج مع المواقع",
      description: "أضف روبوت المحادثة الخاص بك بسهولة إلى أي موقع باستخدام كود بسيط.",
    },
    {
      illustration: (
        <div className="w-full h-24 relative overflow-hidden transform transition-transform duration-300 group-hover:rotate-2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_107%,#f0f9ff_0%,#e0f2fe_45%,#eff6ff_80%)] transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute h-14 w-14 -top-7 -left-7 bg-blue-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute h-12 w-12 -bottom-6 -right-6 bg-sky-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
          </div>
          <div className="relative h-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
            <Clock className="h-10 w-10 text-blue-600 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
          </div>
        </div>
      ),
      title: "دائماً محدث",
      description: "حافظ على تحديث روبوت المحادثة مع التحديثات التلقائية والتعلم المستمر.",
    },
    {
      illustration: (
        <div className="w-full h-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_107%,#f0f9ff_0%,#e0f2fe_45%,#ecfeff_80%)]" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute h-16 w-16 -bottom-8 -left-8 bg-cyan-200 rounded-full" />
            <div className="absolute h-12 w-12 -top-6 -right-6 bg-blue-200 rounded-full" />
          </div>
          <div className="relative h-full flex items-center justify-center">
            <Zap className="h-10 w-10 text-cyan-600" strokeWidth={1.5} />
          </div>
        </div>
      ),
      title: "نماذج ذكاء اصطناعي متقدمة",
      description: "استفد من أحدث تقنيات الذكاء الاصطناعي من Anthropic وOpenAI وDeepSeek وGrok والمزيد للمحادثات الطبيعية والقوية.",
    },
    {
      illustration: (
        <div className="w-full h-24 relative overflow-hidden transform transition-transform duration-300 group-hover:rotate-2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_107%,#ecfeff_0%,#e0f2fe_45%,#f0f9ff_80%)] transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute h-14 w-14 -top-7 -right-7 bg-blue-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute h-12 w-12 -bottom-6 -left-6 bg-cyan-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
          </div>
          <div className="relative h-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
            <File className="h-10 w-10 text-blue-600 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
          </div>
        </div>
      ),
      title: "أنواع ملفات متعددة",
      description: "قم بتحميل ملفات PDF وDOC وTXT والمزيد لبناء قاعدة معرفتك.",
    },
    {
      illustration: (
        <div className="w-full h-24 relative overflow-hidden transform transition-transform duration-300 group-hover:rotate-2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_107%,#f5f3ff_0%,#ede9fe_45%,#faf5ff_80%)] transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute h-16 w-16 -bottom-8 -right-8 bg-purple-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute h-12 w-12 -top-6 -left-6 bg-violet-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
          </div>
          <div className="relative h-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
            <Code className="h-10 w-10 text-violet-600 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
          </div>
        </div>
      ),
      title: "واجهة برمجة التطبيقات",
      description: "الوصول إلى روبوت المحادثة عبر API للتكاملات المخصصة وحالات الاستخدام المتقدمة.",
    },
    {
      illustration: (
        <div className="w-full h-24 relative overflow-hidden transform transition-transform duration-300 group-hover:rotate-2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_107%,#eef2ff_0%,#e0f2fe_45%,#ede9fe_80%)] transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute h-14 w-14 -top-7 -left-7 bg-indigo-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute h-12 w-12 -bottom-6 -right-6 bg-blue-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
          </div>
          <div className="relative h-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
            <Lock className="h-10 w-10 text-indigo-600 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
          </div>
        </div>
      ),
      title: "التركيز على الخصوصية",
      description: "تبقى بياناتك خاصة وآمنة مع تدابير أمنية على مستوى المؤسسات.",
    },
  ]
};

const FeaturesSection = () => {
  const [isArabic, setIsArabic] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    const checkDomain = () => {
      const hostname = window.location.hostname;
      const isArabicDomain = hostname === ARABIC_DOMAIN;
      setIsArabic(isArabicDomain);
    };
    
    checkDomain();
  }, []);

  const currentFeatures = isArabic ? features.ar : features.en;

  return (
    <section id="features" className="py-4 px-4 bg-gradient-to-b from-white to-gray-50" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            {isArabic 
              ? "كل ما تحتاجه لبناء روبوتات محادثة ذكية"
              : "Everything You Need to Build Intelligent Chatbots"
            }
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {isArabic 
              ? "أنشئ روبوتات محادثة ذكية تتفاعل مع زوارك، وتجيب على الأسئلة، وتعزز التحويلات، كل ذلك دون كتابة سطر برمجي واحد."
              : "Create AI chatbots that engage your visitors, answer questions, and boost conversions, all without writing a single line of code."
            }
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentFeatures.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                rotate: 2,
                transition: { duration: 0.2 }
              }}
              onHoverStart={() => setHoveredFeature(index)}
              onHoverEnd={() => setHoveredFeature(null)}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <motion.div 
                animate={hoveredFeature === index ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {feature.illustration}
              </motion.div>
              <motion.div 
                className="p-6"
                animate={hoveredFeature === index ? { y: -5 } : { y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.h3 
                  className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300"
                  animate={hoveredFeature === index ? { color: "#2563eb" } : { color: "#111827" }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p 
                  className="text-gray-600 leading-relaxed"
                  animate={hoveredFeature === index ? { y: -2 } : { y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 