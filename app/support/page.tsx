import React from 'react';

export default function SupportPage() {
  const faqs = [
    {
      question: "How do I get started with ChatSa?",
      answer: "Sign up for an account, upload your training data, and follow our quick start guide to create your first chatbot in minutes."
    },
    {
      question: "What type of data can I use to train my chatbot?",
      answer: "ChatSa supports various data formats including text documents, FAQs, knowledge bases, and conversation logs."
    },
    {
      question: "How can I customize my chatbot's responses?",
      answer: "You can fine-tune responses through our intuitive dashboard, add custom rules, and train with specific examples."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Support</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
          <p className="mb-4">Our support team is available 24/7 to help you with any questions or issues.</p>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
            Contact Us
          </button>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Live Chat</h2>
          <p className="mb-4">Get instant help from our support team through live chat.</p>
          <button className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50">
            Start Chat
          </button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b pb-6">
              <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 