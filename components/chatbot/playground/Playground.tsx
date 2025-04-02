"use client";
import React, { useState, useRef, useEffect } from "react";
import { IconSend, IconRefresh, IconX, IconAlertCircle, IconArrowUp } from "@tabler/icons-react";
import ReactMarkdown from 'react-markdown';
import { ChatSettings } from './ChatSettings';
import { useChatInterfaceSettings } from '@/hooks/useChatInterfaceSettings';
import { useChatbotLeadSetting, ChatbotLeadSettings } from "@/hooks/useChatbotLeadSetting";
import { useAISettings } from '@/hooks/useAISettings';
import { AISettingsProvider, useAISettings as useAISettingsProvider } from "@/contexts/AISettingsContext";
import toast from "react-hot-toast";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PlansSettings } from "@/components/tabs/settings/PlansSettings";
import CalComBooker from "@/components/chatbot/actions/CalComBooker";
import { getEventTypeId, bookMeeting, combineDateAndTime } from "@/lib/calcom";

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
  mocking?: boolean,
  team?: any,
  standalone?: boolean,
  mockingData?: Object,
  isMockingDataValid?: boolean
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
  mocking?: boolean;
  setConfig: React.Dispatch<React.SetStateAction<any>>;
  leadSetting?: ChatbotLeadSettings;
  conversationId?: string;
  currentNodeId?: Number;
  qFlowAIEnabled: boolean;
  standalone?: boolean;
  showCalendar: boolean;
  setShowCalendar: React.Dispatch<React.SetStateAction<boolean>>;
  availableSlots: Record<string, { time: string }[]>;
  handleSendMessage: (message: string) => Promise<void>;
  meetingUrl?: string;
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
  qFlowAIEnabled,
  standalone = false,
  mocking = false,
  showCalendar,
  setShowCalendar,
  handleSendMessage,
  availableSlots,
  meetingUrl
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

  const getTextColor = (confidenceScore: number) => {
    const bgColor = getBackgroundColor(confidenceScore);
    const rgb = bgColor.match(/\d+/g)?.map(Number) || [255, 255, 255];

    // Calculate luminance
    const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]);

    // Return black for bright backgrounds, white for dark backgrounds
    return luminance > 186 ? '#000000' : '#FFFFFF';
  };

  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [loadingSources, setLoadingSources] = useState(false);
  const [sources, setSources] = useState([]);
  const [showLead, setShowLead] = useState(true);
  const { settings: globalSettings, updateSettings: updateGlobalSettings } = useAISettingsProvider();
  const isMobile = /iPhone|iPad|iPod|Android/i.test(window?.navigator?.userAgent);

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

  const handleTimeSlotSelect = (data: any) => {
    console.log(data)
  }

  const onScheduleSubmit = async (date: Date, timeSlot: string, formData: { name: string; email: string; notes?: string; guests?: string; rescheduleReason?: string }) => {
    const [username, eventSlug] = meetingUrl.replace("https://cal.com/", "").split("/");
    const eventTypeId = await getEventTypeId(username, eventSlug);

    if (!eventTypeId) {
      toast.error('Unable to retrieve event type ID.');
      return false;
    }

    const startTime = combineDateAndTime(date, timeSlot);

    const bookingPayload = {
      eventTypeId,
      start: startTime.toISOString(),
      responses: {
        name: formData.name,
        email: formData.email,
        location: { value: 'userPhone', optionValue: '' },
      },
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: 'en',
      title: `Meeting between ${username} and ${formData.name}`,
      description: formData.notes || null,
      status: 'PENDING',
      metadata: {},
    };

    try {
      const bookingResult = await bookMeeting(bookingPayload);
      toast.success('Meeting successfully booked!');

      // Add assistant message after successful booking
      setMessages(prevMessages => [
        ...prevMessages,
        {
          role: 'assistant',
          content: `Your meeting has been successfully booked for ${startTime.toLocaleString()}.`,
          confidenceScore: 100,
        }
      ]);

      setShowCalendar(false);
      return true;
    } catch (error) {
      toast.error(`Booking failed: ${error.message}`);
      return false;
    }
  }

  return (
    <div className={`${embed ? '' : 'pt-4 px-4'} flex-1 flex justify-center ${mocking ? 'h-[calc(100dvh-300px)]' : 'min-h-[calc(100dvh-80px)] h-full'}`}>
      <div
        className={`${embed ? 'w-full h-full' : ''} relative`}
        style={{ width: `${(embed && !standalone) ? 'w-full' : (config.chatWidth + 'px')}` }}
      >
        {!embed && !isSettingsOpen && !standalone && (
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`absolute ${config.bubbleAlignment === 'right' ? '-left-12' : '-right-12'} h-[38px] w-[38px] flex items-center justify-center border rounded-lg bg-white`}
          >
            ☰
          </button>
        )}

        <div className={`h-full flex flex-col bg-white shadow-sm border overflow-hidden ${config.theme === 'dark' ? 'bg-gray-900 text-white border-gray-800' : ''
          } ${config.roundedHeaderCorners ? 'rounded-t-xl' : 'rounded-t-lg'}`}>
          {/* Chat Header */}
          <div
            className={`flex items-center justify-between p-3 border-b ${config.roundedHeaderCorners ? 'rounded-t-xl' : ''
              }`}
            style={{
              backgroundColor: config.syncColors ? config.userMessageColor :
                config.theme === 'dark' ? '#1e3a8a' : undefined, // Dark blue for dark theme
              color: config.syncColors || config.theme === 'dark' ? 'white' : undefined
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
            className={`overflow-y-hidden p-4 flex-grow relative ${config.theme === 'dark' ? 'border-b-0' : ''}`}
            style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: config.theme === 'dark' ? '#111827' : undefined,
            }}
          >
            <div className="absolute inset-0 p-4 overflow-y-auto"
              style={{
                backgroundImage: config.chatBackgroundUrl ? `url(${config.chatBackgroundUrl})` : 'none',
                backgroundColor: config.theme === 'dark' ? '#111827' : 'white',
                opacity: config.chatBackgroundOpacity,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}>
            </div>
            <div className="absolute inset-0 p-4 overflow-y-auto"
              style={{
                backgroundColor: 'none',
              }}>
              {/* Keep existing chat messages but wrap them in a relative div */}
              <div className="relative z-10">
                {messages.length === 0 && (
                  <div className={`max-w-[80%] p-4 ${config.roundedChatCorners ? 'rounded-xl' : 'rounded-lg'
                    } ${config.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50'}`}>
                    {config.initialMessage}
                  </div>
                )}
                {messages.map((message, index) => (
                  <div key={index} className={`mb-4 ${message.role === 'assistant' ? '' : 'flex justify-end'}`}>
                    <div className={`p-3 inline-block max-w-[80%] ${config.roundedChatCorners ? 'rounded-xl' : 'rounded-lg'
                      } ${message.role === 'assistant'
                        ? (config.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-black') + ' prose prose-sm bg-gray-50'
                        : 'text-white'
                      } `}
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
                          <span style={{
                            backgroundColor: getBackgroundColor(message.confidenceScore),
                            color: getTextColor(message.confidenceScore),
                            padding: '2px 4px', borderRadius: '4px'
                          }}>{message.confidenceScore}</span>
                        </div>}
                    </div>
                  </div>
                ))}
                {isLoading && <span className="loading loading-spinner loading-xs"></span>}
                {
                  embed && !standalone && !isLoading && showLead && (leadSetting?.enable == "immediately"
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
                {showCalendar && (
                  <div className="flex justify-start pt-4">
                    <div className="flex gap-3 max-w-[80%]">
                      <div className="bg-muted rounded-lg p-0">
                        <CalComBooker onSubmit={onScheduleSubmit} availableSlots={availableSlots} theme={config.theme} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className={`flex flex-col justify-between ${config.theme === 'dark' ? 'bg-gray-900' : ''}`}>
            {/* Suggested Messages - Horizontal scrollable */}
            <div className={`w-full overflow-x-auto pb-2 mb-2 px-4 pt-2 ${config.theme === 'dark' ? 'bg-gray-900' : ''}`}>
              {config.suggestedMessages && config.suggestedMessages.split('\n').filter(Boolean).map((message: string, i: number) => (
                <button
                  key={i}
                  className={`inline-block mr-2 mb-2 px-3 py-1.5 text-xs rounded-full ${config.theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  onClick={() => {
                    if (embed && !standalone && !isLoading && showLead && (leadSetting?.enable == "immediately"
                      || (leadSetting?.enable == "after"
                        && messages.filter(message => message.role === 'user').length >= leadSetting?.delay))) {
                      toast.error('Please submit the form. 🙂');
                      return;
                    }

                    // Set input and immediately send the message
                    setInput(message);
                    handleSendMessage(message);
                  }}
                >
                  {message}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (embed && !standalone && !isLoading && showLead && (leadSetting?.enable == "immediately"
                || (leadSetting?.enable == "after"
                  && messages.filter(message => message.role === 'user').length >= leadSetting?.delay))) {
                toast.error('Please submit the form. 🙂');
                return;
              }
              handleSubmit(e)
            }} className={`border-t p-3 ${config.theme === 'dark' ? 'border-gray-800 bg-gray-900' : ''}`}>
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={config.messagePlaceholder}
                  className={`w-full p-3 pr-10 border focus:outline-none focus:border-blue-500 text-sm ${config.roundedChatCorners ? 'rounded-lg' : 'rounded-md'
                    } ${config.theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
                  disabled={isLoading || !!currentNodeId}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim() || !!currentNodeId}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full disabled:opacity-50"
                  style={{
                    backgroundColor: !isLoading && input.trim() && !currentNodeId ? config.userMessageColor : 'transparent',
                    color: !isLoading && input.trim() && !currentNodeId ? 'white' : config.theme === 'dark' ? '#9ca3af' : 'gray'
                  }}
                >
                  <IconSend className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Footer */}
            {!mocking && embed && <div className={`p-2 text-center text-sm ${config.theme === 'dark' ? 'text-gray-400 bg-gray-900' : 'text-gray-500'}`}>
              <span>Powered by <a href={`${process.env.NODE_ENV === 'development' ? 'http:' : 'https:'}//${process.env.NEXT_PUBLIC_DOMAIN}`} target="_black" className={`${config.theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>Chatsa.co</a></span>
              {config.footerText && <span className="ml-1">{config.footerText}</span>}
            </div>}
          </div>
        </div>
        <button
          onClick={() => { loadSources(); setIsModalOpen(true); }} // Open modal on button click
          className={`${embed ? 'hidden' : ""} mt-2 w-full rounded-md border-[1px] ${config.theme === 'dark' ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' : 'bg-white hover:bg-slate-100'
            } p-2 text-center`}
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

const Playground = ({
  chatbot,
  embed = false,
  team,
  mocking = false,
  standalone = false,
  mockingData = {},
  isMockingDataValid = false,
}: PlaygroundProps) => {
  if (team) {
    team = JSON.parse(team)
  }
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showPlaygroundInfo, setShowPlaygroundInfo] = useState(false);
  const { config, setConfig } = useChatInterfaceSettings(chatbot.id);
  const { settings: aiSettings, fetchSettings, loading: loadingAISettings } = useAISettings(chatbot.id);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const { leadSetting } = useChatbotLeadSetting(chatbot.id);
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [qFlow, setQFlow] = useState(null);
  const [qFlowEnabled, setQFlowEnabled] = useState(false);
  const [qFlowAIEnabled, setQFlowAIEnabled] = useState(true);
  const [isUpgradePlanModalOpen, setIsUpgradePlanModalOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState(process.env.NEXT_PUBLIC_MEETING_URL);
  const [availableSlots, setAvailableSlots] = useState<Record<string, { time: string }[]>>({});

  const debouncedSave = React.useCallback(
    debounce((msgs: Message[]) => {
      if (msgs.length > 0 && conversationId) {
        saveConversation(msgs);
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

  const saveConversation = async (messages: Message[]) => {
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

  useEffect(() => {
    const fetchDataset = async () => {
      try {
        const response = await fetch(`/api/chatbot/sources/dataset?chatbotId=${chatbot.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch dataset');
        }
        if (data.questionFlow) {
          setQFlow(data.questionFlow)
        }
        if (data.questionFlowEnable) {
          setQFlowEnabled(data.questionFlowEnable)
        }
        if (data.questionAiIResponseEnable) {
          setQFlowAIEnabled(data.questionAiIResponseEnable)
        }
      } catch (error) {
        console.error("Error fetching dataset:", error);
        toast.error("Failed to load dataset" + error.message);
      }
    };

    fetchDataset();
  }, [chatbot]);

  useEffect(() => {
    if (qFlowEnabled && conversationId) {
      //init QF automatically
      handleSendMessage('')
    }
  }, [qFlowEnabled, conversationId])

  // Handle option clicks
  useEffect(() => {
    const handleOptionClick = async (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('chat-option-btn')) {
        const option = target.textContent || '';
        const optionIndex = target.getAttribute('data-index');
        const nodeId = target.getAttribute('data-node');

        const userMessage: Message = { role: 'user', content: option };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
          const response = await fetch('/api/chatbot/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              selectedOption: option,
              optionIndex: Number(optionIndex),
              nodeId,
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
              let content = '';
              if (data.image) {
                const imageHtml = `<img src="${data.image}" alt="Chat Image" class="rounded-md max-w-full my-2" />`;
                const combinedMessage = `${data.message || ''}${imageHtml}`;

                const assistantMessage: Message = { role: 'assistant', content: combinedMessage, confidenceScore: 100 };
                setMessages(prev => [...prev, assistantMessage]);
              } else {
                content = data.message
                const assistantMessage: Message = { role: 'assistant', content, confidenceScore: 100 };
                setMessages(prev => [...prev, assistantMessage]);
              }
            }

            if (data.options && data.options.length > 0) {
              const optionsHtml = `
                <div>
                  <p>${data.question}</p>
                  <div class="mt-2">
                  ${data.options.map((option: string, index: number) => `
                    <button class="chat-option-btn w-full text-left px-4 py-2 rounded hover:bg-gray-200 embed-btn" data-node="${data.nextNodeId}" data-index="${index}">
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

    if (!input.trim()) {
      toast.error('Please enter a message first.');
      return;
    }

    if (isLoading) {
      toast.error('Please wait while the previous message is being processed.');
      return;
    }

    // Only validate mock data when in mocking mode
    if (mocking) {
      if (!isMockingDataValid) {
        toast.error('The action data is not valid. Please complete all required fields.');
        return;
      }
    }

    handleSendMessage(input);
  };

  const handleSendMessage = async (input: string) => {
    if (!conversationId) return;

    const triggetQF = input == "";
    const userMessage: Message = { role: 'user', content: input };

    if (!triggetQF) {
      setMessages(prev => [...prev, userMessage]);
      setInput('');
    }

    setIsLoading(true);

    try {
      // Fetch latest settings before making the chat request
      await fetchSettings();

      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: triggetQF ? messages : [...messages, userMessage],
          chatbotId: chatbot.id,
          language: aiSettings?.language,
          model: aiSettings?.model,
          temperature: aiSettings?.temperature,
          maxTokens: aiSettings?.maxTokens,
          systemPrompt: aiSettings?.systemPrompt,
          conversationId,
          mocking,
          mockingData,
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
          let content = '';
          if (data.image) {
            const imageHtml = `<img src="${data.image}" alt="Chat Image" class="rounded-md max-w-full my-2" />`;
            const combinedMessage = `${data.message || ''}${imageHtml}`;

            const assistantMessage: Message = { role: 'assistant', content: combinedMessage, confidenceScore: 100 };
            setMessages(prev => [...prev, assistantMessage]);
          } else {
            content = data.message
            const assistantMessage: Message = { role: 'assistant', content, confidenceScore: 100 };
            setMessages(prev => [...prev, assistantMessage]);
          }
        }

        if (data.options && data.options.length > 0) {
          const optionsHtml = `
            <div>
              <p>${data.question}</p>
              <div class="mt-2">
              ${data.options.map((option: string, index: number) => `
                <button class="chat-option-btn w-full text-left px-4 py-2 rounded hover:bg-gray-200 embed-btn" data-index="${index}" data-node="${data.nextNodeId}">
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
                if (parsed?.slots && Object.keys(parsed.slots).some(date => parsed.slots[date].length > 0)) {
                  // for selecting time slot
                  setShowCalendar(true);
                  setAvailableSlots(parsed.slots);
                  setMeetingUrl(parsed.meetingUrl);
                  console.log(parsed.slots)
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
      if (error.message === 'limit reached, upgrade for more messages.') {
        showLimitReachedToast();
      } else {
        toast.error(error.message);
      }
      setIsLoading(false);
    }
  }

  const handleContent = (text: string, confidenceScore: number) => {
    console.log(`Received text: ${text} with confidence score: ${confidenceScore}`);
    // Handle the text and confidence score as needed
  };

  // Custom toast for limit reached error
  const showLimitReachedToast = () => {
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg rounded-lg pointer-events-auto`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="bg-white/20 p-2 rounded-full">
                  <IconArrowUp className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white">Message Limit Reached</p>
                <p className="mt-1 text-sm text-white/90">
                  You've reached your plan's message limit. Upgrade to continue chatting.
                </p>
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => {
                      // Close the toast and show the upgrade modal
                      toast.dismiss(t.id);
                      setIsUpgradePlanModalOpen(true);
                    }}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Upgrade Now
                  </button>
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-white/30 text-xs font-medium rounded-md text-white bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      { duration: 10000, position: 'top-center' }
    );
  };

  // Add function to handle modal close
  const handleUpgradePlanModalClose = () => {
    setIsUpgradePlanModalOpen(false);
  };

  if (embed) {
    // if (loadingAISettings)
    //   return <div id='chatbot-loading-spinner'><div className="spinner"></div></div>
    return (
      <AISettingsProvider chatbotId={chatbot.id}>
        <div className={`relative ${mocking ? '' : 'h-full'}`}>
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
            standalone={standalone}
            setConfig={setConfig}
            leadSetting={leadSetting}
            conversationId={conversationId}
            qFlowAIEnabled={qFlowAIEnabled}
            mocking={mocking}
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
            availableSlots={availableSlots}
            handleSendMessage={handleSendMessage}
            meetingUrl={meetingUrl}
          />

          {/* Upgrade Plan Modal - also available in embed view */}
          <Dialog open={isUpgradePlanModalOpen} onOpenChange={handleUpgradePlanModalClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
              <div className="relative">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 text-white">
                      <h2 className="text-2xl font-bold">Upgrade Your Plan</h2>
                      <p className="opacity-90">
                        You've reached your plan's message limit
                      </p>
                    </div>
                    <button
                      onClick={handleUpgradePlanModalClose}
                      className="btn btn-sm btn-circle bg-white/20 hover:bg-white/30 border-none text-white"
                    >
                      <IconX className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Note below header */}
                <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
                  <div className="flex gap-3 items-center">
                    <span className="bg-blue-100 p-2 rounded-full">
                      <IconArrowUp className="w-4 h-4 text-blue-700" />
                    </span>
                    <p className="text-blue-800 text-sm">
                      Upgrading your plan gives you access to more messages, advanced features, and higher limits.
                    </p>
                  </div>
                </div>

                {/* Content with slight padding */}
                <div className="p-6">
                  {/* Get the teamId from the URL */}
                  <PlansSettings teamId={window.location.pathname.match(/\/dashboard\/([^\/]+)/)?.[1] || ''} />
                </div>
              </div>
            </DialogContent>
          </Dialog>
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

            {/* {loadingAISettings ? */}
            {/* <div id='chatbot-loading-spinner'><div className="spinner"></div></div> : */}
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
              leadSetting={leadSetting}
              embed={embed}
              qFlowAIEnabled={qFlowAIEnabled}
              showCalendar={showCalendar}
              setShowCalendar={setShowCalendar}
              availableSlots={availableSlots}
              meetingUrl={meetingUrl}
              handleSendMessage={handleSendMessage}
            />
            {/* } */}
          </div>
        </div>

        {/* Upgrade Plan Modal */}
        <Dialog open={isUpgradePlanModalOpen} onOpenChange={handleUpgradePlanModalClose}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
            <div className="relative">
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 text-white">
                    <h2 className="text-2xl font-bold">Upgrade Your Plan</h2>
                    <p className="opacity-90">
                      You've reached your plan's message limit
                    </p>
                  </div>
                  <button
                    onClick={handleUpgradePlanModalClose}
                    className="btn btn-sm btn-circle bg-white/20 hover:bg-white/30 border-none text-white"
                  >
                    <IconX className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Note below header */}
              <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
                <div className="flex gap-3 items-center">
                  <span className="bg-blue-100 p-2 rounded-full">
                    <IconArrowUp className="w-4 h-4 text-blue-700" />
                  </span>
                  <p className="text-blue-800 text-sm">
                    Upgrading your plan gives you access to more messages, advanced features, and higher limits.
                  </p>
                </div>
              </div>

              {/* Content with slight padding */}
              <div className="p-6">
                {/* Get the teamId from the URL */}
                <PlansSettings teamId={window.location.pathname.match(/\/dashboard\/([^\/]+)/)?.[1] || ''} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AISettingsProvider>
  );
};

export default Playground; 