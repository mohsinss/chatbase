
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-95"></div>
      
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <Sparkles className="h-10 w-10 text-white/80 mx-auto mb-6" />
        
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Transform Your Website with AI-Powered Conversations
        </h2>
        
        <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
          Join thousands of businesses already using ChatSa to improve customer engagement, boost conversions, and provide 24/7 support.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 hover-lift">
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-6 hover-lift">
            Request Demo
          </Button>
        </div>
        
        <p className="text-white/80 mt-6">
          No credit card required. Free plan available.
        </p>
      </div>
    </section>
  );
};

export default CTASection;
