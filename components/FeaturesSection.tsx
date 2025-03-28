"use client";

import React from 'react';
import { Bot, Zap, Database, File, Clock, Globe, Code, Lock } from "lucide-react";

const features = [
  {
    illustration: (
      <div className="w-full h-24 relative overflow-hidden transform transition-transform duration-300 group-hover:rotate-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_107%,#fdf4ff_0%,#e0f2fe_45%,#ede9fe_80%)] transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute h-12 w-12 -top-6 -left-6 bg-purple-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
          <div className="absolute h-16 w-16 -bottom-8 -right-6 bg-blue-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
        </div>
        <div className="relative h-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
          <Bot className="h-10 w-10 text-blue-600 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
        </div>
      </div>
    ),
    title: "Instant AI Chatbot",
    description: "Create a custom chatbot based on your data in just 2 minutes. No coding required.",
  },
  {
    illustration: (
      <div className="w-full h-24 relative overflow-hidden transform transition-transform duration-300 group-hover:rotate-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_107%,#f5f3ff_0%,#dbeafe_45%,#ede9fe_80%)] transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute h-14 w-14 -top-7 -right-7 bg-indigo-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
          <div className="absolute h-12 w-12 -bottom-6 -left-6 bg-blue-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
        </div>
        <div className="relative h-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
          <Database className="h-10 w-10 text-indigo-600 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
        </div>
      </div>
    ),
    title: "Train on Your Data",
    description: "Upload documents, PDFs, or connect to your website to train your bot on your specific content.",
  },
  {
    illustration: (
      <div className="w-full h-24 relative overflow-hidden transform transition-transform duration-300 group-hover:rotate-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_107%,#eef2ff_0%,#e0f2fe_45%,#f0f9ff_80%)] transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute h-16 w-16 -bottom-8 -right-8 bg-sky-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
          <div className="absolute h-12 w-12 -top-6 -left-6 bg-blue-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
        </div>
        <div className="relative h-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
          <Globe className="h-10 w-10 text-sky-600 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
        </div>
      </div>
    ),
    title: "Website Integration",
    description: "Seamlessly add your chatbot to any website with a simple embed code.",
  },
  {
    illustration: (
      <div className="w-full h-24 relative overflow-hidden transform transition-transform duration-300 group-hover:rotate-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_107%,#f0f9ff_0%,#e0f2fe_45%,#eff6ff_80%)] transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute h-14 w-14 -top-7 -left-7 bg-blue-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
          <div className="absolute h-12 w-12 -bottom-6 -right-6 bg-sky-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
        </div>
        <div className="relative h-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
          <Clock className="h-10 w-10 text-blue-600 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
        </div>
      </div>
    ),
    title: "Always Up-to-Date",
    description: "Keep your chatbot current with automatic updates and continuous learning.",
  },
  {
    illustration: (
      <div className="w-full h-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_107%,#f0f9ff_0%,#e0f2fe_45%,#ecfeff_80%)]" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute h-16 w-16 -bottom-8 -left-8 bg-cyan-200 rounded-full" />
          <div className="absolute h-12 w-12 -top-6 -right-6 bg-blue-200 rounded-full" />
        </div>
        <div className="relative h-full flex items-center justify-center">
          <Zap className="h-10 w-10 text-cyan-600" strokeWidth={1.5} />
        </div>
      </div>
    ),
    title: "Advanced AI Models",
    description: "Leverage cutting-edge AI from Anthropic, OpenAI, DeepSeek, Grok, and more for powerful, natural conversations.",
  },
  {
    illustration: (
      <div className="w-full h-24 relative overflow-hidden transform transition-transform duration-300 group-hover:rotate-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_107%,#ecfeff_0%,#e0f2fe_45%,#f0f9ff_80%)] transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute h-14 w-14 -top-7 -right-7 bg-blue-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
          <div className="absolute h-12 w-12 -bottom-6 -left-6 bg-cyan-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
        </div>
        <div className="relative h-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
          <File className="h-10 w-10 text-blue-600 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
        </div>
      </div>
    ),
    title: "Multiple File Types",
    description: "Upload PDFs, DOCs, TXTs, and more to build your knowledge base.",
  },
  {
    illustration: (
      <div className="w-full h-24 relative overflow-hidden transform transition-transform duration-300 group-hover:rotate-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_107%,#f5f3ff_0%,#ede9fe_45%,#faf5ff_80%)] transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute h-16 w-16 -bottom-8 -right-8 bg-purple-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
          <div className="absolute h-12 w-12 -top-6 -left-6 bg-violet-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
        </div>
        <div className="relative h-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
          <Code className="h-10 w-10 text-violet-600 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
        </div>
      </div>
    ),
    title: "API Access",
    description: "Access your chatbot via API for custom integrations and advanced use cases.",
  },
  {
    illustration: (
      <div className="w-full h-24 relative overflow-hidden transform transition-transform duration-300 group-hover:rotate-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_107%,#eef2ff_0%,#e0f2fe_45%,#ede9fe_80%)] transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute h-14 w-14 -top-7 -left-7 bg-indigo-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
          <div className="absolute h-12 w-12 -bottom-6 -right-6 bg-blue-200 rounded-full transition-transform duration-300 group-hover:translate-x-1" />
        </div>
        <div className="relative h-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
          <Lock className="h-10 w-10 text-indigo-600 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
        </div>
      </div>
    ),
    title: "Privacy Focused",
    description: "Your data stays private and secure with enterprise-grade security measures.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-4 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Everything You Need to Build Intelligent Chatbots
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create AI chatbots that engage your visitors, answer questions, and boost conversions, all without writing a single line of code.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 hover:rotate-2 transform-gpu"
            >
              {feature.illustration}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 