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
            {/* <Button variant="outline" size="lg" className="hover-lift w-full">
              <Bot className="mr-2 h-4 w-4" />
              Try Demo Bot
            </Button> */}
          </div>
        </div>
        
        <div className="mt-16 animate-blur-in">
          <div className="relative">
            <div className="neo-shadow rounded-2xl p-1 bg-gradient-to-r from-blue-50 to-white">
              <div className="overflow-hidden rounded-xl shadow-sm">
                <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory relative">
                  <div className="flex gap-6 animate-infinite-scroll">
                    {/* WhatsApp Chatbot */}
                    <div className="flex-none w-[350px] bg-[#25D366] rounded-2xl p-4 shadow-lg snap-center">
                      <div className="bg-white rounded-xl p-4 h-[600px] flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.287.129.332.202.045.073.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">WhatsApp Bot</h3>
                            <p className="text-sm text-gray-500">Online</p>
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3">
                          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">👋 Hello! How can I help you today?</p>
                          </div>
                          <div className="bg-[#25D366] text-white rounded-lg p-3 max-w-[80%] ml-auto">
                            <p className="text-sm">I'd like to know more about your services</p>
                          </div>
                        </div>
                        <div className="mt-4 border-t pt-4">
                          <div className="flex gap-2">
                            <textarea 
                              className="flex-1 resize-none rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                              placeholder="Type your message..."
                              rows={1}
                            />
                            <button className="bg-[#25D366] text-white p-2 rounded-lg hover:bg-[#128C7E] transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Facebook Chatbot */}
                    <div className="flex-none w-[350px] bg-[#1877F2] rounded-2xl p-4 shadow-lg snap-center">
                      <div className="bg-white rounded-xl p-4 h-[600px] flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.287.129.332.202.045.073.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Facebook Bot</h3>
                            <p className="text-sm text-gray-500">Online</p>
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3">
                          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">👋 Hello! How can I help you today?</p>
                          </div>
                          <div className="bg-[#1877F2] text-white rounded-lg p-3 max-w-[80%] ml-auto">
                            <p className="text-sm">I'd like to know more about your services</p>
                          </div>
                        </div>
                        <div className="mt-4 border-t pt-4">
                          <div className="flex gap-2">
                            <textarea 
                              className="flex-1 resize-none rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                              placeholder="Type your message..."
                              rows={1}
                            />
                            <button className="bg-[#1877F2] text-white p-2 rounded-lg hover:bg-[#125A9E] transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Instagram Chatbot */}
                    <div className="flex-none w-[350px] bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 rounded-2xl p-4 shadow-lg snap-center">
                      <div className="bg-white rounded-xl p-4 h-[600px] flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.287.129.332.202.045.073.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Instagram Bot</h3>
                            <p className="text-sm text-gray-500">Online</p>
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3">
                          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">👋 Hello! How can I help you today?</p>
                          </div>
                          <div className="bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg p-3 max-w-[80%] ml-auto">
                            <p className="text-sm">I'd like to know more about your services</p>
                          </div>
                        </div>
                        <div className="mt-4 border-t pt-4">
                          <div className="flex gap-2">
                            <textarea 
                              className="flex-1 resize-none rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gradient-to-tr from-purple-500 via-pink-500 to-orange-500"
                              placeholder="Type your message..."
                              rows={1}
                            />
                            <button className="bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 text-white p-2 rounded-lg hover:bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-600 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Twitter Chatbot */}
                    <div className="flex-none w-[350px] bg-[#1DA1F2] rounded-2xl p-4 shadow-lg snap-center">
                      <div className="bg-white rounded-xl p-4 h-[600px] flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.287.129.332.202.045.073.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Twitter Bot</h3>
                            <p className="text-sm text-gray-500">Online</p>
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3">
                          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">👋 Hello! How can I help you today?</p>
                          </div>
                          <div className="bg-[#1DA1F2] text-white rounded-lg p-3 max-w-[80%] ml-auto">
                            <p className="text-sm">I'd like to know more about your services</p>
                          </div>
                        </div>
                        <div className="mt-4 border-t pt-4">
                          <div className="flex gap-2">
                            <textarea 
                              className="flex-1 resize-none rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                              placeholder="Type your message..."
                              rows={1}
                            />
                            <button className="bg-[#1DA1F2] text-white p-2 rounded-lg hover:bg-[#1271A2] transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Snapchat Chatbot */}
                    <div className="flex-none w-[350px] bg-[#FFFC00] rounded-2xl p-4 shadow-lg snap-center relative">
                      <div className="absolute -top-3 -right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                        Coming Soon
                      </div>
                      <div className="bg-white rounded-xl p-4 h-[600px] flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-10 h-10 rounded-full bg-[#FFFC00] flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.287.129.332.202.045.073.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Snapchat Bot</h3>
                            <p className="text-sm text-gray-500">Coming Soon</p>
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3">
                          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">👋 Hello! How can I help you today?</p>
                          </div>
                          <div className="bg-[#FFFC00] text-red-500 rounded-lg p-3 max-w-[80%] ml-auto">
                            <p className="text-sm">I'm coming soon! Stay tuned!</p>
                          </div>
                        </div>
                        <div className="mt-4 border-t pt-4">
                          <div className="flex gap-2">
                            <textarea 
                              className="flex-1 resize-none rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFFC00]"
                              placeholder="Type your message..."
                              rows={1}
                            />
                            <button className="bg-[#FFFC00] text-red-500 p-2 rounded-lg hover:bg-[#E6E600] transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Duplicate set for seamless infinite scroll */}
                    {/* WhatsApp Chatbot */}
                    <div className="flex-none w-[350px] bg-[#25D366] rounded-2xl p-4 shadow-lg snap-center">
                      <div className="bg-white rounded-xl p-4 h-[600px] flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.287.129.332.202.045.073.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">xxWhatsApp Bot</h3>
                            <p className="text-sm text-gray-500">Online</p>
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3">
                          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">👋 Hello! How can I help you today?</p>
                          </div>
                          <div className="bg-[#25D366] text-white rounded-lg p-3 max-w-[80%] ml-auto">
                            <p className="text-sm">I'd like to know more about your services</p>
                          </div>
                        </div>
                        <div className="mt-4 border-t pt-4">
                          <div className="flex gap-2">
                            <textarea 
                              className="flex-1 resize-none rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                              placeholder="Type your message..."
                              rows={1}
                            />
                            <button className="bg-[#25D366] text-white p-2 rounded-lg hover:bg-[#128C7E] transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Facebook Chatbot */}
                    <div className="flex-none w-[350px] bg-[#1877F2] rounded-2xl p-4 shadow-lg snap-center">
                      <div className="bg-white rounded-xl p-4 h-[600px] flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.287.129.332.202.045.073.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Facebook Bot</h3>
                            <p className="text-sm text-gray-500">Online</p>
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3">
                          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">👋 Hello! How can I help you today?</p>
                          </div>
                          <div className="bg-[#1877F2] text-white rounded-lg p-3 max-w-[80%] ml-auto">
                            <p className="text-sm">I'd like to know more about your services</p>
                          </div>
                        </div>
                        <div className="mt-4 border-t pt-4">
                          <div className="flex gap-2">
                            <textarea 
                              className="flex-1 resize-none rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                              placeholder="Type your message..."
                              rows={1}
                            />
                            <button className="bg-[#1877F2] text-white p-2 rounded-lg hover:bg-[#125A9E] transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Instagram Chatbot */}
                    <div className="flex-none w-[350px] bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 rounded-2xl p-4 shadow-lg snap-center">
                      <div className="bg-white rounded-xl p-4 h-[600px] flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.287.129.332.202.045.073.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Instagram Bot</h3>
                            <p className="text-sm text-gray-500">Online</p>
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3">
                          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">👋 Hello! How can I help you today?</p>
                          </div>
                          <div className="bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg p-3 max-w-[80%] ml-auto">
                            <p className="text-sm">I'd like to know more about your services</p>
                          </div>
                        </div>
                        <div className="mt-4 border-t pt-4">
                          <div className="flex gap-2">
                            <textarea 
                              className="flex-1 resize-none rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gradient-to-tr from-purple-500 via-pink-500 to-orange-500"
                              placeholder="Type your message..."
                              rows={1}
                            />
                            <button className="bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 text-white p-2 rounded-lg hover:bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-600 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Twitter Chatbot */}
                    <div className="flex-none w-[350px] bg-[#1DA1F2] rounded-2xl p-4 shadow-lg snap-center">
                      <div className="bg-white rounded-xl p-4 h-[600px] flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.287.129.332.202.045.073.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Twitter Bot</h3>
                            <p className="text-sm text-gray-500">Online</p>
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3">
                          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">👋 Hello! How can I help you today?</p>
                          </div>
                          <div className="bg-[#1DA1F2] text-white rounded-lg p-3 max-w-[80%] ml-auto">
                            <p className="text-sm">I'd like to know more about your services</p>
                          </div>
                        </div>
                        <div className="mt-4 border-t pt-4">
                          <div className="flex gap-2">
                            <textarea 
                              className="flex-1 resize-none rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                              placeholder="Type your message..."
                              rows={1}
                            />
                            <button className="bg-[#1DA1F2] text-white p-2 rounded-lg hover:bg-[#1271A2] transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Snapchat Chatbot */}
                    <div className="flex-none w-[350px] bg-[#FFFC00] rounded-2xl p-4 shadow-lg snap-center relative">
                      <div className="absolute -top-3 -right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                        Coming Soon
                      </div>
                      <div className="bg-white rounded-xl p-4 h-[600px] flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-10 h-10 rounded-full bg-[#FFFC00] flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.287.129.332.202.045.073.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Snapchat Bot</h3>
                            <p className="text-sm text-gray-500">Coming Soon</p>
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3">
                          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">👋 Hello! How can I help you today?</p>
                          </div>
                          <div className="bg-[#FFFC00] text-red-500 rounded-lg p-3 max-w-[80%] ml-auto">
                            <p className="text-sm">I'm coming soon! Stay tuned!</p>
                          </div>
                        </div>
                        <div className="mt-4 border-t pt-4">
                          <div className="flex gap-2">
                            <textarea 
                              className="flex-1 resize-none rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFFC00]"
                              placeholder="Type your message..."
                              rows={1}
                            />
                            <button className="bg-[#FFFC00] text-red-500 p-2 rounded-lg hover:bg-[#E6E600] transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
