"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNav from '@/components/DashboardNav';

interface Message {
  role: string;
  content: string;
  timestamp: string;
}

interface Conversation {
  _id: string;
  messages: Message[];
  createdAt: string;
}

export default function ChatbotConversations({ params }: { params: { chatbotId: string } }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchConversations();
  }, [params.chatbotId]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`/api/chatbot/conversation?chatbotId=${params.chatbotId}`);
      if (!res.ok) throw new Error('Failed to fetch conversations');
      const data = await res.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <DashboardNav teamId="" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Chatbot Conversations</h1>
        
        <div className="space-y-6">
          {conversations.map(conversation => (
            <div key={conversation._id} className="border rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-2">
                {new Date(conversation.createdAt).toLocaleString()}
              </div>
              
              <div className="space-y-3">
                {conversation.messages.map((message, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg ${
                      message.role === 'user' ? 'bg-blue-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {message.role.toUpperCase()}
                    </div>
                    <div className="text-sm">{message.content}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
} 