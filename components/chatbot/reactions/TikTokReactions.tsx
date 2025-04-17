"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconInfoCircle, IconBrandTiktok } from "@tabler/icons-react";
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

  return (
    <div className="flex flex-col h-full">
      {/* Fixed TikTok header */}
      <div className="sticky top-0 z-10">
        <div className="bg-black text-white p-6">
          <div className="flex items-center gap-3">
            <IconBrandTiktok className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl font-semibold">TikTok Reactions</h1>
              <p className="mt-1 text-white/80">Manage your TikTok chatbot reactions and settings.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 p-6 bg-[#F7F9F9]">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Video View Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.videoViewEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, videoViewEnabled: enabled })}
                    className={`${settingsData.videoViewEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span className={`${settingsData.videoViewEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                  </Switch>
                  <span className="text-sm font-medium text-gray-700">Respond to Video Views</span>
                </div>
              </div>

              <div className={`space-y-4 ${!settingsData.videoViewEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Response Template</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                    value={settingsData.videoViewPrompt}
                    onChange={(e) => setSettingsData({ ...settingsData, videoViewPrompt: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={settingsData.videoViewDelay}
                    onChange={(e) => setSettingsData({ ...settingsData, videoViewDelay: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comment Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.commentEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, commentEnabled: enabled })}
                    className={`${settingsData.commentEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span className={`${settingsData.commentEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                  </Switch>
                  <span className="text-sm font-medium text-gray-700">Respond to Comments</span>
                </div>
              </div>

              <div className={`space-y-4 ${!settingsData.commentEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Response Template</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                    value={settingsData.commentPrompt}
                    onChange={(e) => setSettingsData({ ...settingsData, commentPrompt: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={settingsData.commentDelay}
                    onChange={(e) => setSettingsData({ ...settingsData, commentDelay: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Direct Message Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.dmEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, dmEnabled: enabled })}
                    className={`${settingsData.dmEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span className={`${settingsData.dmEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                  </Switch>
                  <span className="text-sm font-medium text-gray-700">Enable Direct Messages</span>
                </div>
              </div>

              <div className={`space-y-4 ${!settingsData.dmEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Response Template</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                    value={settingsData.dmPrompt}
                    onChange={(e) => setSettingsData({ ...settingsData, dmPrompt: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={settingsData.dmDelay}
                    onChange={(e) => setSettingsData({ ...settingsData, dmDelay: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Duet Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.duetEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, duetEnabled: enabled })}
                    className={`${settingsData.duetEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span className={`${settingsData.duetEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                  </Switch>
                  <span className="text-sm font-medium text-gray-700">Respond to Duets</span>
                </div>
              </div>

              <div className={`space-y-4 ${!settingsData.duetEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Response Template</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                    value={settingsData.duetPrompt}
                    onChange={(e) => setSettingsData({ ...settingsData, duetPrompt: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={settingsData.duetDelay}
                    onChange={(e) => setSettingsData({ ...settingsData, duetDelay: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyword Triggers</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.keywordEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, keywordEnabled: enabled })}
                    className={`${settingsData.keywordEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span className={`${settingsData.keywordEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                  </Switch>
                  <span className="text-sm font-medium text-gray-700">Enable Keyword Triggers</span>
                </div>
              </div>

              <div className={`space-y-4 ${!settingsData.keywordEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                {(settingsData.keywordSettings || []).map((setting, index) => (
                  <div key={index} className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Keyword</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter keyword"
                        value={setting.keyword}
                        onChange={(e) => {
                          const newSettings = [...(settingsData.keywordSettings || [])];
                          newSettings[index].keyword = e.target.value;
                          setSettingsData({ ...settingsData, keywordSettings: newSettings });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Response</label>
                      <textarea
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter response for this keyword"
                        value={setting.response}
                        onChange={(e) => {
                          const newSettings = [...(settingsData.keywordSettings || [])];
                          newSettings[index].response = e.target.value;
                          setSettingsData({ ...settingsData, keywordSettings: newSettings });
                        }}
                      />
                    </div>
                    <button
                      onClick={() => {
                        const newSettings = [...(settingsData.keywordSettings || [])];
                        newSettings.splice(index, 1);
                        setSettingsData({ ...settingsData, keywordSettings: newSettings });
                      }}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Remove Keyword
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newSettings = [...(settingsData.keywordSettings || []), { keyword: '', response: '' }];
                    setSettingsData({ ...settingsData, keywordSettings: newSettings });
                  }}
                  className="text-sm font-medium text-blue-500 hover:text-blue-700"
                >
                  + Add Keyword
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TikTokReactions; 