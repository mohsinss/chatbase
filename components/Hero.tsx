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
                <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:flex-wrap lg:flex-nowrap relative">
                  {/* First set of chatbots */}
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
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Facebook Bot</h3>
                            <p className="text-sm text-gray-500">Active</p>
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3">
                          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">Welcome to our Facebook page! How can I assist you?</p>
                          </div>
                          <div className="bg-[#1877F2] text-white rounded-lg p-3 max-w-[80%] ml-auto">
                            <p className="text-sm">Tell me about your products</p>
                          </div>
                        </div>
                        <div className="mt-4 border-t pt-4">
                          <div className="flex gap-2">
                            <textarea 
                              className="flex-1 resize-none rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2]"
                              placeholder="Type your message..."
                              rows={1}
                            />
                            <button className="bg-[#1877F2] text-white p-2 rounded-lg hover:bg-[#166FE5] transition-colors">
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
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Instagram Bot</h3>
                            <p className="text-sm text-gray-500">Online</p>
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3">
                          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">✨ Welcome to our Instagram! Need help?</p>
                          </div>
                          <div className="bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg p-3 max-w-[80%] ml-auto">
                            <p className="text-sm">Show me your latest collection</p>
                          </div>
                        </div>
                        <div className="mt-4 border-t pt-4">
                          <div className="flex gap-2">
                            <textarea 
                              className="flex-1 resize-none rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Type your message..."
                              rows={1}
                            />
                            <button className="bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 text-white p-2 rounded-lg hover:opacity-90 transition-opacity">
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
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Twitter Bot</h3>
                            <p className="text-sm text-gray-500">Active</p>
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3">
                          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">Hey there! How can I help you today?</p>
                          </div>
                          <div className="bg-[#1DA1F2] text-white rounded-lg p-3 max-w-[80%] ml-auto">
                            <p className="text-sm">What's your latest update?</p>
                          </div>
                        </div>
                        <div className="mt-4 border-t pt-4">
                          <div className="flex gap-2">
                            <textarea 
                              className="flex-1 resize-none rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                              placeholder="Type your message..."
                              rows={1}
                            />
                            <button className="bg-[#1DA1F2] text-white p-2 rounded-lg hover:bg-[#1A8CD8] transition-colors">
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
                            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Snapchat Bot</h3>
                            <p className="text-sm text-gray-500">Coming Soon</p>
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3 opacity-50">
                          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                            <p className="text-sm">👋 Stay tuned for our Snapchat bot!</p>
                          </div>
                          <div className="bg-[#FFFC00] text-black rounded-lg p-3 max-w-[80%] ml-auto">
                            <p className="text-sm">Coming soon...</p>
                          </div>
                        </div>
                        <div className="mt-4 border-t pt-4 opacity-50">
                          <div className="flex gap-2">
                            <textarea 
                              className="flex-1 resize-none rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFFC00]"
                              placeholder="Coming soon..."
                              rows={1}
                              disabled
                            />
                            <button className="bg-[#FFFC00] text-black p-2 rounded-lg opacity-50 cursor-not-allowed">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Second set of chatbots (for infinite scroll) */}
                  <div className="flex gap-6 animate-infinite-scroll" aria-hidden="true">
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
                      </div>
                    </div>

                    {/* Facebook Chatbot */}
                    <div className="flex-none w-[350px] bg-[#1877F2] rounded-2xl p-4 shadow-lg snap-center">
                      <div className="bg-white rounded-xl p-4 h-[600px] flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Facebook Bot</h3>
                            <p className="text-sm text-gray-500">Active</p>
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
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Instagram Bot</h3>
                            <p className="text-sm text-gray-500">Online</p>
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
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Twitter Bot</h3>
                            <p className="text-sm text-gray-500">Active</p>
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
                            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Snapchat Bot</h3>
                            <p className="text-sm text-gray-500">Coming Soon</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Third set of chatbots (for infinite scroll) */}
                  <div className="flex gap-6 animate-infinite-scroll" aria-hidden="true">
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
                      </div>
                    </div>

                    {/* Facebook Chatbot */}
                    <div className="flex-none w-[350px] bg-[#1877F2] rounded-2xl p-4 shadow-lg snap-center">
                      <div className="bg-white rounded-xl p-4 h-[600px] flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Facebook Bot</h3>
                            <p className="text-sm text-gray-500">Active</p>
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
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Instagram Bot</h3>
                            <p className="text-sm text-gray-500">Online</p>
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
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Twitter Bot</h3>
                            <p className="text-sm text-gray-500">Active</p>
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
                            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold">Snapchat Bot</h3>
                            <p className="text-sm text-gray-500">Coming Soon</p>
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
