"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

// Domain configuration
const ENGLISH_DOMAIN = process.env.NEXT_PUBLIC_ENGLISH_DOMAIN || 'chatsa.co';
const ARABIC_DOMAIN = process.env.NEXT_PUBLIC_ARABIC_DOMAIN || 'chat.sa';
const DEFAULT_DOMAIN = process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || 'chatsa.co';

const faqs = {
  en: [
    {
      question: "How does ChatSa train on my data?",
      answer: "ChatSa can train on your data in several ways. You can upload documents (PDF, DOCX, TXT), connect to your website for crawling, or directly input custom data. Our AI processes this information to create a knowledge base for your chatbot."
    },
    {
      question: "Do I need coding knowledge to use ChatSa?",
      answer: "No, ChatSa is designed to be user-friendly with no coding required. Our intuitive interface allows you to create, customize, and deploy chatbots through a simple drag-and-drop interface and guided setup process."
    },
    {
      question: "How accurate are the chatbot responses?",
      answer: "ChatSa uses advanced AI models to ensure high accuracy. The quality of responses depends on the training data provided. With good quality data, our chatbots typically achieve 90%+ accuracy for domain-specific questions."
    },
    {
      question: "Can I customize the appearance of my chatbot?",
      answer: "Yes, ChatSa offers extensive customization options. You can change colors, fonts, avatar images, chat bubble styles, and more to match your brand identity. The Pro and Enterprise plans offer even more advanced customization options."
    },
    {
      question: "How do I add the chatbot to my website?",
      answer: "After creating your chatbot, you'll receive a simple JavaScript code snippet. Just add this to your website's HTML, and the chatbot will appear. No additional setup is required, though we offer advanced integration options for developers."
    },
    {
      question: "What languages does ChatSa support?",
      answer: "ChatSa supports over 95 languages, allowing your chatbot to communicate with users worldwide. You can configure primary and secondary languages or let the chatbot automatically detect and respond in the user's language."
    }
  ],
  ar: [
    {
      question: "كيف يقوم ChatSa بالتدريب على بياناتي؟",
      answer: "يمكن لـ ChatSa التدريب على بياناتك بعدة طرق. يمكنك تحميل المستندات (PDF، DOCX، TXT)، أو الاتصال بموقعك للزحف، أو إدخال بيانات مخصصة مباشرة. يقوم ذكاؤنا الاصطناعي بمعالجة هذه المعلومات لإنشاء قاعدة معرفة لروبوت المحادثة الخاص بك."
    },
    {
      question: "هل أحتاج إلى معرفة بالبرمجة لاستخدام ChatSa؟",
      answer: "لا، تم تصميم ChatSa ليكون سهل الاستخدام دون الحاجة إلى البرمجة. تتيح لك واجهتنا البديهية إنشاء وتخصيص ونشر روبوتات المحادثة من خلال واجهة بسيطة للسحب والإفلات وعملية إعداد موجهة."
    },
    {
      question: "ما مدى دقة استجابات روبوت المحادثة؟",
      answer: "يستخدم ChatSa نماذج ذكاء اصطناعي متقدمة لضمان دقة عالية. تعتمد جودة الاستجابات على بيانات التدريب المقدمة. مع بيانات جيدة الجودة، تحقق روبوتات المحادثة لدينا عادةً دقة تزيد عن 90% للأسئلة الخاصة بالمجال."
    },
    {
      question: "هل يمكنني تخصيص مظهر روبوت المحادثة الخاص بي؟",
      answer: "نعم، يقدم ChatSa خيارات تخصيص واسعة. يمكنك تغيير الألوان والخطوط وصور الصور الرمزية وأنماط فقاعات الدردشة والمزيد لتتناسب مع هوية علامتك التجارية. تقدم خطط Pro و Enterprise خيارات تخصيص أكثر تقدمًا."
    },
    {
      question: "كيف يمكنني إضافة روبوت المحادثة إلى موقعي؟",
      answer: "بعد إنشاء روبوت المحادثة الخاص بك، ستحصل على مقتطف كود JavaScript بسيط. ما عليك سوى إضافته إلى HTML الخاص بموقعك، وسيظهر روبوت المحادثة. لا يلزم إعداد إضافي، على الرغم من أننا نقدم خيارات تكامل متقدمة للمطورين."
    },
    {
      question: "ما هي اللغات التي يدعمها ChatSa؟",
      answer: "يدعم ChatSa أكثر من 95 لغة، مما يسمح لروبوت المحادثة الخاص بك بالتواصل مع المستخدمين في جميع أنحاء العالم. يمكنك تكوين اللغات الأساسية والثانوية أو السماح لروبوت المحادثة باكتشاف والرد بلغة المستخدم تلقائيًا."
    }
  ]
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isArabic, setIsArabic] = useState(false);

  useEffect(() => {
    const checkDomain = () => {
      const hostname = window.location.hostname;
      const isArabicDomain = hostname === ARABIC_DOMAIN;
      setIsArabic(isArabicDomain);
    };
    
    checkDomain();
  }, []);

  const currentFaqs = isArabic ? faqs.ar : faqs.en;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white" dir={isArabic ? 'rtl' : 'ltr'}>
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
              {isArabic ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
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
              ? "اعثر على إجابات للأسئلة الشائعة حول ChatSa."
              : "Find answers to common questions about ChatSa."
            }
          </motion.p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {currentFaqs.map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                viewport={{ once: true }}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className={`h-5 w-5 text-indigo-600 ${isArabic ? 'ml-4' : 'mr-4'}`} />
                  ) : (
                    <ChevronDown className={`h-5 w-5 text-gray-500 ${isArabic ? 'ml-4' : 'mr-4'}`} />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      key="answer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-gray-600">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
