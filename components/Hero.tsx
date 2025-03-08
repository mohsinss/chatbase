"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Sparkles, Zap } from "lucide-react";
import ButtonSignin from "./ButtonSignin";

const Hero = () => {
  return (
    <section className="pt-32 pb-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-blue-50 to-transparent opacity-70"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
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
            <Button variant="outline" size="lg" className="hover-lift w-full">
              <Bot className="mr-2 h-4 w-4" />
              Try Demo Bot
            </Button>
          </div>
        </div>
        
        <div className="mt-16 animate-blur-in">
          <div className="relative">
            <div className="neo-shadow rounded-2xl p-1 bg-gradient-to-r from-blue-50 to-white">
              <div className="overflow-hidden rounded-xl shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1470&q=80" 
                  alt="ChatSa interface preview" 
                  className="w-full h-auto rounded-xl hover-shadow transform transition-all animate-pulse-scale"
                />
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-gray-100 flex items-center">
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
      </div>
    </section>
  );
};

export default Hero;
