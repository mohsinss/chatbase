import { IconRefresh } from "@tabler/icons-react";
import { useAISettings } from '@/contexts/AISettingsContext';
import React, { useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES } from '../settings/AISettings';
import { AI_MODELS, systemPromptTemplates } from "@/types/config";
import toast from "react-hot-toast";

interface ChatSettingsProps {
  isVisible: boolean;
  onToggle: () => void;
  fetchSettings: () => void;
  chatbotId: string;
  team?: any;
}

const InfoTooltip = ({ content }: { content: string }) => (
  <div className="absolute right-0 top-7 w-64 p-3 bg-white border text-sm text-gray-600 rounded-md shadow-lg z-50">
    {content}
  </div>
);

const getSelectedProvider = (model: string): keyof typeof AI_MODELS => {
  for (const [provider, models] of Object.entries(AI_MODELS)) {
    if (models.some(m => m.value === model)) {
      return provider as keyof typeof AI_MODELS;
    }
  }
  return 'OpenAI';
};

export const ChatSettings = ({ 
  isVisible, 
  onToggle, 
  chatbotId, 
  team, 
  fetchSettings 
}: ChatSettingsProps) => {
  const { settings: globalSettings, updateSettings: updateGlobalSettings } = useAISettings();
  const [isSaving, setIsSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState(globalSettings);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [tooltips, setTooltips] = useState({
    model: false,
    modelProvider: false,
    temperature: false,
    maxTokens: false,
    language: false,
    systemPrompt: false,
  });

  const tooltipContent = {
    model: "Choose the AI model Provider that powers your chatbot.",
    modelProvider: "Choose the AI model. Each model has different capabilities and pricing.",
    temperature: "Adjust the creativity level of responses. Lower values give consistent outputs.",
    maxTokens: "Set the maximum length of responses. One token is roughly 4 characters.",
    language: "Select the language for AI responses. This will affect how the AI communicates.",
    systemPrompt: "Select a system prompt template or enter a custom prompt below.",
  };

  // Determine if current instructions match any template prompt
  const currentTemplate = systemPromptTemplates.find(t => t.prompt === localSettings.systemPrompt);
  const systemPromptTemplateValue = currentTemplate ? currentTemplate.key : "custom";

  // Update local settings when global settings change
  useEffect(() => {
    setLocalSettings(globalSettings);
  }, [globalSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/chatbot/ai-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatbotId,
          ...localSettings,
          language: localSettings.language || 'en'
        }),
      });

      const data = await response.json()

      if (!response.ok) throw new Error(data?.details || 'Failed to save');

      // Update global settings immediately
      updateGlobalSettings(localSettings);
      fetchSettings()

      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update flow status');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border-r h-[calc(100vh-80px)] relative w-[400px]">
      {/* Toggle button */}
      {isVisible && (
        <button onClick={onToggle} className="absolute -right-12 top-4 h-[38px] w-[38px] flex items-center justify-center border rounded-lg bg-white">
          ☰
        </button>
      )}

      <div className="h-full overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-gray-800 text-white rounded-lg py-2.5 text-center disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save to chatbot"}
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Status:</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
                <span className="text-gray-700">Trained</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Response Language</span>
              <div className="relative">
                <button
                  className="text-gray-400 text-lg"
                  onMouseEnter={() => setTooltips(prev => ({ ...prev, language: true }))}
                  onMouseLeave={() => setTooltips(prev => ({ ...prev, language: false }))}
                >
                  ⓘ
                </button>
                {tooltips.language && <InfoTooltip content={tooltipContent.language} />}
              </div>
            </div>
            <select
              value={localSettings.language}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, language: e.target.value }))}
              className="w-full p-2.5 border rounded-lg bg-white text-gray-700"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Model Provider</span>
              <div className="relative">
                <button
                  className="text-gray-400 text-lg"
                  onMouseEnter={() => setTooltips(prev => ({ ...prev, modelProvider: true }))}
                  onMouseLeave={() => setTooltips(prev => ({ ...prev, modelProvider: false }))}
                >
                  ⓘ
                </button>
                {tooltips.modelProvider && <InfoTooltip content={tooltipContent.modelProvider} />}
              </div>
            </div>
            <select
              value={getSelectedProvider(localSettings.model)}
              onChange={(e) => {
                const provider = e.target.value as keyof typeof AI_MODELS;
                const firstModel = AI_MODELS[provider][0].value;
                setLocalSettings(prev => ({ ...prev, model: firstModel }));
              }}
              className="w-full p-2.5 border rounded-lg bg-white text-gray-700"
            >
              {Object.keys(AI_MODELS).map(provider => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Model</span>
              <div className="relative">
                <button
                  className="text-gray-400 text-lg"
                  onMouseEnter={() => setTooltips(prev => ({ ...prev, model: true }))}
                  onMouseLeave={() => setTooltips(prev => ({ ...prev, model: false }))}
                >
                  ⓘ
                </button>
                {tooltips.model && <InfoTooltip content={tooltipContent.model} />}
              </div>
            </div>
            <select
              value={localSettings.model}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, model: e.target.value }))}
              className="w-full p-2.5 border rounded-lg bg-white text-gray-700"
            >
              {AI_MODELS[getSelectedProvider(localSettings.model)].map(model => (
                <option key={model.value} value={model.value} disabled={!model.default && team?.plan == "Free"}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Temperature</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-700">{localSettings.temperature}</span>
                <div className="relative">
                  <button
                    className="text-gray-400 text-lg"
                    onMouseEnter={() => setTooltips(prev => ({ ...prev, temperature: true }))}
                    onMouseLeave={() => setTooltips(prev => ({ ...prev, temperature: false }))}
                  >
                    ⓘ
                  </button>
                  {tooltips.temperature && <InfoTooltip content={tooltipContent.temperature} />}
                </div>
              </div>
            </div>
            <div className="relative w-full h-1.5">
              <div className="absolute w-full h-full bg-gray-200 rounded-full"></div>
              <div
                className="absolute h-full bg-blue-500 rounded-full"
                style={{
                  width: `${(localSettings.temperature / 2) * 100}%`,
                }}
              ></div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={localSettings.temperature}
                onChange={(e) => setLocalSettings(prev => ({
                  ...prev,
                  temperature: parseFloat(e.target.value)
                }))}
                className="absolute w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="absolute w-3 h-3 bg-blue-500 rounded-full top-1/2 -translate-y-1/2"
                style={{
                  left: `${(localSettings.temperature / 2) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Reserved</span>
              <span>Creative</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Maximum Tokens</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-700">{localSettings.maxTokens}</span>
                <div className="relative">
                  <button
                    className="text-gray-400 text-lg"
                    onMouseEnter={() => setTooltips(prev => ({ ...prev, maxTokens: true }))}
                    onMouseLeave={() => setTooltips(prev => ({ ...prev, maxTokens: false }))}
                  >
                    ⓘ
                  </button>
                  {tooltips.maxTokens && <InfoTooltip content={tooltipContent.maxTokens} />}
                </div>
              </div>
            </div>
            <div className="relative w-full h-1.5">
              <div className="absolute w-full h-full bg-gray-200 rounded-full"></div>
              <div
                className="absolute h-full bg-blue-500 rounded-full"
                style={{
                  width: `${((localSettings.maxTokens - 100) / 3900) * 100}%`,
                }}
              ></div>
              <input
                type="range"
                min="100"
                max="4000"
                step="100"
                value={localSettings.maxTokens}
                onChange={(e) => setLocalSettings(prev => ({
                  ...prev,
                  maxTokens: parseInt(e.target.value)
                }))}
                className="absolute w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="absolute w-3 h-3 bg-blue-500 rounded-full top-1/2 -translate-y-1/2"
                style={{
                  left: `${((localSettings.maxTokens - 100) / 3900) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>100</span>
              <span>4000</span>
            </div>
            <p className="text-xs text-gray-500">
              Maximum number of tokens to generate in the response
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Chunk Count</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-700">{localSettings.chunkCount || 1}</span>
              </div>
            </div>
            <div className="relative w-full h-1.5">
              <div className="absolute w-full h-full bg-gray-200 rounded-full"></div>
              <div
                className="absolute h-full bg-blue-500 rounded-full"
                style={{
                  width: `${((localSettings.chunkCount || 1) - 1) / 9 * 100}%`,
                }}
              ></div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={localSettings.chunkCount || 1}
                onChange={(e) => setLocalSettings(prev => ({
                  ...prev,
                  chunkCount: parseInt(e.target.value)
                }))}
                className="absolute w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="absolute w-3 h-3 bg-blue-500 rounded-full top-1/2 -translate-y-1/2"
                style={{
                  left: `${((localSettings.chunkCount || 1) - 1) / 9 * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>1</span>
              <span>10</span>
            </div>
            <p className="text-xs text-gray-500">
              Number of chunks to split the context into
            </p>
          </div>

          <div className="space-y-2 hidden">
            <h3 className="text-gray-700 font-medium">AI Actions</h3>
            <div className="p-4 border rounded-lg bg-white text-gray-500 text-center">
              No actions found
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-gray-700 font-medium">System prompt</h3>
            <div className="flex gap-2">
              <select
                value={systemPromptTemplates.find(t => t.prompt === localSettings.systemPrompt)?.key || "custom"}
                onChange={(e) => {
                  const selectedKey = e.target.value;
                  const selectedTemplate = systemPromptTemplates.find(t => t.key === selectedKey);
                  setLocalSettings(prev => ({
                    ...prev,
                    systemPrompt: selectedTemplate ? selectedTemplate.prompt : prev.systemPrompt,
                  }));
                }}
                className="flex-1 p-2.5 border rounded-lg bg-white text-gray-700"
              >
                <option key="custom" value="custom">Custom Prompt</option>
                {systemPromptTemplates.map(template => (
                  <option key={template.key} value={template.key}>
                    {template.displayName}
                  </option>
                ))}
              </select>
              <button
                className="p-2.5 border rounded-lg"
                onClick={() => {
                  // On refresh, set systemPromptTemplate to custom and keep current instructions
                  setLocalSettings(prev => ({
                    ...prev,
                    systemPrompt: prev.systemPrompt,
                  }));
                }}
              >
                <IconRefresh className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={localSettings.systemPrompt}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, systemPrompt: e.target.value }))}
              className="w-full p-4 border rounded-lg text-sm text-gray-700 min-h-[200px]"
              placeholder="Enter system prompt..."
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-gray-700 font-medium">Suggested Messages</h3>
            <textarea
              value={localSettings.suggestedMessages}
              onChange={(e) => setLocalSettings(prev => ({
                ...prev,
                suggestedMessages: e.target.value
              }))}
              placeholder="Enter each message in a new line"
              className="w-full p-4 border rounded-lg text-sm text-gray-700 min-h-[100px]"
            />
            <p className="text-xs text-gray-500">
              Enter each suggested message on a new line. These will appear as clickable buttons in your chatbot.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
