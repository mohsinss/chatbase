import { IconRefresh } from "@tabler/icons-react";
import { useAISettings } from '@/hooks/useAISettings';
import React, { useState, useEffect } from 'react';

interface ChatSettingsProps {
  isVisible: boolean;
  onToggle: () => void;
  chatbotId: string;
}

type NotificationType = {
  message: string;
  type: 'success' | 'error';
};

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

const InfoTooltip = ({ content }: { content: string }) => (
  <div className="absolute right-0 top-7 w-64 p-3 bg-white border text-sm text-gray-600 rounded-md shadow-lg z-50">
    {content}
  </div>
);

export const ChatSettings = ({ isVisible, onToggle, chatbotId }: ChatSettingsProps) => {
  const { settings, saveSettings, availableModels } = useAISettings(chatbotId);
  const [isSaving, setIsSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [tooltips, setTooltips] = useState({
    model: false,
    temperature: false,
    maxTokens: false,
    language: false,
  });

  const tooltipContent = {
    model: "Choose the AI model that powers your chatbot. Each model has different capabilities and pricing.",
    temperature: "Adjust the creativity level of responses. Lower values give consistent outputs.",
    maxTokens: "Set the maximum length of responses. One token is roughly 4 characters.",
    language: "Select the language for AI responses. This will affect how the AI communicates."
  };

  // Update local settings when server settings change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await saveSettings(localSettings);
      if (success) {
        setNotification({
          message: "Settings saved successfully",
          type: "success"
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setNotification({
        message: "Failed to save settings",
        type: "error"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border-r h-[calc(100vh-80px)] relative w-[400px]">
      {notification && (
        <CustomNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

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
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="nl">Dutch</option>
              <option value="pl">Polish</option>
              <option value="ru">Russian</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
              <option value="zh">Chinese</option>
              <option value="ar">Arabic</option>
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
            <div 
              className="flex items-center gap-2 p-3 border rounded-lg bg-white cursor-pointer"
              onClick={() => setShowModelDropdown(!showModelDropdown)}
            >
              <span className="w-5 h-5">🤖</span>
              <span>{availableModels.find(m => m.id === localSettings.model)?.name || localSettings.model}</span>
            </div>
            {showModelDropdown && (
              <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10">
                {availableModels.map(model => (
                  <div
                    key={model.id}
                    className="p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setLocalSettings(prev => ({ ...prev, model: model.id }));
                      setShowModelDropdown(false);
                    }}
                  >
                    {model.name}
                  </div>
                ))}
              </div>
            )}
            <div className="text-xs text-gray-500">1 credit per message</div>
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
            <h3 className="text-gray-700 font-medium">AI Actions</h3>
            <div className="p-4 border rounded-lg bg-white text-gray-500 text-center">
              No actions found
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-gray-700 font-medium">System prompt</h3>
            <div className="flex gap-2">
              <select className="flex-1 p-2.5 border rounded-lg bg-white text-gray-700">
                <option>AI Chatbot</option>
              </select>
              <button className="p-2.5 border rounded-lg">
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
        </div>
      </div>
    </div>
  );
}; 