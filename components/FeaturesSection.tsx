"use client";

import React from 'react';
import { Bot, Zap, Database, File, Clock, Globe, Code, Lock } from "lucide-react";

const features = [
  {
    icon: <Bot className="h-6 w-6 text-blue-600" />,
    title: "Instant AI Chatbot",
    description: "Create a custom chatbot based on your data in just 2 minutes. No coding required.",
  },
  {
    icon: <Database className="h-6 w-6 text-blue-600" />,
    title: "Train on Your Data",
    description: "Upload documents, PDFs, or connect to your website to train your bot on your specific content.",
  },
  {
    icon: <Globe className="h-6 w-6 text-blue-600" />,
    title: "Website Integration",
    description: "Seamlessly add your chatbot to any website with a simple embed code.",
  },
  {
    icon: <Clock className="h-6 w-6 text-blue-600" />,
    title: "Always Up-to-Date",
    description: "Keep your chatbot current with automatic updates and continuous learning.",
  },
  {
    icon: <Zap className="h-6 w-6 text-blue-600" />,
    title: "Powered by GPT-4",
    description: "Leverage the latest AI technology for natural, accurate conversations.",
  },
  {
    icon: <File className="h-6 w-6 text-blue-600" />,
    title: "Multiple File Types",
    description: "Upload PDFs, DOCs, TXTs, and more to build your knowledge base.",
  },
  {
    icon: <Code className="h-6 w-6 text-blue-600" />,
    title: "API Access",
    description: "Access your chatbot via API for custom integrations and advanced use cases.",
  },
  {
    icon: <Lock className="h-6 w-6 text-blue-600" />,
    title: "Privacy Focused",
    description: "Your data stays private and secure with enterprise-grade security measures.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Build <span className="text-gradient">Intelligent Chatbots</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create AI chatbots that engage your visitors, answer questions, and boost conversions, all without writing a single line of code.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover-lift hover-shadow"
            >
              <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 