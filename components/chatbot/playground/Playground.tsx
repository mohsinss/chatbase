"use client";
import React, { useState, useRef, useEffect } from "react";
import { IconSend, IconRefresh } from "@tabler/icons-react";
import ReactMarkdown from 'react-markdown';
import { ChatSettings } from './ChatSettings';
import { useChatInterfaceSettings } from '@/hooks/useChatInterfaceSettings';
import { useAISettings } from '@/hooks/useAISettings';
import { AISettingsProvider } from '@/contexts/AISettingsContext';
import toast from "react-hot-toast";

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
  embed?: boolean,
  team?: any,
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
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  config: any;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  input: string;
  chatbotId: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleRefresh: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  aiSettings: any;
  embed?: boolean;
}

const ChatContainer = ({
  isSettingsOpen,
  setIsSettingsOpen,
  messages,
  setMessages,
  config,
  isLoading,
  setIsLoading,
  input,
  setInput,
  handleSubmit,
  handleRefresh,
  messagesEndRef,
  chatbotId,
  aiSettings,
  embed = false,
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

  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [loadingSources, setLoadingSources] = useState(false);
  const [sources, setSources] = useState([])

  const fetchDataset = async () => {
    try {
      const response = await fetch(`/api/chatbot/sources/dataset?chatbotId=${chatbotId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dataset');
      }
      const data = await response.json();
      return data.datasetId;
    } catch (error) {
      console.error("Error fetching dataset:", error);
    }
  };

  const loadSources = async () => {
    setLoadingSources(true);
    const datasetId = await fetchDataset();
    console.log(datasetId)
    const options = {
      method: 'POST',
      headers: {
        'TR-Dataset': datasetId,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TRIEVE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: '{}'
    };

    fetch('https://api.trieve.ai/api/chunks/scroll', options)
      .then(response => response.json())
      .then(response => setSources(response.chunks))
      .catch(err => console.error(err))
      .finally(() => setLoadingSources(false));
  }

  // Modal Component
  //@ts-ignore
  const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null; // Don't render if not open

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-4 pt-8 rounded shadow-lg relative min-w-[400px] max-w-[800px] w-[80%] h-[80%] overflow-x-hidden overflow-y-scroll">
          <button onClick={onClose} className="absolute top-2 right-2">
            ✖️
          </button>
          <h1 className="font-bold text-2xl">Sources</h1>
          {sources.map((chunk, index) => {
            if (chunk.metadata.filetype == "pdf") return null;
            return <div key={'chunk-' + index} className="border-b-[1px] pt-2">{chunk.chunk_html}</div>
          })}
          <button
            onClick={onClose} // Open modal on button click
            className="mt-2 w-full rounded-md border-[1px] bg-white p-2 text-center hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`${embed ? '' : 'pt-4 px-4'} flex-1 flex justify-center h-full`}>
      <div className={`${embed ? 'w-full' : 'w-[400px]'} relative h-full `}>
        {!embed && !isSettingsOpen && (
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="absolute -left-12 h-[38px] w-[38px] flex items-center justify-center border rounded-lg bg-white"
          >
            ☰
          </button>
        )}

        <div className={`h-full min-h-[calc(100vh-180px)] flex flex-col bg-white shadow-sm border ${config.theme === 'dark' ? 'bg-gray-900 text-white' : ''
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
            <div className="flex items-center gap-3">
              {/* Profile Picture */}
              {config.profilePictureUrl && (
                <div
                  className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden"
                  style={{
                    backgroundImage: `url(${config.profilePictureUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              )}
              <div className="font-medium">{config.displayName}</div>
            </div>
            <button
              onClick={handleRefresh}
              className={`p-1.5 mr-7 rounded-full ${config.syncColors
                ? 'hover:bg-white/10 text-white'
                : 'hover:bg-gray-100'
                }`}
            >
              <IconRefresh className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className={`overflow-y-auto p-4 flex-grow`}>
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
                    ? 'prose prose-sm max-w-none bg-white'
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

          <div className="flex flex-col justify-between">
            {/* Suggested Messages - Horizontal scrollable */}
            <div className="px-3 overflow-x-auto whitespace-nowrap flex gap-2 mb-4 pb-2">
              {config.suggestedMessages?.split('\n').filter((msg: string) => msg.trim()).map((message: string, index: number) => (
                <button
                  key={index}
                  className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors flex-none"
                  onClick={async (e) => {
                    e.preventDefault();
                    // Create the message directly
                    const userMessage: Message = { role: 'user', content: message };
                    setMessages(prev => [...prev, userMessage]);
                    setInput('');

                    // Start the chat process
                    setIsLoading(true);
                    try {
                      const response = await fetch('/api/chatbot/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          messages: [...messages, userMessage],
                          chatbotId: chatbotId,
                          language: aiSettings?.language,
                          model: aiSettings?.model,
                          temperature: aiSettings?.temperature,
                          maxTokens: aiSettings?.maxTokens,
                          systemPrompt: aiSettings?.systemPrompt
                        }),
                      });

                      if (!response.ok) {                        
                        if (response.status === 500) {
                          const data = await response.json();
                          if (data.error === 'No more credits') {
                            // Handle the 'Credits are limited' error here
                            console.error('No more credits');
                            throw new Error('No more credits');
                          }
                        }
                        throw new Error('Stream failed.');
                      }
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
                          }
                        }
                      }
                    } catch (error) {
                      console.error('Chat error:', error);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  {message}
                </button>
              ))}
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
            {embed && <div className="p-2 text-center text-sm text-gray-500">
              <span>Powered by <a href={`${process.env.NODE_ENV === 'development' ? 'http:' : 'https:'}//${process.env.NEXT_PUBLIC_DOMAIN}`} target="_black" className="text-blue-600 hover:text-blue-800">Chatsa.co</a></span>
              {config.footerText && <span className="ml-1">{config.footerText}</span>}
            </div>}
          </div>
        </div>
        <button
          onClick={() => { loadSources(); setIsModalOpen(true); }} // Open modal on button click
          className={`${embed ? 'hidden' : ""} mt-2 w-full rounded-md border-[1px] bg-white p-2 text-center hover:bg-slate-100`}
        >
          {loadingSources ? 'Loading Sources...' : "Show Sources"}
        </button>
        {!embed && <Modal isOpen={isModalOpen && !loadingSources} onClose={() => setIsModalOpen(false)} />}
      </div>
    </div>
  );
};

const Playground = ({ chatbot, embed = false, team }: PlaygroundProps) => {
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

      if (!response.ok) {
        if (response.status === 500) {
          const data = await response.json();
          if (data.error === 'No more credits') {
            // Handle the 'Credits are limited' error here
            console.error('No more credits');
            throw new Error('No more credits');
          }
        }
        throw new Error('Stream failed.');
      }

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
      toast.error(error.message)
    } finally {
      setIsLoading(false);
    }
  };

  const handleContent = (text: string, confidenceScore: number) => {
    console.log(`Received text: ${text} with confidence score: ${confidenceScore}`);
    // Handle the text and confidence score as needed
  };

  if (embed) {
    return (
      <div className="relative" style={{ height: '100dvh' }}>
        <ChatContainer
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          messages={messages}
          setMessages={setMessages}
          config={config}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          handleRefresh={handleRefresh}
          messagesEndRef={messagesEndRef}
          chatbotId={chatbot.id}
          aiSettings={aiSettings}
          embed={embed}
        />
      </div>
    )
  }
  return (
    <AISettingsProvider chatbotId={chatbot.id}>
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
        <div className="relative min-h-[calc(100dvh-80px)] pl-2"
          style={{
            backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}>
          <div className="flex h-full">
            {/* Settings Panel */}
            <div className={`w-[400px] transition-all duration-300 ${isSettingsOpen ? 'mr-4' : '-ml-[400px]'
              }`}>
              <ChatSettings
                isVisible={isSettingsOpen}
                onToggle={() => setIsSettingsOpen(false)}
                chatbotId={chatbot.id}
                team={team}
              />
            </div>

            {/* Chat Container */}
            <ChatContainer
              isSettingsOpen={isSettingsOpen}
              setIsSettingsOpen={setIsSettingsOpen}
              messages={messages}
              setMessages={setMessages}
              config={config}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              handleRefresh={handleRefresh}
              messagesEndRef={messagesEndRef}
              chatbotId={chatbot.id}
              aiSettings={aiSettings}
              embed={embed}
            />
          </div>
        </div>
      </div>
    </AISettingsProvider>
  );
};

export default Playground; 