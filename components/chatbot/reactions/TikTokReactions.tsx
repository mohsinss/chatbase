"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconInfoCircle, IconBrandTiktok, IconPlus, IconTrash, IconAlertTriangle } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";

const TikTokReactions = () => {
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [settingsData, setSettingsData] = useState({
    prompt: "",
    delay: 0,
    videoViewEnabled: false,
    videoViewPrompt: "Thanks for watching my video! Want to chat?",
    videoViewDelay: 0,
    commentEnabled: false,
    commentPrompt: "Thanks for your comment! How can I help you?",
    commentDelay: 0,
    dmEnabled: false,
    dmPrompt: "Hey there! How can I assist you today?",
    dmDelay: 0,
    duetEnabled: false,
    duetPrompt: "Thanks for the duet! Let's connect!",
    duetDelay: 0,
    keywordEnabled: false,
    keywordSettings: []
  });

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // TODO: Implement actual TikTok connection logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to TikTok:', error);
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
    <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
      {/* Connection Status Banner */}
      {!isConnected && (
        <div className="bg-orange-50 border-b border-orange-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconAlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-orange-800">TikTok Not Connected</p>
                <p className="text-xs text-orange-600">Connect your TikTok account to enable these features</p>
              </div>
            </div>
            <button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isConnecting ? "Connecting..." : "Connect TikTok"}
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconBrandTiktok className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-semibold">TikTok Reactions</h1>
              <p className="mt-1 text-white/80">Manage your TikTok chatbot reactions and automated messages</p>
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
      <div className={`p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto ${!isConnected ? 'opacity-60' : ''}`}>
        {/* Video View Settings */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.videoViewEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, videoViewEnabled: enabled })}
                  disabled={!isConnected}
                  className={`${settingsData.videoViewEnabled ? 'bg-black' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span className={`${settingsData.videoViewEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <h3 className="text-lg font-semibold text-gray-700">Video View Responses</h3>
              </div>
            </div>
          </div>

          <div className={`p-4 space-y-4 ${!settingsData.videoViewEnabled || !isConnected ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Template</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black resize-none"
                  rows={3}
                  value={settingsData.videoViewPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, videoViewPrompt: e.target.value })}
                  placeholder="Enter message for video viewers..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black"
                  value={settingsData.videoViewDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, videoViewDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Comment Settings */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.commentEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, commentEnabled: enabled })}
                  disabled={!isConnected}
                  className={`${settingsData.commentEnabled ? 'bg-black' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span className={`${settingsData.commentEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <h3 className="text-lg font-semibold text-gray-700">Comment Responses</h3>
              </div>
            </div>
          </div>

          <div className={`p-4 space-y-4 ${!settingsData.commentEnabled || !isConnected ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Template</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black resize-none"
                  rows={3}
                  value={settingsData.commentPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, commentPrompt: e.target.value })}
                  placeholder="Enter message for comment responses..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black"
                  value={settingsData.commentDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, commentDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Direct Message Settings */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.dmEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, dmEnabled: enabled })}
                  disabled={!isConnected}
                  className={`${settingsData.dmEnabled ? 'bg-black' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span className={`${settingsData.dmEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <h3 className="text-lg font-semibold text-gray-700">Direct Message Responses</h3>
              </div>
            </div>
          </div>

          <div className={`p-4 space-y-4 ${!settingsData.dmEnabled || !isConnected ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Template</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black resize-none"
                  rows={3}
                  value={settingsData.dmPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, dmPrompt: e.target.value })}
                  placeholder="Enter message for direct message responses..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black"
                  value={settingsData.dmDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, dmDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Duet Settings */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.duetEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, duetEnabled: enabled })}
                  disabled={!isConnected}
                  className={`${settingsData.duetEnabled ? 'bg-black' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span className={`${settingsData.duetEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <h3 className="text-lg font-semibold text-gray-700">Duet Responses</h3>
              </div>
            </div>
          </div>

          <div className={`p-4 space-y-4 ${!settingsData.duetEnabled || !isConnected ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Template</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black resize-none"
                  rows={3}
                  value={settingsData.duetPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, duetPrompt: e.target.value })}
                  placeholder="Enter message for duet responses..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black"
                  value={settingsData.duetDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, duetDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Keyword Triggers */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.keywordEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, keywordEnabled: enabled })}
                  disabled={!isConnected}
                  className={`${settingsData.keywordEnabled ? 'bg-black' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span className={`${settingsData.keywordEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <h3 className="text-lg font-semibold text-gray-700">Keyword Triggers</h3>
              </div>
              <button
                onClick={addKeywordSetting}
                disabled={!settingsData.keywordEnabled || !isConnected}
                className="flex items-center gap-2 px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
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
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black focus:border-black"
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
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black focus:border-black"
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
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black focus:border-black"
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
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button 
            disabled={!isConnected}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default TikTokReactions; 