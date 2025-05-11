'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

type UTMProps = {
  getUTMQueryString: () => string;
};

// Components
const HeroSection = ({ getUTMQueryString }: UTMProps) => (
  <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-green-50 via-white to-blue-50">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
    </div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Transform Your Business with AI-Powered Chatbots
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Chatsa: Your all-in-one chatbot solution for WhatsApp, Facebook, and more. Train it on your knowledge base, automate tasks, and boost customer engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/contact${getUTMQueryString()}`}
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Watch Demo
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200"></div>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">1000+</span> businesses trust Chatsa
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20"></div>
            <Image
              src="/chatbot-demo.png"
              alt="Chatsa Dashboard"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Everything You Need in One Platform
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Chatsa combines powerful AI with seamless integration to deliver exceptional customer experiences
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">{feature.icon}</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const IntegrationSection = () => (
  <section className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Seamless Integration with Your Favorite Platforms
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Connect Chatsa with your existing tools and workflows
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {integrations.map((integration, index) => (
          <motion.div
            key={integration.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-16 h-16 mb-4">{integration.icon}</div>
            <h3 className="text-lg font-medium text-gray-900">{integration.name}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Trusted by Businesses Worldwide
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          See how Chatsa is transforming customer service for companies like yours
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="p-8 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
              <div>
                <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                <p className="text-gray-600">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{testimonial.content}</p>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const PricingSection = ({ getUTMQueryString }: UTMProps) => (
  <section className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Choose the plan that's right for your business
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`p-8 rounded-2xl ${
              plan.featured ? 'bg-green-600 text-white' : 'bg-white text-gray-900'
            } border border-gray-100 hover:shadow-xl transition-shadow`}
          >
            <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">${plan.price}</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <span className="mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={`/contact${getUTMQueryString()}`}
              className={`block w-full text-center px-6 py-3 rounded-lg font-medium ${
                plan.featured
                  ? 'bg-white text-green-600 hover:bg-gray-50'
                  : 'bg-green-600 text-white hover:bg-green-700'
              } transition-colors`}
            >
              Get Started
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = ({ getUTMQueryString }: UTMProps) => (
  <section className="py-20 bg-green-600">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
        Ready to Transform Your Customer Service?
      </h2>
      <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
        Join thousands of businesses that trust Chatsa for their customer communication needs
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href={`/contact${getUTMQueryString()}`}
          className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-green-600 transition-colors"
        >
          Start Free Trial
        </Link>
        <Link
          href="#demo"
          className="inline-flex items-center justify-center px-8 py-4 border-2 border-transparent text-base font-medium rounded-lg text-green-600 bg-white hover:bg-green-50 transition-colors"
        >
          Schedule Demo
        </Link>
      </div>
    </div>
  </section>
);

export default function WhatsAppChatbotPage() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const utmSource = searchParams.get('utm_source');
    const utmCampaign = searchParams.get('utm_campaign');
    
    if (utmSource || utmCampaign) {
      console.log('UTM Source:', utmSource);
      console.log('UTM Campaign:', utmCampaign);
    }
  }, [searchParams]);

  const getUTMQueryString = () => {
    const params = new URLSearchParams();
    const utmSource = searchParams.get('utm_source');
    const utmCampaign = searchParams.get('utm_campaign');
    
    if (utmSource) params.append('utm_source', utmSource);
    if (utmCampaign) params.append('utm_campaign', utmCampaign);
    
    return params.toString() ? `?${params.toString()}` : '';
  };

  return (
    <div className="min-h-screen">
      <HeroSection getUTMQueryString={getUTMQueryString} />
      <FeaturesSection />
      <IntegrationSection />
      <TestimonialsSection />
      <PricingSection getUTMQueryString={getUTMQueryString} />
      <CTASection getUTMQueryString={getUTMQueryString} />
    </div>
  );
}

const features = [
  {
    title: 'AI-Powered Conversations',
    description: 'Train your chatbot on your knowledge base for accurate, context-aware responses.',
    icon: '🤖',
  },
  {
    title: 'Multi-Platform Integration',
    description: 'Connect with WhatsApp, Facebook, and other popular messaging platforms.',
    icon: '🔄',
  },
  {
    title: 'Automated Workflows',
    description: 'Schedule appointments, process payments, and handle customer inquiries automatically.',
    icon: '⚡',
  },
  {
    title: 'Customizable Responses',
    description: "Tailor your chatbot's personality and responses to match your brand voice.",
    icon: '🎨',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Track performance, customer satisfaction, and conversation metrics in real-time.',
    icon: '📊',
  },
  {
    title: '24/7 Availability',
    description: 'Provide instant support to your customers around the clock.',
    icon: '🕒',
  },
];

const integrations = [
  {
    name: 'WhatsApp',
    icon: '📱',
  },
  {
    name: 'Facebook',
    icon: '👥',
  },
  {
    name: 'Instagram',
    icon: '📸',
  },
  {
    name: 'Telegram',
    icon: '📨',
  },
  {
    name: 'Slack',
    icon: '💬',
  },
  {
    name: 'Email',
    icon: '📧',
  },
  {
    name: 'CRM',
    icon: '📋',
  },
  {
    name: 'Payment',
    icon: '💳',
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CEO, TechStart Inc.',
    content: "Chatsa has revolutionized our customer service. We've seen a 40% increase in customer satisfaction and reduced response times by 80%.",
  },
  {
    name: 'Michael Chen',
    role: 'Operations Director, Global Retail',
    content: 'The multi-platform integration is seamless, and the AI capabilities are impressive. Our customers love the instant responses.',
  },
  {
    name: 'Emma Rodriguez',
    role: 'Customer Success Manager, SaaS Co.',
    content: 'Setting up automated workflows has saved us countless hours. The analytics dashboard helps us continuously improve our service.',
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '49',
    features: [
      '1,000 messages/month',
      'Basic AI training',
      'WhatsApp integration',
      'Email support',
      'Basic analytics',
    ],
    featured: false,
  },
  {
    name: 'Professional',
    price: '99',
    features: [
      '5,000 messages/month',
      'Advanced AI training',
      'All platform integrations',
      'Priority support',
      'Advanced analytics',
      'Custom workflows',
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    price: '299',
    features: [
      'Unlimited messages',
      'Custom AI training',
      'All platform integrations',
      '24/7 dedicated support',
      'Custom analytics',
      'API access',
      'Custom development',
    ],
    featured: false,
  },
]; 