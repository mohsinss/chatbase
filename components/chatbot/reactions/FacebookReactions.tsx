"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconInfoCircle, IconBrandFacebook, IconLoader } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface FacebookReactionsProps {
  chatbot: {
    integrations: {
      [key: string]: boolean;
    };
    id: string;
    name: string;
  };
}

const FacebookReactions = ({ chatbot }: FacebookReactionsProps) => {
  const [isFetchingSettings, setIsFetchingSettings] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();
  const [isSavingSettings, setIsSavingSettings] = useState(false);
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
    pageSpecificEnabled: false,
    pageSpecificSettings: [],
    keywordEnabled: false,
    keywordSettings: []
  });

  useEffect(() => {
    fetchSettings(chatbot.id);
    setIsConnected(!!chatbot?.integrations?.['messenger']);
  }, [chatbot]);

  const fetchSettings = async (id: string) => {
    setIsFetchingSettings(true);
    try {
      const response = await fetch(`/api/chatbot/integrations/facebook-page/settings-v1?chatbotId=${chatbot.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }

      const data = await response.json();
      setSettingsData(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to fetch settings.");
    }
    setIsFetchingSettings(false);
  };

  const saveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const response = await fetch(`/api/chatbot/integrations/facebook-page/settings-v1?chatbotId=${chatbot.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...settingsData
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save settings");
      }

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
    setIsSavingSettings(false);
  };

  useEffect(() => {
    setIsConnected(!!chatbot?.integrations?.['messenger']);
  }, [chatbot]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // TODO: Implement actual Facebook connection logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to Facebook:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <>
      {/* Fixed Facebook header */}
      <div className="">
        <div className="bg-[#1877F2] text-white p-6 flex justify-between">
          <div className="flex items-center gap-3">
            <IconBrandFacebook className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl font-semibold">Facebook Reactions</h1>
              <p className="mt-1 text-white/80">Manage your Facebook chatbot reactions and settings.</p>
            </div>
          </div>
          <div className="flex justify-end items-center gap-4">
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`px-4 py-2 rounded-lg text-sm font-medium h-10 transition-colors ${isConnected
                ? "bg-[#42B72A] text-white border border-green-200"
                : "bg-[#1877F2] text-white hover:opacity-90"
                }`}
            >
              {isConnected ? "Already Connected to Facebook" : isConnecting ? "Connecting..." : "Connect to Facebook"}
            </button>
            <button
              onClick={saveSettings}
              disabled={isSavingSettings}
              className={`px-4 py-2 rounded-lg text-sm font-medium h-10 transition-colors ${isSavingSettings
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {isSavingSettings ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable content with top padding for fixed header */}
      <div className="flex flex-1 gap-2 overflow-y-scroll flex-col *:gap-6 p-6 bg-[#F0F2F5] ">
        {isFetchingSettings && <div className="bg-white p-6 rounded-lg shadow-sm">
          <IconLoader className="animate-spin w-8 h-8 mx-auto" />
        </div>}
        {!isFetchingSettings && <>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#F0F2F5] rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.postEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, postEnabled: enabled })}
                    className={`${settingsData.postEnabled ? 'bg-[#1877F2]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2`}
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-[#1877F2] focus:border-[#1877F2]"
                    value={settingsData.postPrompt}
                    onChange={(e) => setSettingsData({ ...settingsData, postPrompt: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1877F2] focus:border-[#1877F2]"
                    value={settingsData.postDelay}
                    onChange={(e) => setSettingsData({ ...settingsData, postDelay: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comment Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#F0F2F5] rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.commentEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, commentEnabled: enabled })}
                    className={`${settingsData.commentEnabled ? 'bg-[#1877F2]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2`}
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-[#1877F2] focus:border-[#1877F2]"
                    value={settingsData.commentPrompt}
                    onChange={(e) => setSettingsData({ ...settingsData, commentPrompt: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1877F2] focus:border-[#1877F2]"
                    value={settingsData.commentDelay}
                    onChange={(e) => setSettingsData({ ...settingsData, commentDelay: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#F0F2F5] rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.messageEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, messageEnabled: enabled })}
                    className={`${settingsData.messageEnabled ? 'bg-[#1877F2]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2`}
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-[#1877F2] focus:border-[#1877F2]"
                    value={settingsData.messagePrompt}
                    onChange={(e) => setSettingsData({ ...settingsData, messagePrompt: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1877F2] focus:border-[#1877F2]"
                    value={settingsData.messageDelay}
                    onChange={(e) => setSettingsData({ ...settingsData, messageDelay: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Page-Specific Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#F0F2F5] rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.pageSpecificEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, pageSpecificEnabled: enabled })}
                    className={`${settingsData.pageSpecificEnabled ? 'bg-[#1877F2]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2`}
                  >
                    <span className={`${settingsData.pageSpecificEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                  </Switch>
                  <span className="text-sm font-medium text-gray-700">Enable Page-Specific Settings</span>
                </div>
              </div>

              <div className={`space-y-4 ${!settingsData.pageSpecificEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                {(settingsData.pageSpecificSettings || []).map((setting, index) => (
                  <div key={index} className="flex flex-col gap-3 p-4 bg-[#F0F2F5] rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Page URL</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1877F2] focus:border-[#1877F2]"
                        placeholder="Enter page URL"
                        value={setting.url}
                        onChange={(e) => {
                          const newSettings = [...(settingsData.pageSpecificSettings || [])];
                          newSettings[index].url = e.target.value;
                          setSettingsData({ ...settingsData, pageSpecificSettings: newSettings });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Custom Prompt</label>
                      <textarea
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1877F2] focus:border-[#1877F2]"
                        placeholder="Enter custom response for this page"
                        value={setting.prompt}
                        onChange={(e) => {
                          const newSettings = [...(settingsData.pageSpecificSettings || [])];
                          newSettings[index].prompt = e.target.value;
                          setSettingsData({ ...settingsData, pageSpecificSettings: newSettings });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Custom Delay (seconds)</label>
                      <input
                        type="number"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1877F2] focus:border-[#1877F2]"
                        value={setting.delay}
                        onChange={(e) => {
                          const newSettings = [...(settingsData.pageSpecificSettings || [])];
                          newSettings[index].delay = Number(e.target.value);
                          setSettingsData({ ...settingsData, pageSpecificSettings: newSettings });
                        }}
                      />
                    </div>
                    <button
                      onClick={() => {
                        const newSettings = [...(settingsData.pageSpecificSettings || [])];
                        newSettings.splice(index, 1);
                        setSettingsData({ ...settingsData, pageSpecificSettings: newSettings });
                      }}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Remove Page Setting
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newSettings = [...(settingsData.pageSpecificSettings || []), { url: '', prompt: '', delay: 0 }];
                    setSettingsData({ ...settingsData, pageSpecificSettings: newSettings });
                  }}
                  className="text-sm font-medium text-[#1877F2] hover:text-[#166FE5]"
                >
                  + Add Page Setting
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyword Triggers</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#F0F2F5] rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settingsData.keywordEnabled}
                    onChange={(enabled) => setSettingsData({ ...settingsData, keywordEnabled: enabled })}
                    className={`${settingsData.keywordEnabled ? 'bg-[#1877F2]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2`}
                  >
                    <span className={`${settingsData.keywordEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                  </Switch>
                  <span className="text-sm font-medium text-gray-700">Enable Keyword Triggers</span>
                </div>
              </div>

              <div className={`space-y-4 ${!settingsData.keywordEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                {(settingsData.keywordSettings || []).map((setting, index) => (
                  <div key={index} className="flex flex-col gap-3 p-4 bg-[#F0F2F5] rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Keyword</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1877F2] focus:border-[#1877F2]"
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
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1877F2] focus:border-[#1877F2]"
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
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1877F2] focus:border-[#1877F2]"
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
                  className="text-sm font-medium text-[#1877F2] hover:text-[#166FE5]"
                >
                  + Add Keyword
                </button>
              </div>
            </div>
          </div>
        </>}
      </div>
    </>
  );
};

export default FacebookReactions; 