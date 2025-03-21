"use client";
import React, { useState, useRef, useEffect } from "react";
import { IconSend, IconRefresh, IconX } from "@tabler/icons-react";
import ReactMarkdown from 'react-markdown';
import { ChatSettings } from './ChatSettings';
import { useChatInterfaceSettings } from '@/hooks/useChatInterfaceSettings';
import { useChatbotLeadSetting, ChatbotLeadSettings } from "@/hooks/useChatbotLeadSetting";
import { useAISettings } from '@/hooks/useAISettings';
import { AISettingsProvider, useAISettings as useAISettingsProvider } from "@/contexts/AISettingsContext";
import toast from "react-hot-toast";
import Link from "next/link";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  confidenceScore?: number;
  reasonal_content?: string;
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
  setCurrentNodeId: React.Dispatch<React.SetStateAction<Number>>;
  input: string;
  chatbotId: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleRefresh: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  aiSettings: any;
  embed?: boolean;
  setConfig: React.Dispatch<React.SetStateAction<any>>;
  leadSetting?: ChatbotLeadSettings;
  conversationId?: string;
  currentNodeId?: Number;
}

interface ChatConfig {
  chatWidth: number;
  theme: string;
  roundedHeaderCorners: boolean;
  roundedChatCorners: boolean;
  userMessageColor: string;
  displayName: string;
  profilePictureUrl?: string;
  chatIconUrl?: string;
  initialMessage: string;
  messagePlaceholder: string;
  suggestedMessages?: string;
  footerText?: string;
  syncColors: boolean;
  bubbleAlignment: string;
  chatBackgroundUrl?: string;
  chatBackgroundOpacity?: number;
  conversationId?: string;
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
  setConfig,
  leadSetting,
  conversationId,
  setCurrentNodeId,
  currentNodeId,
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
  const [sources, setSources] = useState([]);
  const [showLead, setShowLead] = useState(true);
  const { settings: globalSettings, updateSettings: updateGlobalSettings } = useAISettingsProvider();
  const isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);

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

    // Find the last user message
    const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');

    const options = {
      method: 'POST',
      headers: {
        'TR-Dataset': datasetId,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TRIEVE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: lastUserMessage?.content || " ",
        search_type: 'semantic',
        page_size: aiSettings?.chunkCount || 4,
      })
    };

    const chunk_response = await fetch('https://api.trieve.ai/api/chunk/search', options)
      .then(response => response.json())
      .then(response => {
        setSources(response.chunks);
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingSources(false));

    // fetch('https://api.trieve.ai/api/chunks/scroll', options)
    //   .then(response => response.json())
    //   .then(response => setSources(response.chunks))
    //   .catch(err => console.error(err))
    //   .finally(() => setLoadingSources(false));
  }

  // Modal Component
  //@ts-ignore
  const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null; // Don't render if not open

    return (
      <div className="z-[11] fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-4 pt-8 rounded shadow-lg relative min-w-[400px] max-w-[800px] w-[80%] h-[80%] overflow-x-hidden overflow-y-scroll">
          <button onClick={onClose} className="absolute top-2 right-2">
            ✖️
          </button>
          <h1 className="font-bold text-2xl">Sources</h1>
          {sources.map((chunk, index) => {
            // if (chunk.metadata.filetype == "pdf") return null;
            return <div key={'chunk-' + chunk.chunk.id} className="border-b-[1px] pt-2">{chunk.chunk.chunk_html}</div>
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

  const toggleChatWindow = () => {
    const chatContainer = document.getElementById('chatbot-widget')
    const closeButton = document.getElementById('close-button')
    const chatIcon = document.getElementById('chatbot-widget-icon')
    if (chatContainer.style.display === 'none' || chatContainer.style.display === '') {
      chatContainer.style.display = 'block';
      closeButton.style.display = 'block';
      if (!config?.chatIconUrl) {
        chatIcon.innerHTML = `<svg id="closeIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.3" stroke="white" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
            </svg>`;
      }
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    } else {
      chatContainer.style.display = 'none';
      closeButton.style.display = 'none';
      if (!config?.chatIconUrl) {
        chatIcon.innerHTML = '<div>💬</div>';
      }
      document.getElementsByTagName('body')[0].style.overflowY = 'scroll';
    }
  }

  useEffect(() => {
    const handleSettingsUpdate = (event: MessageEvent) => {
      if (event.data.type === 'chatbot-settings-update') {
        const newSettings = event.data.settings;
        // Update the config with new settings
        setConfig((prev: ChatConfig) => ({
          ...prev,
          ...newSettings
        }));
      }
    };

    window.addEventListener('message', handleSettingsUpdate);
    return () => window.removeEventListener('message', handleSettingsUpdate);
  }, [setConfig]);

  useEffect(() => {
    // Update the config with new settings
    setConfig((prev: ChatConfig) => ({
      ...prev,
      suggestedMessages: globalSettings?.suggestedMessages,
    }));
  }, [globalSettings])

  const handleLeadFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');

    const customQuestions = leadSetting?.customQuestions || [];
    const customAnswers = customQuestions.reduce((answers, question) => {
      answers[question] = formData.get(question) as string;
      return answers;
    }, {} as Record<string, string>);

    try {
      const response = await fetch('/api/chatbot/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbotId: chatbotId,
          name,
          email,
          phone,
          customAnswers,
          conversationId
        }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          // Handle invalid email error
          const data = await response.json();
          setShowLead(false);
          toast.error(data.error);
          return;
        } else {
          throw new Error('Failed to submit lead');
        }
      }

      toast.success('Thank you for your attention.');
      // Handle successful lead submission here
      // For example, you might want to clear the form and show a success message
    } catch (error) {
      console.error('Error submitting lead:', error);

      toast.error('Sth went wrong.');
    } finally {
      setShowLead(false);
    }
  };

  return (
    <div className={`${embed ? '' : 'pt-4 px-4'} min-h-[calc(100dvh-80px)] flex-1 flex justify-center h-full`}>
      <div
        className={`${embed ? 'w-full h-full' : ''} relative`}
        style={{ width: `${config.chatWidth}px` }}
      >
        {!embed && !isSettingsOpen && (
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`absolute ${config.bubbleAlignment === 'right' ? '-left-12' : '-right-12'} h-[38px] w-[38px] flex items-center justify-center border rounded-lg bg-white`}
          >
            ☰
          </button>
        )}

        <div className={`h-full flex flex-col bg-white shadow-sm border ${config.theme === 'dark' ? 'bg-gray-900 text-white' : ''
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
            <div className="flex justify-center items-center">
              <button
                onClick={() => { handleRefresh() }}
                className={`p-1.5 rounded-full ${config.syncColors
                  ? 'hover:bg-white/10 text-white'
                  : 'hover:bg-gray-100'
                  }`}
              >
                <IconRefresh className="w-4 h-4" />
              </button>
              <button
                onClick={() => { window.parent.postMessage({ action: 'closeIframe' }, '*') }}
                className={`p-1.5 rounded-full ${config.syncColors
                  ? 'hover:bg-white/10 text-white'
                  : 'hover:bg-gray-100'
                  } ${isMobile ? '' : 'hidden'}`}
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            className={`overflow-y-hidden p-4 flex-grow relative`}
            style={{
              // backgroundImage: config.chatBackgroundUrl ? `url(${config.chatBackgroundUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 p-4 overflow-y-auto"
              style={{
                backgroundImage: config.chatBackgroundUrl ? `url(${config.chatBackgroundUrl})` : 'none',
                backgroundColor: 'white',
                opacity: config.chatBackgroundOpacity,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                // opacity: config.chatBackgroundUrl ? 1 - (config.chatBackgroundOpacity || 0.1) : 1,
              }}>
            </div>
            <div className="absolute inset-0 p-4 overflow-y-auto"
              style={{
                backgroundColor: 'none',
              }}>
              {/* Keep existing chat messages but wrap them in a relative div */}
              <div className="relative z-10">
                {messages.length === 0 && (
                  <div className={` p-4 ${config.roundedChatCorners ? 'rounded-xl' : 'rounded-lg'
                    } ${config.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    {config.initialMessage}
                  </div>
                )}
                {messages.map((message, index) => (
                  <div key={index} className={`mb-4 ${message.role === 'assistant' ? '' : 'flex justify-end'}`}>
                    <div className={`p-3 inline-block max-w-[80%] ${config.roundedChatCorners ? 'rounded-xl' : 'rounded-lg'
                      } ${message.role === 'assistant'
                        ? 'prose prose-sm max-w-none bg-gray-50'
                        : 'text-white'
                      }`}
                      style={{
                        backgroundColor: message.role === 'user' ? config.userMessageColor : undefined,
                        transition: 'background-color 0.3s ease'
                      }}>
                      {message.reasonal_content &&
                        <p className="p-1 rounded-sm bg-slate-100 pb-3 hidden">{message.reasonal_content}</p>
                      }
                      {message.role === 'assistant' ? (
                        <div className="html-content" dangerouslySetInnerHTML={{ __html: message.content }} />
                        // <ReactMarkdown>{message.content}</ReactMarkdown>
                      ) : (
                        <p className="p-1">{message.content}</p>
                      )}
                      {message.role === 'assistant' && message.confidenceScore != -1 &&
                        <div className="mt-2">
                          <span style={{ backgroundColor: getBackgroundColor(message.confidenceScore), padding: '2px 4px', borderRadius: '4px' }}>{message.confidenceScore}</span>
                        </div>}
                    </div>
                  </div>
                ))}
                {isLoading && <span className="loading loading-spinner loading-xs"></span>}
                {
                  !isLoading && showLead && (leadSetting?.enable == "immediately"
                    || (leadSetting?.enable == "after"
                      && messages.filter(message => message.role === 'user').length >= leadSetting?.delay))
                  &&
                  <div className="py-3">
                    <div className="hyphens-auto break-words rounded-[20px] text-left text-sm leading-5 antialiased relative inline-block max-w-full rounded-r-[20px] rounded-l px-5 py-4 only:rounded-[20px] last:rounded-tl first:rounded-tl-[20px] first:rounded-bl only:rounded-bl last:rounded-bl-[20px] bg-zinc-200/50 text-zinc-800 group-data-[theme=dark]:bg-zinc-800/80 group-data-[theme=dark]:text-zinc-300">
                      <div className="float-left clear-both">
                        <div className="flex space-x-3">
                          <div className="flex-1 gap-4">
                            <div className="text-left text-inherit">
                              <form onSubmit={handleLeadFormSubmit}>
                                <div className="mb-4 flex items-start justify-between">
                                  <h4 className="pr-8 font-semibold text-sm">{leadSetting?.title}</h4>
                                  <button
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 underline-offset-4 hover:underline dark:text-zinc-50 h-9 w-9 absolute top-0 right-0 p-0 group-data-[theme=dark]:hover:text-zinc-400 group-data-[theme=dark]:text-zinc-300 text-zinc-700 hover:text-zinc-600"
                                    type="button"
                                    onClick={() => setShowLead(false)}
                                    aria-label="Close contact form"
                                    title="Close contact form">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="h-4 w-4">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                  </button>
                                </div>
                                {
                                  leadSetting?.name
                                  && <div className="mb-4">
                                    <label className="mb-1 block font-medium text-sm" htmlFor="name">Name</label>
                                    <div className="flex w-full rounded group-data-[theme=dark]:bg-black bg-white">
                                      <input id="name" autoComplete="name" className="w-full min-w-0 flex-auto appearance-none rounded border bg-inherit p-1 px-3 py-2 sm:text-sm focus:outline-none focus:ring-none group-data-[theme=dark]:border-[#5f5f5e] border-[#cfcfce]" maxLength={70} aria-label="Name" title="Name" name="name" />
                                    </div>
                                  </div>
                                }
                                {
                                  leadSetting?.email
                                  && <div className="mb-4">
                                    <label className="mb-1 block font-medium text-sm" htmlFor="email">Email</label>
                                    <div className="flex w-full rounded group-data-[theme=dark]:bg-black bg-white">
                                      <input id="email" autoComplete="email" required={true} className="w-full min-w-0 flex-auto rounded border bg-inherit p-1 px-3 py-2 sm:text-sm focus:outline-none focus:ring-none group-data-[theme=dark]:border-[#5f5f5e] border-[#cfcfce]" aria-label="Email" title="Email" type="email" name="email" />
                                    </div>
                                  </div>
                                }
                                {
                                  leadSetting?.phone
                                  && <div className="mb-4">
                                    <label className="mb-1 block font-medium text-sm" htmlFor="phone">Phone Number</label>
                                    <div className="flex w-full rounded group-data-[theme=dark]:bg-black bg-white">
                                      <input id="phone" autoComplete="tel" required={true} className="w-full min-w-0 flex-auto appearance-none rounded border bg-inherit p-1 px-3 py-2 sm:text-sm focus:outline-none focus:ring-none group-data-[theme=dark]:border-[#5f5f5e] border-[#cfcfce]" aria-label="Phone Number" title="Phone Number" type="tel" name="phone" />
                                    </div>
                                  </div>
                                }
                                {
                                  leadSetting?.customQuestions?.map((question, index) => (
                                    <div key={index} className="mb-4">
                                      <label className="mb-1 block font-medium text-sm" htmlFor={`customQuestion-${index}`}>{question}</label>
                                      <div className="flex w-full rounded group-data-[theme=dark]:bg-black bg-white">
                                        <input id={`${question}`} className="w-full min-w-0 flex-auto rounded border bg-inherit p-1 px-3 py-2 sm:text-sm focus:outline-none focus:ring-none group-data-[theme=dark]:border-[#5f5f5e] border-[#cfcfce]" aria-label={question} title={question} name={question} />
                                      </div>
                                    </div>
                                  ))
                                }
                                <div className="flex items-end justify-between">
                                  <button
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-800/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 h-9 px-4 py-1"
                                    aria-label="Send your contact info"
                                    title="Send your contact info"
                                    type="submit">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
                                      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z">
                                      </path>
                                    </svg>
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="flex flex-col justify-between pt-2">
            {/* Suggested Messages - Horizontal scrollable */}
            <div className="px-3 overflow-x-auto whitespace-nowrap flex gap-2 mb-4 pb-2">
              {!currentNodeId && config.suggestedMessages?.split('\n').filter((msg: string) => msg.trim()).map((message: string, index: number) => (
                <button
                  key={index}
                  className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors flex-none"
                  onClick={async (e) => {
                    e.preventDefault();
                    // Create the message directly
                    const userMessage: Message = { role: 'user', content: message };
                    setMessages(prev => [...prev, userMessage]);
                    setInput('');

                    if (!conversationId) return;
                    // Start the chat process
                    setIsLoading(true);
                    try {
                      if (!isLoading && showLead && (leadSetting?.enable == "immediately"
                        || (leadSetting?.enable == "after"
                          && messages.filter(message => message.role === 'user').length >= leadSetting?.delay))) {
                        toast.error('Please submit the form. 🙂');
                        setIsLoading(false);
                        return;
                      }
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
                          systemPrompt: aiSettings?.systemPrompt,
                          conversationId,
                        }),
                      });

                      if (!response.ok) {
                        if (response.status === 500) {
                          const data = await response.json();
                          if (data.error === 'limit reached, upgrade for more messages.') {
                            // Handle the 'Credits are limited' error here
                            console.error('limit reached, upgrade for more messages.');
                            throw new Error('limit reached, upgrade for more messages.');
                          }
                        }
                        throw new Error('Stream failed.');
                      }

                      const contentType = response.headers.get('Content-Type');

                      if (contentType?.includes('application/json')) {
                        // Non-streaming response
                        const data = await response.json();

                        if (data.message) {
                          const assistantMessage: Message = { role: 'assistant', content: data.message, confidenceScore: 100 };
                          setMessages(prev => [...prev, assistantMessage]);
                        }

                        if (data.options && data.options.length > 0) {
                          const optionsHtml = `
                            <div>
                              <p>${data.question}</p>
                              <div class="mt-2">
                              ${data.options.map((option: string, index: number) => `
                                <button class="chat-option-btn w-full text-left px-4 py-2 rounded hover:bg-gray-200 embed-btn" data-index="${index}">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-undo"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
                                  ${option}
                                </button>
                              `).join('')}
                              </div>
                            </div>
                          `;
                          const optionsMessage: Message = { role: 'assistant', content: optionsHtml, confidenceScore: 100 };
                          setMessages(prev => [...prev, optionsMessage]);
                          setCurrentNodeId(data.nextNodeId);
                        } else {
                          setCurrentNodeId(null);
                        }
                        setIsLoading(false);
                      } else {
                        const assistantMessage: Message = { role: 'assistant', content: '', reasonal_content: '' };
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
                            // console.log(lines)

                            for (const line of lines) {
                              if (line.startsWith('data: ')) {
                                const data = line.slice(5).trim();

                                if (data === '[DONE]') {
                                  setIsLoading(false);
                                  continue
                                }

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
                              }
                              else if (line.startsWith('reason: ')) {
                                const data = line.slice(7).trim();
                                console.log(data)

                                try {
                                  const parsed = JSON.parse(data);
                                  if (parsed.reasonal_text) {

                                    setMessages(prev => {
                                      const lastMessage = prev[prev.length - 1];
                                      let lastMessage_reasonal_content = lastMessage?.reasonal_content + parsed.reasonal_text;
                                      return [
                                        ...prev.slice(0, -1),
                                        { ...lastMessage, reasonal_content: lastMessage_reasonal_content }
                                      ];
                                    });
                                  }

                                } catch (e) {
                                  console.log(e)
                                }
                              }
                            }
                          }
                        }
                      }
                    } catch (error) {
                      console.error('Chat error:', error);
                      setIsLoading(false);
                      toast.error(error.message)
                    }
                  }}
                >
                  {message}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!isLoading && showLead && (leadSetting?.enable == "immediately"
                || (leadSetting?.enable == "after"
                  && messages.filter(message => message.role === 'user').length >= leadSetting?.delay))) {
                toast.error('Please submit the form. 🙂');
                return;
              }
              handleSubmit(e)
            }} className="border-t p-3">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={config.messagePlaceholder}
                  className={`w-full p-3 pr-10 border focus:outline-none focus:border-blue-500 text-sm ${config.roundedChatCorners ? 'rounded-lg' : 'rounded-md'
                    } ${config.theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}
                  disabled={isLoading || !!currentNodeId}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim() || !!currentNodeId}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full disabled:opacity-50"
                  style={{ 
                    backgroundColor: !isLoading && input.trim() && !currentNodeId ? config.userMessageColor : 'transparent',
                    color: !isLoading && input.trim() && !currentNodeId ? 'white' : 'gray' 
                  }}
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
      </div>
      {!embed && <Modal isOpen={isModalOpen && !loadingSources} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

const debounce = (func: Function, wait: number) => {
  let timeout: any;
  const debouncedFunc = (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  debouncedFunc.cancel = () => clearTimeout(timeout);
  return debouncedFunc;
};

const Playground = ({ chatbot, embed = false, team }: PlaygroundProps) => {
  if (team) {
    team = JSON.parse(team)
  }
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showPlaygroundInfo, setShowPlaygroundInfo] = useState(false);
  const { config, setConfig } = useChatInterfaceSettings(chatbot.id);
  const { settings: aiSettings, fetchSettings } = useAISettings(chatbot.id);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const { leadSetting } = useChatbotLeadSetting(chatbot.id);
  const [currentNodeId, setCurrentNodeId] = useState(null);

  const debouncedSave = React.useCallback(
    debounce((msgs: Message[]) => {
      if (msgs.length > 0 && conversationId) {
        saveConversation();
      }
    }, 1000),
    [conversationId]
  );

  // Create new conversation on mount
  useEffect(() => {
    createNewConversation();
  }, [chatbot.id]);

  // Save conversation when messages change
  useEffect(() => {
    debouncedSave(messages);
    return () => debouncedSave.cancel?.();
  }, [messages, debouncedSave]);

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
          source: embed ? "Playground" : "Playground",
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

  // Add this to your window object for global access
  // useEffect(() => {
  //   (window as any).handleOptionSelect = (value: string) => {
  //     // Send the selection to your chat API
  //     handleSendMessage(value);
  //   };

  //   // Cleanup
  //   return () => {
  //     delete (window as any).handleOptionSelect;
  //   };
  // }, [conversationId]);

  // Handle option clicks
  useEffect(() => {
    const handleOptionClick = async (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('chat-option-btn')) {
        const option = target.textContent || '';
        const index = target.getAttribute('data-index');

        const userMessage: Message = { role: 'user', content: option };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
          const response = await fetch('/api/chatbot/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              selectedOption: option,
              optionIndex: Number(index),
              currentNodeId,
              chatbotId: chatbot.id,
              conversationId,
              messages: [...messages, userMessage],
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch response.');
          }

          const contentType = response.headers.get('Content-Type');

          if (contentType?.includes('application/json')) {
            // Non-streaming response
            const data = await response.json();

            if (data.message) {
              const assistantMessage: Message = { role: 'assistant', content: data.message, confidenceScore: 100 };
              setMessages(prev => [...prev, assistantMessage]);
            }

            if (data.options && data.options.length > 0) {
              const optionsHtml = `
                <div>
                  <p>${data.question}</p>
                  <div class="mt-2">
                  ${data.options.map((option: string, index: number) => `
                    <button class="chat-option-btn w-full text-left px-4 py-2 rounded hover:bg-gray-200 embed-btn" data-index="${index}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-undo"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
                      ${option}
                    </button>
                  `).join('')}
                  </div>
                </div>
              `;
              const optionsMessage: Message = { role: 'assistant', content: optionsHtml, confidenceScore: 100 };
              setMessages(prev => [...prev, optionsMessage]);
              setCurrentNodeId(data.nextNodeId);
            } else {
              setCurrentNodeId(null);
            }
          } else {
            const assistantMessage: Message = { role: 'assistant', content: '', reasonal_content: '' };
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
                // console.log(lines)

                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    const data = line.slice(5).trim();

                    if (data === '[DONE]') {
                      setIsLoading(false);
                      continue
                    }

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
                  }
                  else if (line.startsWith('reason: ')) {
                    const data = line.slice(7).trim();
                    console.log(data)

                    try {
                      const parsed = JSON.parse(data);
                      if (parsed.reasonal_text) {

                        setMessages(prev => {
                          const lastMessage = prev[prev.length - 1];
                          let lastMessage_reasonal_content = lastMessage?.reasonal_content + parsed.reasonal_text;
                          return [
                            ...prev.slice(0, -1),
                            { ...lastMessage, reasonal_content: lastMessage_reasonal_content }
                          ];
                        });
                      }

                    } catch (e) {
                      console.log(e)
                    }
                  }
                  else if (line.startsWith('score: ')) {
                    const score = line.slice(6).trim();
                    setConfidenceScore(Number(score))
                    console.log(score)
                  }
                }
              }
            }
          }

        } catch (error) {
          console.error('Option click error:', error);
          toast.error(error.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    document.addEventListener('click', handleOptionClick);
    return () => document.removeEventListener('click', handleOptionClick);
  }, [currentNodeId, chatbot, conversationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    handleSendMessage(input);
  };

  const handleSendMessage = async (input: string) => {
    if (!conversationId) return;
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
          systemPrompt: aiSettings?.systemPrompt,
          conversationId,
        }),
      });

      if (!response.ok) {
        if (response.status === 500) {
          const data = await response.json();
          if (data.error === 'limit reached, upgrade for more messages.') {
            // Handle the 'Credits are limited' error here
            console.error('limit reached, upgrade for more messages.');
            throw new Error('limit reached, upgrade for more messages.');
          }
        }
        throw new Error('Stream failed.');
      }

      const contentType = response.headers.get('Content-Type');

      if (contentType?.includes('application/json')) {
        // Non-streaming response
        const data = await response.json();

        if (data.message) {
          const assistantMessage: Message = { role: 'assistant', content: data.message, confidenceScore: 100 };
          setMessages(prev => [...prev, assistantMessage]);
        }

        if (data.options && data.options.length > 0) {
          const optionsHtml = `
            <div>
              <p>${data.question}</p>
              <div class="mt-2">
              ${data.options.map((option: string, index: number) => `
                <button class="chat-option-btn w-full text-left px-4 py-2 rounded hover:bg-gray-200 embed-btn" data-index="${index}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-undo"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
                  ${option}
                </button>
              `).join('')}
              </div>
            </div>
          `;
          const optionsMessage: Message = { role: 'assistant', content: optionsHtml, confidenceScore: 100 };
          setMessages(prev => [...prev, optionsMessage]);
          setCurrentNodeId(data.nextNodeId);
        } else {
          setCurrentNodeId(null);
        }
      } else {
        const assistantMessage: Message = { role: 'assistant', content: '', reasonal_content: '' };
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
            // console.log(lines)

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(5).trim();

                if (data === '[DONE]') {
                  setIsLoading(false);
                  continue
                }

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
              }
              else if (line.startsWith('reason: ')) {
                const data = line.slice(7).trim();
                console.log(data)

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.reasonal_text) {

                    setMessages(prev => {
                      const lastMessage = prev[prev.length - 1];
                      let lastMessage_reasonal_content = lastMessage?.reasonal_content + parsed.reasonal_text;
                      return [
                        ...prev.slice(0, -1),
                        { ...lastMessage, reasonal_content: lastMessage_reasonal_content }
                      ];
                    });
                  }

                } catch (e) {
                  console.log(e)
                }
              }
              else if (line.startsWith('score: ')) {
                const score = line.slice(6).trim();
                setConfidenceScore(Number(score))
                console.log(score)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error.message)
      setIsLoading(false);
    }
  }

  const handleContent = (text: string, confidenceScore: number) => {
    console.log(`Received text: ${text} with confidence score: ${confidenceScore}`);
    // Handle the text and confidence score as needed
  };

  if (embed) {
    return (
      <AISettingsProvider chatbotId={chatbot.id}>
        <div className="relative" style={{ height: '100dvh' }}>
          <ChatContainer
            setCurrentNodeId={setCurrentNodeId}
            currentNodeId={currentNodeId}
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
            setConfig={setConfig}
            leadSetting={leadSetting}
            conversationId={conversationId}
          />
        </div>
      </AISettingsProvider>
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
            <Link href={window.location + '/compare'} className="px-4 py-1.5 border rounded-lg text-sm">Compare</Link>
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
                fetchSettings={fetchSettings}
              />
            </div>

            {/* Chat Container */}
            <ChatContainer
              setCurrentNodeId={setCurrentNodeId}
              isSettingsOpen={isSettingsOpen}
              setIsSettingsOpen={setIsSettingsOpen}
              currentNodeId={currentNodeId}
              messages={messages}
              setMessages={setMessages}
              config={config}
              setConfig={setConfig}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              handleRefresh={handleRefresh}
              messagesEndRef={messagesEndRef}
              chatbotId={chatbot.id}
              aiSettings={aiSettings}
              conversationId={conversationId}
              embed={embed}
            />
          </div>
        </div>
      </div>
    </AISettingsProvider>
  );
};

export default Playground; 