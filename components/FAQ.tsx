"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// <FAQ> component is a lsit of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList arrayy below.

export default function FAQ() {
  const faqs = [
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
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Frequently Asked Questions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about ChatSa.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-indigo-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
