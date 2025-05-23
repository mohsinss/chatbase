"use client";

import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import ButtonSignin from "./ButtonSignin";

// <Pricing/> displays the pricing plans for your app
// It's your Stripe config in config.js.stripe.plans[] that will be used to display the plans
// <ButtonCheckout /> renders a button that will redirect the user to Stripe checkout called the /api/stripe/create-checkout API endpoint with the correct priceId

export default function Pricing() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Free",
      price: "$0",
      yearlyPrice: "$0",
      description: "Perfect for getting started",
      features: [
        "Access to fast models",
        "20 message credits/month",
        "1 chatbot",
        "400,000 characters/chatbot",
        "1 team member",
        "Limit to 10 links to train on",
        "Embed on unlimited websites",
        "Capture leads",
        "View chat history",
        "WhatsApp chatbot"
      ],
      cta: "Get started",
      popular: false,
      footnote: "Chatbots get deleted after 14 days of inactivity on the free plan."
    },
    {
      name: "Hobby",
      price: "$19",
      yearlyPrice: "$190",
      period: isYearly ? "/year" : "/month",
      description: "For individual creators",
      features: [
        "Everything in Free, plus...",
        "Access to advanced models",
        "2,000 message credits/month",
        "2 chatbots",
        "11,000,000 characters/chatbot",
        "Unlimited links to train on",
        "API access",
        "Integrations",
        "Basic Analytics",
        "Chatbot integration for Facebook and Instagram"
      ],
      cta: "Subscribe",
      popular: false
    },
    {
      name: "Standard",
      price: "$99",
      yearlyPrice: "$990",
      period: isYearly ? "/year" : "/month",
      description: "For growing businesses",
      features: [
        "Everything in Hobby, plus...",
        "10,000 message credits/month",
        "5 chatbots",
        "3 team members",
        "Unlimited YouTube links to train",
        "Unlimited AI actions (agentic AI)",
        "Calendar scheduling",
        "Advanced social media chatbot actions"
      ],
      cta: "Subscribe",
      popular: true
    },
    {
      name: "Unlimited",
      price: "$399",
      yearlyPrice: "$3,990",
      period: isYearly ? "/year" : "/month",
      description: "For large organizations",
      features: [
        "Everything in Standard, plus...",
        "40,000 message credits/month included",
        "10 chatbots",
        "5 team members",
        "Remove 'Powered by Chatbase'",
        "Use your own custom domains",
        "Advanced Analytics",
        "Advanced Twitter and Shopify chatbot actions"
      ],
      cta: "Subscribe",
      popular: false,
      footnote: "(Messages over the limit will use your OpenAI API Key)"
    }
  ];

  // Add scroll monitoring
  useEffect(() => {
    const handleScroll = () => {
      if (!carouselRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const cardWidth = 350 + 24;
      const totalCards = plans.length * 3; // We have 3 sets of plans
      const singleSetWidth = cardWidth * plans.length;
      
      // If scrolled to the beginning of first set, jump to beginning of second set
      if (scrollLeft <= 0) {
        carouselRef.current.scrollTo({
          left: singleSetWidth,
          behavior: 'instant'
        });
      }
      
      // If scrolled to the end of third set, jump to end of second set
      if (scrollLeft >= scrollWidth - clientWidth - 10) {
        carouselRef.current.scrollTo({
          left: singleSetWidth * 2 - clientWidth,
          behavior: 'instant'
        });
      }
      
      setAtStart(scrollLeft <= singleSetWidth + 10);
      setAtEnd(scrollLeft >= singleSetWidth * 2 - clientWidth - 10);
    };
    
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    
    return () => {
      if (carousel) {
        carousel.removeEventListener('scroll', handleScroll);
      }
    };
  }, [plans.length]);

  // Center carousel on load
  useEffect(() => {
    if (carouselRef.current) {
      // Center on the Standard plan (index 2, most popular) in the first set
      const cardWidth = 350 + 24; // card width + gap
      const centerPosition = cardWidth * (plans.length + 1); // Position to show Standard plan centered in first duplicate set
      carouselRef.current.scrollTo({
        left: centerPosition,
        behavior: 'instant'
      });
    }
  }, []);

  const scrollLeft = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: -356, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: 356, behavior: 'smooth' });
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Predictable Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Scalable plans to fit your needs. Get 2 months free by subscribing yearly.
          </p>
          
          {/* Pricing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8 mb-10">
            <span className={`text-sm ${!isYearly ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isYearly ? 'bg-indigo-600' : 'bg-gray-200'}`}
              aria-pressed={isYearly}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isYearly ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
            <span className={`text-sm ${isYearly ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>Yearly</span>
          </div>
        </div>
        
        <div className="relative">
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
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory pt-12 px-6"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {/* Render three sets of plans for infinite scroll */}
            {[...plans, ...plans, ...plans].map((plan, index) => {
              const originalIndex = index % plans.length;
              const setNumber = Math.floor(index / plans.length);
              return (
                <div key={`${setNumber}-${originalIndex}`} className="flex-none w-[350px] snap-center relative group">
                  {plan.popular && (
                    <div className="absolute -top-5 inset-x-0 flex justify-center z-50">
                      <div className="bg-indigo-600 group-hover:bg-white text-white group-hover:text-purple-600 px-8 py-2 rounded-full text-base font-semibold shadow-lg transition-colors duration-500 border border-transparent group-hover:border-purple-600">
                        Most Popular
                      </div>
                    </div>
                  )}
                  <div 
                    className={`bg-white rounded-xl p-8 border relative overflow-hidden h-[650px] ${
                      plan.popular 
                        ? 'border-indigo-500 shadow-lg hover:border-purple-600 transition-colors duration-500' 
                        : 'border-gray-200 shadow-sm transition-all duration-500 before:absolute before:inset-0 before:bg-purple-50 before:origin-bottom-right before:scale-0 before:transition-transform before:duration-500 before:ease-out hover:before:scale-100 before:rounded-xl hover:border-purple-200'
                    }`}
                  >
                    {plan.popular && (
                      <>
                        {/* Animated background overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tl from-purple-600 via-indigo-600 to-violet-700 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"></div>
                        <div className="absolute inset-0 bg-gradient-to-tl from-purple-600/0 via-purple-600/50 to-purple-600 translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-1000 ease-out"></div>
                      </>
                    )}
                    
                    <div className="flex flex-col h-full relative z-10">
                      <div className={`text-center ${plan.popular ? 'mt-6 mb-8' : 'mb-8'}`}>
                        <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'group-hover:text-white transition-colors duration-500' : ''}`}>{plan.name}</h3>
                        <div className="flex items-center justify-center">
                          <span className={`text-4xl font-bold ${plan.popular ? 'group-hover:text-white transition-colors duration-500' : ''}`}>
                            {isYearly ? plan.yearlyPrice || plan.price : plan.price}
                          </span>
                          {plan.period && <span className={`text-gray-500 ml-1 ${plan.popular ? 'group-hover:text-gray-200 transition-colors duration-500' : ''}`}>{plan.period}</span>}
                        </div>
                        <p className={`text-gray-600 mt-2 ${plan.popular ? 'group-hover:text-gray-200 transition-colors duration-500' : ''}`}>{plan.description}</p>
                      </div>
                      
                      <div className="flex-grow  mb-6 max-h-[380px] pr-2" style={{ scrollbarWidth: 'thin' }}>
                        <ul className="space-y-3">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <Check className={`h-5 w-5 mr-2 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-indigo-600 group-hover:text-white transition-colors duration-500' : 'text-indigo-600'}`} />
                              <span className={plan.popular ? 'group-hover:text-white transition-colors duration-500' : ''}>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        {plan.footnote && (
                          <p className={`text-sm text-gray-500 mt-4 ${plan.popular ? 'group-hover:text-gray-300 transition-colors duration-500' : ''}`}>{plan.footnote}</p>
                        )}
                      </div>
                      
                      <div className="text-center mt-auto">
                        <ButtonSignin 
                          text={plan.cta}
                          extraStyle={`w-full py-4 text-lg font-semibold ${
                            plan.popular 
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700 group-hover:bg-white group-hover:text-purple-600 group-hover:border-white transition-all duration-500' 
                              : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
