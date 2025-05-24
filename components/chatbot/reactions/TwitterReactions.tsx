"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconInfoCircle, IconBrandTwitter, IconPlus, IconTrash, IconAlertTriangle, IconTestPipe } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";

const TwitterReactions = () => {
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [testMode, setTestMode] = useState(false);
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

  const canInteract = isConnected || testMode;

  // Initialize test data when test mode is enabled
  useEffect(() => {
    if (testMode && !isConnected) {
      setSettingsData(prev => ({
        ...prev,
        replyDmEnabled: true,
        keywordDmEnabled: true,
        keywordTriggers: [
          { keyword: "help", prompt: "I see you need help! Let me assist you with that.", delay: 2 },
          { keyword: "pricing", prompt: "Great question about pricing! Let me share our current rates with you.", delay: 1 }
        ],
        likeDmEnabled: true,
        retweetDmEnabled: true
      }));
    }
  }, [testMode, isConnected]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // TODO: Implement actual Twitter connection logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to Twitter:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const addKeywordTrigger = () => {
    setSettingsData({
      ...settingsData,
      keywordTriggers: [...(settingsData.keywordTriggers || []), { keyword: "", prompt: "", delay: 0 }]
    });
  };

  const removeKeywordTrigger = (index: number) => {
    const newTriggers = [...(settingsData.keywordTriggers || [])];
    newTriggers.splice(index, 1);
    setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
  };

  const addSpecificTweet = (type: 'like' | 'retweet') => {
    const field = type === 'like' ? 'likeDmSpecificTweets' : 'retweetDmSpecificTweets';
    setSettingsData({
      ...settingsData,
      [field]: [...(settingsData[field] || []), { tweetUrl: "", prompt: "", delay: 0 }]
    });
  };

  const removeSpecificTweet = (index: number, type: 'like' | 'retweet') => {
    const field = type === 'like' ? 'likeDmSpecificTweets' : 'retweetDmSpecificTweets';
    const newTweets = [...(settingsData[field] || [])];
    newTweets.splice(index, 1);
    setSettingsData({ ...settingsData, [field]: newTweets });
  };

  return (
    <div className="bg-sky-50 border border-sky-200 rounded-lg overflow-hidden">
      {/* Connection Status Banner */}
      {!isConnected && (
        <div className="bg-orange-50 border-b border-orange-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconAlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-orange-800">Twitter Not Connected</p>
                <p className="text-xs text-orange-600">Connect your Twitter account to enable these features</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={testMode}
                  onChange={setTestMode}
                  className={`${testMode ? 'bg-sky-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                  <span className={`${testMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <div className="flex items-center gap-1">
                  <IconTestPipe className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Test Mode</span>
                </div>
              </div>
              <button 
                onClick={handleConnect}
                disabled={isConnecting}
                className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {isConnecting ? "Connecting..." : "Connect Twitter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-500 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconBrandTwitter className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-semibold">Twitter Reactions</h1>
              <p className="mt-1 text-white/80">Manage your Twitter chatbot reactions and automated DMs</p>
            </div>
          </div>
          {isConnected && (
            <div className="flex items-center gap-2 text-sm bg-white/20 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Connected
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className={`p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto ${!canInteract ? 'opacity-60' : ''}`}>
        {/* Reply-Triggered DMs */}
        <div className="bg-white rounded-lg border border-sky-200 overflow-hidden">
          <div className="p-4 bg-sky-50 border-b border-sky-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.replyDmEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, replyDmEnabled: enabled })}
                  disabled={!canInteract}
                  className={`${settingsData.replyDmEnabled ? 'bg-sky-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span className={`${settingsData.replyDmEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <h3 className="text-lg font-semibold text-sky-700">Reply-Triggered DMs</h3>
              </div>
            </div>
          </div>

          <div className={`p-4 space-y-4 ${!settingsData.replyDmEnabled || !canInteract ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Welcome DM Template</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
                  rows={3}
                  value={settingsData.welcomeDmPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, welcomeDmPrompt: e.target.value })}
                  placeholder="Enter welcome message for new users..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reply DM Template</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
                  rows={3}
                  value={settingsData.replyDmPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, replyDmPrompt: e.target.value })}
                  placeholder="Enter message for reply authors..."
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Delay (seconds)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  value={settingsData.welcomeDmDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, welcomeDmDelay: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reply Delay (seconds)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  value={settingsData.replyDmDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, replyDmDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Keyword-Triggered DMs */}
        <div className="bg-white rounded-lg border border-sky-200 overflow-hidden">
          <div className="p-4 bg-sky-50 border-b border-sky-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.keywordDmEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, keywordDmEnabled: enabled })}
                  disabled={!canInteract}
                  className={`${settingsData.keywordDmEnabled ? 'bg-sky-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span className={`${settingsData.keywordDmEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <h3 className="text-lg font-semibold text-sky-700">Keyword-Triggered DMs</h3>
              </div>
              <button
                onClick={addKeywordTrigger}
                disabled={!settingsData.keywordDmEnabled || !canInteract}
                className="flex items-center gap-2 px-3 py-1 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50"
              >
                <IconPlus className="w-4 h-4" />
                Add Keyword
              </button>
            </div>
          </div>

          <div className={`p-4 space-y-4 ${!settingsData.keywordDmEnabled || !canInteract ? 'opacity-50 pointer-events-none' : ''}`}>
            {(settingsData.keywordTriggers || []).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No keyword triggers configured. Click "Add Keyword" to get started.</p>
              </div>
            ) : (
              (settingsData.keywordTriggers || []).map((trigger, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-700">Keyword Trigger {index + 1}</h4>
                    <button
                      onClick={() => removeKeywordTrigger(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Keyword</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        value={trigger.keyword}
                        onChange={(e) => {
                          const newTriggers = [...(settingsData.keywordTriggers || [])];
                          newTriggers[index].keyword = e.target.value;
                          setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                        }}
                        placeholder="Enter keyword"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Response</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        value={trigger.prompt}
                        onChange={(e) => {
                          const newTriggers = [...(settingsData.keywordTriggers || [])];
                          newTriggers[index].prompt = e.target.value;
                          setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                        }}
                        placeholder="Enter response message"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        value={trigger.delay}
                        onChange={(e) => {
                          const newTriggers = [...(settingsData.keywordTriggers || [])];
                          newTriggers[index].delay = Number(e.target.value);
                          setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Like DMs */}
        <div className="bg-white rounded-lg border border-sky-200 overflow-hidden">
          <div className="p-4 bg-sky-50 border-b border-sky-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.likeDmEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, likeDmEnabled: enabled })}
                  disabled={!canInteract}
                  className={`${settingsData.likeDmEnabled ? 'bg-sky-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span className={`${settingsData.likeDmEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <h3 className="text-lg font-semibold text-sky-700">Like DMs</h3>
              </div>
              <button
                onClick={() => addSpecificTweet('like')}
                disabled={!settingsData.likeDmEnabled || !canInteract}
                className="flex items-center gap-2 px-3 py-1 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50"
              >
                <IconPlus className="w-4 h-4" />
                Add Tweet
              </button>
            </div>
          </div>

          <div className={`p-4 space-y-4 ${!settingsData.likeDmEnabled || !canInteract ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Like DM Template</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
                  rows={3}
                  value={settingsData.likeDmPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, likeDmPrompt: e.target.value })}
                  placeholder="Enter default message for likes..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Delay (seconds)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  value={settingsData.likeDmDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, likeDmDelay: Number(e.target.value) })}
                />
                <div className="mt-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settingsData.likeDmFirstOnly}
                      onChange={(e) => setSettingsData({ ...settingsData, likeDmFirstOnly: e.target.checked })}
                      className="rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                    />
                    <span className="text-sm text-gray-700">Send DM only on first like</span>
                  </label>
                </div>
              </div>
            </div>

            {(settingsData.likeDmSpecificTweets || []).length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Specific Tweet Settings</h4>
                {(settingsData.likeDmSpecificTweets || []).map((tweet, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-700">Tweet {index + 1}</h5>
                      <button
                        onClick={() => removeSpecificTweet(index, 'like')}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tweet URL</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                          value={tweet.tweetUrl}
                          onChange={(e) => {
                            const newTweets = [...(settingsData.likeDmSpecificTweets || [])];
                            newTweets[index].tweetUrl = e.target.value;
                            setSettingsData({ ...settingsData, likeDmSpecificTweets: newTweets });
                          }}
                          placeholder="https://twitter.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Prompt</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                          value={tweet.prompt}
                          onChange={(e) => {
                            const newTweets = [...(settingsData.likeDmSpecificTweets || [])];
                            newTweets[index].prompt = e.target.value;
                            setSettingsData({ ...settingsData, likeDmSpecificTweets: newTweets });
                          }}
                          placeholder="Leave empty for default"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Delay</label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                          value={tweet.delay}
                          onChange={(e) => {
                            const newTweets = [...(settingsData.likeDmSpecificTweets || [])];
                            newTweets[index].delay = Number(e.target.value);
                            setSettingsData({ ...settingsData, likeDmSpecificTweets: newTweets });
                          }}
                          placeholder="Leave empty for default"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Retweet DMs */}
        <div className="bg-white rounded-lg border border-sky-200 overflow-hidden">
          <div className="p-4 bg-sky-50 border-b border-sky-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.retweetDmEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, retweetDmEnabled: enabled })}
                  disabled={!canInteract}
                  className={`${settingsData.retweetDmEnabled ? 'bg-sky-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span className={`${settingsData.retweetDmEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <h3 className="text-lg font-semibold text-sky-700">Retweet DMs</h3>
              </div>
              <button
                onClick={() => addSpecificTweet('retweet')}
                disabled={!settingsData.retweetDmEnabled || !canInteract}
                className="flex items-center gap-2 px-3 py-1 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50"
              >
                <IconPlus className="w-4 h-4" />
                Add Tweet
              </button>
            </div>
          </div>

          <div className={`p-4 space-y-4 ${!settingsData.retweetDmEnabled || !canInteract ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Retweet DM Template</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
                  rows={3}
                  value={settingsData.retweetDmPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, retweetDmPrompt: e.target.value })}
                  placeholder="Enter default message for retweets..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Delay (seconds)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  value={settingsData.retweetDmDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, retweetDmDelay: Number(e.target.value) })}
                />
                <div className="mt-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settingsData.retweetDmFirstOnly}
                      onChange={(e) => setSettingsData({ ...settingsData, retweetDmFirstOnly: e.target.checked })}
                      className="rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                    />
                    <span className="text-sm text-gray-700">Send DM only on first retweet</span>
                  </label>
                </div>
              </div>
            </div>

            {(settingsData.retweetDmSpecificTweets || []).length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Specific Tweet Settings</h4>
                {(settingsData.retweetDmSpecificTweets || []).map((tweet, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-700">Tweet {index + 1}</h5>
                      <button
                        onClick={() => removeSpecificTweet(index, 'retweet')}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tweet URL</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                          value={tweet.tweetUrl}
                          onChange={(e) => {
                            const newTweets = [...(settingsData.retweetDmSpecificTweets || [])];
                            newTweets[index].tweetUrl = e.target.value;
                            setSettingsData({ ...settingsData, retweetDmSpecificTweets: newTweets });
                          }}
                          placeholder="https://twitter.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Prompt</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                          value={tweet.prompt}
                          onChange={(e) => {
                            const newTweets = [...(settingsData.retweetDmSpecificTweets || [])];
                            newTweets[index].prompt = e.target.value;
                            setSettingsData({ ...settingsData, retweetDmSpecificTweets: newTweets });
                          }}
                          placeholder="Leave empty for default"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Delay</label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                          value={tweet.delay}
                          onChange={(e) => {
                            const newTweets = [...(settingsData.retweetDmSpecificTweets || [])];
                            newTweets[index].delay = Number(e.target.value);
                            setSettingsData({ ...settingsData, retweetDmSpecificTweets: newTweets });
                          }}
                          placeholder="Leave empty for default"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-sky-200">
          <button 
            disabled={!canInteract}
            className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testMode && !isConnected ? "Save Test Settings" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwitterReactions; 