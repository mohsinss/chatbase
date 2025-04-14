"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconInfoCircle, IconBrandSlack } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";

const SlackReactions = () => {
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [settingsData, setSettingsData] = useState({
    prompt: "",
    delay: 0,
    channelMessageEnabled: false,
    channelMessagePrompt: "Thanks for your message! How can I help?",
    channelMessageDelay: 0,
    mentionEnabled: false,
    mentionPrompt: "You mentioned me! How can I assist you?",
    mentionDelay: 0,
    reactionEnabled: false,
    reactionPrompt: "Thanks for the reaction! Need anything?",
    reactionDelay: 0,
    keywordEnabled: false,
    keywordSettings: []
  });

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // TODO: Implement actual Slack connection logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to Slack:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="p-0 h-full">
      {/* Fixed Slack header */}
      <div className="fixed top-[120px] left-[70px] md:left-48 right-0 z-10">
        <div className="bg-[#4A154B] text-white p-6">
          <div className="flex items-center gap-3">
            <IconBrandSlack className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl font-semibold">Slack Reactions</h1>
              <p className="mt-1 text-white/80">Manage your Slack chatbot reactions and settings.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scrollable content with top padding for fixed header */}
      <div className="flex flex-col gap-6 p-6 bg-[#F7F9F9] mt-[120px]">
        <div className="flex justify-end">
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isConnected
                ? "bg-gradient-to-r from-green-400 via-green-500 to-purple-400 text-white border border-green-200"
                : "bg-[#4A154B] text-white hover:opacity-90"
            }`}
          >
            {isConnected ? "Already Connected to Slack" : isConnecting ? "Connecting..." : "Connect to Slack"}
          </button>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Message Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.channelMessageEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, channelMessageEnabled: enabled })}
                  className={`${settingsData.channelMessageEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span className={`${settingsData.channelMessageEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Respond to Channel Messages</span>
              </div>
            </div>

            <div className={`space-y-4 ${!settingsData.channelMessageEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Response Template</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.channelMessagePrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, channelMessagePrompt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.channelMessageDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, channelMessageDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mention Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.mentionEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, mentionEnabled: enabled })}
                  className={`${settingsData.mentionEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span className={`${settingsData.mentionEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Respond to Mentions</span>
              </div>
            </div>

            <div className={`space-y-4 ${!settingsData.mentionEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Response Template</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.mentionPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, mentionPrompt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.mentionDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, mentionDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reaction Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.reactionEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, reactionEnabled: enabled })}
                  className={`${settingsData.reactionEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span className={`${settingsData.reactionEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Respond to Reactions</span>
              </div>
            </div>

            <div className={`space-y-4 ${!settingsData.reactionEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Response Template</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.reactionPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, reactionPrompt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.reactionDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, reactionDelay: Number(e.target.value) })}
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
  );
};

export default SlackReactions; 