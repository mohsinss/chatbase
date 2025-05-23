'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import { ArrowLeft, Check, Star, Users, Zap, Shield, Clock, ArrowRight } from 'lucide-react';

// Template data (in a real app, this would come from a database)
const templates = [
  {
    id: 1,
    slug: 'instagram-bot-for-lawyers-and-law-firms',
    title: 'Instagram Bot for Lawyers and Law Firms',
    subtitle: 'Present Your Law Services In An Impressive Way And Generate More Qualified Leads On Instagram With This Multifunctional Bot',
    description: 'If you\'re looking to drive more leads for your law firm on Instagram - this bot is your ultimate weapon. It is designed specifically for lawyers and does all the repetitive tasks of getting information from your potential clients on your behalf.',
    longDescription: 'This comprehensive Instagram bot template is specifically designed for law firms and legal professionals who want to automate their lead generation process on Instagram. The bot handles initial client inquiries, qualifies leads, and provides valuable information about your legal services.',
    tags: ['ChatSa', 'INSTAGRAM', 'LAW FIRM', 'ATTORNEY', 'LAWYER', 'CHATBOT LAWYER'],
    category: 'Recently added',
    features: [
      {
        title: 'EDUCATING FUNNEL',
        description: 'The bot showcases the services you offer using a funnel that educates visitors with valuable content and helps to increase your conversions.',
        icon: '📚'
      },
      {
        title: 'USE SIMPLE KEYWORDS',
        description: 'Provide a way for users to start a conversation with a business using keywords. Simply type \'hi\', \'hello\', or similar to trigger an automated response from the chatbot.',
        icon: '🔤'
      },
      {
        title: 'AUTO REPLY TO INSTAGRAM COMMENTS',
        description: 'Instagram comment auto-responders allow sending private automated messages to people who comment on your posts. To trigger a comment auto-responder, simply comment on a page\'s post using a specific keyword.',
        icon: '💬'
      },
      {
        title: 'SEND NOTIFICATIONS',
        description: 'The bot automatically sends requests to the bot administrators via email.',
        icon: '🔔'
      }
    ],
    platforms: [
      { name: 'Instagram', icon: '📷' },
      { name: 'ChatSa', icon: '/chatbase-icon.png' }
    ],
    stats: {
      users: '2.5K+',
      rating: 4.9,
      reviews: 127
    },
    price: 'Free',
    setupTime: '5 minutes'
  }
];

const faqs = [
  {
    question: 'Can I customize a chatbot?',
    answer: 'Yes. You don\'t need to have any programming or technical skills to customize your bots.',
    isOpen: true
  },
  {
    question: 'What if I need some help after purchasing a bot?',
    answer: 'We provide comprehensive support documentation and our team is available to help you with any questions or issues you might encounter.',
    isOpen: false
  },
  {
    question: 'How much time it takes to create a bot using the ChatSa templates?',
    answer: 'Most templates can be set up and customized within 5-15 minutes, depending on your specific requirements and customizations.',
    isOpen: false
  },
  {
    question: 'Do I need to be a programmer to launch a bot?',
    answer: 'No programming skills required! Our templates are designed to be user-friendly and can be set up by anyone.',
    isOpen: false
  },
  {
    question: 'What platforms do you support?',
    answer: 'We support Instagram, Facebook Messenger, WhatsApp, and various other messaging platforms through integrations.',
    isOpen: false
  }
];

// JSON-LD structured data component
function StructuredData({ template }: { template: any }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": template.title,
    "description": template.description,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": template.stats.rating,
      "reviewCount": template.stats.reviews,
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Organization",
      "name": "ChatSa",
      "url": "https://chatsa.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ChatSa",
      "url": "https://chatsa.com"
    },
    "keywords": template.tags.join(", "),
    "featureList": template.features.map((f: any) => f.title),
    "screenshot": "/api/placeholder/1200/630"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function TemplatePage({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState('preview');
  const [faqItems, setFaqItems] = useState(faqs);
  const [isLoading, setIsLoading] = useState(true);

  const template = templates.find(t => t.slug === params.slug);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!template && !isLoading) {
    notFound();
  }

  const toggleFaq = (index: number) => {
    setFaqItems(prev => prev.map((item, i) => 
      i === index ? { ...item, isOpen: !item.isOpen } : item
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!template) return null;

  return (
    <>
      <StructuredData template={template} />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <Link 
              href="/chatbot-templates" 
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 mb-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-blue-600 font-medium">
                    <span className="bg-blue-100 px-2 py-1 rounded">{template.category}</span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {template.stats.rating}
                    </span>
                    <span className="text-gray-500">({template.stats.reviews} reviews)</span>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    {template.title}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {template.subtitle}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/chatbot-templates?tag=${encodeURIComponent(tag)}`}
                      className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full hover:bg-blue-200 transition-colors duration-200 cursor-pointer"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {template.stats.users} users
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {template.setupTime} setup
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    Secure & Reliable
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                    Get Template - {template.price}
                    <span className="ml-2 text-sm opacity-90">Join ChatSa to unlock the template</span>
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    No credit card required • Setup in minutes
                  </p>
                </div>
              </div>

              {/* Phone Mockup */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative animate-float">
                  <div className="w-80 h-96 bg-black rounded-3xl p-2 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
                      {/* Phone Header */}
                      <div className="bg-gray-800 text-white text-xs p-3 flex items-center justify-between">
                        <span>12:31</span>
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                        <span>100%</span>
                      </div>

                      {/* Chat Interface */}
                      <div className="p-4 space-y-3 h-full bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center overflow-hidden">
                            <img 
                              src="/chatbase-icon.png" 
                              alt="ChatSa" 
                              className="w-8 h-8 object-contain"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-semibold">lawfirms_chatbot</div>
                            <div className="text-xs text-gray-500">Instagram • 0 followers • 1 post</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-white rounded-lg p-3 shadow-sm animate-slide-in-left">
                            <p className="text-sm">Welcome to "Breeze Law", law firm specializing exclusively in Family law, where our focus is on you!</p>
                            <div className="mt-2 bg-gray-100 rounded p-2">
                              <div className="w-full h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-600">Law Office Image</span>
                              </div>
                            </div>
                            <p className="text-xs text-blue-600 mt-1">Definitely! 😊</p>
                          </div>

                          <div className="bg-blue-500 text-white rounded-lg p-3 ml-8 animate-slide-in-right">
                            <p className="text-sm">Our experienced team guides you through the legal process of your life's transition.</p>
                          </div>

                          <div className="bg-white rounded-lg p-3 shadow-sm animate-slide-in-left">
                            <p className="text-sm">We provide you with the knowledge and tools necessary to successfully get through what is often a difficult time.</p>
                            <div className="mt-2 flex space-x-2">
                              <button className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">CHILD SUPPORT</button>
                              <button className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">DIVORCE</button>
                              <button className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">CUSTODY</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'features', label: 'FEATURES' },
                  { id: 'preview', label: 'PREVIEW TEMPLATE' },
                  { id: 'platforms', label: 'PLATFORMS & INTEGRATIONS' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'features' && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold text-center text-blue-600 mb-8">Chatbot Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {template.features.map((feature, index) => (
                      <div 
                        key={index} 
                        className="flex items-start space-x-4 animate-slide-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Check className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'preview' && (
                <div className="animate-fade-in text-center">
                  <h2 className="text-2xl font-bold text-blue-600 mb-4">Preview Template</h2>
                  <p className="text-gray-600 mb-8">
                    See how the Instagram Bot for Lawyers and Law Firms is used to drive sales and engage with customers
                  </p>
                  <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">⚖️</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Law Firm chatbot</h3>
                      <p className="text-gray-600">Interactive preview coming soon</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'platforms' && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold text-center text-blue-600 mb-8">Platforms & Integrations</h2>
                  <p className="text-center text-gray-600 mb-8">This chatbot can be connected to a variety of apps</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    {template.platforms.map((platform, index) => (
                      <div 
                        key={index}
                        className="text-center animate-bounce-in"
                        style={{ animationDelay: `${index * 200}ms` }}
                      >
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 overflow-hidden">
                          {platform.icon.startsWith('/') ? (
                            <img 
                              src={platform.icon} 
                              alt={platform.name} 
                              className="w-10 h-10 object-contain"
                            />
                          ) : (
                            <span className="text-2xl">{platform.icon}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{platform.name}</p>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <p className="text-gray-600 mb-4">Available on ChatSa for Instagram</p>
                    <div className="flex justify-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xl">📷</span>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <img 
                          src="/chatbase-icon.png" 
                          alt="ChatSa" 
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-2">Frequently asked questions</h2>
            <p className="text-center text-gray-600 mb-8">Find the answers to common questions about the ChatSa Marketplace</p>
            
            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-lg animate-slide-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <ArrowRight 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        faq.isOpen ? 'rotate-90' : ''
                      }`} 
                    />
                  </button>
                  {faq.isOpen && (
                    <div className="px-6 pb-4 animate-fade-in">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Related Templates */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-8">Explore more chatbot templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <h3 className="font-semibold text-gray-900 mb-2">TABLE RESERVATION BOT FOR BARS AND RESTAURANTS</h3>
                <p className="text-gray-600 text-sm mb-4">Book tables in minutes with a Facebook Messenger bot</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  <Link 
                    href="/chatbot-templates?tag=ChatSa"
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-200 transition-colors duration-200"
                  >
                    ChatSa
                  </Link>
                  <Link 
                    href="/chatbot-templates?tag=LEAD%20GENERATION"
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-200 transition-colors duration-200"
                  >
                    LEAD GENERATION
                  </Link>
                  <Link 
                    href="/chatbot-templates?tag=RESTAURANT"
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-200 transition-colors duration-200"
                  >
                    RESTAURANT
                  </Link>
                </div>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                  UNLOCK TEMPLATE
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <h3 className="font-semibold text-gray-900 mb-2">APPOINTMENT MESSENGER BOT FOR REAL ESTATE AGENTS</h3>
                <p className="text-gray-600 text-sm mb-4">Get information about properties for sale and schedule property tours with real estate brokers</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  <Link 
                    href="/chatbot-templates?tag=ChatSa"
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-200 transition-colors duration-200"
                  >
                    ChatSa
                  </Link>
                  <Link 
                    href="/chatbot-templates?tag=REAL%20ESTATE"
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-200 transition-colors duration-200"
                  >
                    REAL ESTATE
                  </Link>
                  <Link 
                    href="/chatbot-templates?tag=SALES"
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-200 transition-colors duration-200"
                  >
                    SALES
                  </Link>
                </div>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                  UNLOCK TEMPLATE
                </button>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link 
                href="/chatbot-templates"
                className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                VIEW ALL TEMPLATES
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 