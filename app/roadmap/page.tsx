import React from 'react';

export default function RoadmapPage() {
  const quarters = [
    {
      title: "Q2 2025",
      status: "in-progress",
      features: [
        {
          name: "Advanced Analytics Dashboard",
          description: "Detailed insights into chatbot performance and user interactions",
          status: "in-development",
          eta: "May 2025"
        },
        {
          name: "Custom AI Model Training",
          description: "Train models on your specific industry data",
          status: "planned",
          eta: "June 2025"
        },
        {
          name: "Voice Integration",
          description: "Support for voice commands and responses",
          status: "research",
          eta: "June 2025"
        }
      ]
    },
    {
      title: "Q3 2025",
      status: "planned",
      features: [
        {
          name: "Multi-Agent Collaboration",
          description: "Multiple chatbots working together to solve complex queries",
          status: "planned",
          eta: "August 2025"
        },
        {
          name: "Sentiment Analysis",
          description: "Real-time analysis of user sentiment during conversations",
          status: "research",
          eta: "September 2025"
        }
      ]
    },
    {
      title: "Q4 2025",
      status: "planned",
      features: [
        {
          name: "Enterprise SSO",
          description: "Single sign-on support for enterprise customers",
          status: "planned",
          eta: "October 2025"
        },
        {
          name: "Advanced Compliance Tools",
          description: "Enhanced security and compliance features for regulated industries",
          status: "research",
          eta: "November 2025"
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'in-development': 'bg-green-100 text-green-800',
      'planned': 'bg-blue-100 text-blue-800',
      'research': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.planned;
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Product Roadmap</h1>
        <p className="text-xl text-gray-600">
          See what's coming next in ChatSa's development
        </p>
      </div>

      <div className="space-y-16">
        {quarters.map((quarter, index) => (
          <div key={index} className="relative">
            <div className="flex items-center mb-8">
              <h2 className="text-2xl font-bold">{quarter.title}</h2>
              <span className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                quarter.status === 'in-progress' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {quarter.status === 'in-progress' ? 'In Progress' : 'Planned'}
              </span>
            </div>

            <div className="space-y-6">
              {quarter.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="bg-white rounded-lg border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{feature.name}</h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-500">{feature.eta}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(feature.status)}`}>
                        {feature.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            {index < quarters.length - 1 && (
              <div className="absolute left-8 top-full h-16 w-px bg-gray-200" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Have a Feature Request?</h3>
        <p className="text-gray-600 mb-6">
          We'd love to hear your ideas for improving ChatSa
        </p>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
          Submit Feature Request
        </button>
      </div>
    </div>
  );
} 