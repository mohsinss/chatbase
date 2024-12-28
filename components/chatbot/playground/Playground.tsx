"use client";
import React, { useState, useRef, useEffect } from "react";
import { IconSend, IconRefresh } from "@tabler/icons-react";
import ReactMarkdown from 'react-markdown';
import { ChatSettings } from './ChatSettings';
import { useChatInterfaceSettings } from '@/hooks/useChatInterfaceSettings';

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

const InfoTooltip = ({ content }: { content: string }) => (
  <div className="absolute left-0 top-full mt-1 w-64 p-3 bg-white border text-sm text-gray-600 rounded-md shadow-lg z-50">
    {content}
  </div>
);

const Playground = ({ chatbot }: PlaygroundProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showPlaygroundInfo, setShowPlaygroundInfo] = useState(false);
  const { config } = useChatInterfaceSettings(chatbot.id);

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
          <div className="relative">
            <h1 className="text-2xl font-bold flex items-center">
              Playground
              <button
                className="ml-1 text-gray-400 text-lg"
                onMouseEnter={() => setShowPlaygroundInfo(true)}
                onMouseLeave={() => setShowPlaygroundInfo(false)}
              >
                ⓘ
              </button>
            </h1>
            {showPlaygroundInfo && (
              <InfoTooltip content="Test and experiment with your chatbot's settings in real-time. Changes made here won't affect your live chatbot until you save them." />
            )}
          </div>
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
            <ChatSettings 
              isVisible={isSettingsOpen} 
              onToggle={() => setIsSettingsOpen(false)}
              chatbotId={chatbot.id}
            />
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

              <div className={`bg-white rounded-lg shadow-sm border ${
                config.theme === 'dark' ? 'bg-gray-900 text-white' : ''
              }`}>
                {/* Chat Header */}
                <div 
                  className="flex items-center justify-between p-3 border-b"
                  style={{
                    backgroundColor: config.syncColors ? config.userMessageColor : undefined,
                    color: config.syncColors ? 'white' : undefined
                  }}
                >
                  <div className="text-sm">{config.displayName}</div>
                  <button 
                    onClick={handleRefresh}
                    className={`p-1.5 rounded-full ${
                      config.syncColors 
                        ? 'hover:bg-white/10 text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <IconRefresh className="w-4 h-4" />
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="h-[calc(100vh-280px)] overflow-y-auto p-4">
                  {messages.length === 0 && (
                    <div className={`text-gray-500 p-4 rounded-lg ${
                      config.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                    }`}>
                      {config.initialMessage}
                    </div>
                  )}
                  {messages.map((message, index) => (
                    <div key={index} className={`mb-4 ${message.role === 'assistant' ? '' : 'flex justify-end'}`}>
                      <div className={`rounded-lg p-3 inline-block max-w-[80%] ${
                        message.role === 'assistant' 
                          ? `${config.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} prose prose-sm max-w-none` 
                          : 'text-white'
                      }`}
                      style={{
                        backgroundColor: message.role === 'user' ? config.userMessageColor : undefined
                      }}>
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
                      placeholder={config.messagePlaceholder}
                      className={`w-full p-3 pr-10 rounded-lg border focus:outline-none focus:border-blue-500 text-sm ${
                        config.theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''
                      }`}
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

                {/* Footer */}
                {config.footerText && (
                  <div className="p-2 text-center text-sm text-gray-500">
                    <span>Powered by Chatbase.co</span>
                    <span className="ml-1">{config.footerText}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground; 