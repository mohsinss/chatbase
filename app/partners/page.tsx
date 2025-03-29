import React from 'react';
import Image from 'next/image';

export default function PartnersPage() {
  const partnerTypes = [
    {
      title: 'Technology Partners',
      description: 'Integrate your technology with ChatSa to create powerful AI solutions',
      benefits: [
        'Access to ChatSa API and SDK',
        'Technical integration support',
        'Co-marketing opportunities',
        'Partner portal access'
      ],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    },
    {
      title: 'Solution Partners',
      description: 'Build and deliver AI chatbot solutions to your clients',
      benefits: [
        'Partner certification program',
        'Sales enablement resources',
        'Priority support',
        'Revenue sharing'
      ],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: 'Channel Partners',
      description: 'Resell ChatSa solutions to your customer base',
      benefits: [
        'Competitive margins',
        'Deal registration',
        'Sales training',
        'Marketing support'
      ],
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const featuredPartners = [
    { name: 'TechCorp', logo: '/partners/techcorp.png' },
    { name: 'InnovateAI', logo: '/partners/innovateai.png' },
    { name: 'CloudSys', logo: '/partners/cloudsys.png' },
    { name: 'DataFlow', logo: '/partners/dataflow.png' },
    { name: 'AILabs', logo: '/partners/ailabs.png' },
    { name: 'SmartTech', logo: '/partners/smarttech.png' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 py-24">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Partner with ChatSa
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto">
            Join our ecosystem of partners delivering cutting-edge AI solutions to businesses worldwide.
          </p>
        </div>
      </div>

      {/* Partnership Types */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Partnership Programs</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {partnerTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-lg border p-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-6">
                  {type.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{type.title}</h3>
                <p className="text-gray-600 mb-6">{type.description}</p>
                <ul className="space-y-3">
                  {type.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Partners */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-6xl mx-auto">
            {featuredPartners.map((partner, index) => (
              <div key={index} className="bg-white rounded-lg p-6 flex items-center justify-center">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Become a Partner */}
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Become a Partner</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Ready to join our partner ecosystem? Fill out our partner application form and our team will get in touch with you.
          </p>
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700">
            Apply Now
          </button>
        </div>
      </div>

      {/* Partner Resources */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Partner Resources</h2>
            <p className="text-xl text-gray-600 mb-12">
              Access everything you need to succeed as a ChatSa partner
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <a href="#" className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">Partner Portal</h3>
                <p className="text-gray-600">Access sales tools, technical resources, and marketing materials</p>
              </a>
              <a href="#" className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">Training Center</h3>
                <p className="text-gray-600">Get certified and learn about ChatSa products and solutions</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 