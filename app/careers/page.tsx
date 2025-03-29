import React from 'react';

export default function CareersPage() {
  const openPositions = [
    {
      title: 'Senior ML Engineer',
      department: 'Engineering',
      location: 'San Francisco / Remote',
      type: 'Full-time',
      description: 'Join our core AI team to develop and improve our chatbot models.',
      requirements: [
        'Experience with large language models and NLP',
        '5+ years of ML engineering experience',
        'Strong Python and PyTorch/TensorFlow skills',
        'Experience with production ML systems'
      ]
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'San Francisco / Remote',
      type: 'Full-time',
      description: 'Lead the development of our next-generation chatbot platform.',
      requirements: [
        '4+ years of product management experience',
        'Experience with AI/ML products',
        'Strong analytical and strategic thinking',
        'Excellent communication skills'
      ]
    },
    {
      title: 'Full Stack Engineer',
      department: 'Engineering',
      location: 'San Francisco / Remote',
      type: 'Full-time',
      description: 'Build and scale our web application and developer tools.',
      requirements: [
        'Experience with React, Node.js, and TypeScript',
        'Understanding of cloud infrastructure',
        'Strong problem-solving skills',
        'Experience with real-time applications'
      ]
    }
  ];

  const benefits = [
    {
      title: 'Competitive Compensation',
      description: 'Competitive salary, equity, and bonuses',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Health & Wellness',
      description: 'Comprehensive health, dental, and vision coverage',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      title: 'Flexible Work',
      description: 'Remote-first culture with flexible hours',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      title: 'Learning & Development',
      description: 'Annual learning stipend and career growth opportunities',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 py-24">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Join Us in Shaping the Future of AI
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto">
            We're building the next generation of AI-powered customer interactions, and we need exceptional people to help us get there.
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Join ChatSa?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{position.title}</h3>
                    <div className="flex space-x-4">
                      <span className="text-sm text-gray-500">{position.location}</span>
                      <span className="text-sm text-indigo-600">{position.type}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{position.description}</p>
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Requirements:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {position.requirements.map((req, reqIndex) => (
                        <li key={reqIndex}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Culture Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Culture</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            We're building a diverse, inclusive team of talented individuals who are passionate about using AI to solve real-world problems.
          </p>
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700">
            View All Positions
          </button>
        </div>
      </div>
    </div>
  );
} 