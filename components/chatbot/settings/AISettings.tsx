"use client";

import React, { useState, useEffect, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface AISettingsProps {
  chatbotId: string;
}

type NotificationType = {
  message: string;
  type: 'success' | 'error';
};

export const SUPPORTED_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'nl', label: 'Dutch' },
  { value: 'pl', label: 'Polish' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ar', label: 'Arabic' }
] as const;

type ModelInfo = {
  value: string;
  label: string;
}

type AIModelProviders = {
  OpenAI: ModelInfo[];
  Anthropic: ModelInfo[];
  Gemini: ModelInfo[];
}

// Group models by provider with proper typing
const AI_MODELS: AIModelProviders = {
  OpenAI: [
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
    { value: "gpt-4", label: "GPT-4" },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  ],
  Anthropic: [
    { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku" },
    { value: "claude-3-sonnet-20240229", label: "Claude 3 Sonnet" },
    { value: "claude-3-opus-20240229", label: "Claude 3 Opus" }
  ],
  Gemini: [
    { value: "gemini-1.5-flash", label: "Gemini 2.0 Flash" },
    { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
    { value: "gemini-1.0-pro", label: "Gemini 1.0 Pro" },
    { value: "gemini-1.0-ultra", label: "Gemini 1.0 Ultra" }
  ]
};

type Provider = keyof typeof AI_MODELS;

const CustomNotification = ({ message, type, onClose }: NotificationType & { onClose: () => void }) => (
  <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
    type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }`}>
    <div className="flex justify-between items-center">
      <p>{message}</p>
      <button 
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
    </div>
  </div>
);

const AISettings = ({ chatbotId }: AISettingsProps) => {
  const [temperature, setTemperature] = useState(0.7)
  const [model, setModel] = useState("gpt-3.5-turbo")
  const [systemPrompt, setSystemPrompt] = useState("")
  const [knowledgeCutoff, setKnowledgeCutoff] = useState("")
  const [maxTokens, setMaxTokens] = useState<number>(500)
  const [contextWindow, setContextWindow] = useState<number>(16000)
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    fetchSettings();
  }, [chatbotId]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/chatbot/ai-settings?chatbotId=${chatbotId}`);
      const data = await response.json();
      
      if (data) {
        console.log("Fetched settings:", data);
        setModel(data.model ?? "gpt-3.5-turbo");
        setTemperature(data.temperature ?? 0.7);
        setSystemPrompt(data.systemPrompt ?? "");
        setKnowledgeCutoff(data.knowledgeCutoff ?? "");
        setMaxTokens(data.maxTokens ?? 500);
        setContextWindow(data.contextWindow ?? 16000);
        setLanguage(data.language ?? "en");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setNotification({
        message: "Failed to load settings",
        type: "error"
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const settingsData = {
        chatbotId,
        model,
        temperature,
        systemPrompt,
        knowledgeCutoff,
        maxTokens,
        contextWindow,
        language,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0
      };

      console.log("Saving settings:", settingsData);

      const response = await fetch("/api/chatbot/ai-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Save error:", errorData);
        throw new Error(errorData.error || "Failed to save");
      }

      const savedData = await response.json();
      console.log("Saved data:", savedData);

      setNotification({
        message: "Settings saved successfully",
        type: "success"
      });
    } catch (error) {
      console.error("Save error:", error);
      setNotification({
        message: "Failed to save settings",
        type: "error"
      });
    }
    setLoading(false);
  };

  // Get provider based on selected model with proper typing
  const getSelectedProvider = (): Provider => {
    for (const [provider, models] of Object.entries(AI_MODELS)) {
      if (models.some(m => m.value === model)) {
        return provider as Provider;
      }
    }
    return 'OpenAI'; // Default provider
  };

  return (
    <>
      {notification && (
        <CustomNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="w-full max-w-3xl mx-auto space-y-8">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="flex h-10 w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500">Select the language for AI responses</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Model Provider
              </label>
              <select
                value={getSelectedProvider()}
                onChange={(e) => {
                  const provider = e.target.value as Provider;
                  const firstModel = AI_MODELS[provider][0].value;
                  setModel(firstModel);
                }}
                className="flex h-10 w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.keys(AI_MODELS).map(provider => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="flex h-10 w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {AI_MODELS[getSelectedProvider()].map(model => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500">Select the AI model to power your chatbot</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Temperature ({temperature})
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full max-w-xl"
              />
              <p className="text-sm text-gray-500">
                Controls randomness: Lowering results in more focused and deterministic responses, 
                while increasing leads to more creative and varied outputs
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                System Message
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={4}
                placeholder="You are a helpful AI assistant..."
                className="flex w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-sm text-gray-500">Define the AI&apos;s personality and behavior</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Knowledge Cutoff
              </label>
              <input
                type="date"
                value={knowledgeCutoff}
                onChange={(e) => setKnowledgeCutoff(e.target.value)}
                className="flex h-10 w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-sm text-gray-500">Set the knowledge cutoff date for the AI model</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <h3 className="text-xl font-semibold">Advanced Settings</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Maximum Tokens
              </label>
              <input
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                placeholder="4096"
                className="flex h-10 w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-sm text-gray-500">Maximum number of tokens per response</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Context Window
              </label>
              <input
                type="number"
                value={contextWindow}
                onChange={(e) => setContextWindow(parseInt(e.target.value))}
                placeholder="16000"
                className="flex h-10 w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-sm text-gray-500">Number of tokens to consider from conversation history</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-2xl font-semibold">Training</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Last trained at
            </label>
            <p className="text-lg">
              December 26, 2024 at 12:11 AM
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default AISettings;