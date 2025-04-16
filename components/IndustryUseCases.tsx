"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

// Domain configuration
const ENGLISH_DOMAIN = process.env.NEXT_PUBLIC_ENGLISH_DOMAIN || 'chatsa.co';
const ARABIC_DOMAIN = process.env.NEXT_PUBLIC_ARABIC_DOMAIN || 'chat.sa';
const DEFAULT_DOMAIN = process.env.NEXT_PUBLIC_DEFAULT_DOMAIN || 'chatsa.co';

const industries = {
  en: [
    {
      name: "Healthcare",
      description: "Provide 24/7 patient support, schedule appointments, answer medical questions, and streamline administrative tasks.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1100&q=80",
      benefits: ["Patient pre-screening", "Appointment scheduling", "Medical information", "Insurance inquiries"]
    },
    {
      name: "Legal",
      description: "Automate client intake, answer common legal questions, draft basic documents, and provide case status updates.",
      image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=1100&q=80",
      benefits: ["Client intake automation", "Legal FAQ assistance", "Document drafting", "Case status updates"]
    },
    {
      name: "E-commerce",
      description: "Boost sales with product recommendations, handle order inquiries, process returns, and provide personalized shopping assistance.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1100&q=80",
      benefits: ["Product recommendations", "Order tracking", "Return processing", "Inventory inquiries"]
    },
    {
      name: "Education",
      description: "Support students with course information, assignment help, enrollment assistance, and administrative inquiries.",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1100&q=80",
      benefits: ["Course information", "Assignment guidance", "Enrollment support", "Administrative assistance"]
    },
    {
      name: "Real Estate",
      description: "Qualify leads, schedule viewings, answer property questions, and provide neighborhood information.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1100&q=80",
      benefits: ["Property matching", "Viewing scheduling", "Neighborhood insights", "Mortgage calculations"]
    },
    {
      name: "Financial Services",
      description: "Assist with account inquiries, explain financial products, provide basic financial advice, and detect fraud.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1100&q=80",
      benefits: ["Account management", "Product explanations", "Financial guidance", "Fraud detection"]
    }
  ],
  ar: [
    {
      name: "الرعاية الصحية",
      description: "تقديم دعم للمرضى على مدار الساعة، جدولة المواعيد، الإجابة على الأسئلة الطبية، وتبسيط المهام الإدارية.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1100&q=80",
      benefits: ["فحص المرضى المسبق", "جدولة المواعيد", "المعلومات الطبية", "استفسارات التأمين"]
    },
    {
      name: "القانون",
      description: "أتمتة استقبال العملاء، الإجابة على الأسئلة القانونية الشائعة، صياغة المستندات الأساسية، وتقديم تحديثات حالة القضايا.",
      image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=1100&q=80",
      benefits: ["أتمتة استقبال العملاء", "المساعدة في الأسئلة القانونية الشائعة", "صياغة المستندات", "تحديثات حالة القضايا"]
    },
    {
      name: "التجارة الإلكترونية",
      description: "زيادة المبيعات من خلال توصيات المنتجات، معالجة استفسارات الطلبات، معالجة المرتجعات، وتقديم مساعدة تسوق مخصصة.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1100&q=80",
      benefits: ["توصيات المنتجات", "تتبع الطلبات", "معالجة المرتجعات", "استفسارات المخزون"]
    },
    {
      name: "التعليم",
      description: "دعم الطلاب بمعلومات الدورة، المساعدة في الواجبات، المساعدة في التسجيل، واستفسارات إدارية.",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1100&q=80",
      benefits: ["معلومات الدورة", "إرشادات الواجبات", "دعم التسجيل", "المساعدة الإدارية"]
    },
    {
      name: "العقارات",
      description: "تأهيل العملاء المحتملين، جدولة المشاهدات، الإجابة على أسئلة العقارات، وتقديم معلومات عن الحي.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1100&q=80",
      benefits: ["مطابقة العقارات", "جدولة المشاهدات", "معلومات عن الحي", "حسابات الرهن العقاري"]
    },
    {
      name: "الخدمات المالية",
      description: "المساعدة في استفسارات الحسابات، شرح المنتجات المالية، تقديم المشورة المالية الأساسية، وكشف الاحتيال.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1100&q=80",
      benefits: ["إدارة الحسابات", "شرح المنتجات", "الإرشاد المالي", "كشف الاحتيال"]
    }
  ]
};

export default function IndustryUseCases() {
  const [isArabic, setIsArabic] = useState(false);

  useEffect(() => {
    const checkDomain = () => {
      const hostname = window.location.hostname;
      const isArabicDomain = hostname === ARABIC_DOMAIN;
      setIsArabic(isArabicDomain);
    };
    
    checkDomain();
  }, []);

  const currentIndustries = isArabic ? industries.ar : industries.en;

  // Function to render the appropriate icon based on industry name
  const renderIcon = (industryName: string) => {
    switch(industryName) {
      case "Healthcare":
      case "الرعاية الصحية":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9" />
          </svg>
        );
      case "Legal":
      case "القانون":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        );
      case "E-commerce":
      case "التجارة الإلكترونية":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case "Education":
      case "التعليم":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        );
      case "Real Estate":
      case "العقارات":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case "Financial Services":
      case "الخدمات المالية":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  return (
    <section id="industry-use-cases" className="py-20 bg-gray-50" data-aos="fade-up" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {isArabic ? "حلول القطاعات" : "Industry Solutions"}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {isArabic 
              ? "يتكيف شاتسا مع احتياجات قطاعك الفريدة مع حلول روبوتات محادثة ذكية متخصصة."
              : "ChatSa adapts to your industry's unique needs with specialized AI chatbot solutions."
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentIndustries.map((industry, index) => (
            <Link 
              href={`/industries/${industry.name.toLowerCase().replace(/\s+/g, '-')}`} 
              key={index}
            >
              <div 
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={100 + (index * 100)}
              >
                <div className="h-48 relative">
                  <Image
                    src={industry.image}
                    alt={`${industry.name} industry`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6">
                      <div className="flex items-center mb-2">
                        <div className={`w-10 h-10 bg-white rounded-full flex items-center justify-center ${isArabic ? 'ml-3' : 'mr-3'}`}>
                          {renderIcon(industry.name)}
                        </div>
                        <h3 className="text-xl font-bold text-white">{industry.name}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{industry.description}</p>
                  <ul className="space-y-2 mb-4">
                    {industry.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <svg className={`h-5 w-5 text-indigo-500 ${isArabic ? 'ml-2' : 'mr-2'} flex-shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full text-indigo-600 border-indigo-600 hover:bg-indigo-50">
                    {isArabic ? "اعرف المزيد" : "Learn more"}
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 