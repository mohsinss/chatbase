"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconInfoCircle, IconBrandTwitter } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";

const TwitterReactions = () => {
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
  const [settingsData, setSettingsData] = useState({
    prompt: "",
    delay: 0,
    prompt1: "",
    delay1: 0,
    replyDmEnabled: false,
    welcomeDmEnabled: false,
    welcomeDmPrompt: "Welcome! Thanks for engaging with our tweet. How can I help you today?",
    welcomeDmDelay: 0,
    replyDmPrompt: "Thanks for your reply! I'd love to continue this conversation in DM. How can I assist you?",
    replyDmDelay: 0,
    keywordDmEnabled: false,
    keywordTriggers: [],
    likeDmEnabled: false,
    likeDmPrompt: "Thanks for liking our tweet! We're glad you enjoyed it. How can we help you today?",
    likeDmDelay: 0,
    likeDmFirstOnly: false,
    likeDmSpecificTweets: [],
    retweetDmEnabled: false,
    retweetDmPrompt: "Thanks for retweeting! We appreciate your support. How can we help you today?",
    retweetDmDelay: 0,
    retweetDmFirstOnly: false,
    retweetDmSpecificTweets: []
  });

  return (
    <div className="p-0">
      <div className="bg-[#1DA1F2] text-white p-6 rounded-t-lg">
        <div className="flex items-center gap-3">
          <IconBrandTwitter className="w-8 h-8 text-white" />
          <div>
            <h1 className="text-2xl font-semibold">Twitter Reactions</h1>
            <p className="mt-1 text-white/80">Manage your Twitter chatbot reactions and settings.</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-6 p-6 bg-[#F7F9F9]">
        <div className="bg-white p-6 rounded-lg shadow-sm">
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

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reply Settings</h3>
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

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reply-Triggered DMs</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.replyDmEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, replyDmEnabled: enabled })}
                  className={`${settingsData.replyDmEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span className={`${settingsData.replyDmEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Enable Reply-Triggered DMs</span>
              </div>
            </div>

            <div className={`space-y-6 ${!settingsData.replyDmEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
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
                    disabled={!settingsData.replyDmEnabled}
                  />
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      value={settingsData.welcomeDmDelay}
                      onChange={(e) => setSettingsData({ ...settingsData, welcomeDmDelay: Number(e.target.value) })}
                      disabled={!settingsData.replyDmEnabled}
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
                    <span className="text-sm font-medium text-gray-700">Send DM to Reply Authors</span>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Reply DM Template</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                    value={settingsData.replyDmPrompt}
                    onChange={(e) => setSettingsData({ ...settingsData, replyDmPrompt: e.target.value })}
                    disabled={!settingsData.replyDmEnabled}
                  />
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      value={settingsData.replyDmDelay}
                      onChange={(e) => setSettingsData({ ...settingsData, replyDmDelay: Number(e.target.value) })}
                      disabled={!settingsData.replyDmEnabled}
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
                          disabled={!settingsData.replyDmEnabled}
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
                          disabled={!settingsData.replyDmEnabled}
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
                            disabled={!settingsData.replyDmEnabled}
                          />
                        </div>
                        <button
                          onClick={() => {
                            const newTriggers = [...(settingsData.keywordTriggers || [])];
                            newTriggers.splice(index, 1);
                            setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                          }}
                          className="mt-1 text-red-500 hover:text-red-700"
                          disabled={!settingsData.replyDmEnabled}
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
                      disabled={!settingsData.replyDmEnabled}
                    >
                      + Add Keyword Trigger
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Like DMs</h3>
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
                <span className="text-sm font-medium text-gray-700">Send DM After Tweet Like</span>
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
                <h4 className="text-sm font-medium text-gray-700 mb-4">Specific Tweet Settings</h4>
                <div className="space-y-4">
                  {(settingsData.likeDmSpecificTweets || []).map((tweet, index) => (
                    <div key={index} className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tweet URL</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://twitter.com/..."
                          value={tweet.tweetUrl}
                          onChange={(e) => {
                            const newTweets = [...(settingsData.likeDmSpecificTweets || [])];
                            newTweets[index].tweetUrl = e.target.value;
                            setSettingsData({ ...settingsData, likeDmSpecificTweets: newTweets });
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Custom Prompt (optional)</label>
                        <textarea
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Leave empty to use default prompt"
                          value={tweet.prompt}
                          onChange={(e) => {
                            const newTweets = [...(settingsData.likeDmSpecificTweets || [])];
                            newTweets[index].prompt = e.target.value;
                            setSettingsData({ ...settingsData, likeDmSpecificTweets: newTweets });
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Custom Delay (seconds, optional)</label>
                        <input
                          type="number"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Leave empty to use default delay"
                          value={tweet.delay}
                          onChange={(e) => {
                            const newTweets = [...(settingsData.likeDmSpecificTweets || [])];
                            newTweets[index].delay = Number(e.target.value);
                            setSettingsData({ ...settingsData, likeDmSpecificTweets: newTweets });
                          }}
                        />
                      </div>
                      <button
                        onClick={() => {
                          const newTweets = [...(settingsData.likeDmSpecificTweets || [])];
                          newTweets.splice(index, 1);
                          setSettingsData({ ...settingsData, likeDmSpecificTweets: newTweets });
                        }}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove Tweet
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newTweets = [...(settingsData.likeDmSpecificTweets || []), { tweetUrl: '', prompt: '', delay: undefined }];
                      setSettingsData({ ...settingsData, likeDmSpecificTweets: newTweets });
                    }}
                    className="text-sm font-medium text-blue-500 hover:text-blue-700"
                  >
                    + Add Specific Tweet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Retweet DMs</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.retweetDmEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, retweetDmEnabled: enabled })}
                  className={`${settingsData.retweetDmEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span className={`${settingsData.retweetDmEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Send DM After Retweet</span>
              </div>
            </div>

            <div className={`space-y-6 ${!settingsData.retweetDmEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={settingsData.retweetDmFirstOnly}
                      onChange={(enabled) => setSettingsData({ ...settingsData, retweetDmFirstOnly: enabled })}
                      className={`${settingsData.retweetDmFirstOnly ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    />
                    <span className="text-sm font-medium text-gray-700">Send DM Only on First Retweet</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Default Retweet DM Prompt</label>
                    <textarea
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                      value={settingsData.retweetDmPrompt}
                      onChange={(e) => setSettingsData({ ...settingsData, retweetDmPrompt: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Default Delay (seconds)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      value={settingsData.retweetDmDelay}
                      onChange={(e) => setSettingsData({ ...settingsData, retweetDmDelay: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Specific Tweet Settings</h4>
                <div className="space-y-4">
                  {(settingsData.retweetDmSpecificTweets || []).map((tweet, index) => (
                    <div key={index} className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tweet URL</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://twitter.com/..."
                          value={tweet.tweetUrl}
                          onChange={(e) => {
                            const newTweets = [...(settingsData.retweetDmSpecificTweets || [])];
                            newTweets[index].tweetUrl = e.target.value;
                            setSettingsData({ ...settingsData, retweetDmSpecificTweets: newTweets });
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Custom Prompt (optional)</label>
                        <textarea
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Leave empty to use default prompt"
                          value={tweet.prompt}
                          onChange={(e) => {
                            const newTweets = [...(settingsData.retweetDmSpecificTweets || [])];
                            newTweets[index].prompt = e.target.value;
                            setSettingsData({ ...settingsData, retweetDmSpecificTweets: newTweets });
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Custom Delay (seconds, optional)</label>
                        <input
                          type="number"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Leave empty to use default delay"
                          value={tweet.delay}
                          onChange={(e) => {
                            const newTweets = [...(settingsData.retweetDmSpecificTweets || [])];
                            newTweets[index].delay = Number(e.target.value);
                            setSettingsData({ ...settingsData, retweetDmSpecificTweets: newTweets });
                          }}
                        />
                      </div>
                      <button
                        onClick={() => {
                          const newTweets = [...(settingsData.retweetDmSpecificTweets || [])];
                          newTweets.splice(index, 1);
                          setSettingsData({ ...settingsData, retweetDmSpecificTweets: newTweets });
                        }}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove Tweet
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newTweets = [...(settingsData.retweetDmSpecificTweets || []), { tweetUrl: '', prompt: '', delay: undefined }];
                      setSettingsData({ ...settingsData, retweetDmSpecificTweets: newTweets });
                    }}
                    className="text-sm font-medium text-blue-500 hover:text-blue-700"
                  >
                    + Add Specific Tweet
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

export default TwitterReactions; 