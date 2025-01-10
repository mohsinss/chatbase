"use client";
import React, { useState, useRef, useEffect } from "react";
import { IconSend, IconRefresh } from "@tabler/icons-react";
import ReactMarkdown from 'react-markdown';
import { ChatSettings } from './ChatSettings';
import { useChatInterfaceSettings } from '@/hooks/useChatInterfaceSettings';
import { useAISettings } from '@/hooks/useAISettings';
import { AISettingsProvider } from '@/contexts/AISettingsContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  confidenceScore?: number;
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
      language?: string;
    };
  };
}

const InfoTooltip = ({ content }: { content: string }) => (
  <div className="absolute left-0 top-full mt-1 w-64 p-3 bg-white border text-sm text-gray-600 rounded-md shadow-lg z-50">
    {content}
  </div>
);

interface ChatContainerProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  messages: Message[];
  config: any;
  isLoading: boolean;
  input: string;
  chatbotId: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleRefresh: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatContainer = ({
  isSettingsOpen,
  setIsSettingsOpen,
  messages,
  config,
  isLoading,
  input,
  setInput,
  handleSubmit,
  handleRefresh,
  messagesEndRef,
  chatbotId
}: ChatContainerProps) => {
  const getBackgroundColor = (confidenceScore: number) => {
    if (confidenceScore === -1) {
      return 'rgb(241, 241, 241)';
    }
    const normalizedScore = confidenceScore / 100;

    // Calculate the color based on the normalized score
    const red = Math.max(256 - Math.floor(normalizedScore * 15), 0); // Red decreases as score increases
    const green = Math.min(Math.floor(normalizedScore * 241), 241); // Green increases as score increases
    const blue = 241; // Keep blue constant

    return `rgb(${red}, ${green}, ${blue})`; // Return the RGB color
  };

  return (
    <div className="flex-1 flex justify-center ">
      <div className="w-full relative">

        <div className={`bg-white flex flex-col justify-between shadow-sm border ${config.theme === 'dark' ? 'bg-gray-900 text-white' : ''
          } ${config.roundedHeaderCorners ? 'rounded-t-xl' : 'rounded-t-lg'}`}>
          {/* Chat Header */}
          <div
            className={`flex items-center justify-between p-3 border-b ${config.roundedHeaderCorners ? 'rounded-t-xl' : ''
              }`}
            style={{
              backgroundColor: config.syncColors ? config.userMessageColor : undefined,
              color: config.syncColors ? 'white' : undefined
            }}
          >
            <div className="text-sm">{config.displayName}</div>
            <button
              onClick={handleRefresh}
              className={`p-1.5 rounded-full  pr-8 ${config.syncColors
                  ? 'hover:bg-white/10 text-white'
                  : 'hover:bg-gray-100'
                }`}
            >
              <IconRefresh className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-[calc(100vh-126px)] overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className={`text-gray-500 p-4 ${config.roundedChatCorners ? 'rounded-xl' : 'rounded-lg'
                } ${config.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                {config.initialMessage}
              </div>
            )}
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.role === 'assistant' ? '' : 'flex justify-end'}`}>
                <div className={`p-3 inline-block max-w-[80%] ${config.roundedChatCorners ? 'rounded-xl' : 'rounded-lg'
                  } ${message.role === 'assistant'
                    ? `${config.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} prose prose-sm max-w-none`
                    : 'text-white'
                  }`}
                  style={{
                    backgroundColor: message.role === 'user' ? config.userMessageColor : undefined,
                    transition: 'background-color 0.3s ease'
                  }}>
                  {message.role === 'assistant' ? (
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  ) : (
                    <p>{message.content}</p>
                  )}
                  {message.role === 'assistant' && message.confidenceScore != -1 && <div>
                    <span style={{ backgroundColor: getBackgroundColor(message.confidenceScore), padding: '2px 4px', borderRadius: '4px' }}>{message.confidenceScore}</span>
                  </div>}
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
                className={`w-full p-3 pr-10 border focus:outline-none focus:border-blue-500 text-sm ${config.roundedChatCorners ? 'rounded-lg' : 'rounded-md'
                  } ${config.theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}
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
              <span>Powered by Chatsa.co</span>
              <span className="ml-1">{config.footerText}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Playground = ({ chatbot }: PlaygroundProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showPlaygroundInfo, setShowPlaygroundInfo] = useState(false);
  const { config } = useChatInterfaceSettings(chatbot.id);
  const { settings: aiSettings, fetchSettings } = useAISettings(chatbot.id);
  const [confidenceScore, setConfidenceScore] = useState(0);

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

  // Add effect to refetch settings when they change
  useEffect(() => {
    fetchSettings();
  }, [chatbot.id]);

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
      // Fetch latest settings before making the chat request
      await fetchSettings();

      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          chatbotId: chatbot.id,
          language: aiSettings?.language,
          model: aiSettings?.model,
          temperature: aiSettings?.temperature,
          maxTokens: aiSettings?.maxTokens,
          systemPrompt: aiSettings?.systemPrompt
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
                    let lastMessage_content = lastMessage.content + parsed.text;

                    let confidenceScore1 = -1;

                    if (lastMessage_content.split(":::").length > 1 && lastMessage_content.split(":::")[1].length > 0) {
                      const confidenceScore = lastMessage_content.split(":::")[1];
                      confidenceScore1 = Number(confidenceScore)
                      console.log(confidenceScore1)
                      lastMessage_content = lastMessage_content.split(":::")[0];
                    }
                    return [
                      ...prev.slice(0, -1),
                      { ...lastMessage, content: lastMessage_content, confidenceScore: confidenceScore1 }
                    ];
                  });
                }
              } catch (e) {
                console.log('Skipping unparseable chunk');
              }
            }
            if (line.startsWith('score: ')) {
              const score = line.slice(6).trim();
              setConfidenceScore(Number(score))
              console.log(score)
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
    <div className="relative h-[100%]"
      style={{
        backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}>
      <div className="flex">

        {/* Chat Container */}
        <ChatContainer
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          messages={messages}
          config={config}
          isLoading={isLoading}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          handleRefresh={handleRefresh}
          messagesEndRef={messagesEndRef}
          chatbotId={chatbot.id}
        />
      </div>
    </div>
  );
};

export default Playground; 