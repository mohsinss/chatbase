"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconBrandSlack } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";

interface SlackReactionsProps {
  chatbot: {
    integrations: {
      [key: string]: boolean;
    };
  };
}

const SlackReactions = ({ chatbot }: SlackReactionsProps) => {
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();
  const [settingsData, setSettingsData] = useState({
    prompt: "",
    delay: 0,
    channelEnabled: false,
    channelPrompt: "Thanks for your message! How can I help?",
    channelDelay: 0,
    dmEnabled: false,
    dmPrompt: "Thanks for your direct message! How can I help?",
    dmDelay: 0,
    mentionEnabled: false,
    mentionPrompt: "Thanks for mentioning me! How can I help?",
    mentionDelay: 0,
    reactionEnabled: false,
    reactionPrompt: "Thanks for your reaction! How can I help?",
    reactionDelay: 0,
    keywordEnabled: false,
    keywordSettings: []
  });

  useEffect(() => {
    setIsConnected(!!chatbot?.integrations?.['slack']);
  }, [chatbot]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // TODO: Implement actual Slack connection logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to Slack:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Slack header */}
      <div className="sticky top-0 z-10">
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
      
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 p-6 bg-[#F8F8F8]">
          <div className="flex justify-end">
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isConnected
                  ? "bg-[#4A154B] text-white border border-purple-200"
                  : "bg-[#4A154B] text-white hover:bg-[#611f69]"
              }`}
            >
              {isConnected ? "Already Connected to Slack" : isConnecting ? "Connecting..." : "Connect to Slack"}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#F8F8F8] rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.channelEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, channelEnabled: enabled })}
                    className={`${settingsData.channelEnabled ? 'bg-[#4A154B]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A154B] focus:ring-offset-2`}
                  >
                    <span className={`${settingsData.channelEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                  </Switch>
                  <span className="text-sm font-medium text-gray-700">Respond to Channel Messages</span>
                </div>
              </div>

              <div className={`space-y-4 ${!settingsData.channelEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Response Template</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-3 focus:ring-[#4A154B] focus:border-[#4A154B]"
                    value={settingsData.channelPrompt}
                    onChange={(e) => setSettingsData({ ...settingsData, channelPrompt: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-[#4A154B] focus:border-[#4A154B]"
                    value={settingsData.channelDelay}
                    onChange={(e) => setSettingsData({ ...settingsData, channelDelay: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Direct Message Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#F8F8F8] rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.dmEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, dmEnabled: enabled })}
                    className={`${settingsData.dmEnabled ? 'bg-[#4A154B]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A154B] focus:ring-offset-2`}
                  >
                    <span className={`${settingsData.dmEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                  </Switch>
                  <span className="text-sm font-medium text-gray-700">Respond to Direct Messages</span>
                </div>
              </div>

              <div className={`space-y-4 ${!settingsData.dmEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Response Template</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-3 focus:ring-[#4A154B] focus:border-[#4A154B]"
                    value={settingsData.dmPrompt}
                    onChange={(e) => setSettingsData({ ...settingsData, dmPrompt: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-[#4A154B] focus:border-[#4A154B]"
                    value={settingsData.dmDelay}
                    onChange={(e) => setSettingsData({ ...settingsData, dmDelay: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mention Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#F8F8F8] rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.mentionEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, mentionEnabled: enabled })}
                    className={`${settingsData.mentionEnabled ? 'bg-[#4A154B]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A154B] focus:ring-offset-2`}
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
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-3 focus:ring-[#4A154B] focus:border-[#4A154B]"
                    value={settingsData.mentionPrompt}
                    onChange={(e) => setSettingsData({ ...settingsData, mentionPrompt: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-[#4A154B] focus:border-[#4A154B]"
                    value={settingsData.mentionDelay}
                    onChange={(e) => setSettingsData({ ...settingsData, mentionDelay: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reaction Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#F8F8F8] rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.reactionEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, reactionEnabled: enabled })}
                    className={`${settingsData.reactionEnabled ? 'bg-[#4A154B]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A154B] focus:ring-offset-2`}
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
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-3 focus:ring-[#4A154B] focus:border-[#4A154B]"
                    value={settingsData.reactionPrompt}
                    onChange={(e) => setSettingsData({ ...settingsData, reactionPrompt: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-[#4A154B] focus:border-[#4A154B]"
                    value={settingsData.reactionDelay}
                    onChange={(e) => setSettingsData({ ...settingsData, reactionDelay: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyword Triggers</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#F8F8F8] rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.keywordEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, keywordEnabled: enabled })}
                    className={`${settingsData.keywordEnabled ? 'bg-[#4A154B]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A154B] focus:ring-offset-2`}
                  >
                    <span className={`${settingsData.keywordEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                  </Switch>
                  <span className="text-sm font-medium text-gray-700">Enable Keyword Triggers</span>
                </div>
              </div>

              <div className={`space-y-4 ${!settingsData.keywordEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                {(settingsData.keywordSettings || []).map((setting, index) => (
                  <div key={index} className="flex flex-col gap-3 p-4 bg-[#F8F8F8] rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Keyword</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-[#4A154B] focus:border-[#4A154B]"
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
                        className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-[#4A154B] focus:border-[#4A154B]"
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
                        className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-[#4A154B] focus:border-[#4A154B]"
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
                  className="text-sm font-medium text-[#4A154B] hover:text-[#611f69]"
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

export default SlackReactions; 