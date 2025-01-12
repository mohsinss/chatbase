"use client";

import { useState } from "react";

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Free",
      price: "0",
      yearlyPrice: "0",
      period: isYearly ? "Per Year" : "Forever",
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
      footnote: "Chatbots get deleted after 14 days of inactivity on the free plan.",
      buttonText: "Get started",
      buttonStyle: "white"
    },
    {
      name: "Hobby",
      price: "19",
      yearlyPrice: "190",
      period: isYearly ? "Per Year" : "Per Month",
      features: [
        "Everything in Free, plus...",
        "Access to advanced models",
        "2,000 message credits/month",
        "2 chatbots",
        "1 AI Action/chatbot",
        "11,000,000 characters/chatbot",
        "Unlimited links to train on",
        "API access",
        "Integrations",
        "Basic Analytics"
      ],
      buttonText: "Subscribe",
      buttonStyle: "white"
    },
    {
      name: "Standard",
      price: "99",
      yearlyPrice: "990",
      period: isYearly ? "Per Year" : "Per Month",
      features: [
        "Everything in Hobby, plus...",
        "10,000 message credits/month",
        "5 chatbots",
        "2 AI Actions/chatbot",
        "3 team members"
      ],
      buttonText: "Subscribe",
      buttonStyle: "dark"
    },
    {
      name: "Unlimited",
      price: "399",
      yearlyPrice: "3,990",
      period: isYearly ? "Per Year" : "Per Month",
      features: [
        "Everything in Standard, plus...",
        "40,000 message credits/month included",
        "10 chatbots",
        "3 AI Actions/chatbot",
        "5 team members",
        "Remove 'Powered by Chatbase'",
        "Use your own custom domains",
        "Advanced Analytics"
      ],
      footnote: "(Messages over the limit will use your OpenAI API Key)",
      buttonText: "Subscribe",
      buttonStyle: "white"
    }
  ];

  return (
    <div className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Predictable Pricing</h1>
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-purple-600">Scalable</span>{" "}
            <span className="text-pink-600">Plans</span>
          </h2>
          <p className="text-gray-600 mb-8">
            Get 2 months for free by subscribing yearly.
          </p>
          
          {/* Pricing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                isYearly ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>Yearly</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">
                  ${isYearly ? plan.yearlyPrice : plan.price}
                </span>
                <span className="text-gray-500 ml-2">{plan.period}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.footnote && (
                <p className="text-sm text-gray-500 mb-8">{plan.footnote}</p>
              )}
              <button
                className={`w-full py-2 px-4 rounded-lg border border-gray-200 
                  ${
                    plan.buttonStyle === 'dark'
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                  }
                  transition-colors`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 