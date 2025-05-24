"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconBrandWhatsapp, IconLoader, IconTrash, IconPlus, IconAlertTriangle, IconTestPipe } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";

interface WhatsAppReactionsProps {
  chatbot: {
    integrations: {
      [key: string]: boolean;
    };
    id: string;
    name: string;
  };
}

const WhatsAppReactions = ({ chatbot }: WhatsAppReactionsProps) => {
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [whatsappNumbers, setWhatsappNumbers] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState("");
  const [settingsData, setSettingsData] = useState({
    phoneNumber: "",
    messageEnabled: false,
    messagePrompt: "",
    messageDelay: 0,
    keywordEnabled: false,
    keywordTriggers: [],
    autoReplyEnabled: false,
    autoReplyPrompt: "Thanks for your message! I'll get back to you soon.",
    autoReplyDelay: 0
  });

  const canInteract = isConnected || testMode;

  // Initialize test data when test mode is enabled
  useEffect(() => {
    if (testMode && !isConnected) {
      setSettingsData(prev => ({
        ...prev,
        phoneNumber: "+1234567890",
        messageEnabled: true,
        messagePrompt: "Hi! Thanks for messaging us on WhatsApp. How can I help you today?",
        messageDelay: 2,
        keywordEnabled: true,
        keywordTriggers: [
          { keyword: "support", prompt: "I'm here to help with any support questions you have!", delay: 1 },
          { keyword: "order", prompt: "Let me help you with your order. What's your order number?", delay: 2 }
        ],
        autoReplyEnabled: true
      }));
    }
  }, [testMode, isConnected]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // TODO: Implement actual WhatsApp connection logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      setIsConnected(true);
      setWhatsappNumbers([
        { _id: "1", display_phone_number: "+1 (555) 123-4567" },
        { _id: "2", display_phone_number: "+1 (555) 987-6543" }
      ]);
      setSelectedPageId("1");
    } catch (error) {
      console.error('Failed to connect to WhatsApp:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const addKeywordTrigger = () => {
    setSettingsData({
      ...settingsData,
      keywordTriggers: [...(settingsData.keywordTriggers || []), { keyword: "", prompt: "", delay: 0 }]
    });
  };

  const removeKeywordTrigger = (index: number) => {
    const newTriggers = [...(settingsData.keywordTriggers || [])];
    newTriggers.splice(index, 1);
    setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg overflow-hidden">
      {/* Connection Status Banner */}
      {!isConnected && (
        <div className="bg-orange-50 border-b border-orange-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconAlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-orange-800">WhatsApp Not Connected</p>
                <p className="text-xs text-orange-600">Connect your WhatsApp Business account to enable these features</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={testMode}
                  onChange={setTestMode}
                  className={`${testMode ? 'bg-green-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                  <span className={`${testMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <div className="flex items-center gap-1">
                  <IconTestPipe className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Test Mode</span>
                </div>
              </div>
              <button 
                onClick={handleConnect}
                disabled={isConnecting}
                className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {isConnecting ? "Connecting..." : "Connect WhatsApp"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconBrandWhatsapp className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-semibold">WhatsApp Reactions</h1>
              <p className="mt-1 text-white/80">Manage your WhatsApp Business chatbot reactions and automated messages</p>
            </div>
          </div>
          {isConnected && (
            <div className="flex items-center gap-2 text-sm bg-white/20 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Connected
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className={`p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto ${!canInteract ? 'opacity-60' : ''}`}>
        {/* WhatsApp Number Selector */}
        <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
          <div className="p-4 bg-green-50 border-b border-green-200">
            <h3 className="text-lg font-semibold text-green-700">WhatsApp Business Number</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50"
                  value={settingsData.phoneNumber}
                  onChange={(e) => setSettingsData({ ...settingsData, phoneNumber: e.target.value })}
                  placeholder="+1234567890"
                  disabled={!canInteract}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Message Responses */}
        <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
          <div className="p-4 bg-green-50 border-b border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.messageEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, messageEnabled: enabled })}
                  disabled={!canInteract}
                  className={`${settingsData.messageEnabled ? 'bg-green-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span className={`${settingsData.messageEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <h3 className="text-lg font-semibold text-green-700">Message Responses</h3>
              </div>
            </div>
          </div>

          <div className={`p-4 space-y-4 ${!settingsData.messageEnabled || !canInteract ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Template</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  rows={3}
                  value={settingsData.messagePrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, messagePrompt: e.target.value })}
                  placeholder="Enter message for WhatsApp responses..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={settingsData.messageDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, messageDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Auto Reply */}
        <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
          <div className="p-4 bg-green-50 border-b border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.autoReplyEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, autoReplyEnabled: enabled })}
                  disabled={!canInteract}
                  className={`${settingsData.autoReplyEnabled ? 'bg-green-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span className={`${settingsData.autoReplyEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <h3 className="text-lg font-semibold text-green-700">Auto Reply</h3>
              </div>
            </div>
          </div>

          <div className={`p-4 space-y-4 ${!settingsData.autoReplyEnabled || !canInteract ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto Reply Template</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  rows={3}
                  value={settingsData.autoReplyPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, autoReplyPrompt: e.target.value })}
                  placeholder="Enter auto reply message..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={settingsData.autoReplyDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, autoReplyDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Keyword Triggers */}
        <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
          <div className="p-4 bg-green-50 border-b border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.keywordEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, keywordEnabled: enabled })}
                  disabled={!canInteract}
                  className={`${settingsData.keywordEnabled ? 'bg-green-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span className={`${settingsData.keywordEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <h3 className="text-lg font-semibold text-green-700">Keyword Triggers</h3>
              </div>
              <button
                onClick={addKeywordTrigger}
                disabled={!settingsData.keywordEnabled || !canInteract}
                className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                <IconPlus className="w-4 h-4" />
                Add Keyword
              </button>
            </div>
          </div>

          <div className={`p-4 space-y-4 ${!settingsData.keywordEnabled || !canInteract ? 'opacity-50 pointer-events-none' : ''}`}>
            {(settingsData.keywordTriggers || []).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No keyword triggers configured. Click "Add Keyword" to get started.</p>
              </div>
            ) : (
              (settingsData.keywordTriggers || []).map((trigger: any, index: number) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-700">Keyword Trigger {index + 1}</h4>
                    <button
                      onClick={() => removeKeywordTrigger(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Keyword</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={trigger.keyword}
                        onChange={(e) => {
                          const newTriggers = [...(settingsData.keywordTriggers || [])];
                          newTriggers[index].keyword = e.target.value;
                          setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                        }}
                        placeholder="Enter keyword"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Response</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={trigger.prompt}
                        onChange={(e) => {
                          const newTriggers = [...(settingsData.keywordTriggers || [])];
                          newTriggers[index].prompt = e.target.value;
                          setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                        }}
                        placeholder="Enter response message"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={trigger.delay}
                        onChange={(e) => {
                          const newTriggers = [...(settingsData.keywordTriggers || [])];
                          newTriggers[index].delay = Number(e.target.value);
                          setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-green-200">
          <button 
            disabled={!canInteract}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testMode && !isConnected ? "Save Test Settings" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppReactions;
