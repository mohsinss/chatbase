import { useState, useEffect } from 'react';

interface AISettingsType {
  model: string;
  temperature: number;
  systemPrompt: string;
  maxTokens: number;
}

export const useAISettings = (chatbotId: string) => {
  const [settings, setSettings] = useState<AISettingsType>({
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    systemPrompt: "",
    maxTokens: 500,
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
      const response = await fetch(`/api/chatbot/ai-settings?chatbotId=${chatbotId}`);
      const data = await response.json();
      
      if (data) {
        setSettings({
          model: data.model ?? "gpt-3.5-turbo",
          temperature: data.temperature ?? 0.7,
          systemPrompt: data.systemPrompt ?? "",
          maxTokens: data.maxTokens ?? 500,
        });
      }
    } catch (error) {
      console.error("Failed to fetch AI settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: Partial<AISettingsType>) => {
    try {
      const response = await fetch("/api/chatbot/ai-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatbotId,
          ...settings,
          ...newSettings,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      setSettings(prev => ({ ...prev, ...newSettings }));
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
    settings, 
    setSettings, 
    loading, 
    fetchSettings, 
    saveSettings,
    availableModels 
  };
}; 