"use client";

import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

// <Pricing/> displays the pricing plans for your app
// It's your Stripe config in config.js.stripe.plans[] that will be used to display the plans
// <ButtonCheckout /> renders a button that will redirect the user to Stripe checkout called the /api/stripe/create-checkout API endpoint with the correct priceId

export default function Pricing() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  // Add scroll monitoring
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
    
    // Cleanup function
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
        "View chat history"
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
        "Basic Analytics"
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
        "3 team members"
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
        "Advanced Analytics"
      ],
      cta: "Subscribe",
      popular: false,
      footnote: "(Messages over the limit will use your OpenAI API Key)"
    }
  ];

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
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`flex-none w-[350px] bg-white rounded-xl p-8 border snap-center ${
                  plan.popular 
                    ? 'border-indigo-500 shadow-lg relative' 
                    : 'border-gray-200 shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 inset-x-0 flex justify-center">
                    <div className="bg-indigo-600 text-white px-8 py-2 rounded-full text-base font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}
                <div className="flex flex-col h-full">
                  <div className={`text-center ${plan.popular ? 'mt-4' : 'mb-8'}`}>
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-center justify-center">
                      <span className="text-4xl font-bold">
                        {isYearly ? plan.yearlyPrice || plan.price : plan.price}
                      </span>
                      {plan.period && <span className="text-gray-500 ml-1">{plan.period}</span>}
                    </div>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </div>
                  
                  <div className="flex-grow overflow-y-auto mb-6 max-h-[280px] pr-2" style={{ scrollbarWidth: 'thin' }}>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {plan.footnote && (
                      <p className="text-sm text-gray-500 mt-4">{plan.footnote}</p>
                    )}
                  </div>
                  
                  <div className="text-center mt-auto">
                    <Link href={plan.name === "Unlimited" ? "/contact" : "/signup"}>
                      <Button 
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                            : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
                        }`}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
