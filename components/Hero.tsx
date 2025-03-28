"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Sparkles, Zap, ChevronDown, Globe } from "lucide-react";
import ButtonSignin from "./ButtonSignin";

// Define types
type LanguageType = "english" | "arabic" | "spanish";
type PlatformType = "whatsapp" | "twitter" | "facebook" | "instagram" | "snapchat";
type MessageType = {
  text: string;
  isBot: boolean;
};

const Hero = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [language, setLanguage] = useState<LanguageType>("english");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  
  // Language options with flags
  const languages = [
    { id: "english" as LanguageType, name: "English", flag: "🇺🇸" },
    { id: "arabic" as LanguageType, name: "العربية", flag: "🇦🇪" },
    { id: "spanish" as LanguageType, name: "Español", flag: "🇪🇸" },
  ];

  // Monitor scroll position to detect start/end
  useEffect(() => {
    const handleScroll = () => {
      if (!carouselRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setAtStart(scrollLeft === 0);
      setAtEnd(Math.abs(scrollWidth - clientWidth - scrollLeft) < 10);
    };
    
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
    }
    
    return () => {
      if (carousel) {
        carousel.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scrollLeft = () => {
    if (!carouselRef.current) return;
    
    if (atStart) {
      carouselRef.current.scrollTo({
        left: carouselRef.current.scrollWidth,
        behavior: 'instant'
      });
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollBy({ left: -370, behavior: 'smooth' });
        }
      }, 10);
    } else {
      carouselRef.current.scrollBy({ left: -370, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (!carouselRef.current) return;
    
    if (atEnd) {
      carouselRef.current.scrollTo({
        left: 0,
        behavior: 'instant'
      });
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollBy({ left: 370, behavior: 'smooth' });
        }
      }, 10);
    } else {
      carouselRef.current.scrollBy({ left: 370, behavior: 'smooth' });
    }
  };

  // Messages for different platforms and languages
  const getMessages = (platform: PlatformType): MessageType[] => {
    const messages = {
      whatsapp: {
        english: [
          { text: "👋 Hello! Welcome to Golden Gym. How can I assist you today?", isBot: true },
          { text: "Hi! I'm interested in your membership options.", isBot: false },
          { text: "We offer several plans: Basic ($29/month), Premium ($49/month), and VIP ($79/month). Each includes different amenities. Would you like more details on any specific plan?", isBot: true },
          { text: "What's included in the Premium plan?", isBot: false },
          { text: "Our Premium plan includes unlimited gym access, 2 free personal training sessions monthly, group classes, sauna access, and nutritional guidance. Would you like to schedule a tour?", isBot: true }
        ],
        arabic: [
          { text: "👋 مرحبًا! مرحبًا بك في جولدن جيم. كيف يمكنني مساعدتك اليوم؟", isBot: true },
          { text: "مرحبًا! أنا مهتم بخيارات العضوية لديكم.", isBot: false },
          { text: "نقدم عدة خطط: الأساسية (29 دولارًا/شهريًا)، المتميزة (49 دولارًا/شهريًا)، وكبار الشخصيات (79 دولارًا/شهريًا). يشمل كل منها وسائل راحة مختلفة. هل ترغب في مزيد من التفاصيل حول أي خطة محددة؟", isBot: true },
          { text: "ما الذي تتضمنه الخطة المتميزة؟", isBot: false },
          { text: "تتضمن خطتنا المتميزة وصولاً غير محدود إلى الصالة الرياضية، وجلستين مجانيتين للتدريب الشخصي شهريًا، ودروس جماعية، والوصول إلى الساونا، والإرشاد الغذائي. هل ترغب في تحديد موعد لجولة؟", isBot: true }
        ],
        spanish: [
          { text: "👋 ¡Hola! Bienvenido a Golden Gym. ¿Cómo puedo ayudarte hoy?", isBot: true },
          { text: "¡Hola! Estoy interesado en sus opciones de membresía.", isBot: false },
          { text: "Ofrecemos varios planes: Básico (29$/mes), Premium (49$/mes) y VIP (79$/mes). Cada uno incluye diferentes comodidades. ¿Te gustaría más detalles sobre algún plan específico?", isBot: true },
          { text: "¿Qué incluye el plan Premium?", isBot: false },
          { text: "Nuestro plan Premium incluye acceso ilimitado al gimnasio, 2 sesiones gratuitas de entrenamiento personal al mes, clases grupales, acceso a sauna y orientación nutricional. ¿Te gustaría programar una visita?", isBot: true }
        ]
      },
      twitter: {
        english: [
          { text: "Welcome to Golden Gym! How can we help you today?", isBot: true },
          { text: "Do you offer any special classes?", isBot: false },
          { text: "Yes! We have HIIT, Yoga, Spin, Zumba, and Boxing classes daily. Our most popular is the 6PM HIIT class with trainer Mike!", isBot: true },
          { text: "Are there any special promotions right now?", isBot: false },
          { text: "Absolutely! We're running a summer special: 20% off all annual memberships and no joining fee if you sign up before the end of the month. Would you like a free day pass to try us out?", isBot: true }
        ],
        arabic: [
          { text: "مرحبًا بك في جولدن جيم! كيف يمكننا مساعدتك اليوم؟", isBot: true },
          { text: "هل تقدمون أي دروس خاصة؟", isBot: false },
          { text: "نعم! لدينا دروس HIIT، واليوغا، والدراجات، والزومبا، والملاكمة يوميًا. أكثرها شعبية هو درس HIIT الساعة 6 مساءً مع المدرب مايك!", isBot: true },
          { text: "هل هناك أي عروض ترويجية خاصة الآن؟", isBot: false },
          { text: "بالتأكيد! نحن نقدم عرضًا صيفيًا خاصًا: خصم 20% على جميع العضويات السنوية وبدون رسوم اشتراك إذا اشتركت قبل نهاية الشهر. هل ترغب في الحصول على تصريح يوم مجاني لتجربتنا؟", isBot: true }
        ],
        spanish: [
          { text: "¡Bienvenido a Golden Gym! ¿Cómo podemos ayudarte hoy?", isBot: true },
          { text: "¿Ofrecen clases especiales?", isBot: false },
          { text: "¡Sí! Tenemos clases diarias de HIIT, Yoga, Spinning, Zumba y Boxeo. ¡La más popular es la clase HIIT de las 6PM con el entrenador Mike!", isBot: true },
          { text: "¿Hay alguna promoción especial en este momento?", isBot: false },
          { text: "¡Absolutamente! Estamos ofreciendo una promoción de verano: 20% de descuento en todas las membresías anuales y sin cuota de inscripción si te registras antes de fin de mes. ¿Te gustaría un pase de día gratuito para probarnos?", isBot: true }
        ]
      },
      facebook: {
        english: [
          { text: "Hi there! Welcome to Golden Gym's Facebook chat. How may I help you today?", isBot: true },
          { text: "Do you have personal trainers available?", isBot: false },
          { text: "Absolutely! We have 12 certified personal trainers specializing in different areas like weight loss, muscle building, rehabilitation, and sports performance. Each trainer offers a free consultation to new members.", isBot: true },
          { text: "What are your opening hours?", isBot: false },
          { text: "Golden Gym is open Monday-Friday 5AM-11PM, Saturday 7AM-10PM, and Sunday 8AM-8PM. Our busiest hours are typically 5-8PM on weekdays. Would you like information about our less crowded times?", isBot: true }
        ],
        arabic: [
          { text: "مرحبًا! مرحبًا بك في دردشة فيسبوك الخاصة بجولدن جيم. كيف يمكنني مساعدتك اليوم؟", isBot: true },
          { text: "هل لديكم مدربين شخصيين متاحين؟", isBot: false },
          { text: "بالتأكيد! لدينا 12 مدربًا شخصيًا معتمدًا متخصصين في مجالات مختلفة مثل فقدان الوزن، وبناء العضلات، وإعادة التأهيل، والأداء الرياضي. يقدم كل مدرب استشارة مجانية للأعضاء الجدد.", isBot: true },
          { text: "ما هي ساعات العمل الخاصة بكم؟", isBot: false },
          { text: "جولدن جيم مفتوح من الاثنين إلى الجمعة من 5 صباحًا حتى 11 مساءً، والسبت من 7 صباحًا حتى 10 مساءً، والأحد من 8 صباحًا حتى 8 مساءً. ساعات الذروة لدينا عادة من 5 إلى 8 مساءً في أيام الأسبوع. هل ترغب في معلومات حول أوقاتنا الأقل ازدحامًا؟", isBot: true }
        ],
        spanish: [
          { text: "¡Hola! Bienvenido al chat de Facebook de Golden Gym. ¿Cómo puedo ayudarte hoy?", isBot: true },
          { text: "¿Tienen entrenadores personales disponibles?", isBot: false },
          { text: "¡Absolutamente! Tenemos 12 entrenadores personales certificados especializados en diferentes áreas como pérdida de peso, construcción muscular, rehabilitación y rendimiento deportivo. Cada entrenador ofrece una consulta gratuita a los nuevos miembros.", isBot: true },
          { text: "¿Cuáles son sus horarios de apertura?", isBot: false },
          { text: "Golden Gym está abierto de lunes a viernes de 5AM a 11PM, sábados de 7AM a 10PM y domingos de 8AM a 8PM. Nuestras horas más concurridas son típicamente de 5-8PM en días laborables. ¿Te gustaría información sobre nuestros horarios menos concurridos?", isBot: true }
        ]
      },
      instagram: {
        english: [
          { text: "✨ Welcome to Golden Gym's Instagram! How can we help you?", isBot: true },
          { text: "I saw your post about the new equipment. What did you get?", isBot: false },
          { text: "We've just added brand new Technogym equipment including treadmills with immersive screens, a full cable machine section, and a functional training area with smart tracking capabilities. Come check it out!", isBot: true },
          { text: "Do you post workout routines?", isBot: false },
          { text: "Yes! We share workout routines every Monday, nutrition tips on Wednesdays, and success stories on Fridays. Follow us for daily motivation and exclusive member promos. Would you like us to tag you in our next workout post?", isBot: true }
        ],
        arabic: [
          { text: "✨ مرحبًا بك في إنستغرام جولدن جيم! كيف يمكننا مساعدتك؟", isBot: true },
          { text: "رأيت منشورك عن المعدات الجديدة. ماذا حصلت؟", isBot: false },
          { text: "لقد أضفنا للتو معدات Technogym جديدة تمامًا بما في ذلك أجهزة المشي مع شاشات غامرة، وقسم كامل لآلات الكابل، ومنطقة تدريب وظيفي مع إمكانيات تتبع ذكية. تعال وتحقق من ذلك!", isBot: true },
          { text: "هل تنشر روتين تمارين؟", isBot: false },
          { text: "نعم! نشارك روتين التمارين كل يوم اثنين، ونصائح التغذية يوم الأربعاء، وقصص النجاح يوم الجمعة. تابعنا للحصول على تحفيز يومي وعروض ترويجية حصرية للأعضاء. هل تريد منا أن نضع علامة عليك في منشور التمرين القادم؟", isBot: true }
        ],
        spanish: [
          { text: "✨ ¡Bienvenido al Instagram de Golden Gym! ¿Cómo podemos ayudarte?", isBot: true },
          { text: "Vi tu publicación sobre el nuevo equipamiento. ¿Qué han adquirido?", isBot: false },
          { text: "¡Acabamos de añadir equipamiento nuevo de Technogym que incluye cintas de correr con pantallas inmersivas, una sección completa de máquinas de cable y un área de entrenamiento funcional con capacidades de seguimiento inteligente. ¡Ven a verlo!", isBot: true },
          { text: "¿Publican rutinas de entrenamiento?", isBot: false },
          { text: "¡Sí! Compartimos rutinas de entrenamiento todos los lunes, consejos de nutrición los miércoles e historias de éxito los viernes. Síguenos para motivación diaria y promociones exclusivas para miembros. ¿Te gustaría que te etiquetáramos en nuestra próxima publicación de entrenamiento?", isBot: true }
        ]
      },
      snapchat: {
        english: [
          { text: "👋 Thanks for connecting with Golden Gym on Snapchat! Our bot is coming soon.", isBot: true },
          { text: "When will it be ready?", isBot: false },
          { text: "We're launching our full Snapchat service next month with daily workout snaps, exclusive behind-the-scenes content, and member spotlights. Stay tuned!", isBot: true }
        ],
        arabic: [
          { text: "👋 شكرًا لتواصلك مع جولدن جيم على سناب شات! الروبوت الخاص بنا قادم قريبًا.", isBot: true },
          { text: "متى سيكون جاهزًا؟", isBot: false },
          { text: "سنطلق خدمة سناب شات الكاملة الخاصة بنا الشهر المقبل مع لقطات تمرين يومية، ومحتوى حصري من وراء الكواليس، وتسليط الضوء على الأعضاء. ترقبوا!", isBot: true }
        ],
        spanish: [
          { text: "👋 ¡Gracias por conectarte con Golden Gym en Snapchat! Nuestro bot estará disponible pronto.", isBot: true },
          { text: "¿Cuándo estará listo?", isBot: false },
          { text: "Lanzaremos nuestro servicio completo de Snapchat el próximo mes con snaps diarios de entrenamiento, contenido exclusivo tras bastidores y destacados de miembros. ¡Mantente atento!", isBot: true }
        ]
      }
    };
    
    return messages[platform][language] || messages[platform].english;
  };

  return (
    <section className="pt-32 pb-2 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-blue-50 to-transparent opacity-70"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Language selector */}
        <div className="absolute top-0 left-4 z-50">
          <div className="relative">
            <button 
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow px-3 py-2 text-sm font-medium"
            >
              <Globe className="w-4 h-4" />
              {languages.find(l => l.id === language)?.flag}
              {languages.find(l => l.id === language)?.name}
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {isLangDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {languages.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        setLanguage(lang.id as LanguageType);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`${
                        language === lang.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      } flex items-center w-full px-4 py-2 text-sm`}
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-fade-up">
            <Sparkles className="inline-block w-4 h-4 mr-2" />
            The easiest way to create AI chatbots
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-up stagger-1">
            Create AI Chatbots for <br className="hidden md:block" />
            <span className="text-gradient">Your Website in Minutes</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 animate-fade-up stagger-2">
            Build custom AI chatbots trained on your data without coding. Connect to your website in 2 minutes.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 animate-fade-up stagger-3 w-full max-w-md mx-auto">
            <ButtonSignin 
              text="Get Started Free"
              extraStyle="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 hover-lift w-full"
            />
          </div>
        </div>
        
        <div className="mt-16 animate-blur-in">
          <div className="relative">
            <div className="neo-shadow rounded-2xl p-1 bg-gradient-to-r from-blue-50 to-white">
              <div className="overflow-hidden rounded-xl shadow-sm relative">
                {/* Fixed position buttons */}
                <button 
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white shadow-md rounded-full p-2"
                  onClick={scrollLeft}
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white shadow-md rounded-full p-2"
                  onClick={scrollRight}
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <div 
                  ref={carouselRef}
                  className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {/* Reordered with Twitter next to WhatsApp */}
                  {[
                    {
                      name: "WhatsApp Bot",
                      status: "Online",
                      bgColor: "bg-[#25D366]",
                      icon: "M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.287.129.332.202.045.073.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z",
                      messages: getMessages("whatsapp")
                    },
                    {
                      name: "Twitter Bot",
                      status: "Active",
                      bgColor: "bg-[#1DA1F2]",
                      icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
                      messages: getMessages("twitter")
                    },
                    {
                      name: "Facebook Bot",
                      status: "Active",
                      bgColor: "bg-[#1877F2]",
                      icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                      messages: getMessages("facebook")
                    },
                    {
                      name: "Instagram Bot",
                      status: "Online",
                      bgColor: "bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500",
                      icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
                      messages: getMessages("instagram")
                    },
                    {
                      name: "Snapchat Bot",
                      status: "Coming Soon",
                      bgColor: "bg-[#FFFC00]",
                      isComingSoon: true,
                      icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
                      messages: getMessages("snapchat")
                    }
                  ].map((bot, index) => (
                    <div key={index} className={`flex-none w-[350px] ${bot.bgColor} rounded-2xl p-4 shadow-lg snap-center relative`}>
                      {bot.isComingSoon && (
                        <div className="absolute top-0 left-0 bg-orange-700 text-white px-3 py-1 rounded-full text-sm font-medium z-20">
                          Coming Soon
                        </div>
                      )}
                      <div className={`bg-white rounded-xl p-4 h-[600px] flex flex-col ${bot.name === "WhatsApp Bot" ? "relative" : ""}`}>
                        {bot.name === "WhatsApp Bot" && (
                          <div 
                            className="absolute top-16 inset-x-0 bottom-0 rounded-xl overflow-hidden" 
                            style={{
                              backgroundImage: "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              opacity: 0.25
                            }}
                          ></div>
                        )}
                        
                        <div className="flex items-center gap-2 mb-4 z-10">
                          <div className={`w-10 h-10 rounded-full ${bot.bgColor} flex items-center justify-center`}>
                            <svg className={`w-6 h-6 ${bot.name === "Snapchat Bot" ? "text-black" : "text-white"}`} fill="currentColor" viewBox="0 0 24 24">
                              <path d={bot.icon} />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">{bot.name}</h3>
                            <p className="text-sm text-gray-500">{bot.status}</p>
                          </div>
                        </div>
                        
                        <div className={`flex-1 overflow-y-auto space-y-3 ${bot.isComingSoon ? "opacity-50" : ""} z-10`}>
                          {bot.messages.map((message, msgIndex) => (
                            <div key={msgIndex} className={`${message.isBot ? "bg-gray-100" : bot.bgColor} ${!message.isBot && !bot.isComingSoon ? "text-white" : ""} rounded-lg p-3 max-w-[80%] ${!message.isBot ? "ml-auto" : ""}`}>
                              <p className="text-sm">{message.text}</p>
                            </div>
                          ))}
                        </div>
                        
                        <div className={`mt-4 border-t pt-4 ${bot.isComingSoon ? "opacity-50" : ""} z-10`}>
                          <div className="flex gap-2">
                            <textarea 
                              className={`flex-1 resize-none rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-${bot.bgColor.split("bg-")[1]}`}
                              placeholder={bot.isComingSoon ? "Coming soon..." : "Type your message..."}
                              rows={1}
                              disabled={bot.isComingSoon}
                            />
                            <button className={`${bot.bgColor} ${bot.name === "Snapchat Bot" ? "text-black" : "text-white"} p-2 rounded-lg ${bot.isComingSoon ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 transition-opacity"}`}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="absolute -top-16 -right-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-gray-100 flex items-center">
              <Zap className="text-yellow-500 h-5 w-5 mr-2" />
              <div className="overflow-hidden w-[180px]">
                <div className="animate-marquee inline-flex whitespace-nowrap">
                  <span className="text-sm font-medium">Powered by Claude 3.7</span>
                  <span className="text-sm font-medium mx-4">•</span>
                  <span className="text-sm font-medium"> GPT4.5   </span>
                  <span className="text-sm font-medium mx-4">•</span>
                  <span className="text-sm font-medium">  DeepSeek </span>

                  <span className="text-sm font-medium mx-4">•</span>
                  <span className="text-sm font-medium"> Grok3 </span>

                  <span className="text-sm font-medium mx-4">•</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Custom Knowledge Base Section */}
        <div className="mt-1 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h2 className="text-2xl font-bold">Try It Today: Add Your Custom Knowledge Base</h2>
            <KnowledgeBaseUploader />
          </div>
        </div>
      </div>
    </section>
  );
};

// Knowledge Base Uploader Component
const KnowledgeBaseUploader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };
    
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);
  
  return (
    <div className="relative">
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg hover-lift flex items-center font-medium"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Upload Knowledge Base
      </Button>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div 
            ref={modalRef}
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Upload Your Knowledge Base</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-gray-500 mb-2">Drag and drop your PDF file, or</p>
                <Button className="bg-blue-50 text-blue-600 hover:bg-blue-100">Browse Files</Button>
                <p className="text-xs text-gray-400 mt-2">Supported formats: PDF, DOCX, TXT (Max 10MB)</p>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paste your text</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Paste your knowledge base content here..."
                ></textarea>
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6">
                Train My Bot
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
