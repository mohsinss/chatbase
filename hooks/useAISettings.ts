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
  
  // Updated model list to match route.ts
  const [availableModels] = useState([
    // OpenAI Models
    { id: "gpt-4o", name: "GPT-4o (Flagship)" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini" },
    { id: "o1", name: "O1 (Advanced Reasoning)" },
    { id: "o1-mini", name: "O1 Mini" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
    // Anthropic Models
    { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet" },
    { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku" },
    { id: "claude-3-opus-20240229", name: "Claude 3 Opus" },
    // Gemini Models
    { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash" },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
    { id: "gemini-1.5-flash-8b", name: "Gemini 1.5 Flash-8B" },
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" }
  ]);

  const fetchSettings = async () => {
    try {
      const [aiResponse, interfaceResponse] = await Promise.all([
        fetch(`/api/chatbot/ai-settings?chatbotId=${chatbotId}`),
        fetch(`/api/chatbot/interface-settings?chatbotId=${chatbotId}`)
      ]);

      const aiData = await aiResponse.json();
      const interfaceData = await interfaceResponse.json();

      // Special handling for O1 models
      const isO1Model = aiData.model?.startsWith('o1');
      const temperature = isO1Model ? 1 : (aiData.temperature ?? 0.7);

      setSettings(prev => ({
        ...prev,
        ...aiData,
        temperature,
        displayName: interfaceData.displayName || prev.displayName
      }));
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: AISettingsType) => {
    try {
      // Special handling for O1 models
      const isO1Model = newSettings.model?.startsWith('o1');
      const temperature = isO1Model ? 1 : newSettings.temperature;

      const [aiResponse, interfaceResponse] = await Promise.all([
        fetch('/api/chatbot/ai-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatbotId,
            model: newSettings.model,
            temperature,
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