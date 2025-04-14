"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconInfoCircle, IconBrandLinkedin } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";

interface LinkedInReactionsProps {
  chatbot: {
    integrations: {
      [key: string]: boolean;
    };
  };
}

const LinkedInReactions = ({ chatbot }: LinkedInReactionsProps) => {
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();
  const [settingsData, setSettingsData] = useState({
    prompt: "",
    delay: 0,
    postEnabled: false,
    postPrompt: "Thanks for your post! How can I help?",
    postDelay: 0,
    commentEnabled: false,
    commentPrompt: "Thanks for your comment! How can I help?",
    commentDelay: 0,
    messageEnabled: false,
    messagePrompt: "Thanks for your message! How can I help?",
    messageDelay: 0,
    connectionEnabled: false,
    connectionPrompt: "Thanks for connecting! How can I help?",
    connectionDelay: 0,
    keywordEnabled: false,
    keywordSettings: []
  });

  useEffect(() => {
    setIsConnected(!!chatbot?.integrations?.['linkedin']);
  }, [chatbot]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // TODO: Implement actual LinkedIn connection logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to LinkedIn:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="p-0 h-full">
      {/* Fixed LinkedIn header */}
      <div className="fixed top-[120px] left-[70px] md:left-48 right-0 z-10">
        <div className="bg-[#0A66C2] text-white p-6">
          <div className="flex items-center gap-3">
            <IconBrandLinkedin className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl font-semibold">LinkedIn Reactions</h1>
              <p className="mt-1 text-white/80">Manage your LinkedIn chatbot reactions and settings.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scrollable content with top padding for fixed header */}
      <div className="flex flex-col gap-6 p-6 bg-[#F3F2EF] mt-[120px]">
        <div className="flex justify-end">
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isConnected
                ? "bg-[#0A66C2] text-white border border-blue-200"
                : "bg-[#0A66C2] text-white hover:opacity-90"
            }`}
          >
            {isConnected ? "Already Connected to LinkedIn" : isConnecting ? "Connecting..." : "Connect to LinkedIn"}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-[#F3F2EF] rounded-lg">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.postEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, postEnabled: enabled })}
                  className={`${settingsData.postEnabled ? 'bg-[#0A66C2]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2`}
                >
                  <span className={`${settingsData.postEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Respond to Posts</span>
              </div>
            </div>

            <div className={`space-y-4 ${!settingsData.postEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Response Template</label>
                <textarea
                  className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-3 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
                  value={settingsData.postPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, postPrompt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
                  value={settingsData.postDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, postDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comment Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-[#F3F2EF] rounded-lg">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.commentEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, commentEnabled: enabled })}
                  className={`${settingsData.commentEnabled ? 'bg-[#0A66C2]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2`}
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
                  className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-3 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
                  value={settingsData.commentPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, commentPrompt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
                  value={settingsData.commentDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, commentDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-[#F3F2EF] rounded-lg">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.messageEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, messageEnabled: enabled })}
                  className={`${settingsData.messageEnabled ? 'bg-[#0A66C2]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2`}
                >
                  <span className={`${settingsData.messageEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Respond to Messages</span>
              </div>
            </div>

            <div className={`space-y-4 ${!settingsData.messageEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Response Template</label>
                <textarea
                  className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-3 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
                  value={settingsData.messagePrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, messagePrompt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
                  value={settingsData.messageDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, messageDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-[#F3F2EF] rounded-lg">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.connectionEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, connectionEnabled: enabled })}
                  className={`${settingsData.connectionEnabled ? 'bg-[#0A66C2]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2`}
                >
                  <span className={`${settingsData.connectionEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Respond to New Connections</span>
              </div>
            </div>

            <div className={`space-y-4 ${!settingsData.connectionEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Response Template</label>
                <textarea
                  className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-3 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
                  value={settingsData.connectionPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, connectionPrompt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
                  value={settingsData.connectionDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, connectionDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyword Triggers</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-[#F3F2EF] rounded-lg">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.keywordEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, keywordEnabled: enabled })}
                  className={`${settingsData.keywordEnabled ? 'bg-[#0A66C2]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2`}
                >
                  <span className={`${settingsData.keywordEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Enable Keyword Triggers</span>
              </div>
            </div>

            <div className={`space-y-4 ${!settingsData.keywordEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              {(settingsData.keywordSettings || []).map((setting, index) => (
                <div key={index} className="flex flex-col gap-3 p-4 bg-[#F3F2EF] rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Keyword</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
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
                      className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
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
                      className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
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
                className="text-sm font-medium text-[#0A66C2] hover:text-[#004182]"
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

export default LinkedInReactions; 