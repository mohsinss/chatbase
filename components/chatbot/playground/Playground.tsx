"use client";

import React, { useState, useRef, useEffect } from "react";
import { IconX, IconArrowUp } from "@tabler/icons-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PlansSettings } from "@/components/tabs/settings/PlansSettings";
import { ChatSettings } from './ChatSettings';
import { useChatInterfaceSettings } from '@/hooks/useChatInterfaceSettings';
import { useChatbotLeadSetting } from "@/hooks/useChatbotLeadSetting";
import { useAISettings } from '@/hooks/useAISettings';
import { AISettingsProvider } from "@/contexts/AISettingsContext";
import { PlaygroundProps, Message } from './types';
import InfoTooltip from './InfoTooltip';
import SourcesModal from './SourcesModal';
import ChatContainer from './ChatContainer';

// Utility function for debouncing
const debounce = (func: Function, wait: number) => {
  let timeout: any;
  const debouncedFunc = (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  debouncedFunc.cancel = () => clearTimeout(timeout);
  return debouncedFunc;
};

const Playground: React.FC<PlaygroundProps> = ({
  chatbot,
  embed = false,
  team,
  mocking = false,
  standalone = false,
  mockingData = {},
  isMockingDataValid = false,
}) => {
  if (team) {
    team = JSON.parse(team);
  }

  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showPlaygroundInfo, setShowPlaygroundInfo] = useState(false);
  const { config, setConfig } = useChatInterfaceSettings(chatbot.id);
  const { settings: aiSettings, fetchSettings, loading: loadingAISettings } = useAISettings(chatbot.id);
  const { leadSetting } = useChatbotLeadSetting(chatbot.id);
  const [currentNodeId, setCurrentNodeId] = useState<any>(null);
  const [qFlow, setQFlow] = useState(null);
  const [qFlowEnabled, setQFlowEnabled] = useState(false);
  const [qFlowAIEnabled, setQFlowAIEnabled] = useState(true);
  const [isUpgradePlanModalOpen, setIsUpgradePlanModalOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState(process.env.NEXT_PUBLIC_MEETING_URL);
  const [availableSlots, setAvailableSlots] = useState<Record<string, { time: string }[]>>({});
  const [sources, setSources] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingSources, setLoadingSources] = useState(false);

  const debouncedSave = React.useCallback(
    debounce((msgs: Message[]) => {
      if (msgs.length > 0) {
        saveConversation(msgs);
      }
    }, 1000),
    [conversationId]
  );

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

  const saveConversation = async (messages: Message[]) => {
    try {
      const response = await fetch('/api/chatbot/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbotId: chatbot.id,
          conversationId: conversationId,
          messages,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch dataset');
      }
      setConversationId(data._id);
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  };

  const handleRefresh = async () => {
    setMessages([]);
    setConversationId(null);
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
          setQFlow(data.questionFlow);
        }
        if (data.questionFlowEnable) {
          setQFlowEnabled(data.questionFlowEnable);
        }
        if (data.questionAiIResponseEnable) {
          setQFlowAIEnabled(data.questionAiIResponseEnable);
        }
      } catch (error) {
        console.error("Error fetching dataset:", error);
        toast.error("Failed to load dataset" + error.message);
      }
    };

    fetchDataset();
  }, [chatbot.id]);

  useEffect(() => {
    if (qFlowEnabled && conversationId) {
      //init QF automatically
      handleSendMessage('');
    }
  }, [qFlowEnabled, conversationId]);

  // Handle option clicks
  useEffect(() => {
    const handleOptionClick = async (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('chat-option-btn')) {
        const option = target.textContent || '';
        const optionIndex = target.getAttribute('data-index');
        const nodeId = target.getAttribute('data-node');
        const dataAction = target.getAttribute('data-action');

        // Create user message and update UI
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
              dataAction: dataAction,
              metadata: {
                itemId: target.getAttribute('data-item-id'),
                category: target.getAttribute('data-category'),
                quantity: target.getAttribute('data-quantity'),
                orderId: target.getAttribute('data-order-id')
              }
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
                content = data.message;
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

                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    const data = line.slice(5).trim();

                    if (data === '[DONE]') {
                      setIsLoading(false);
                      continue;
                    }

                    const parsed = JSON.parse(data);
                    if (parsed.text) {
                      setMessages(prev => {
                        const lastMessage = prev[prev.length - 1];
                        let lastMessage_content = lastMessage.content + parsed.text;

                        let confidenceScore1 = -1;

                        if (lastMessage_content.split(":::").length > 1 && lastMessage_content.split(":::")[1].length > 0) {
                          const confidenceScore = lastMessage_content.split(":::")[1];
                          confidenceScore1 = Number(confidenceScore);
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
                      console.log(e);
                    }
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
  }, [currentNodeId, chatbot.id, conversationId, messages]);

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

  const handleSendMessage = async (message: string) => {
    const triggerQF = message === "";
    const userMessage: Message = { role: 'user', content: message };

    if (!triggerQF) {
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
          messages: triggerQF ? messages : [...messages, userMessage],
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
            content = data.message;
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

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(5).trim();

                if (data === '[DONE]') {
                  setIsLoading(false);
                  continue;
                }

                const parsed = JSON.parse(data);
                if (parsed.text) {
                  setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    let lastMessage_content = lastMessage.content + parsed.text;

                    let confidenceScore1 = -1;

                    if (lastMessage_content.split(":::").length > 1 && lastMessage_content.split(":::")[1].length > 0) {
                      const confidenceScore = lastMessage_content.split(":::")[1];
                      confidenceScore1 = Number(confidenceScore);
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
                }
              }
              else if (line.startsWith('reason: ')) {
                const data = line.slice(7).trim();

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
                  console.log(e);
                }
              }
              else if (line.startsWith('score: ')) {
                const score = line.slice(6).trim();
                // Handle score if needed
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

  const loadSources = async () => {
    setLoadingSources(true);
    const response = await fetch(`/api/chatbot/sources/dataset?chatbotId=${chatbot.id}`);
    if (!response.ok) {
      toast.error('Failed to fetch dataset');
      setLoadingSources(false);
      return;
    }

    const data = await response.json();
    const datasetId = data.datasetId;

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
        page_size: 4, // Default chunk count
      })
    };

    try {
      const response = await fetch('https://api.trieve.ai/api/chunk/search', options);
      const data = await response.json();
      setSources(data.chunks);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load sources');
    } finally {
      setLoadingSources(false);
    }
  };

  if (loadingAISettings)
    return <div id='chatbot-loading-spinner'><div className="spinner"></div></div>;

  if (embed) {
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
            setIsModalOpen={setIsModalOpen}
            setLoadingSources={setLoadingSources}
            loadingSources={loadingSources}
            loadSources={loadSources}
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
    );
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
              <span className="w-4 h-4 mt-[-9px]">💡</span>
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="relative pl-2"
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
              qFlowAIEnabled={qFlowAIEnabled}
              showCalendar={showCalendar}
              setShowCalendar={setShowCalendar}
              availableSlots={availableSlots}
              handleSendMessage={handleSendMessage}
              meetingUrl={meetingUrl}
              setIsModalOpen={setIsModalOpen}
              setLoadingSources={setLoadingSources}
              loadingSources={loadingSources}
              loadSources={loadSources}
            />
          </div>
        </div>

        {/* Sources Modal */}
        {isModalOpen && (
          <SourcesModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            sources={sources}
            loadingSources={loadingSources}
          />
        )}

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
