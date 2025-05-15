import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAISettings as useAISettingsProvider } from "@/contexts/AISettingsContext";
import { ChatContainerProps, Message } from './types';
import ChatHeader from './ChatHeader';
import MessageDisplay from './MessageDisplay';
import SuggestedMessages from './SuggestedMessages';
import ChatInput from './ChatInput';
import LeadForm from './LeadForm';
import CalComBooker from "@/components/chatbot/actions/Calcom/CalComBooker";

const ChatContainer: React.FC<ChatContainerProps> = ({
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
  mocking = false,
  setConfig,
  leadSetting,
  conversationId,
  setCurrentNodeId,
  currentNodeId,
  qFlowAIEnabled,
  standalone = false,
  showCalendar,
  setShowCalendar,
  handleSendMessage,
  availableSlots,
  meetingUrl,
  setIsModalOpen,
  setLoadingSources,
  loadingSources,
  loadSources
}) => {
  const [sources, setSources] = useState([]);
  const [showLead, setShowLead] = useState(true);
  const { settings: globalSettings } = useAISettingsProvider();
  const isMobile = typeof window !== 'undefined' ? /iPhone|iPad|iPod|Android/i.test(window?.navigator?.userAgent) : false;
  const [disableInput, setDisableInput] = useState(false);

  useEffect(() => {
    setDisableInput(isLoading || !!currentNodeId || showCalendar);
  }, [isLoading, currentNodeId, showCalendar]);

  useEffect(() => {
    const handleSettingsUpdate = (event: MessageEvent) => {
      if (event.data.type === 'chatbot-settings-update') {
        const newSettings = event.data.settings;
        // Update the config with new settings
        setConfig((prev) => ({
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
    setConfig((prev) => ({
      ...prev,
      suggestedMessages: globalSettings?.suggestedMessages,
    }));
  }, [globalSettings, setConfig]);

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

  const toggleChatWindow = () => {
    const chatContainer = document.getElementById('chatbot-widget');
    const closeButton = document.getElementById('close-button');
    const chatIcon = document.getElementById('chatbot-widget-icon');
    
    if (chatContainer && closeButton && chatIcon) {
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
  };

  const onScheduleSubmit = async (date: Date, timeSlot: string, formData: { name: string; email: string; notes?: string; guests?: string; rescheduleReason?: string }) => {
    if (!meetingUrl) {
      toast.error('Meeting URL is not available.');
      return false;
    }

    try {
      // This would be implemented with the actual booking logic
      // For now, we'll just simulate a successful booking
      
      // Add assistant message after successful booking
      setMessages(prevMessages => [
        ...prevMessages,
        {
          role: 'assistant',
          content: `Your meeting has been successfully booked for ${date.toLocaleDateString()} at ${timeSlot}.`,
          confidenceScore: 100,
        }
      ]);

      setShowCalendar(false);
      toast.success('Meeting successfully booked!');
      return true;
    } catch (error) {
      toast.error(`Booking failed: ${error.message}`);
      return false;
    }
  };

  const shouldShowLeadForm = embed && 
    !standalone && 
    !isLoading && 
    showLead && 
    leadSetting && 
    (leadSetting.enable === "immediately" || 
     (leadSetting.enable === "after" && 
      messages.filter(message => message.role === 'user').length >= (leadSetting.delay || 0)));

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

        <div className={`h-full flex flex-col bg-white shadow-sm border overflow-hidden ${
          config.theme === 'dark' ? 'bg-gray-900 text-white border-gray-800' : ''
        } ${config.roundedHeaderCorners ? 'rounded-t-xl' : 'rounded-t-lg'}`}>
          {/* Chat Header */}
          <ChatHeader 
            config={config}
            handleRefresh={handleRefresh}
            isMobile={isMobile}
            disabled={disableInput}
          />

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
              {/* Chat messages */}
              <div className="relative z-10">
                {messages.length === 0 && (
                  <div className={`max-w-[80%] p-4 ${
                    config.roundedChatCorners ? 'rounded-xl' : 'rounded-lg'
                  } ${config.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50'}`}>
                    {config.initialMessage}
                  </div>
                )}
                
                {messages.map((message, index) => (
                  <MessageDisplay 
                    key={index}
                    message={message}
                    isUserMessage={message.role === 'user'}
                    roundedChatCorners={config.roundedChatCorners}
                    theme={config.theme}
                    userMessageColor={config.userMessageColor}
                  />
                ))}
                
                {isLoading && (
                  <div className="flex items-center justify-between space-x-1 p-4 bg-gray-100 rounded-lg w-16 mt-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                )}
                
                {shouldShowLeadForm && (
                  <LeadForm 
                    leadSetting={leadSetting}
                    onClose={() => setShowLead(false)}
                    chatbotId={chatbotId}
                    conversationId={conversationId}
                  />
                )}
                
                {showCalendar && (
                  <div className="flex justify-start pt-4">
                    <div className="flex gap-3 max-w-[80%]">
                      <div className="bg-muted rounded-lg p-0">
                        <CalComBooker 
                          onSubmit={onScheduleSubmit} 
                          availableSlots={availableSlots} 
                          theme={config.theme === 'dark' ? 'dark' : 'light'} 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className={`flex flex-col justify-between ${config.theme === 'dark' ? 'bg-gray-900' : ''}`}>
            {/* Suggested Messages */}
            <SuggestedMessages 
              config={config}
              theme={config.theme}
              handleSendMessage={handleSendMessage}
              disabled={disableInput}
              showLeadForm={shouldShowLeadForm}
            />

            {/* Chat Input */}
            <ChatInput 
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              config={config}
              disabled={disableInput}
            />

            {/* Footer */}
            {!mocking && embed && (
              <div className={`p-2 text-center text-sm ${config.theme === 'dark' ? 'text-gray-400 bg-gray-900' : 'text-gray-500'}`}>
                <span>Powered by <a href={`${process.env.NODE_ENV === 'development' ? 'http:' : 'https:'}//${process.env.NEXT_PUBLIC_DOMAIN}`} target="_black" className={`${config.theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>Chatsa.co</a></span>
                {config.footerText && <span className="ml-1">{config.footerText}</span>}
              </div>
            )}
          </div>
        </div>
        
        {/* Sources Button */}
        <button
          onClick={() => { loadSources(); setIsModalOpen(true); }}
          className={`${embed ? 'hidden' : ""} mt-2 w-full rounded-md border-[1px] ${
            config.theme === 'dark' ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' : 'bg-white hover:bg-slate-100'
          } p-2 text-center`}
        >
          {loadingSources ? 'Loading Sources...' : "Show Sources"}
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
