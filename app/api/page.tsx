import React from 'react';

export default function ApiPage() {
  const endpoints = [
    {
      method: 'POST',
      endpoint: '/api/v1/chatbot',
      description: 'Create a new chatbot instance',
      parameters: [
        { name: 'name', type: 'string', required: true, description: 'Name of the chatbot' },
        { name: 'model', type: 'string', required: true, description: 'AI model to use' },
        { name: 'training_data', type: 'array', required: false, description: 'Initial training data' }
      ]
    },
    {
      method: 'GET',
      endpoint: '/api/v1/chatbot/{id}',
      description: 'Retrieve chatbot details',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Chatbot ID' }
      ]
    },
    {
      method: 'POST',
      endpoint: '/api/v1/chat',
      description: 'Send a message to the chatbot',
      parameters: [
        { name: 'chatbot_id', type: 'string', required: true, description: 'Chatbot ID' },
        { name: 'message', type: 'string', required: true, description: 'User message' },
        { name: 'context', type: 'object', required: false, description: 'Additional context' }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">API Reference</h1>
      <p className="text-xl text-gray-600 mb-12">
        Integrate ChatSa into your applications with our powerful REST API
      </p>

      <div className="space-y-12">
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Authentication</h2>
          <p className="mb-4">All API requests require an API key to be included in the header:</p>
          <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
            <code>Authorization: Bearer YOUR_API_KEY</code>
          </pre>
        </div>

        {endpoints.map((endpoint, index) => (
          <div key={index} className="border-b pb-8">
            <div className="flex items-center space-x-4 mb-4">
              <span className={`px-3 py-1 rounded-lg text-white font-medium
                ${endpoint.method === 'GET' ? 'bg-green-600' : 'bg-blue-600'}`}>
                {endpoint.method}
              </span>
              <code className="bg-gray-100 px-3 py-1 rounded-lg font-mono">
                {endpoint.endpoint}
              </code>
            </div>
            
            <p className="text-gray-600 mb-6">{endpoint.description}</p>
            
            <h3 className="text-lg font-medium mb-4">Parameters</h3>
            <div className="bg-white rounded-lg border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Required</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {endpoint.parameters.map((param, paramIndex) => (
                    <tr key={paramIndex}>
                      <td className="px-6 py-4 font-mono text-sm">{param.name}</td>
                      <td className="px-6 py-4 text-sm">{param.type}</td>
                      <td className="px-6 py-4 text-sm">{param.required ? 'Yes' : 'No'}</td>
                      <td className="px-6 py-4 text-sm">{param.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 