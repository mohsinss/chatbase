"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type LocaleType = 'en' | 'ar';

interface LocaleContextType {
  locale: LocaleType;
  setLocale: (locale: LocaleType) => void;
  t: (key: string) => any;
  isRTL: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

// Translations
const translations = {
  en: {
    // Header
    'nav.features': 'Features',
    'nav.guide': 'Guide',
    'nav.pricing': 'Pricing',
    'nav.faq': 'FAQ',
    'button.signin': 'Sign in',
    'button.getstarted': 'Get started',
    
    // Hero
    'hero.easiest': 'The easiest way to create AI chatbots',
    'hero.title': 'Create AI Chatbots for',
    'hero.titleGradient': 'Your Website in Minutes',
    'hero.subtitle': 'Build custom AI chatbots trained on a single unified knowledge base. Deploy consistent responses across all social media channels without coding. Connect to your website in 2 minutes.',
    'hero.cta': 'Get Started Free',
    'hero.knowledgeBase.title': 'Try It Today: Add Your Custom Knowledge Base',
    'hero.knowledgeBase.button': 'Upload Knowledge Base',
    'hero.knowledgeBase.modal.title': 'Upload Your Knowledge Base',
    'hero.knowledgeBase.modal.dropText': 'Drag and drop your PDF file, or',
    'hero.knowledgeBase.modal.browse': 'Browse Files',
    'hero.knowledgeBase.modal.formats': 'Supported formats: PDF, DOCX, TXT (Max 10MB)',
    'hero.knowledgeBase.modal.or': 'Or',
    'hero.knowledgeBase.modal.paste': 'Paste your text',
    'hero.knowledgeBase.modal.placeholder': 'Paste your knowledge base content here...',
    'hero.knowledgeBase.modal.train': 'Train My Bot',
    
    // CompanyLogos
    'companyLogos.title': 'Trusted by companies worldwide',
    
    // HowItWorks
    'howItWorks.title': 'How ChatSa',
    'howItWorks.titleGradient': 'Works',
    'howItWorks.subtitle': 'Get your AI chatbot up and running in minutes with these simple steps.',
    'howItWorks.step1.number': '01',
    'howItWorks.step1.title': 'Upload your data',
    'howItWorks.step1.description': 'Add documents, PDFs, or connect your website to train your AI chatbot on your specific content.',
    'howItWorks.step2.number': '02',
    'howItWorks.step2.title': 'Customize your chatbot',
    'howItWorks.step2.description': 'Personalize your bot\'s appearance, behavior, and responses to match your brand and requirements.',
    'howItWorks.step3.number': '03',
    'howItWorks.step3.title': 'Integrate with your website',
    'howItWorks.step3.description': 'Add a single line of code to your website to embed your AI chatbot and start engaging with visitors.',
    'howItWorks.benefit1': 'No coding or technical skills needed',
    'howItWorks.benefit2': 'Works with all website platforms',
    'howItWorks.benefit3': 'Start engaging visitors in minutes',
    
    // IndustryUseCases
    'industryUseCases.title': 'Industry Solutions',
    'industryUseCases.subtitle': 'ChatSa adapts to your industry\'s unique needs with specialized AI chatbot solutions.',
    'industryUseCases.learnMore': 'Learn more',
    'industryUseCases.healthcare.name': 'Healthcare',
    'industryUseCases.healthcare.description': 'Provide 24/7 patient support, schedule appointments, answer medical questions, and streamline administrative tasks.',
    'industryUseCases.healthcare.benefits.1': 'Patient pre-screening',
    'industryUseCases.healthcare.benefits.2': 'Appointment scheduling',
    'industryUseCases.healthcare.benefits.3': 'Medical information',
    'industryUseCases.healthcare.benefits.4': 'Insurance inquiries',
    'industryUseCases.legal.name': 'Legal',
    'industryUseCases.legal.description': 'Automate client intake, answer common legal questions, draft basic documents, and provide case status updates.',
    'industryUseCases.legal.benefits.1': 'Client intake automation',
    'industryUseCases.legal.benefits.2': 'Legal FAQ assistance',
    'industryUseCases.legal.benefits.3': 'Document drafting',
    'industryUseCases.legal.benefits.4': 'Case status updates',
    'industryUseCases.ecommerce.name': 'E-commerce',
    'industryUseCases.ecommerce.description': 'Boost sales with product recommendations, handle order inquiries, process returns, and provide personalized shopping assistance.',
    'industryUseCases.ecommerce.benefits.1': 'Product recommendations',
    'industryUseCases.ecommerce.benefits.2': 'Order tracking',
    'industryUseCases.ecommerce.benefits.3': 'Return processing',
    'industryUseCases.ecommerce.benefits.4': 'Inventory inquiries',
    'industryUseCases.education.name': 'Education',
    'industryUseCases.education.description': 'Support students with course information, assignment help, enrollment assistance, and administrative inquiries.',
    'industryUseCases.education.benefits.1': 'Course information',
    'industryUseCases.education.benefits.2': 'Assignment guidance',
    'industryUseCases.education.benefits.3': 'Enrollment support',
    'industryUseCases.education.benefits.4': 'Administrative assistance',
    'industryUseCases.realEstate.name': 'Real Estate',
    'industryUseCases.realEstate.description': 'Qualify leads, schedule viewings, answer property questions, and provide neighborhood information.',
    'industryUseCases.realEstate.benefits.1': 'Property matching',
    'industryUseCases.realEstate.benefits.2': 'Viewing scheduling',
    'industryUseCases.realEstate.benefits.3': 'Neighborhood insights',
    'industryUseCases.realEstate.benefits.4': 'Mortgage calculations',
    'industryUseCases.financialServices.name': 'Financial Services',
    'industryUseCases.financialServices.description': 'Assist with account inquiries, explain financial products, provide basic financial advice, and detect fraud.',
    'industryUseCases.financialServices.benefits.1': 'Account management',
    'industryUseCases.financialServices.benefits.2': 'Product explanations',
    'industryUseCases.financialServices.benefits.3': 'Financial guidance',
    'industryUseCases.financialServices.benefits.4': 'Fraud detection',
    testimonials: {
      title: "What Our Users Are Saying",
      subtitle: "Join thousands of satisfied users who have transformed their customer support with ChatSa.",
      testimonials: [
        {
          name: "Sarah Johnson",
          role: "Customer Support Manager",
          company: "TechGrowth Solutions",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
          content: "ChatSa has completely revolutionized our customer support workflow. We've reduced response times by 80% while maintaining high quality interactions. The ability to train the AI on our specific products has been game-changing!"
        },
        {
          name: "Michael Chen",
          role: "E-commerce Director",
          company: "GlobalShop",
          image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
          content: "After implementing ChatSa on our e-commerce platform, we've seen a 45% increase in customer satisfaction scores and a 30% reduction in support tickets. The ROI has been incredible and setup was surprisingly easy."
        },
        {
          name: "Jennifer Smith",
          role: "CTO",
          company: "InnovateNow",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
          content: "We evaluated several AI chatbot solutions, but ChatSa stood out for its exceptional customization capabilities and seamless integration with our existing systems. Three months in, and we couldn't be happier with our decision."
        }
      ]
    },
  },
  ar: {
    // Header
    'nav.features': 'المميزات',
    'nav.guide': 'الدليل',
    'nav.pricing': 'الأسعار',
    'nav.faq': 'الأسئلة الشائعة',
    'button.signin': 'تسجيل الدخول',
    'button.getstarted': 'ابدأ الآن',
    
    // Hero
    'hero.easiest': 'أسهل طريقة لإنشاء روبوتات المحادثة بالذكاء الاصطناعي',
    'hero.title': 'أنشئ روبوتات محادثة ذكية لـ',
    'hero.titleGradient': 'موقعك الإلكتروني في دقائق',
    'hero.subtitle': 'ابنِ روبوتات محادثة مخصصة مدربة على قاعدة معرفية موحدة. انشر ردودًا متسقة عبر جميع قنوات التواصل الاجتماعي بدون برمجة. اربط بموقعك الإلكتروني في دقيقتين.',
    'hero.cta': 'ابدأ مجانًا',
    'hero.knowledgeBase.title': 'جربه اليوم: أضف قاعدة المعرفة المخصصة الخاصة بك',
    'hero.knowledgeBase.button': 'رفع قاعدة المعرفة',
    'hero.knowledgeBase.modal.title': 'رفع قاعدة المعرفة الخاصة بك',
    'hero.knowledgeBase.modal.dropText': 'اسحب وأفلت ملف PDF الخاص بك، أو',
    'hero.knowledgeBase.modal.browse': 'تصفح الملفات',
    'hero.knowledgeBase.modal.formats': 'الصيغ المدعومة: PDF، DOCX، TXT (بحد أقصى 10 ميجابايت)',
    'hero.knowledgeBase.modal.or': 'أو',
    'hero.knowledgeBase.modal.paste': 'الصق النص الخاص بك',
    'hero.knowledgeBase.modal.placeholder': 'الصق محتوى قاعدة المعرفة الخاصة بك هنا...',
    'hero.knowledgeBase.modal.train': 'تدريب الروبوت الخاص بي',
    
    // CompanyLogos
    'companyLogos.title': 'موثوق به من قبل الشركات في جميع أنحاء العالم',
    
    // HowItWorks
    'howItWorks.title': 'كيف يعمل',
    'howItWorks.titleGradient': 'ChatSa',
    'howItWorks.subtitle': 'احصل على روبوت المحادثة الذكي الخاص بك جاهزاً للعمل في دقائق مع هذه الخطوات البسيطة.',
    'howItWorks.step1.number': '01',
    'howItWorks.step1.title': 'قم بتحميل بياناتك',
    'howItWorks.step1.description': 'أضف المستندات أو ملفات PDF أو اربط موقعك الإلكتروني لتدريب روبوت المحادثة الذكي على المحتوى الخاص بك.',
    'howItWorks.step2.number': '02',
    'howItWorks.step2.title': 'خصص روبوت المحادثة الخاص بك',
    'howItWorks.step2.description': 'قم بتخصيص مظهر وسلوك وردود الروبوت الخاص بك لتتناسب مع علامتك التجارية ومتطلباتك.',
    'howItWorks.step3.number': '03',
    'howItWorks.step3.title': 'دمجه مع موقعك الإلكتروني',
    'howItWorks.step3.description': 'أضف سطراً واحداً من التعليمات البرمجية إلى موقعك الإلكتروني لتضمين روبوت المحادثة الذكي الخاص بك وبدء التفاعل مع الزوار.',
    'howItWorks.benefit1': 'لا حاجة لمهارات البرمجة أو التقنية',
    'howItWorks.benefit2': 'يعمل مع جميع منصات المواقع الإلكترونية',
    'howItWorks.benefit3': 'ابدأ بالتفاعل مع الزوار في دقائق',
    
    // IndustryUseCases
    'industryUseCases.title': 'حلول الصناعات',
    'industryUseCases.subtitle': 'يتكيف ChatSa مع احتياجات صناعتك الفريدة بحلول روبوتات الدردشة الذكية المتخصصة.',
    'industryUseCases.learnMore': 'اعرف المزيد',
    'industryUseCases.healthcare.name': 'الرعاية الصحية',
    'industryUseCases.healthcare.description': 'توفير دعم المرضى على مدار الساعة، وجدولة المواعيد، والإجابة على الأسئلة الطبية، وتبسيط المهام الإدارية.',
    'industryUseCases.healthcare.benefits.1': 'الفحص المسبق للمرضى',
    'industryUseCases.healthcare.benefits.2': 'جدولة المواعيد',
    'industryUseCases.healthcare.benefits.3': 'المعلومات الطبية',
    'industryUseCases.healthcare.benefits.4': 'استفسارات التأمين',
    'industryUseCases.legal.name': 'القانون',
    'industryUseCases.legal.description': 'أتمتة استقبال العملاء، والإجابة على الأسئلة القانونية الشائعة، وصياغة المستندات الأساسية، وتقديم تحديثات حالة القضية.',
    'industryUseCases.legal.benefits.1': 'أتمتة استقبال العملاء',
    'industryUseCases.legal.benefits.2': 'مساعدة الأسئلة الشائعة القانونية',
    'industryUseCases.legal.benefits.3': 'صياغة المستندات',
    'industryUseCases.legal.benefits.4': 'تحديثات حالة القضية',
    'industryUseCases.ecommerce.name': 'التجارة الإلكترونية',
    'industryUseCases.ecommerce.description': 'تعزيز المبيعات من خلال توصيات المنتجات، والتعامل مع استفسارات الطلبات، ومعالجة المرتجعات، وتقديم مساعدة التسوق الشخصية.',
    'industryUseCases.ecommerce.benefits.1': 'توصيات المنتجات',
    'industryUseCases.ecommerce.benefits.2': 'تتبع الطلب',
    'industryUseCases.ecommerce.benefits.3': 'معالجة المرتجعات',
    'industryUseCases.ecommerce.benefits.4': 'استفسارات المخزون',
    'industryUseCases.education.name': 'التعليم',
    'industryUseCases.education.description': 'دعم الطلاب بمعلومات الدورة التدريبية، ومساعدة المهام، ومساعدة التسجيل، والاستفسارات الإدارية.',
    'industryUseCases.education.benefits.1': 'معلومات الدورة',
    'industryUseCases.education.benefits.2': 'إرشادات المهام',
    'industryUseCases.education.benefits.3': 'دعم التسجيل',
    'industryUseCases.education.benefits.4': 'المساعدة الإدارية',
    'industryUseCases.realEstate.name': 'العقارات',
    'industryUseCases.realEstate.description': 'تأهيل العملاء المحتملين، وجدولة المشاهدات، والإجابة على أسئلة العقارات، وتوفير معلومات الحي.',
    'industryUseCases.realEstate.benefits.1': 'مطابقة العقارات',
    'industryUseCases.realEstate.benefits.2': 'جدولة المشاهدات',
    'industryUseCases.realEstate.benefits.3': 'معلومات الأحياء',
    'industryUseCases.realEstate.benefits.4': 'حسابات الرهن العقاري',
    'industryUseCases.financialServices.name': 'الخدمات المالية',
    'industryUseCases.financialServices.description': 'المساعدة في استفسارات الحساب، وشرح المنتجات المالية، وتقديم المشورة المالية الأساسية، واكتشاف الاحتيال.',
    'industryUseCases.financialServices.benefits.1': 'إدارة الحساب',
    'industryUseCases.financialServices.benefits.2': 'شرح المنتجات',
    'industryUseCases.financialServices.benefits.3': 'التوجيه المالي',
    'industryUseCases.financialServices.benefits.4': 'اكتشاف الاحتيال',
    testimonials: {
      title: "ماذا يقول مستخدمونا",
      subtitle: "انضم إلى الآلاف من المستخدمين الراضين الذين حولوا دعم العملاء لديهم باستخدام تشات سا.",
      testimonials: [
        {
          name: "سارة جونسون",
          role: "مديرة دعم العملاء",
          company: "حلول تيك غروث",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
          content: "لقد أحدثت تشات سا ثورة كاملة في سير عمل دعم العملاء لدينا. قللنا أوقات الاستجابة بنسبة 80٪ مع الحفاظ على تفاعلات عالية الجودة. القدرة على تدريب الذكاء الاصطناعي على منتجاتنا المحددة كانت تغييرًا جذريًا!"
        },
        {
          name: "مايكل تشن",
          role: "مدير التجارة الإلكترونية",
          company: "جلوبال شوب",
          image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
          content: "بعد تنفيذ تشات سا على منصة التجارة الإلكترونية لدينا، شهدنا زيادة بنسبة 45٪ في درجات رضا العملاء وانخفاضًا بنسبة 30٪ في تذاكر الدعم. كان العائد على الاستثمار مذهلاً والإعداد كان سهلاً بشكل مفاجئ."
        },
        {
          name: "جينيفر سميث",
          role: "المديرة التقنية",
          company: "إنوفيت ناو",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
          content: "لقد قيّمنا العديد من حلول روبوتات الدردشة بالذكاء الاصطناعي، لكن تشات سا تميزت بقدراتها الاستثنائية للتخصيص والتكامل السلس مع أنظمتنا الحالية. بعد ثلاثة أشهر، لا يمكننا أن نكون أكثر سعادة بقرارنا."
        }
      ]
    },
  }
} as const;

// Type for translation keys
type TranslationKey = keyof typeof translations.en;

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [locale, setLocaleState] = useState<LocaleType>('en');
  
  // Determine locale from pathname on initial load
  useEffect(() => {
    const pathnameLocale = pathname.startsWith('/ar') ? 'ar' : 'en';
    setLocaleState(pathnameLocale);
  }, [pathname]);
  
  // Change locale and redirect to appropriate path
  const setLocale = (newLocale: LocaleType) => {
    setLocaleState(newLocale);
    
    // Redirect to the equivalent page in the new locale
    if (newLocale === 'ar' && !pathname.startsWith('/ar')) {
      router.push(`/ar${pathname}`);
    } else if (newLocale === 'en' && pathname.startsWith('/ar')) {
      router.push(pathname.replace(/^\/ar/, ''));
    }
  };
  
  // Translation function
  const t = (key: string) => {
    // Handle nested keys like 'testimonials.title'
    if (key.includes('.')) {
      const keys = key.split('.');
      let value = translations[locale] as any;
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return key; // Key not found
        }
      }
      
      return value;
    }
    
    return (translations[locale] as any)[key] || key;
  };
  
  // Check if current locale is RTL
  const isRTL = locale === 'ar';
  
  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, isRTL }}>
      {children}
    </LocaleContext.Provider>
  );
}; 