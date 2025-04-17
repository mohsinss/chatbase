"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconInfoCircle, IconBrandInstagram } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";

interface InstagramReactionsProps {
  chatbot: {
    integrations: {
      [key: string]: boolean;
    };
  };
}

const InstagramReactions = ({ chatbot }: InstagramReactionsProps) => {
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
    storyEnabled: false,
    storyPrompt: "Thanks for viewing my story! How can I help?",
    storyDelay: 0,
    hashtagEnabled: false,
    hashtagSettings: []
  });

  useEffect(() => {
    setIsConnected(!!chatbot?.integrations?.['instagram']);
  }, [chatbot]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // TODO: Implement actual Instagram connection logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to Instagram:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Instagram header */}
      <div className="sticky top-0 z-10">
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white p-6">
          <div className="flex items-center gap-3">
            <IconBrandInstagram className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl font-semibold">Instagram Reactions</h1>
              <p className="mt-1 text-white/80">Manage your Instagram chatbot reactions and settings.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 p-6 bg-[#FAFAFA]">
          <div className="flex justify-end">
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isConnected
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border border-purple-200"
                  : "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:opacity-90"
              }`}
            >
              {isConnected ? "Already Connected to Instagram" : isConnecting ? "Connecting..." : "Connect to Instagram"}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.postEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, postEnabled: enabled })}
                    className={`${settingsData.postEnabled ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
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
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-3 focus:ring-purple-500 focus:border-purple-500"
                    value={settingsData.postPrompt}
                    onChange={(e) => setSettingsData({ ...settingsData, postPrompt: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                    value={settingsData.postDelay}
                    onChange={(e) => setSettingsData({ ...settingsData, postDelay: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comment Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.commentEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, commentEnabled: enabled })}
                    className={`${settingsData.commentEnabled ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
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
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-3 focus:ring-purple-500 focus:border-purple-500"
                    value={settingsData.commentPrompt}
                    onChange={(e) => setSettingsData({ ...settingsData, commentPrompt: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                    value={settingsData.commentDelay}
                    onChange={(e) => setSettingsData({ ...settingsData, commentDelay: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.messageEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, messageEnabled: enabled })}
                    className={`${settingsData.messageEnabled ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
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
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-3 focus:ring-purple-500 focus:border-purple-500"
                    value={settingsData.messagePrompt}
                    onChange={(e) => setSettingsData({ ...settingsData, messagePrompt: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                    value={settingsData.messageDelay}
                    onChange={(e) => setSettingsData({ ...settingsData, messageDelay: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Story Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.storyEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, storyEnabled: enabled })}
                    className={`${settingsData.storyEnabled ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
                  >
                    <span className={`${settingsData.storyEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                  </Switch>
                  <span className="text-sm font-medium text-gray-700">Respond to Story Views</span>
                </div>
              </div>

              <div className={`space-y-4 ${!settingsData.storyEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Response Template</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-3 focus:ring-purple-500 focus:border-purple-500"
                    value={settingsData.storyPrompt}
                    onChange={(e) => setSettingsData({ ...settingsData, storyPrompt: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                    value={settingsData.storyDelay}
                    onChange={(e) => setSettingsData({ ...settingsData, storyDelay: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hashtag Triggers</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#FAFAFA] rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.hashtagEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, hashtagEnabled: enabled })}
                    className={`${settingsData.hashtagEnabled ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
                  >
                    <span className={`${settingsData.hashtagEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                  </Switch>
                  <span className="text-sm font-medium text-gray-700">Enable Hashtag Triggers</span>
                </div>
              </div>

              <div className={`space-y-4 ${!settingsData.hashtagEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                {(settingsData.hashtagSettings || []).map((setting, index) => (
                  <div key={index} className="flex flex-col gap-3 p-4 bg-[#FAFAFA] rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hashtag</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Enter hashtag"
                        value={setting.hashtag}
                        onChange={(e) => {
                          const newSettings = [...(settingsData.hashtagSettings || [])];
                          newSettings[index].hashtag = e.target.value;
                          setSettingsData({ ...settingsData, hashtagSettings: newSettings });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Response</label>
                      <textarea
                        className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Enter response for this hashtag"
                        value={setting.prompt}
                        onChange={(e) => {
                          const newSettings = [...(settingsData.hashtagSettings || [])];
                          newSettings[index].prompt = e.target.value;
                          setSettingsData({ ...settingsData, hashtagSettings: newSettings });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Custom Delay (seconds)</label>
                      <input
                        type="number"
                        className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                        value={setting.delay}
                        onChange={(e) => {
                          const newSettings = [...(settingsData.hashtagSettings || [])];
                          newSettings[index].delay = Number(e.target.value);
                          setSettingsData({ ...settingsData, hashtagSettings: newSettings });
                        }}
                      />
                    </div>
                    <button
                      onClick={() => {
                        const newSettings = [...(settingsData.hashtagSettings || [])];
                        newSettings.splice(index, 1);
                        setSettingsData({ ...settingsData, hashtagSettings: newSettings });
                      }}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Remove Hashtag
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newSettings = [...(settingsData.hashtagSettings || []), { hashtag: '', prompt: '', delay: 0 }];
                    setSettingsData({ ...settingsData, hashtagSettings: newSettings });
                  }}
                  className="text-sm font-medium text-purple-500 hover:text-purple-700"
                >
                  + Add Hashtag
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramReactions; 