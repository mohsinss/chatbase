"use client";

import DashboardNav from "@/components/DashboardNav";

export default function DocsPage() {
  return (
    <>
      <DashboardNav teamId="" />
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Documentation</h1>
        
        {/* Quick Start Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-600 mb-4">
              Get started with our platform in just a few minutes. Follow these simple steps:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Create a team or join an existing one</li>
              <li>Create your first chatbot</li>
              <li>Configure your chatbot settings</li>
              <li>Add training data and sources</li>
              <li>Test your chatbot in the playground</li>
            </ol>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Team Management</h3>
              <p className="text-gray-600">
                Create and manage teams, invite members, and collaborate on chatbots.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Chatbot Creation</h3>
              <p className="text-gray-600">
                Build custom chatbots with advanced AI capabilities and natural language processing.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Data Integration</h3>
              <p className="text-gray-600">
                Connect various data sources to train your chatbot with relevant information.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600">
                Track chatbot performance, user interactions, and usage statistics.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 