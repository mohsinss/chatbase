import React from 'react';
import { useState, useEffect } from 'react';

export interface ChatbotLeadSettings {
  enable: string,
  delay: number,
  title: string,
  email: boolean,
  name: boolean,
  phone: boolean,
}

export const useChatbotLeadSetting = (chatbotId: string) => {
  const [leadSetting, setLeadSetting] = useState<ChatbotLeadSettings>({
    enable: "never",
    delay: 1,
    title: 'Let us know how to contact you',
    email: true,
    name: true,
    phone: true,
  });

  const [loading, setLoading] = useState(true);

  //fetch lead settings
  const fetchLeadSettings = async () => {
    try {
      const response = await fetch(`/api/chatbot/leads-settings?chatbotId=${chatbotId}`);
      const data = await response.json();

      if (data) {
        setLeadSetting(prev => ({
          enable: data.enableLead ?? 'never',
          delay: data.delay ?? 0,
          title: data.title || "Let us know how to contact you",
          name: data.nameEnabled ?? true,
          email: data.emailEnabled ?? true,
          phone: data.phoneEnabled ?? true,
        }));
      }
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    if (chatbotId) {
      fetchLeadSettings();
    }
  }, [chatbotId]);

  return {
    leadSetting,
    loading,
  };
}; 