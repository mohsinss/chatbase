"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconInfoCircle } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";

const SnapchatReactions = () => {
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Snapchat Reactions</h1>
      <p className="mt-2 text-gray-600">Manage your Snapchat chatbot reactions and settings.</p>
      
      <div className="flex flex-col gap-6 mt-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Story View Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.storyViewEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, storyViewEnabled: enabled })}
                  className={`${settingsData.storyViewEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span className={`${settingsData.storyViewEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Respond to Story Views</span>
              </div>
            </div>

            <div className={`space-y-4 ${!settingsData.storyViewEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Response Template</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.storyViewPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, storyViewPrompt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.storyViewDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, storyViewDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Snap Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.snapEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, snapEnabled: enabled })}
                  className={`${settingsData.snapEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span className={`${settingsData.snapEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Respond to Snaps</span>
              </div>
            </div>

            <div className={`space-y-4 ${!settingsData.snapEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Response Template</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.snapPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, snapPrompt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.snapDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, snapDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chat Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.chatEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, chatEnabled: enabled })}
                  className={`${settingsData.chatEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span className={`${settingsData.chatEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Enable Chat Responses</span>
              </div>
            </div>

            <div className={`space-y-4 ${!settingsData.chatEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Response Template</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.chatPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, chatPrompt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.chatDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, chatDelay: Number(e.target.value) })}
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

export default SnapchatReactions; 