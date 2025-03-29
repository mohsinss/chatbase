import React from 'react';

export default function TutorialsPage() {
  const tutorials = [
    {
      title: "Building Your First Chatbot",
      duration: "15 min",
      level: "Beginner",
      description: "Learn how to create and deploy your first AI chatbot with ChatSa."
    },
    {
      title: "Advanced Data Training",
      duration: "25 min",
      level: "Intermediate",
      description: "Master the art of training your chatbot with custom data for better responses."
    },
    {
      title: "Integration Masterclass",
      duration: "20 min",
      level: "Advanced",
      description: "Discover how to integrate your chatbot with popular platforms and services."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Tutorials</h1>
      <p className="text-xl text-gray-600 mb-12">Learn how to make the most of ChatSa with our step-by-step tutorials.</p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial, index) => (
          <div key={index} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">{tutorial.title}</h3>
            <div className="flex space-x-4 text-sm text-gray-500 mb-4">
              <span>{tutorial.duration}</span>
              <span>•</span>
              <span>{tutorial.level}</span>
            </div>
            <p className="text-gray-600">{tutorial.description}</p>
            <button className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium">
              Start Tutorial →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 