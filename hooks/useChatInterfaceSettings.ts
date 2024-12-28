import { useState, useEffect } from 'react';

interface ChatConfig {
  initialMessage: string;
  messagePlaceholder: string;
  userMessageColor: string;
  theme: 'light' | 'dark';
  displayName: string;
  footerText: string;
  syncColors: boolean;
  roundedHeaderCorners: boolean;
  roundedChatCorners: boolean;
}

export const useChatInterfaceSettings = (chatbotId: string) => {
  const [config, setConfig] = useState<ChatConfig>({
    initialMessage: "Hi! What can I help you with?",
    messagePlaceholder: "Message...",
    userMessageColor: "#4285f4",
    theme: 'light',
    displayName: "Chatbot",
    footerText: "",
    syncColors: false,
    roundedHeaderCorners: false,
    roundedChatCorners: false,
  });

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
      console.error("Failed to load chat interface settings:", error);
    }
  };

  const saveSettings = async (newSettings: Partial<ChatConfig>) => {
    try {
      const response = await fetch("/api/chatbot/interface-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatbotId,
          ...config,
          ...newSettings,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      setConfig(prev => ({ ...prev, ...newSettings }));
      return true;
    } catch (error) {
      console.error("Failed to save settings:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [chatbotId]);

  return { 
    config, 
    setConfig, 
    saveSettings,
    fetchSettings 
  };
}; 