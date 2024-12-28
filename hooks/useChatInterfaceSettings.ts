import { useState, useEffect } from 'react';

interface ChatConfig {
  initialMessage: string;
  messagePlaceholder: string;
  userMessageColor: string;
  theme: 'light' | 'dark';
  displayName: string;
  footerText: string;
  syncColors: boolean;
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
  });

  useEffect(() => {
    fetchSettings();
  }, [chatbotId]);

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

  return { config };
}; 