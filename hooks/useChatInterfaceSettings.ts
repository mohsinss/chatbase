import { useState, useEffect } from 'react';

interface ChatInterfaceSettings {
  theme: 'light' | 'dark';
  displayName: string;
  initialMessage: string;
  messagePlaceholder: string;
  footerText: string;
  userMessageColor: string;
  roundedHeaderCorners: boolean;
  roundedChatCorners: boolean;
  syncColors: boolean;
  suggestedMessages: string;
  chatWidth: number;
}

export const useChatInterfaceSettings = (chatbotId: string) => {
  const [config, setConfig] = useState<ChatInterfaceSettings>({
    theme: 'light',
    displayName: 'AI Assistant',
    initialMessage: 'Hello! How can I help you today?',
    messagePlaceholder: 'Type your message...',
    footerText: '',
    userMessageColor: '#2563eb',
    roundedHeaderCorners: true,
    roundedChatCorners: true,
    syncColors: false,
    suggestedMessages: "how are you ?\nwho are they ?\nwhat dates the event will start",
    chatWidth: 448,
  });

  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/chatbot/interface-settings?chatbotId=${chatbotId}`);
      const data = await response.json();
      
      if (data) {
        setConfig(prev => ({
          ...prev,
          ...data
        }));
      }
    } catch (error) {
      console.error('Failed to fetch interface settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: Partial<ChatInterfaceSettings>) => {
    try {
      const response = await fetch('/api/chatbot/interface-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbotId,
          ...newSettings
        }),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      setConfig(prev => ({
        ...prev,
        ...newSettings
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to save interface settings:', error);
      return false;
    }
  };

  useEffect(() => {
    if (chatbotId) {
      fetchSettings();
    }
  }, [chatbotId]);

  return {
    config,
    setConfig,
    loading,
    fetchSettings,
    saveSettings
  };
}; 