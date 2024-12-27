"use client";
import React, { useState, useRef, useEffect } from "react";
import { IconSend, IconRefresh } from "@tabler/icons-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PlaygroundProps {
  chatbot: {
    name: string;
    id: string;
    settings?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      systemPrompt?: string;
    };
  };
}

const Playground = ({ chatbot }: PlaygroundProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Create new conversation on mount
  useEffect(() => {
    createNewConversation();
  }, [chatbot.id]);

  // Save conversation when messages change
  useEffect(() => {
    if (messages.length > 0 && conversationId) {
      saveConversation();
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const createNewConversation = async () => {
    try {
      const response = await fetch('/api/chatbot/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbotId: chatbot.id,
          messages: [],
          createNew: true, // Signal to create a new conversation
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setConversationId(data._id);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to create new conversation:', error);
    }
  };

  const saveConversation = async () => {
    if (!conversationId) return;
    
    try {
      await fetch('/api/chatbot/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbotId: chatbot.id,
          conversationId: conversationId,
          messages,
        }),
      });
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  };

  const handleRefresh = async () => {
    createNewConversation();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          chatbotId: chatbot.id,
        }),
      });

      if (!response.ok) throw new Error('Stream failed');
      
      const assistantMessage: Message = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, assistantMessage]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let done = false;
        while (!done) {
          const result = await reader.read();
          done = result.done;
          if (done) break;
          
          const chunk = decoder.decode(result.value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(5).trim();
              
              if (data === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    return [
                      ...prev.slice(0, -1),
                      { ...lastMessage, content: lastMessage.content + parsed.text }
                    ];
                  });
                }
              } catch (e) {
                console.log('Skipping unparseable chunk');
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#fafafa] p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Playground
            <span className="inline-block w-5 h-5 rounded-full border flex items-center justify-center text-sm">?</span>
          </h1>
          <button className="px-4 py-2 border rounded-lg">Compare</button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg">{chatbot.name}</h2>
            <button 
              onClick={handleRefresh}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <IconRefresh className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-[calc(100vh-280px)] overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.role === 'assistant' ? '' : 'flex justify-end'}`}>
                <div className={`rounded-lg p-4 inline-block max-w-[80%] ${
                  message.role === 'assistant' ? 'bg-gray-100' : 'bg-blue-500 text-white'
                }`}>
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input .*/}
          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message..."
                className="w-full p-4 pr-12 rounded-lg border focus:outline-none focus:border-blue-500"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <IconSend className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Playground; 