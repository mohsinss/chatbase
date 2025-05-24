"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconBrandInstagram, IconPlus, IconTrash, IconAlertTriangle, IconTestPipe } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";

interface InstagramReactionsProps {
  chatbot: {
    integrations: {
      [key: string]: boolean;
    };
    id: string;
    name: string;
  };
}

const InstagramReactions = ({ chatbot }: InstagramReactionsProps) => {
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [settingsData, setSettingsData] = useState({
    prompt: "",
    delay: 0,
    prompt1: "",
    delay1: 0,
    commentDmEnabled: false,
    storyReactionEnabled: false,
    storyReactionPrompt: "Thanks for reacting to my story! What did you think about it?",
    storyReactionDelay: 0,
    commentDmPrompt: "Thanks for your comment! I'd love to continue this conversation in DMs.",
    commentDmDelay: 0,
    keywordDmEnabled: false,
    keywordTriggers: [],
    likeDmEnabled: false,
    likeDmPrompt: "Thanks for liking our post! We're glad you enjoyed it. How can we help you today?",
    likeDmDelay: 0,
    likeDmFirstOnly: false,
    likeDmSpecificPosts: [],
    followDmEnabled: false,
    followDmPrompt: "Thanks for following us! We're excited to connect with you. How can we help?",
    followDmDelay: 0
  });

  const canInteract = isConnected || testMode;

  // Initialize test data when test mode is enabled
  useEffect(() => {
    if (testMode && !isConnected) {
      setSettingsData(prev => ({
        ...prev,
        commentDmEnabled: true,
        storyReactionEnabled: true,
        keywordDmEnabled: true,
        keywordTriggers: [
          { keyword: "help", prompt: "I see you need help! Let me assist you with that.", delay: 2 },
          { keyword: "pricing", prompt: "Great question about pricing! Let me share our current rates with you.", delay: 1 }
        ],
        likeDmEnabled: true,
        followDmEnabled: true
      }));
    }
  }, [testMode, isConnected]);

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

  const addSpecificPost = () => {
    setSettingsData({
      ...settingsData,
      likeDmSpecificPosts: [...(settingsData.likeDmSpecificPosts || []), { postUrl: "", prompt: "", delay: 0 }]
    });
  };

  const removeSpecificPost = (index: number) => {
    const newPosts = [...(settingsData.likeDmSpecificPosts || [])];
    newPosts.splice(index, 1);
    setSettingsData({ ...settingsData, likeDmSpecificPosts: newPosts });
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg overflow-hidden">
      {/* Connection Status Banner */}
      {!isConnected && (
        <div className="bg-orange-50 border-b border-orange-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconAlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-orange-800">Instagram Not Connected</p>
                <p className="text-xs text-orange-600">Connect your Instagram account to enable these features</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={testMode}
                  onChange={setTestMode}
                  className={`${testMode ? 'bg-purple-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
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
                {isConnecting ? "Connecting..." : "Connect Instagram"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconBrandInstagram className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-semibold">Instagram Reactions</h1>
              <p className="mt-1 text-white/80">Manage your Instagram chatbot reactions and automated DMs</p>
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
        {/* Comment-Triggered DMs */}
        <div className="bg-white rounded-lg border border-purple-200 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.commentDmEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, commentDmEnabled: enabled })}
                  disabled={!canInteract}
                  className={`${settingsData.commentDmEnabled ? 'bg-purple-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span className={`${settingsData.commentDmEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <h3 className="text-lg font-semibold text-purple-700">Comment-Triggered DMs</h3>
              </div>
            </div>
          </div>

          <div className={`p-4 space-y-4 ${!settingsData.commentDmEnabled || !canInteract ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment DM Template</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  rows={3}
                  value={settingsData.commentDmPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, commentDmPrompt: e.target.value })}
                  placeholder="Enter message for comment authors..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={settingsData.commentDmDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, commentDmDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Story Reactions */}
        <div className="bg-white rounded-lg border border-purple-200 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.storyReactionEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, storyReactionEnabled: enabled })}
                  disabled={!canInteract}
                  className={`${settingsData.storyReactionEnabled ? 'bg-purple-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span className={`${settingsData.storyReactionEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <h3 className="text-lg font-semibold text-purple-700">Story Reactions</h3>
              </div>
            </div>
          </div>

          <div className={`p-4 space-y-4 ${!settingsData.storyReactionEnabled || !canInteract ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Story Reaction DM Template</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  rows={3}
                  value={settingsData.storyReactionPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, storyReactionPrompt: e.target.value })}
                  placeholder="Enter message for story reactions..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={settingsData.storyReactionDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, storyReactionDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Keyword-Triggered DMs */}
        <div className="bg-white rounded-lg border border-purple-200 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.keywordDmEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, keywordDmEnabled: enabled })}
                  disabled={!canInteract}
                  className={`${settingsData.keywordDmEnabled ? 'bg-purple-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span className={`${settingsData.keywordDmEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <h3 className="text-lg font-semibold text-purple-700">Keyword-Triggered DMs</h3>
              </div>
              <button
                onClick={addKeywordTrigger}
                disabled={!settingsData.keywordDmEnabled || !canInteract}
                className="flex items-center gap-2 px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
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
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
        <div className="bg-white rounded-lg border border-purple-200 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.likeDmEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, likeDmEnabled: enabled })}
                  disabled={!canInteract}
                  className={`${settingsData.likeDmEnabled ? 'bg-purple-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span className={`${settingsData.likeDmEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <h3 className="text-lg font-semibold text-purple-700">Like DMs</h3>
              </div>
              <button
                onClick={addSpecificPost}
                disabled={!settingsData.likeDmEnabled || !canInteract}
                className="flex items-center gap-2 px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                <IconPlus className="w-4 h-4" />
                Add Post
              </button>
            </div>
          </div>

          <div className={`p-4 space-y-4 ${!settingsData.likeDmEnabled || !canInteract ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Like DM Template</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
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
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={settingsData.likeDmDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, likeDmDelay: Number(e.target.value) })}
                />
                <div className="mt-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settingsData.likeDmFirstOnly}
                      onChange={(e) => setSettingsData({ ...settingsData, likeDmFirstOnly: e.target.checked })}
                      className="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Send DM only on first like</span>
                  </label>
                </div>
              </div>
            </div>

            {(settingsData.likeDmSpecificPosts || []).length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Specific Post Settings</h4>
                {(settingsData.likeDmSpecificPosts || []).map((post, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-700">Post {index + 1}</h5>
                      <button
                        onClick={() => removeSpecificPost(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Post URL</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          value={post.postUrl}
                          onChange={(e) => {
                            const newPosts = [...(settingsData.likeDmSpecificPosts || [])];
                            newPosts[index].postUrl = e.target.value;
                            setSettingsData({ ...settingsData, likeDmSpecificPosts: newPosts });
                          }}
                          placeholder="https://instagram.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Prompt</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          value={post.prompt}
                          onChange={(e) => {
                            const newPosts = [...(settingsData.likeDmSpecificPosts || [])];
                            newPosts[index].prompt = e.target.value;
                            setSettingsData({ ...settingsData, likeDmSpecificPosts: newPosts });
                          }}
                          placeholder="Leave empty for default"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Delay</label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          value={post.delay}
                          onChange={(e) => {
                            const newPosts = [...(settingsData.likeDmSpecificPosts || [])];
                            newPosts[index].delay = Number(e.target.value);
                            setSettingsData({ ...settingsData, likeDmSpecificPosts: newPosts });
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

        {/* Follow DMs */}
        <div className="bg-white rounded-lg border border-purple-200 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.followDmEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, followDmEnabled: enabled })}
                  disabled={!canInteract}
                  className={`${settingsData.followDmEnabled ? 'bg-purple-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
                >
                  <span className={`${settingsData.followDmEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <h3 className="text-lg font-semibold text-purple-700">Follow DMs</h3>
              </div>
            </div>
          </div>

          <div className={`p-4 space-y-4 ${!settingsData.followDmEnabled || !canInteract ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Follow DM Template</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  rows={3}
                  value={settingsData.followDmPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, followDmPrompt: e.target.value })}
                  placeholder="Enter message for new followers..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delay (seconds)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={settingsData.followDmDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, followDmDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-purple-200">
          <button 
            disabled={!canInteract}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testMode && !isConnected ? "Save Test Settings" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstagramReactions;
