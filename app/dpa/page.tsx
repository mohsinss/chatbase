import React from 'react';

export default function DPAPage() {
  const sections = [
    {
      title: 'Scope and Definitions',
      content: `This Data Processing Agreement ("DPA") forms part of the agreement between ChatSa ("Processor") and the Customer ("Controller") and applies to all processing of personal data carried out by ChatSa on behalf of the Customer.`
    },
    {
      title: 'Data Processing Details',
      content: `ChatSa processes personal data only for the purpose of providing AI chatbot services, including:
- Customer service conversations
- User behavior analytics
- Training data for AI models
- Performance optimization`
    },
    {
      title: 'Security Measures',
      content: `We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including:
- End-to-end encryption
- Access control and authentication
- Regular security audits
- Employee training
- Data backup and recovery procedures`
    },
    {
      title: 'Sub-processors',
      content: `ChatSa may engage sub-processors to assist in providing the services. We maintain a list of approved sub-processors and will inform customers of any intended changes.`
    },
    {
      title: 'Data Subject Rights',
      content: `We assist the Controller in responding to requests from data subjects to exercise their rights under applicable data protection laws, including rights of access, rectification, erasure, and data portability.`
    },
    {
      title: 'Data Breach Notification',
      content: `In the event of a personal data breach, we will notify the Controller without undue delay and provide assistance in addressing the breach.`
    },
    {
      title: 'Audit Rights',
      content: `The Controller has the right to audit ChatSa's compliance with this DPA, subject to reasonable notice and confidentiality obligations.`
    },
    {
      title: 'Data Deletion',
      content: `Upon termination of services, we will delete or return all personal data to the Controller, unless required by law to retain it.`
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 py-24">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Data Processing Agreement</h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto">
            Our commitment to protecting and processing your data responsibly
          </p>
        </div>
      </div>

      {/* Last Updated */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          Last updated: March 1, 2024
        </div>
      </div>

      {/* DPA Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-12">
              This Data Processing Agreement governs the processing of personal data by ChatSa on behalf of its customers. It ensures compliance with applicable data protection laws and regulations, including GDPR.
            </p>

            {sections.map((section, index) => (
              <div key={index} className="mb-12">
                <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600 whitespace-pre-line">{section.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions About This DPA?</h2>
            <p className="text-gray-600 mb-8">
              If you have any questions about this Data Processing Agreement or our data practices, please contact our Data Protection Officer.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700">
                Contact DPO
              </button>
              <button className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50">
                Download DPA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 