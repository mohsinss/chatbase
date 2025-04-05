"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconInfoCircle } from "@tabler/icons-react";
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
    prompt1: "",
    delay1: 0,
    commentDmEnabled: false,
    welcomeDmEnabled: false,
    welcomeDmPrompt: "Welcome! Thanks for engaging with our post. How can I help you today?",
    welcomeDmDelay: 0,
    replyDmEnabled: false,
    replyDmPrompt: "Thanks for your comment! I'd love to continue this conversation in DM. How can I assist you?",
    replyDmDelay: 0,
    keywordDmEnabled: false,
    keywordTriggers: [],
    likeDmEnabled: false,
    likeDmPrompt: "Thanks for liking our post! We're glad you enjoyed it. How can we help you today?",
    likeDmDelay: 0,
    likeDmFirstOnly: false,
    likeDmSpecificPosts: []
  });

  useEffect(() => {
    if (chatbot?.integrations) {
      setIsConnected(!!chatbot.integrations['instagram']);
      console.log('Instagram integration status:', chatbot.integrations['instagram']);
    }
  }, [chatbot]);

  const handleConnect = () => {
    setIsConnecting(true);
    router.push(`${window.location.pathname}/../../connect/integrations`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Instagram Reactions</h1>
          <p className="mt-2 text-gray-600">Manage your Instagram chatbot reactions and settings.</p>
        </div>
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isConnected
              ? "bg-gradient-to-r from-green-400 via-green-500 to-purple-400 text-white border border-green-200"
              : "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:opacity-90"
          }`}
        >
          {isConnected ? "Connected to Instagram" : isConnecting ? "Connecting..." : "Connect to Instagram"}
        </button>
      </div>
      
      <div className="flex flex-col gap-6 mt-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Direct Message Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Prompt</label>
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                value={settingsData.prompt}
                onChange={(e) => setSettingsData({ ...settingsData, prompt: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
              <input
                type="number"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={settingsData.delay}
                onChange={(e) => setSettingsData({ ...settingsData, delay: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comment Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Prompt</label>
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                value={settingsData.prompt1}
                onChange={(e) => setSettingsData({ ...settingsData, prompt1: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
              <input
                type="number"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                value={settingsData.delay1}
                onChange={(e) => setSettingsData({ ...settingsData, delay1: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comment-Triggered DMs</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.commentDmEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, commentDmEnabled: enabled })}
                  className={`${settingsData.commentDmEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span className={`${settingsData.commentDmEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Enable Comment-Triggered DMs</span>
              </div>
            </div>

            <div className={`space-y-6 ${!settingsData.commentDmEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={settingsData.welcomeDmEnabled}
                      onChange={(enabled) => setSettingsData({ ...settingsData, welcomeDmEnabled: enabled })}
                      className={`${settingsData.welcomeDmEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    />
                    <span className="text-sm font-medium text-gray-700">Send Welcome DM to New Users</span>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Welcome DM Template</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                    value={settingsData.welcomeDmPrompt}
                    onChange={(e) => setSettingsData({ ...settingsData, welcomeDmPrompt: e.target.value })}
                    disabled={!settingsData.commentDmEnabled}
                  />
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      value={settingsData.welcomeDmDelay}
                      onChange={(e) => setSettingsData({ ...settingsData, welcomeDmDelay: Number(e.target.value) })}
                      disabled={!settingsData.commentDmEnabled}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={settingsData.replyDmEnabled}
                      onChange={(enabled) => setSettingsData({ ...settingsData, replyDmEnabled: enabled })}
                      className={`${settingsData.replyDmEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    />
                    <span className="text-sm font-medium text-gray-700">Send DM to Comment Authors</span>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Comment Reply DM Template</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                    value={settingsData.replyDmPrompt}
                    onChange={(e) => setSettingsData({ ...settingsData, replyDmPrompt: e.target.value })}
                    disabled={!settingsData.commentDmEnabled}
                  />
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      value={settingsData.replyDmDelay}
                      onChange={(e) => setSettingsData({ ...settingsData, replyDmDelay: Number(e.target.value) })}
                      disabled={!settingsData.commentDmEnabled}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={settingsData.keywordDmEnabled}
                      onChange={(enabled) => setSettingsData({ ...settingsData, keywordDmEnabled: enabled })}
                      className={`${settingsData.keywordDmEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    />
                    <span className="text-sm font-medium text-gray-700">Keyword-Triggered DMs</span>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Keyword Triggers</label>
                  <div className="space-y-3">
                    {(settingsData.keywordTriggers || []).map((trigger, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <input
                          type="text"
                          className="mt-1 block w-1/3 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Keyword"
                          value={trigger.keyword}
                          onChange={(e) => {
                            const newTriggers = [...(settingsData.keywordTriggers || [])];
                            newTriggers[index].keyword = e.target.value;
                            setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                          }}
                          disabled={!settingsData.commentDmEnabled}
                        />
                        <textarea
                          className="mt-1 block w-1/3 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="DM Prompt"
                          value={trigger.prompt}
                          onChange={(e) => {
                            const newTriggers = [...(settingsData.keywordTriggers || [])];
                            newTriggers[index].prompt = e.target.value;
                            setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                          }}
                          disabled={!settingsData.commentDmEnabled}
                        />
                        <div className="flex flex-col w-1/6">
                          <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                          <input
                            type="number"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            value={trigger.delay || 0}
                            onChange={(e) => {
                              const newTriggers = [...(settingsData.keywordTriggers || [])];
                              newTriggers[index].delay = Number(e.target.value);
                              setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                            }}
                            disabled={!settingsData.commentDmEnabled}
                          />
                        </div>
                        <button
                          onClick={() => {
                            const newTriggers = [...(settingsData.keywordTriggers || [])];
                            newTriggers.splice(index, 1);
                            setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                          }}
                          className="mt-1 text-red-500 hover:text-red-700"
                          disabled={!settingsData.commentDmEnabled}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newTriggers = [...(settingsData.keywordTriggers || []), { keyword: '', prompt: '', delay: 0 }];
                        setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                      }}
                      className="text-sm font-medium text-blue-500 hover:text-blue-700"
                      disabled={!settingsData.commentDmEnabled}
                    >
                      + Add Keyword Trigger
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Like DMs</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.likeDmEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, likeDmEnabled: enabled })}
                  className={`${settingsData.likeDmEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span className={`${settingsData.likeDmEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Send DM After Post Like</span>
              </div>
            </div>

            <div className={`space-y-6 ${!settingsData.likeDmEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={settingsData.likeDmFirstOnly}
                      onChange={(enabled) => setSettingsData({ ...settingsData, likeDmFirstOnly: enabled })}
                      className={`${settingsData.likeDmFirstOnly ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    />
                    <span className="text-sm font-medium text-gray-700">Send DM Only on First Like</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Default Like DM Prompt</label>
                    <textarea
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                      value={settingsData.likeDmPrompt}
                      onChange={(e) => setSettingsData({ ...settingsData, likeDmPrompt: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Default Delay (seconds)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      value={settingsData.likeDmDelay}
                      onChange={(e) => setSettingsData({ ...settingsData, likeDmDelay: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Specific Post Settings</h4>
                <div className="space-y-4">
                  {(settingsData.likeDmSpecificPosts || []).map((post, index) => (
                    <div key={index} className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Post URL</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://instagram.com/..."
                          value={post.postUrl}
                          onChange={(e) => {
                            const newPosts = [...(settingsData.likeDmSpecificPosts || [])];
                            newPosts[index].postUrl = e.target.value;
                            setSettingsData({ ...settingsData, likeDmSpecificPosts: newPosts });
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Custom Prompt (optional)</label>
                        <textarea
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Leave empty to use default prompt"
                          value={post.prompt}
                          onChange={(e) => {
                            const newPosts = [...(settingsData.likeDmSpecificPosts || [])];
                            newPosts[index].prompt = e.target.value;
                            setSettingsData({ ...settingsData, likeDmSpecificPosts: newPosts });
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Custom Delay (seconds, optional)</label>
                        <input
                          type="number"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Leave empty to use default delay"
                          value={post.delay}
                          onChange={(e) => {
                            const newPosts = [...(settingsData.likeDmSpecificPosts || [])];
                            newPosts[index].delay = Number(e.target.value);
                            setSettingsData({ ...settingsData, likeDmSpecificPosts: newPosts });
                          }}
                        />
                      </div>
                      <button
                        onClick={() => {
                          const newPosts = [...(settingsData.likeDmSpecificPosts || [])];
                          newPosts.splice(index, 1);
                          setSettingsData({ ...settingsData, likeDmSpecificPosts: newPosts });
                        }}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove Post
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newPosts = [...(settingsData.likeDmSpecificPosts || []), { postUrl: '', prompt: '', delay: undefined }];
                      setSettingsData({ ...settingsData, likeDmSpecificPosts: newPosts });
                    }}
                    className="text-sm font-medium text-blue-500 hover:text-blue-700"
                  >
                    + Add Specific Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramReactions; 