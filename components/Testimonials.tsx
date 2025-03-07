"use client";

import React from 'react';
import { Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    quote: "ChatSa completely transformed our customer service. We've seen a 35% reduction in support tickets while improving customer satisfaction scores.",
    author: "Sarah Johnson",
    position: "CTO at TechBloom",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    stars: 5,
  },
  {
    quote: "Setting up our AI chatbot took less than 10 minutes. Now it handles 80% of customer inquiries automatically, saving us countless hours.",
    author: "Michael Chen",
    position: "Founder, GrowthMind",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    stars: 5,
  },
  {
    quote: "The ability to train the chatbot on our specific data makes it incredibly accurate. Our users love getting instant answers to their questions.",
    author: "Elena Rodriguez",
    position: "Marketing Director, Novus",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    stars: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by <span className="text-indigo-600">Innovative Teams</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See what our customers have to say about their experience with ChatSa.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <blockquote className="text-lg text-gray-700 mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              
              <div className="flex items-center">
                <Image 
                  src={testimonial.avatar} 
                  alt={testimonial.author}
                  width={48}
                  height={48}
                  className="rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <div className="p-8 bg-blue-50 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">Join 10,000+ businesses using ChatSa</h3>
            <p className="text-gray-600 mb-6">
              From startups to enterprise companies, ChatSa helps businesses of all sizes enhance their customer experience.
            </p>
            <div className="flex flex-wrap justify-center gap-8 opacity-80">
              {/* Company logos would go here */}
              <div className="text-xl font-bold text-gray-400">COMPANY</div>
              <div className="text-xl font-bold text-gray-400">BRAND</div>
              <div className="text-xl font-bold text-gray-400">STARTUP</div>
              <div className="text-xl font-bold text-gray-400">ENTERPRISE</div>
              <div className="text-xl font-bold text-gray-400">TECH CO</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 