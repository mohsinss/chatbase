'use client'

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from 'framer-motion';

// Domain configuration
const ENGLISH_DOMAIN = process.env.NEXT_PUBLIC_ENGLISH_DOMAIN || 'chatsa.co';
const ARABIC_DOMAIN = process.env.NEXT_PUBLIC_ARABIC_DOMAIN || 'chat.sa';
const DEFAULT_DOMAIN = process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || 'chatsa.co';

const useCases = {
  en: [
    {
      title: "Customer Support Automation",
      description: "Handle common customer inquiries, troubleshoot issues, and escalate complex problems to human agents when necessary.",
      image: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=1100&q=80",
      benefits: ["24/7 availability", "Instant responses", "Reduced support costs", "Consistent service"],
      link: "https://www.zendesk.com/blog/chatbots-for-customer-service/"
    },
    {
      title: "Lead Generation & Qualification",
      description: "Engage website visitors, collect contact information, and qualify leads before routing them to your sales team.",
      image: "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=1100&q=80",
      benefits: ["Automated lead capture", "Intelligent qualification", "Higher conversion rates", "Sales team efficiency"],
      link: "https://www.hubspot.com/marketing/chatbots-lead-generation"
    },
    {
      title: "Appointment Scheduling",
      description: "Allow customers to book, reschedule, or cancel appointments through natural conversation with your chatbot.",
      image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1100&q=80",
      benefits: ["Seamless booking", "Calendar integration", "Automated reminders", "Reduced no-shows"],
      link: "https://www.calendly.com/blog/ai-scheduling-assistants"
    },
    {
      title: "Document Creation & Processing",
      description: "Generate contracts, forms, and other documents based on user inputs and your business templates.",
      image: "https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=1100&q=80",
      benefits: ["Automated document generation", "Template customization", "Reduced errors", "Faster processing"],
      link: "https://www.docusign.com/products/ai-agreement-cloud"
    },
    {
      title: "Product Recommendations",
      description: "Suggest relevant products or services based on customer preferences, history, and current needs.",
      image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1100&q=80",
      benefits: ["Personalized suggestions", "Increased sales", "Enhanced customer experience", "Cross-selling opportunities"],
      link: "https://www.shopify.com/retail/product-recommendation"
    },
    {
      title: "Knowledge Base Assistant",
      description: "Provide instant answers from your knowledge base, documentation, or internal resources.",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1100&q=80",
      benefits: ["Instant information access", "Reduced support tickets", "Consistent answers", "Self-service enablement"],
      link: "https://www.intercom.com/features/knowledge-base"
    }
  ],
  ar: [
    {
      title: "أتمتة دعم العملاء",
      description: "معالجة استفسارات العملاء الشائعة، وحل المشكلات، وتصعيد المشكلات المعقدة إلى وكلاء بشريين عند الضرورة.",
      image: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=1100&q=80",
      benefits: ["متاح 24/7", "استجابات فورية", "تقليل تكاليف الدعم", "خدمة متناسقة"],
      link: "https://www.zendesk.com/blog/chatbots-for-customer-service/"
    },
    {
      title: "توليد وتأهيل العملاء المحتملين",
      description: "جذب زوار الموقع، وجمع معلومات الاتصال، وتأهيل العملاء المحتملين قبل توجيههم إلى فريق المبيعات الخاص بك.",
      image: "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=1100&q=80",
      benefits: ["التقاط العملاء المحتملين تلقائياً", "التأهيل الذكي", "معدلات تحويل أعلى", "كفاءة فريق المبيعات"],
      link: "https://www.hubspot.com/marketing/chatbots-lead-generation"
    },
    {
      title: "جدولة المواعيد",
      description: "السماح للعملاء بحجز المواعيد أو إعادة جدولتها أو إلغائها من خلال محادثة طبيعية مع روبوت المحادثة الخاص بك.",
      image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1100&q=80",
      benefits: ["حجز سلس", "تكامل التقويم", "تذكيرات تلقائية", "تقليل حالات عدم الحضور"],
      link: "https://www.calendly.com/blog/ai-scheduling-assistants"
    },
    {
      title: "إنشاء ومعالجة المستندات",
      description: "إنشاء العقود والنماذج والمستندات الأخرى بناءً على مدخلات المستخدم وقوالب عملك.",
      image: "https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=1100&q=80",
      benefits: ["إنشاء المستندات تلقائياً", "تخصيص القوالب", "تقليل الأخطاء", "معالجة أسرع"],
      link: "https://www.docusign.com/products/ai-agreement-cloud"
    },
    {
      title: "توصيات المنتجات",
      description: "اقتراح المنتجات أو الخدمات ذات الصلة بناءً على تفضيلات العملاء وتاريخهم واحتياجاتهم الحالية.",
      image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1100&q=80",
      benefits: ["اقتراحات مخصصة", "زيادة المبيعات", "تحسين تجربة العملاء", "فرص البيع المتقاطع"],
      link: "https://www.shopify.com/retail/product-recommendation"
    },
    {
      title: "مساعد قاعدة المعرفة",
      description: "تقديم إجابات فورية من قاعدة المعرفة الخاصة بك أو الوثائق أو الموارد الداخلية.",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1100&q=80",
      benefits: ["وصول فوري للمعلومات", "تقليل تذاكر الدعم", "إجابات متناسقة", "تمكين الخدمة الذاتية"],
      link: "https://www.intercom.com/features/knowledge-base"
    }
  ]
};

export default function UseCases() {
  const [isArabic, setIsArabic] = useState(false);
  
  useEffect(() => {
    const checkDomain = () => {
      const hostname = window.location.hostname;
      const isArabicDomain = hostname === ARABIC_DOMAIN;
      setIsArabic(isArabicDomain);
    };
    
    checkDomain();
  }, []);

  const currentUseCases = isArabic ? useCases.ar : useCases.en;

  return (
    <section id="use-cases" className="py-20 bg-white" dir={isArabic ? 'rtl' : 'ltr'}>
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
              {isArabic ? "حالات استخدام متعددة" : "Versatile Use Cases"}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {isArabic 
              ? "اكتشف الطرق العديدة التي يمكن لـ ChatSa من خلالها تحويل عمليات عملك وتجربة عملائك."
              : "Discover the many ways ChatSa can transform your business operations and customer experience."
            }
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentUseCases.map((useCase, index) => (
            <Link 
              key={index}
              href={`/use-cases/${useCase.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 cursor-pointer"
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.04, y: -6 }}
                className="flex flex-col h-full"
              >
                <div className="h-48 relative">
                  <img
                    src={useCase.image}
                    alt={useCase.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-xl font-bold text-white">{useCase.title}</h3>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-gray-600 mb-4">{useCase.description}</p>
                  <ul className="space-y-2 mb-4">
                    {useCase.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <svg className={`h-5 w-5 text-indigo-500 ${isArabic ? 'ml-2' : 'mr-2'} flex-shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="w-full text-indigo-600 border border-indigo-600 rounded-md py-2 px-4 text-center hover:bg-indigo-50 transition-colors mt-auto">
                    {isArabic ? "معرفة المزيد" : "Learn more"}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 