"use client";
import React, { useState, useRef, useEffect } from "react";
import { IconSend, IconRefresh } from "@tabler/icons-react";
import ReactMarkdown from 'react-markdown';
import { ChatSettings } from './ChatSettings';

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
    <div>
      {/* Playground header - moved outside */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold flex items-center">
            Playground
            <span className="ml-1 inline-flex w-4 h-4 rounded-full border text-xs items-center justify-center">ⓘ</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-1.5 border rounded-lg text-sm">Compare</button>
          <button className="w-8 h-8 flex items-center justify-center border rounded-lg">
            <span className="w-4 h-4">💡</span>
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="relative min-h-[calc(100vh-80px)] pl-2" 
           style={{ 
             backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)',
             backgroundSize: '20px 20px'
           }}>
        <div className="flex">
          {/* Settings Panel */}
          <div className={`w-[400px] transition-all duration-300 ${
            isSettingsOpen ? 'mr-4' : '-ml-[400px]'
          }`}>
            <ChatSettings isVisible={isSettingsOpen} onToggle={() => setIsSettingsOpen(false)} />
          </div>

          {/* Chat Container */}
          <div className="flex-1 flex justify-center pt-4 px-4">
            <div className="w-[400px] relative">
              {!isSettingsOpen && (
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="absolute -left-12 h-[38px] w-[38px] flex items-center justify-center border rounded-lg bg-white"
                >
                  ☰
                </button>
              )}

              <div className="bg-white rounded-lg shadow-sm border">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-3 border-b">
                  <div className="text-sm">Chatbot {new Date().toLocaleString()}</div>
                  <button 
                    onClick={handleRefresh}
                    className="p-1.5 hover:bg-gray-100 rounded-full"
                  >
                    <IconRefresh className="w-4 h-4" />
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="h-[calc(100vh-280px)] overflow-y-auto p-4">
                  {messages.length === 0 && (
                    <div className="text-gray-500 p-4 rounded-lg bg-gray-50">
                      Hi! What can I help you with?
                    </div>
                  )}
                  {messages.map((message, index) => (
                    <div key={index} className={`mb-4 ${message.role === 'assistant' ? '' : 'flex justify-end'}`}>
                      <div className={`rounded-lg p-3 inline-block max-w-[80%] ${
                        message.role === 'assistant' ? 'bg-gray-100 prose prose-sm max-w-none' : 'bg-blue-500 text-white'
                      }`}>
                        {message.role === 'assistant' ? (
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        ) : (
                          <p>{message.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSubmit} className="border-t p-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Message..."
                      className="w-full p-3 pr-10 rounded-lg border focus:outline-none focus:border-blue-500 text-sm"
                      disabled={isLoading}
                    />
                    <button 
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      <IconSend className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground; 