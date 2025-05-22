"use client"

import type React from "react"
import { IconRefresh, IconInfoCircle } from "@tabler/icons-react"
import { AI_MODELS, systemPromptTemplates } from "@/types/config"

// Flatten all models from different providers into a single array
const allModels = Object.entries(AI_MODELS).flatMap(([provider, models]) => 
  models.map(model => ({
    ...model,
    provider
  }))
);

interface ModelSettingsProps {
  instance: any
  updateInstance: (id: string, updates: any) => void
  onClose: () => void
  plan: string
}

const ModelSettings = ({ instance, updateInstance, onClose, plan }: ModelSettingsProps) => {
  // Ensure instance and aiSettings exist
  if (!instance) {
    return null
  }

  // Initialize aiSettings if it doesn't exist
  const aiSettings = instance.aiSettings || {
    model: "gpt-4o",
    temperature: 0,
    maxTokens: 1000,
    systemPromptTemplate: "aiAgent",
    instructions: "You are a helpful assistant.",
  };

  // Determine if current instructions match any template prompt
  const currentTemplate = systemPromptTemplates.find(t => t.prompt === aiSettings.instructions);
  const systemPromptTemplateValue = currentTemplate ? currentTemplate.key : "custom";

  // Update model and instance name with deep copy
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation()
    const modelValue = e.target.value
    
    // Find the selected model from allModels
    const selectedModel = allModels.find(model => model.value === modelValue)
    
    // Update the instance name to reflect the model
    // let displayName = selectedModel ? `${selectedModel.label}` : instance.name
    let displayName = instance.name
    
    // Create a deep copy of settings to ensure no reference sharing
    const newSettings = JSON.parse(JSON.stringify({
      ...aiSettings,
      model: modelValue,
    }));

    // Update instance with new model and name
    updateInstance(instance.id, {
      name: displayName,
      aiSettings: newSettings,
    })
  }

  // Update temperature setting with deep copy
  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const value = Number.parseFloat(e.target.value)
    
    // Create a deep copy of settings
    const newSettings = JSON.parse(JSON.stringify({
      ...aiSettings,
      temperature: value,
    }));
    
    updateInstance(instance.id, {
      aiSettings: newSettings,
    })
  }

  // Update max tokens setting with deep copy
  const handleMaxTokensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const value = Number.parseInt(e.target.value)
    
    // Create a deep copy of settings
    const newSettings = JSON.parse(JSON.stringify({
      ...aiSettings,
      maxTokens: value,
    }));
    
    updateInstance(instance.id, {
      aiSettings: newSettings,
    })
  }

  // Update system prompt based on template with deep copy
  const handleSystemPromptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation()
    const templateKey = e.target.value
    let systemPrompt = "You are a helpful assistant."

    // Find the prompt template by key
    const template = systemPromptTemplates.find(t => t.key === templateKey)
    if (template) {
      systemPrompt = template.prompt
    }

    // Create a deep copy of settings
    const newSettings = JSON.parse(JSON.stringify({
      ...aiSettings,
      systemPromptTemplate: templateKey,
      instructions: systemPrompt,
    }));

    updateInstance(instance.id, {
      aiSettings: newSettings,
    })
  }

  // Update instructions with deep copy
  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.stopPropagation()
    
    // Create a deep copy of settings
    const newSettings = JSON.parse(JSON.stringify({
      ...aiSettings,
      instructions: e.target.value,
    }));
    
    updateInstance(instance.id, {
      aiSettings: newSettings,
    })
  }

  return (
    <div
      data-settings-menu
      className="absolute top-full right-0 mt-1 w-96 bg-white border rounded-lg shadow-lg z-50 p-4 space-y-6"
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Model</label>
          <IconInfoCircle className="w-4 h-4 text-gray-400" />
        </div>
        <div className="relative">
          <select
            value={aiSettings.model || "gpt-4o"}
            onChange={handleModelChange}
            className="w-full p-2 border rounded-md appearance-none bg-white pr-8"
          >
            {/* Group models by provider */}
            {Object.entries(AI_MODELS).map(([provider, models]) => (
              <optgroup key={provider} label={provider}>
                {models.map(model => (
                  <option key={model.value} value={model.value} disabled={!model.default && plan == "Free"}>
                    {model.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Temperature</label>
          <span className="text-sm text-gray-500">{aiSettings.temperature || 0}</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={aiSettings.temperature || 0}
          onChange={handleTemperatureChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">Reserved</span>
          <span className="text-xs text-gray-500">Creative</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Max Tokens</label>
          <span className="text-sm text-gray-500">{aiSettings.maxTokens || 1000}</span>
        </div>
        <input
          type="range"
          min="100"
          max="4000"
          step="100"
          value={aiSettings.maxTokens || 1000}
          onChange={handleMaxTokensChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">Short</span>
          <span className="text-xs text-gray-500">Long</span>
        </div>
      </div>

      <div className="hidden">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">AI Actions</label>
        </div>
        <div className="p-4 border rounded-md text-center text-sm text-gray-500">No actions found</div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">System prompt</label>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <select
            value={aiSettings.systemPromptTemplate || "aiAgent"}
            onChange={handleSystemPromptChange}
            className="w-full p-2 border rounded-md appearance-none bg-white pr-8"
          >
            <option key="custom" value="custom">Custom Prompt</option>
            {systemPromptTemplates.map(template => (
              <option key={template.key} value={template.key}>
                {template.displayName}
              </option>
            ))}
          </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <button className="p-2 border rounded-md">
            <IconRefresh className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Instructions</label>
        </div>
        <div className="relative">
          <textarea
            value={aiSettings.instructions || "### Role\nYou are a Developer Assistant who helps with coding tasks."}
            onChange={handleInstructionsChange}
            className="w-full p-2 border rounded-md h-24 resize-none"
          />
        </div>
      </div>
    </div>
  )
}

export default ModelSettings
