"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function HowItWorks() {
  const observerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        } else {
          entry.target.classList.remove('animate-in');
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, options);

    observerRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observerRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const steps = [
    {
      number: "01",
      title: "Upload Your Data",
      description: "Connect your website, upload documents, or provide custom data to train your AI chatbot.",
      image: "/steps/upload-data.png"
    },
    {
      number: "02",
      title: "Customize Your Chatbot",
      description: "Personalize the appearance, behavior, and responses of your chatbot to match your brand.",
      image: "/steps/customize.png"
    },
    {
      number: "03",
      title: "Deploy and Integrate",
      description: "Add your chatbot to your website with a simple code snippet or use our API for custom integrations.",
      image: "/steps/deploy.png"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 opacity-0 transition-all duration-1000 transform translate-y-10"
          ref={el => { observerRefs.current[0] = el; }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">How ChatSa Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create and deploy your AI chatbot in just three simple steps.
          </p>
        </div>

        <div className="space-y-32">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center`}
            >
              <div
                className={`md:w-1/2 mb-8 md:mb-0 opacity-0 transition-all duration-1000 transform ${index % 2 === 0 ? 'translate-x-20' : '-translate-x-20'
                  }`}
                ref={el => { observerRefs.current[index * 2 + 1] = el }}
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-indigo-100 to-violet-100 rounded-2xl transform -rotate-2"></div>
                  <div className="relative rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={600}
                      height={400}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
              <div
                className={`md:w-1/2 ${index % 2 === 1 ? 'md:pr-16' : 'md:pl-16'} opacity-0 transition-all duration-1000 transform ${index % 2 === 0 ? '-translate-x-20' : 'translate-x-20'
                  }`}
                ref={el => { observerRefs.current[index * 2 + 2] = el }}
              >
                <div className="inline-block text-5xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-4">
                  {step.number}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  {step.title}
                </h3>
                <p className="text-xl text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .animate-in {
          opacity: 1 !important;
          transform: translate(0, 0) !important;
        }
      `}</style>
    </section>
  );
} 