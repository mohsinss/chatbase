"use client";

import React, { useState, useEffect, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AI_MODELS } from "@/types";
import toast from "react-hot-toast";
import { PlusCircle, Trash2 } from "lucide-react";

interface AISettingsProps {
  chatbotId: string;
  team: TeamData;
}

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

interface TeamData {
  plan: string;
}

type Provider = keyof typeof AI_MODELS;

const AISettings = ({ chatbotId, team }: AISettingsProps) => {
  const [temperature, setTemperature] = useState(0.7)
  const [chunkCount, setChunkCount] = useState<number>(5)
  const [model, setModel] = useState("gpt-3.5-turbo")
  const [systemPrompt, setSystemPrompt] = useState("")
  const [knowledgeCutoff, setKnowledgeCutoff] = useState("")
  const [maxTokens, setMaxTokens] = useState<number>(500)
  const [contextWindow, setContextWindow] = useState<number>(16000)
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState("en")
  const [lastTrained, setLastTrained] = useState('')
  const [urls, setUrls] = useState<Array<{url: string, useCase: string}>>([{url: "", useCase: ""}])

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
        setChunkCount(data.chunkCount ?? 4);
        setSystemPrompt(data.systemPrompt ?? "");
        setKnowledgeCutoff(data.knowledgeCutoff ?? "");
        setMaxTokens(data.maxTokens ?? 500);
        setContextWindow(data.contextWindow ?? 16000);
        setLanguage(data.language ?? "en");
        setLastTrained(data.lastTrained);
        setUrls(data.urls ?? [{url: "", useCase: ""}]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load settings");
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
        chunkCount,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
        urls
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
      
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save settings");
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

  const addUrlRow = () => {
    setUrls([...urls, {url: "", useCase: ""}]);
  };

  const removeUrlRow = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  const handleUrlChange = (index: number, field: 'url' | 'useCase', value: string) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  return (
    <>
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
                  <option key={lang.label} value={lang.label}>
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
                  <option key={model.value} value={model.value} disabled={!model.default && team.plan == "Free"}>
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
                Chunk Count ({chunkCount})
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={chunkCount}
                onChange={(e) => setChunkCount(parseInt(e.target.value))}
                className="w-full max-w-xl"
              />
              <p className="text-sm text-gray-500">
                Controls how many relevant chunks of information are included in the context. 
                Higher values provide more context but may increase response time and token usage
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

            {/* <div className="space-y-4">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                URL Settings
              </label>
              <div className="space-y-4">
                {urls.map((urlItem, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-1 space-y-2">
                      <input
                        type="url"
                        value={urlItem.url}
                        onChange={(e) => handleUrlChange(index, 'url', e.target.value)}
                        placeholder="https://example.com"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={urlItem.useCase}
                        onChange={(e) => handleUrlChange(index, 'useCase', e.target.value)}
                        placeholder="When to use this URL"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeUrlRow(index)}
                      className="mt-1"
                      disabled={urls.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  onClick={addUrlRow} 
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" /> Add URL
                </Button>
                <p className="text-sm text-gray-500">Add URLs that the chatbot should reference or use in responses</p>
              </div>
            </div> */}

            <div className="space-y-2 hidden">
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
              {new Date(lastTrained).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default AISettings;