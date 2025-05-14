'use client'

import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';

// Domain configuration
const ENGLISH_DOMAIN = process.env.NEXT_PUBLIC_ENGLISH_DOMAIN || 'chatsa.co';
const ARABIC_DOMAIN = process.env.NEXT_PUBLIC_ARABIC_DOMAIN || 'chat.sa';
const DEFAULT_DOMAIN = process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || 'chatsa.co';

const dashboardFeatures = {
  en: [
    {
      title: "Model Configuration",
      description: "Fine-tune your AI models with advanced parameters and customize response behaviors for optimal performance.",
      image: "https://images.unsplash.com/photo-1596638787647-904d822d751e?auto=format&fit=crop&w=1100&q=80",
      features: [
        "GPT, Claude, and custom model integration",
        "Response temperature and creativity controls",
        "Context window optimization tools",
        "Personality and tone customization"
      ]
    },
    {
      title: "Conversation Analytics",
      description: "Track user satisfaction, response accuracy, and engagement metrics with AI-powered conversation analysis.",
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1100&q=80",
      features: [
        "Sentiment analysis for user messages",
        "Conversation completion and success rates",
        "User satisfaction metrics and feedback",
        "Response time and accuracy tracking"
      ]
    },
    {
      title: "Knowledge Management",
      description: "Upload documents, connect APIs, and build comprehensive knowledge bases to power your AI chatbot's responses.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1100&q=80",
      features: [
        "Document embedding and vectorization",
        "Semantic search integration",
        "Automated knowledge extraction",
        "Custom data connectors for third-party sources"
      ]
    },
    {
      title: "Deployment Tools",
      description: "Seamlessly deploy your chatbots across multiple platforms with our one-click integration tools.",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1100&q=80",
      features: [
        "Website, Slack, and Discord integrations",
        "Mobile SDK for iOS and Android apps",
        "Custom API endpoint generation",
        "Version control and rollback capabilities"
      ]
    }
  ],
  ar: [
    {
      title: "تكوين النموذج",
      description: "ضبط نماذج الذكاء الاصطناعي الخاصة بك مع معلمات متقدمة وتخصيص سلوكيات الاستجابة للحصول على أفضل أداء.",
      image: "https://images.unsplash.com/photo-1596638787647-904d822d751e?auto=format&fit=crop&w=1100&q=80",
      features: [
        "تكامل مع GPT وClaude والنماذج المخصصة",
        "ضوابط درجة الحرارة والإبداع في الاستجابة",
        "أدوات تحسين نافذة السياق",
        "تخصيص الشخصية والنبرة"
      ]
    },
    {
      title: "تحليلات المحادثة",
      description: "تتبع رضا المستخدمين ودقة الاستجابة ومقاييس التفاعل مع تحليل المحادثات المدعوم بالذكاء الاصطناعي.",
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1100&q=80",
      features: [
        "تحليل المشاعر لرسائل المستخدمين",
        "معدلات إكمال ونجاح المحادثة",
        "مقاييس رضا المستخدمين والملاحظات",
        "تتبع وقت الاستجابة والدقة"
      ]
    },
    {
      title: "إدارة المعرفة",
      description: "قم بتحميل المستندات وربط واجهات برمجة التطبيقات وبناء قواعد معرفة شاملة لتشغيل استجابات روبوت المحادثة الذكي الخاص بك.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1100&q=80",
      features: [
        "تضمين المستندات وتحويلها إلى متجهات",
        "تكامل البحث الدلالي",
        "استخراج المعرفة التلقائي",
        "موصلات بيانات مخصصة للمصادر الخارجية"
      ]
    },
    {
      title: "أدوات النشر",
      description: "انشر روبوتات المحادثة الخاصة بك بسلاسة عبر منصات متعددة باستخدام أدوات التكامل بنقرة واحدة.",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1100&q=80",
      features: [
        "تكامل مع المواقع وSlack وDiscord",
        "SDK للهواتف المحمولة لتطبيقات iOS وAndroid",
        "إنشاء نقاط نهاية API مخصصة",
        "التحكم في الإصدارات وإمكانية التراجع"
      ]
    }
  ]
};

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const checkDomain = () => {
      const hostname = window.location.hostname;
      const isArabicDomain = hostname === ARABIC_DOMAIN;
      setIsArabic(isArabicDomain);
    };
    
    checkDomain();
  }, []);
  
  const currentFeatures = isArabic ? dashboardFeatures.ar : dashboardFeatures.en;

  return (
    <section className="py-20 bg-white" data-aos="fade-up" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {isArabic ? "لوحة تحكم قوية" : "Powerful Dashboard"}
            </span>{" "}
            {isArabic ? "للتحكم الكامل" : "for Complete Control"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {isArabic 
              ? "قم بإدارة روبوتات المحادثة الخاصة بك بسهولة باستخدام لوحة التحكم البديهية المليئة بالميزات القوية."
              : "Manage your chatbots with ease using our intuitive dashboard packed with powerful features."
            }
          </motion.p>
        </motion.div>

        {mounted && (
          <Tabs defaultValue={currentFeatures[0].title.toLowerCase().replace(/\s+/g, '-')} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-12">
              {currentFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="contents"
                >
                  <TabsTrigger 
                    value={feature.title.toLowerCase().replace(/\s+/g, '-')}
                  >
                    {isArabic ? feature.title.split(' ')[0] : feature.title.split(' ')[0]}
                  </TabsTrigger>
                </motion.div>
              ))}
            </TabsList>
            {currentFeatures.map((feature, index) => (
              <TabsContent key={index} value={feature.title.toLowerCase().replace(/\s+/g, '-')}> 
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col lg:flex-row items-center gap-12"
                >
                  <div className="lg:w-1/2">
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-lg text-gray-600 mb-6">{feature.description}</p>
                    <ul className="space-y-3">
                      {feature.features.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <svg className={`h-5 w-5 text-indigo-500 ${isArabic ? 'ml-2' : 'mr-2'} flex-shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <motion.div
                    className="lg:w-1/2"
                    whileHover={{ scale: 1.04, y: -6 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <div className="relative rounded-xl overflow-hidden shadow-xl border border-gray-200">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-auto"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/5 to-violet-600/5"></div>
                    </div>
                  </motion.div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </section>
  );
} 