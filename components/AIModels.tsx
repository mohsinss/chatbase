'use client'

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from 'framer-motion';

// Domain configuration
const ENGLISH_DOMAIN = process.env.NEXT_PUBLIC_ENGLISH_DOMAIN || 'chatsa.co';
const ARABIC_DOMAIN = process.env.NEXT_PUBLIC_ARABIC_DOMAIN || 'chat.sa';
const DEFAULT_DOMAIN = process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || 'chatsa.co';

const aiModels = {
  en: [
    {
      name: "OpenAI GPT-4o",
      description: "Leverage OpenAI's most advanced multi-modal model for human-like conversations and real-time responses.",
      features: ["Multi-modal capabilities (text, audio, images, video)", "Ultra-fast response times (232ms average)", "Advanced cross-modal reasoning", "Improved performance in non-English languages"]
    },
    {
      name: "Anthropic Claude 3.7 Sonnet",
      description: "Experience Anthropic's latest model that excels at vision, coding, and multi-step reasoning.",
      features: ["2x faster than Claude 3 Opus", "Enhanced vision capabilities for charts and graphs", "64% success rate on complex coding tasks", "Superior multi-step workflow orchestration"]
    },
    {
      name: "Google Gemini 2.5 Pro",
      description: "Access Google's flagship model with the world's longest context window for comprehensive document analysis.",
      features: ["1 million token context window", "Process 1,500+ pages in a single prompt", "Advanced image understanding", "Real-time data analysis with visualization"]
    },
    {
      name: "DeepSeek",
      description: "Implement DeepSeek's specialized models for advanced reasoning and domain-specific applications.",
      features: ["671B parameter architecture (37B active)", "Pure reinforcement learning approach", "Chain-of-Thought processing", "Self-verification and reflection capabilities"]
    },
    {
      name: "xAI Grok-3",
      description: "Deploy xAI's latest model for real-time information and witty interactions with superior reasoning abilities.",
      features: ["Enhanced logical reasoning and problem-solving", "Advanced coding capabilities", "Real-world physics modeling", "Improved political content neutrality"]
    }
  ],
  ar: [
    {
      name: "OpenAI GPT-4o",
      description: "استفد من أحدث نموذج متعدد الوسائط من OpenAI للمحادثات الشبيهة بالبشر والاستجابات في الوقت الفعلي.",
      features: ["قدرات متعددة الوسائط (نص، صوت، صور، فيديو)", "أوقات استجابة فائقة السرعة (232 مللي ثانية في المتوسط)", "استدلال متقدم عبر الوسائط", "أداء محسن في اللغات غير الإنجليزية"]
    },
    {
      name: "Anthropic Claude 3.7 Sonnet",
      description: "جرب أحدث نموذج من Anthropic الذي يتفوق في الرؤية والبرمجة والاستدلال متعدد الخطوات.",
      features: ["أسرع بمرتين من Claude 3 Opus", "قدرات رؤية محسنة للرسوم البيانية والرسوم", "معدل نجاح 64% في مهام البرمجة المعقدة", "تنسيق متقدم لسير العمل متعدد الخطوات"]
    },
    {
      name: "Google Gemini 2.5 Pro",
      description: "استفد من النموذج الرئيسي من Google مع أطول نافذة سياق في العالم لتحليل المستندات الشامل.",
      features: ["نافذة سياق مليون رمز", "معالجة 1500+ صفحة في موجه واحد", "فهم متقدم للصور", "تحليل البيانات في الوقت الفعلي مع التصور"]
    },
    {
      name: "DeepSeek",
      description: "نفذ نماذج DeepSeek المتخصصة للاستدلال المتقدم والتطبيقات الخاصة بالمجال.",
      features: ["هندسة معمارية 671B معلمة (37B نشطة)", "نهج تعلم معزز خالص", "معالجة سلسلة التفكير", "قدرات التحقق الذاتي والتأمل"]
    },
    {
      name: "xAI Grok-3",
      description: "انشر أحدث نموذج من xAI للحصول على معلومات في الوقت الفعلي وتفاعلات ذكية مع قدرات استدلالية فائقة.",
      features: ["استدلال منطقي وحل مشكلات محسن", "قدرات برمجة متقدمة", "نمذجة فيزياء العالم الحقيقي", "تحسين حيادية المحتوى السياسي"]
    }
  ]
};

export default function AIModels() {
  const [showAll, setShowAll] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  
  useEffect(() => {
    const checkDomain = () => {
      const hostname = window.location.hostname;
      const isArabicDomain = hostname === ARABIC_DOMAIN;
      setIsArabic(isArabicDomain);
    };
    
    checkDomain();
  }, []);

  const currentModels = isArabic ? aiModels.ar : aiModels.en;

  // Function to render the appropriate logo based on model name
  const renderLogo = (modelName: string) => {
    switch(modelName) {
      case "OpenAI GPT-4o":
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.5093-2.6067-1.4997z" fill="#412991"/>
          </svg>
        );
      case "Anthropic Claude 3.7 Sonnet":
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#6B5CE7" />
            <circle cx="12" cy="12" r="4.5" fill="white" />
          </svg>
        );
      case "Google Gemini 2.5 Pro":
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8.5" cy="10" r="4.5" fill="#EA4335" />
            <circle cx="15.5" cy="10" r="4.5" fill="#4285F4" />
            <circle cx="12" cy="16" r="4.5" fill="#FBBC05" />
            <path d="M12 7L8.5 13H15.5L12 7Z" fill="#34A853" />
          </svg>
        );
      case "DeepSeek":
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" fill="#00A67E" />
            <path d="M8 12l4-4 4 4-4 4-4-4z" fill="white" />
          </svg>
        );
      case "xAI Grok-3":
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="4" fill="#FF3366" />
            <path d="M12 4L5 8v8l7 4 7-4V8l-7-4z" fill="white" />
            <path d="M12 8v8" stroke="#FF3366" strokeWidth="1.5" />
            <path d="M8 10v4" stroke="#FF3366" strokeWidth="1.5" />
            <path d="M16 10v4" stroke="#FF3366" strokeWidth="1.5" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#4285F4" strokeWidth="2" />
            <circle cx="12" cy="12" r="5" fill="#4285F4" />
          </svg>
        );
    }
  };

  return (
    <section id="ai-models" className="py-20 bg-gradient-to-r from-indigo-50 to-violet-50" dir={isArabic ? 'rtl' : 'ltr'}>
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
              {isArabic ? "مدعوم بنماذج الذكاء الاصطناعي المتقدمة" : "Powered by Advanced AI Models"}
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
              ? "اختر من بين أحدث نماذج الذكاء الاصطناعي في العالم لتشغيل تجربة روبوت المحادثة الخاص بك."
              : "Choose from the world's most sophisticated AI models to power your chatbot experience."
            }
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentModels.slice(0, showAll ? currentModels.length : 3).map((model, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.04, y: -6 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 mr-4">
                  {renderLogo(model.name)}
                </div>
                <h3 className="text-xl font-bold">{model.name}</h3>
              </div>
              <p className="text-gray-600 mb-4">{model.description}</p>
              <ul className="space-y-2">
                {model.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg className={`h-5 w-5 text-indigo-500 ${isArabic ? 'ml-2' : 'mr-2'} flex-shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        {!showAll && currentModels.length > 3 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
            >
              {isArabic ? "عرض المزيد من النماذج" : "Show More Models"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
} 