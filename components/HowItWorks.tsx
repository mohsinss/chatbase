"use client";

import React, { useState, useEffect } from 'react';
import { Check, ArrowRight } from "lucide-react";
import { motion } from 'framer-motion';

// Domain configuration
const ENGLISH_DOMAIN = process.env.NEXT_PUBLIC_ENGLISH_DOMAIN || 'chatsa.co';
const ARABIC_DOMAIN = process.env.NEXT_PUBLIC_ARABIC_DOMAIN || 'chat.sa';
const DEFAULT_DOMAIN = process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || 'chatsa.co';

const steps = {
  en: [
    {
      number: "01",
      title: "Upload your data",
      description: "Add documents, PDFs, or connect your website to train your AI chatbot on your specific content.",
      image: "./landingPage/Uploadyourdata.png",
      benefits: [
        "No coding or technical skills needed",
        "Works with all website platforms",
        "Start engaging visitors in minutes"
      ]
    },
    {
      number: "02",
      title: "Customize your chatbot",
      description: "Personalize your bot's appearance, behavior, and responses to match your brand and requirements.",
      image: "./landingPage/Customizeyourchatbot.png",
      benefits: [
        "No coding or technical skills needed",
        "Works with all website platforms",
        "Start engaging visitors in minutes"
      ]
    },
    {
      number: "03",
      title: "Integrate with your website",
      description: "Add a single line of code to your website to embed your AI chatbot and start engaging with visitors.",
      image: "./landingPage/Integrate.png",
      benefits: [
        "No coding or technical skills needed",
        "Works with all website platforms",
        "Start engaging visitors in minutes"
      ]
    }
  ],
  ar: [
    {
      number: "01",
      title: "تحميل بياناتك",
      description: "أضف المستندات وملفات PDF أو قم بربط موقعك الإلكتروني لتدريب روبوت المحادثة الذكي على محتواك المحدد.",
      image: "./landingPage/Uploadyourdata.png",
      benefits: [
        "لا حاجة لمهارات برمجة أو تقنية",
        "يعمل مع جميع منصات المواقع",
        "ابدأ في التفاعل مع الزوار في دقائق"
      ]
    },
    {
      number: "02",
      title: "تخصيص روبوت المحادثة",
      description: "قم بتخصيص مظهر وسلوك واستجابات الروبوت لتتناسب مع علامتك التجارية ومتطلباتك.",
      image: "./landingPage/Customizeyourchatbot.png",
      benefits: [
        "لا حاجة لمهارات برمجة أو تقنية",
        "يعمل مع جميع منصات المواقع",
        "ابدأ في التفاعل مع الزوار في دقائق"
      ]
    },
    {
      number: "03",
      title: "دمج مع موقعك",
      description: "أضف سطرًا واحدًا من الكود إلى موقعك لتضمين روبوت المحادثة الذكي وبدء التفاعل مع الزوار.",
      image: "./landingPage/Integrate.png",
      benefits: [
        "لا حاجة لمهارات برمجة أو تقنية",
        "يعمل مع جميع منصات المواقع",
        "ابدأ في التفاعل مع الزوار في دقائق"
      ]
    }
  ]
};

const HowItWorks = () => {
  const [isArabic, setIsArabic] = useState(false);

  useEffect(() => {
    const checkDomain = () => {
      const hostname = window.location.hostname;
      const isArabicDomain = hostname === ARABIC_DOMAIN;
      setIsArabic(isArabicDomain);
    };
    
    checkDomain();
  }, []);

  const currentSteps = isArabic ? steps.ar : steps.en;

  return (
    <section id="how-it-works" className="py-8 px-4 bg-white" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            {isArabic 
              ? "كيف يعمل شاتسا"
              : "How ChatSa "
            }
            <span className="text-gradient">
              {isArabic ? "يعمل" : "Works"}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            {isArabic 
              ? "احصل على روبوت المحادثة الذكي الخاص بك جاهزًا للعمل في دقائق مع هذه الخطوات البسيطة."
              : "Get your AI chatbot up and running in minutes with these simple steps."
            }
          </motion.p>
        </motion.div>
        
        <div className="space-y-24">
          {currentSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}
            >
              <motion.div
                className="w-full md:w-1/2"
                whileHover={{ scale: 1.04, y: -6 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <div className="overflow-hidden rounded-2xl shadow-lg">
                  <img 
                    src={step.image}
                    alt={step.title}
                    className="w-full h-auto transition-transform duration-500"
                  />
                </div>
              </motion.div>
              <div className="w-full md:w-1/2 space-y-4">
                <div className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  {isArabic ? "خطوة" : "Step"} {step.number}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">{step.title}</h3>
                <p className="text-gray-600 text-lg">{step.description}</p>
                <ul className="space-y-2">
                  {step.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start">
                      <Check className={`h-5 w-5 text-green-500 ${isArabic ? 'ml-2' : 'mr-2'} mt-0.5`} />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 