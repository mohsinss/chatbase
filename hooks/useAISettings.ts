import { useState, useEffect } from 'react';

interface AISettingsType {
  model: string;
  temperature: number;
  systemPrompt: string;
  maxTokens: number;
  displayName: string;
  language: string;
}

export const useAISettings = (chatbotId: string) => {
  const [settings, setSettings] = useState<AISettingsType>({
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    systemPrompt: "",
    maxTokens: 500,
    displayName: "Chatbot",
    language: "en"
  });
  const [loading, setLoading] = useState(true);
  const [availableModels] = useState([
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
    { id: "gpt-4", name: "GPT-4" },
    { id: "gpt-4o", name: "GPT-4o" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini" },
  ]);

  const fetchSettings = async () => {
    try {
      const [aiResponse, interfaceResponse] = await Promise.all([
        fetch(`/api/chatbot/ai-settings?chatbotId=${chatbotId}`),
        fetch(`/api/chatbot/interface-settings?chatbotId=${chatbotId}`)
      ]);

      const aiData = await aiResponse.json();
      const interfaceData = await interfaceResponse.json();

      setSettings(prev => ({
        ...prev,
        ...aiData,
        displayName: interfaceData.displayName || prev.displayName
      }));
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const saveSettings = async (newSettings: AISettingsType) => {
    try {
      const [aiResponse, interfaceResponse] = await Promise.all([
        fetch('/api/chatbot/ai-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatbotId,
            model: newSettings.model,
            temperature: newSettings.temperature,
            systemPrompt: newSettings.systemPrompt,
            maxTokens: newSettings.maxTokens,
            language: newSettings.language,
            topP: 1,
            frequencyPenalty: 0,
            presencePenalty: 0
          })
        }),
        fetch('/api/chatbot/interface-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatbotId,
            displayName: newSettings.displayName
          })
        })
      ]);

      if (!aiResponse.ok || !interfaceResponse.ok) {
        throw new Error('Failed to save settings');
      }

      setSettings(newSettings);
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  };

  useEffect(() => {
    if (chatbotId) {
      fetchSettings();
    }
  }, [chatbotId]);

  return { 
    settings, 
    setSettings, 
    loading, 
    fetchSettings, 
    saveSettings,
    availableModels 
  };
}; 