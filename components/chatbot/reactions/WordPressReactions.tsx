"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconBrandWordpress } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";

interface WordPressReactionsProps {
  chatbot: {
    integrations: {
      [key: string]: boolean;
    };
  };
}

const WordPressReactions = ({ chatbot }: WordPressReactionsProps) => {
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();
  const [settingsData, setSettingsData] = useState({
    prompt: "",
    delay: 0,
    commentEnabled: false,
    commentPrompt: "Thanks for your comment! How can I help?",
    commentDelay: 0,
    postEnabled: false,
    postPrompt: "Thanks for reading! How can I help?",
    postDelay: 0,
    contactEnabled: false,
    contactPrompt: "Thanks for reaching out! How can I help?",
    contactDelay: 0,
    keywordEnabled: false,
    keywordSettings: []
  });

  useEffect(() => {
    setIsConnected(!!chatbot?.integrations?.['wordpress']);
  }, [chatbot]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // TODO: Implement actual WordPress connection logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to WordPress:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Fixed WordPress header */}
      <div className="sticky top-0 z-10">
        <div className="bg-[#21759B] text-white p-6">
          <div className="flex items-center gap-3">
            <IconBrandWordpress className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl font-semibold">WordPress Reactions</h1>
              <p className="mt-1 text-white/80">Manage your WordPress chatbot reactions and settings.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 p-6 bg-[#F8F8F8]">
          <div className="flex justify-end">
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isConnected
                  ? "bg-[#0073AA] text-white border border-blue-200"
                  : "bg-[#0073AA] text-white hover:bg-[#005F8B]"
              }`}
            >
              {isConnected ? "Already Connected to WordPress" : isConnecting ? "Connecting..." : "Connect to WordPress"}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comment Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.commentEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, commentEnabled: enabled })}
                    className={`${settingsData.commentEnabled ? 'bg-[#0073AA]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0073AA] focus:ring-offset-2`}
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
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-3 focus:ring-[#0073AA] focus:border-[#0073AA]"
                    value={settingsData.commentPrompt}
                    onChange={(e) => setSettingsData({ ...settingsData, commentPrompt: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-[#0073AA] focus:border-[#0073AA]"
                    value={settingsData.commentDelay}
                    onChange={(e) => setSettingsData({ ...settingsData, commentDelay: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.postEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, postEnabled: enabled })}
                    className={`${settingsData.postEnabled ? 'bg-[#0073AA]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0073AA] focus:ring-offset-2`}
                  >
                    <span className={`${settingsData.postEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                  </Switch>
                  <span className="text-sm font-medium text-gray-700">Respond to Post Views</span>
                </div>
              </div>

              <div className={`space-y-4 ${!settingsData.postEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Response Template</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-3 focus:ring-[#0073AA] focus:border-[#0073AA]"
                    value={settingsData.postPrompt}
                    onChange={(e) => setSettingsData({ ...settingsData, postPrompt: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-[#0073AA] focus:border-[#0073AA]"
                    value={settingsData.postDelay}
                    onChange={(e) => setSettingsData({ ...settingsData, postDelay: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Form Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.contactEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, contactEnabled: enabled })}
                    className={`${settingsData.contactEnabled ? 'bg-[#0073AA]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0073AA] focus:ring-offset-2`}
                  >
                    <span className={`${settingsData.contactEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                  </Switch>
                  <span className="text-sm font-medium text-gray-700">Respond to Contact Form Submissions</span>
                </div>
              </div>

              <div className={`space-y-4 ${!settingsData.contactEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Response Template</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-3 focus:ring-[#0073AA] focus:border-[#0073AA]"
                    value={settingsData.contactPrompt}
                    onChange={(e) => setSettingsData({ ...settingsData, contactPrompt: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-[#0073AA] focus:border-[#0073AA]"
                    value={settingsData.contactDelay}
                    onChange={(e) => setSettingsData({ ...settingsData, contactDelay: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyword Triggers</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.keywordEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, keywordEnabled: enabled })}
                    className={`${settingsData.keywordEnabled ? 'bg-[#0073AA]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0073AA] focus:ring-offset-2`}
                  >
                    <span className={`${settingsData.keywordEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                  </Switch>
                  <span className="text-sm font-medium text-gray-700">Enable Keyword Triggers</span>
                </div>
              </div>

              <div className={`space-y-4 ${!settingsData.keywordEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                {(settingsData.keywordSettings || []).map((setting, index) => (
                  <div key={index} className="flex flex-col gap-3 p-4 bg-[#F5F5F5] rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Keyword</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-[#0073AA] focus:border-[#0073AA]"
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
                        className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-[#0073AA] focus:border-[#0073AA]"
                        placeholder="Enter response for this keyword"
                        value={setting.prompt}
                        onChange={(e) => {
                          const newSettings = [...(settingsData.keywordSettings || [])];
                          newSettings[index].prompt = e.target.value;
                          setSettingsData({ ...settingsData, keywordSettings: newSettings });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Custom Delay (seconds)</label>
                      <input
                        type="number"
                        className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-[#0073AA] focus:border-[#0073AA]"
                        value={setting.delay}
                        onChange={(e) => {
                          const newSettings = [...(settingsData.keywordSettings || [])];
                          newSettings[index].delay = Number(e.target.value);
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
                    const newSettings = [...(settingsData.keywordSettings || []), { keyword: '', prompt: '', delay: 0 }];
                    setSettingsData({ ...settingsData, keywordSettings: newSettings });
                  }}
                  className="text-sm font-medium text-[#0073AA] hover:text-[#005F8B]"
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

export default WordPressReactions; 