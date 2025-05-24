"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconInfoCircle, IconBrandSnapchat, IconPlus, IconTrash, IconAlertTriangle } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";

const SnapchatReactions = () => {
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [settingsData, setSettingsData] = useState({
    prompt: "",
    delay: 0,
    storyViewEnabled: false,
    storyViewPrompt: "Thanks for watching my story! Want to chat?",
    storyViewDelay: 0,
    snapEnabled: false,
    snapPrompt: "Got your snap! How can I help you today?",
    snapDelay: 0,
    chatEnabled: false,
    chatPrompt: "Hey there! How can I assist you?",
    chatDelay: 0,
    keywordEnabled: false,
    keywordSettings: []
  });

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // TODO: Implement actual Snapchat connection logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to Snapchat:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const addKeywordSetting = () => {
    setSettingsData({
      ...settingsData,
      keywordSettings: [...(settingsData.keywordSettings || []), { keyword: "", prompt: "", delay: 0 }]
    });
  };

  const removeKeywordSetting = (index: number) => {
    const newSettings = [...(settingsData.keywordSettings || [])];
    newSettings.splice(index, 1);
    setSettingsData({ ...settingsData, keywordSettings: newSettings });
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg overflow-hidden">
      {/* Connection Status Banner */}
      {!isConnected && (
        <div className="bg-orange-50 border-b border-orange-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconAlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-orange-800">Snapchat Not Connected</p>
                <p className="text-xs text-orange-600">Connect your Snapchat account to enable these features</p>
              </div>
            </div>
            <button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isConnecting ? "Connecting..." : "Connect Snapchat"}
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconBrandSnapchat className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-semibold">Snapchat Reactions</h1>
              <p className="mt-1 text-black/80">Manage your Snapchat chatbot reactions and automated messages</p>
            </div>
          </div>
          {isConnected && (
            <div className="flex items-center gap-2 text-sm bg-black/20 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Connected
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className={`p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto ${!isConnected ? 'opacity-60' : ''}`}>
        {/* Story View Settings */}
        <div className="bg-white rounded-lg border border-yellow-200 overflow-hidden">
          <div className="p-4 bg-yellow-50 border-b border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.storyViewEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, storyViewEnabled: enabled })}
                  disabled={!isConnected}
                  className={`${settingsData.storyViewEnabled ? 'bg-yellow-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span className={`${settingsData.storyViewEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <h3 className="text-lg font-semibold text-yellow-700">Story View Responses</h3>
              </div>
            </div>
          </div>

          <div className={`p-4 space-y-4 ${!settingsData.storyViewEnabled || !isConnected ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Template</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
                  rows={3}
                  value={settingsData.storyViewPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, storyViewPrompt: e.target.value })}
                  placeholder="Enter message for story viewers..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  value={settingsData.storyViewDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, storyViewDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Snap Settings */}
        <div className="bg-white rounded-lg border border-yellow-200 overflow-hidden">
          <div className="p-4 bg-yellow-50 border-b border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.snapEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, snapEnabled: enabled })}
                  disabled={!isConnected}
                  className={`${settingsData.snapEnabled ? 'bg-yellow-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span className={`${settingsData.snapEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <h3 className="text-lg font-semibold text-yellow-700">Snap Responses</h3>
              </div>
            </div>
          </div>

          <div className={`p-4 space-y-4 ${!settingsData.snapEnabled || !isConnected ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Template</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
                  rows={3}
                  value={settingsData.snapPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, snapPrompt: e.target.value })}
                  placeholder="Enter message for snap responses..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  value={settingsData.snapDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, snapDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Chat Settings */}
        <div className="bg-white rounded-lg border border-yellow-200 overflow-hidden">
          <div className="p-4 bg-yellow-50 border-b border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.chatEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, chatEnabled: enabled })}
                  disabled={!isConnected}
                  className={`${settingsData.chatEnabled ? 'bg-yellow-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span className={`${settingsData.chatEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <h3 className="text-lg font-semibold text-yellow-700">Chat Responses</h3>
              </div>
            </div>
          </div>

          <div className={`p-4 space-y-4 ${!settingsData.chatEnabled || !isConnected ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Template</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
                  rows={3}
                  value={settingsData.chatPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, chatPrompt: e.target.value })}
                  placeholder="Enter message for chat responses..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  value={settingsData.chatDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, chatDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Keyword Triggers */}
        <div className="bg-white rounded-lg border border-yellow-200 overflow-hidden">
          <div className="p-4 bg-yellow-50 border-b border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.keywordEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, keywordEnabled: enabled })}
                  disabled={!isConnected}
                  className={`${settingsData.keywordEnabled ? 'bg-yellow-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span className={`${settingsData.keywordEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <h3 className="text-lg font-semibold text-yellow-700">Keyword Triggers</h3>
              </div>
              <button
                onClick={addKeywordSetting}
                disabled={!settingsData.keywordEnabled || !isConnected}
                className="flex items-center gap-2 px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
              >
                <IconPlus className="w-4 h-4" />
                Add Keyword
              </button>
            </div>
          </div>

          <div className={`p-4 space-y-4 ${!settingsData.keywordEnabled || !isConnected ? 'opacity-50 pointer-events-none' : ''}`}>
            {(settingsData.keywordSettings || []).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No keyword triggers configured. Click "Add Keyword" to get started.</p>
              </div>
            ) : (
              (settingsData.keywordSettings || []).map((setting, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-700">Keyword Trigger {index + 1}</h4>
                    <button
                      onClick={() => removeKeywordSetting(index)}
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
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        value={setting.keyword}
                        onChange={(e) => {
                          const newSettings = [...(settingsData.keywordSettings || [])];
                          newSettings[index].keyword = e.target.value;
                          setSettingsData({ ...settingsData, keywordSettings: newSettings });
                        }}
                        placeholder="Enter keyword"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Response</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        value={setting.prompt}
                        onChange={(e) => {
                          const newSettings = [...(settingsData.keywordSettings || [])];
                          newSettings[index].prompt = e.target.value;
                          setSettingsData({ ...settingsData, keywordSettings: newSettings });
                        }}
                        placeholder="Enter response message"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        value={setting.delay}
                        onChange={(e) => {
                          const newSettings = [...(settingsData.keywordSettings || [])];
                          newSettings[index].delay = Number(e.target.value);
                          setSettingsData({ ...settingsData, keywordSettings: newSettings });
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
        <div className="flex justify-end pt-4 border-t border-yellow-200">
          <button 
            disabled={!isConnected}
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnapchatReactions; 