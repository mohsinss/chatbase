import React, { createContext, useContext, useState, useEffect } from 'react';

interface AISettings {
  model: string;
  temperature: number;
  systemPrompt: string;
  maxTokens: number;
  language: string;
  suggestedMessages: string;
  chunkCount: number
}

interface AISettingsContextType {
  settings: AISettings;
  updateSettings: (newSettings: Partial<AISettings>) => void;
}

const AISettingsContext = createContext<AISettingsContextType | undefined>(undefined);

export const AISettingsProvider = ({ children, chatbotId }: { children: React.ReactNode, chatbotId: string }) => {
  const [settings, setSettings] = useState<AISettings>({
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    systemPrompt: "",
    maxTokens: 500,
    language: "en",
    suggestedMessages: "",
    chunkCount: 4
  });

  const updateSettings = (newSettings: Partial<AISettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Initial fetch of settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`/api/chatbot/ai-settings?chatbotId=${chatbotId}`);
        const data = await response.json();
        if (data) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };

    fetchSettings();
  }, [chatbotId]);

  return (
    <AISettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AISettingsContext.Provider>
  );
};

export const useAISettings = () => {
  const context = useContext(AISettingsContext);
  if (context === undefined) {
    throw new Error('useAISettings must be used within an AISettingsProvider');
  }
  return context;
}; 