"use client";

import React from 'react';
import { Check, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload your data",
    description: "Add documents, PDFs, or connect your website to train your AI chatbot on your specific content.",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1100&q=80",
  },
  {
    number: "02",
    title: "Customize your chatbot",
    description: "Personalize your bot's appearance, behavior, and responses to match your brand and requirements.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1100&q=80",
  },
  {
    number: "03",
    title: "Integrate with your website",
    description: "Add a single line of code to your website to embed your AI chatbot and start engaging with visitors.",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1100&q=80",
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How ChatSa <span className="text-gradient">Works</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get your AI chatbot up and running in minutes with these simple steps.
          </p>
        </div>
        
        <div className="space-y-24">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}
            >
              <div className="w-full md:w-1/2">
                <div className="overflow-hidden rounded-2xl shadow-lg">
                  <img 
                    src={step.image}
                    alt={step.title}
                    className="w-full h-auto hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/2 space-y-4">
                <div className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  Step {step.number}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">{step.title}</h3>
                <p className="text-gray-600 text-lg">{step.description}</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-700">No coding or technical skills needed</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-700">Works with all website platforms</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-700">Start engaging visitors in minutes</span>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 