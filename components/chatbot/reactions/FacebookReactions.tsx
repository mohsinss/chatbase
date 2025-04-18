"use client";

import { IconBrandFacebook } from "@tabler/icons-react";
import { IconLoader, IconTrash } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";
import {
  useSocialReactions,
  SocialReactionsProps,
  SectionTitle,
  ToggleSwitch,
  ResponseTypeSelector,
  TextAreaField,
  NumberField
} from "./SocialReactionsBase";

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
  // Configuration for Facebook
  const config: SocialReactionsProps = {
    chatbot,
    platform: 'facebook',
    apiBasePath: '/api/chatbot/integrations/facebook-page',
    integrationKey: 'messenger',
    primaryColor: 'bg-blue-600',
    headerBgClass: 'bg-[#1877F2]',
    headerIcon: <IconBrandFacebook className="w-8 h-8 text-white" />,
    headerTitle: 'Facebook Reactions',
    headerDescription: 'Manage your Facebook chatbot reactions and settings.'
  };

  // Use the shared hook for social reactions
  const {
    isFetchingSettings,
    isConnecting,
    isSavingSettings,
    pages: facebookPages,
    selectedPageId,
    settingsData,
    setSettingsData,
    saveSettings,
    handlePageChange,
    handleConnect
  } = useSocialReactions(config);

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Facebook header */}
      <div className="sticky top-0 z-10">
        <div className={config.headerBgClass + " text-white p-6"}>
          <div className="flex items-center gap-3 justify-between">
            <div className="flex gap-3">
              {config.headerIcon}
              <div>
                <h1 className="text-2xl font-semibold">{config.headerTitle}</h1>
                <p className="mt-1 text-white/80">{config.headerDescription}</p>
              </div>
            </div>
            <button
              onClick={handleConnect}
              disabled={isConnecting || facebookPages.length !== 0}
              className={`px-4 py-2 rounded-lg  transition-colors text-[#1877F2] bg-white hover:opacity-90"
                `}
            >
              {facebookPages.length !== 0 
                ? "Already Connected" 
                : isConnecting 
                  ? "Connecting..." 
                  : "Connect to Facebook"}
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 p-6 bg-[#F0F2F5]">
          {isFetchingSettings ? (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <IconLoader className="animate-spin w-8 h-8 mx-auto" />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Page Selector */}
              <div className="bg-white p-6 rounded-lg">
                <SectionTitle>Select Facebook Page</SectionTitle>
                <div className="space-y-4">
                  {facebookPages.length === 0 ? (
                    <div className="space-y-4">
                      <p className="text-gray-500">No Facebook pages connected. Please connect a Facebook page first.</p>
                      <button
                        onClick={handleConnect}
                        disabled={isConnecting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        {isConnecting ? "Connecting..." : "Connect Facebook Page"}
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Page</label>
                        <select
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                          value={selectedPageId}
                          onChange={handlePageChange}
                        >
                          {facebookPages.map((page) => (
                            <option key={page._id} value={page._id}>
                              {page.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={saveSettings}
                          disabled={isSavingSettings}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          {isSavingSettings ? (
                            <>
                              <Spinner className="w-4 h-4 mr-2" />
                              Saving...
                            </>
                          ) : (
                            "Save Settings"
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {facebookPages.length !== 0 && (
                <>
                  {/* Messenger Settings */}
                  <div className="bg-white p-6 rounded-lg">
                    <SectionTitle>Messenger Settings</SectionTitle>
                    <div className="space-y-4">
                      <TextAreaField
                        label="Prompt"
                        value={settingsData?.prompt}
                        onChange={(value) => setSettingsData({ ...settingsData, prompt: value })}
                        primaryColor={config.primaryColor}
                      />
                      <NumberField
                        label="Delay (seconds)"
                        value={settingsData?.delay}
                        onChange={(value) => setSettingsData({ ...settingsData, delay: value })}
                        primaryColor={config.primaryColor}
                      />
                    </div>
                  </div>

                  {/* Comment Settings */}
                  <div className="bg-white p-6 rounded-lg">
                    <SectionTitle>Comment Settings</SectionTitle>
                    <div className="space-y-4">
                      <TextAreaField
                        label="Prompt"
                        value={settingsData?.prompt1}
                        onChange={(value) => setSettingsData({ ...settingsData, prompt1: value })}
                        primaryColor={config.primaryColor}
                      />
                      <NumberField
                        label="Delay (seconds)"
                        value={settingsData?.delay1}
                        onChange={(value) => setSettingsData({ ...settingsData, delay1: value })}
                        primaryColor={config.primaryColor}
                      />
                    </div>
                  </div>

                  {/* Comment-Triggered DMs */}
                  <div className="bg-white p-6 rounded-lg">
                    <div className="flex items-center justify-between p-0 bg-white rounded-lg mb-4">
                      <div className="flex items-center gap-3">
                        <ToggleSwitch
                          checked={settingsData?.commentDmEnabled}
                          onChange={(enabled) => setSettingsData({ ...settingsData, commentDmEnabled: enabled })}
                          primaryColor={config.primaryColor}
                        />
                        <h3 className="text-lg font-semibold text-gray-900 mb-0">Comment-Triggered DMs</h3>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className={`space-y-6 ${!settingsData?.commentDmEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                        {/* Welcome DM to New Users */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <ToggleSwitch
                                checked={settingsData?.welcomeDmEnabled}
                                onChange={(enabled) => setSettingsData({ ...settingsData, welcomeDmEnabled: enabled })}
                                primaryColor={config.primaryColor}
                                disabled={!settingsData?.commentDmEnabled}
                              />
                              <span className={`text-sm font-medium ${settingsData?.commentDmEnabled ? 'text-gray-700' : 'text-gray-400'}`}>Send Welcome DM to New Users</span>
                            </div>
                          </div>
                          <div className="mt-4">
                            <ResponseTypeSelector
                              responseType={settingsData?.welcomeDmResponseType}
                              onChange={(type) => setSettingsData({ ...settingsData, welcomeDmResponseType: type })}
                              disabled={!settingsData?.commentDmEnabled}
                              primaryColor={config.primaryColor}
                            />

                            {settingsData?.welcomeDmResponseType !== "template" ? (
                              <TextAreaField
                                label="AI Prompt"
                                value={settingsData?.welcomeDmPrompt || "Welcome! Thanks for engaging with our page. How can I help you today?"}
                                onChange={(value) => setSettingsData({ ...settingsData, welcomeDmPrompt: value })}
                                disabled={!settingsData?.commentDmEnabled}
                                placeholder="Enter a prompt for the AI to generate a response"
                                primaryColor={config.primaryColor}
                              />
                            ) : (
                              <TextAreaField
                                label="Template Response"
                                value={settingsData?.welcomeDmTemplate || ""}
                                onChange={(value) => setSettingsData({ ...settingsData, welcomeDmTemplate: value })}
                                disabled={!settingsData?.commentDmEnabled}
                                placeholder="Enter a fixed template response"
                                primaryColor={config.primaryColor}
                              />
                            )}
                            <div className="mt-2">
                              <NumberField
                                label="Delay (seconds)"
                                value={settingsData?.welcomeDmDelay}
                                onChange={(value) => setSettingsData({ ...settingsData, welcomeDmDelay: value })}
                                disabled={!settingsData?.commentDmEnabled}
                                primaryColor={config.primaryColor}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Send DM to Comment Authors */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <ToggleSwitch
                                checked={settingsData?.replyDmEnabled}
                                onChange={(enabled) => setSettingsData({ ...settingsData, replyDmEnabled: enabled })}
                                primaryColor={config.primaryColor}
                                disabled={!settingsData?.commentDmEnabled}
                              />
                              <span className={`text-sm font-medium ${settingsData?.commentDmEnabled ? 'text-gray-700' : 'text-gray-400'}`}>Send DM to Comment Authors</span>
                            </div>
                          </div>
                          <div className="mt-4">
                            <ResponseTypeSelector
                              responseType={settingsData?.replyDmResponseType}
                              onChange={(type) => setSettingsData({ ...settingsData, replyDmResponseType: type })}
                              disabled={!settingsData?.commentDmEnabled}
                              primaryColor={config.primaryColor}
                            />

                            {settingsData?.replyDmResponseType !== "template" ? (
                              <TextAreaField
                                label="AI Prompt"
                                value={settingsData?.replyDmPrompt || "Thanks for your comment! I'd love to continue this conversation in DM. How can I assist you?"}
                                onChange={(value) => setSettingsData({ ...settingsData, replyDmPrompt: value })}
                                disabled={!settingsData?.commentDmEnabled}
                                placeholder="Enter a prompt for the AI to generate a response"
                                primaryColor={config.primaryColor}
                              />
                            ) : (
                              <TextAreaField
                                label="Template Response"
                                value={settingsData?.replyDmTemplate || ""}
                                onChange={(value) => setSettingsData({ ...settingsData, replyDmTemplate: value })}
                                disabled={!settingsData?.commentDmEnabled}
                                placeholder="Enter a fixed template response"
                                primaryColor={config.primaryColor}
                              />
                            )}
                            <div className="mt-2">
                              <NumberField
                                label="Delay (seconds)"
                                value={settingsData?.replyDmDelay}
                                onChange={(value) => setSettingsData({ ...settingsData, replyDmDelay: value })}
                                disabled={!settingsData?.commentDmEnabled}
                                primaryColor={config.primaryColor}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Keyword-Triggered DMs */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <ToggleSwitch
                                checked={settingsData?.keywordDmEnabled}
                                onChange={(enabled) => setSettingsData({ ...settingsData, keywordDmEnabled: enabled })}
                                primaryColor={config.primaryColor}
                                disabled={!settingsData?.commentDmEnabled}
                              />
                              <span className={`text-sm font-medium ${settingsData?.commentDmEnabled ? 'text-gray-700' : 'text-gray-400'}`}>Keyword-Triggered DMs</span>
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className={`block text-sm font-medium mb-2 ${settingsData?.commentDmEnabled ? 'text-gray-700' : 'text-gray-400'}`}>Keyword Triggers</label>
                            <div className="space-y-3">
                              {(settingsData?.keywordTriggers || []).map((trigger, index) => (
                                <div key={index} className="flex gap-3 items-start">
                                  <div className="flex flex-col w-1/4">
                                    <label className={`block text-sm font-medium ${settingsData?.commentDmEnabled ? 'text-gray-700' : 'text-gray-400'}`}>Keyword</label>
                                    <input
                                      type="text"
                                      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 ${!settingsData?.commentDmEnabled ? 'bg-white' : ''}`}
                                      value={trigger.keyword}
                                      onChange={(e) => {
                                        const newTriggers = [...(settingsData?.keywordTriggers || [])];
                                        newTriggers[index].keyword = e.target.value;
                                        setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                                      }}
                                      disabled={!settingsData?.commentDmEnabled}
                                    />
                                  </div>

                                  <div className="flex flex-col w-1/6">
                                    <label className={`block text-sm font-medium ${settingsData?.commentDmEnabled ? 'text-gray-700' : 'text-gray-400'}`}>Type</label>
                                    <select
                                      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 ${!settingsData?.commentDmEnabled ? 'bg-white' : ''}`}
                                      value={trigger.responseType === "template" ? "template" : "prompt"}
                                      onChange={(e) => {
                                        const newTriggers = [...(settingsData?.keywordTriggers || [])];
                                        newTriggers[index].responseType = e.target.value as "template" | "prompt";
                                        setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                                      }}
                                      disabled={!settingsData?.commentDmEnabled}
                                    >
                                      <option value="prompt">AI Prompt</option>
                                      <option value="template">Template</option>
                                    </select>
                                  </div>

                                  <div className="flex flex-col w-1/3">
                                    {trigger.responseType !== "template" ? (
                                      <div>
                                        <label className={`block text-sm font-medium ${settingsData?.commentDmEnabled ? 'text-gray-700' : 'text-gray-400'}`}>AI Prompt</label>
                                        <div className="space-y-2">
                                          <textarea
                                            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 ${!settingsData?.commentDmEnabled ? 'bg-white' : ''}`}
                                            value={trigger.prompt || ""}
                                            onChange={(e) => {
                                              const newTriggers = [...(settingsData?.keywordTriggers || [])];
                                              newTriggers[index].prompt = e.target.value;
                                              setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                                            }}
                                            disabled={!settingsData?.commentDmEnabled}
                                            placeholder="Enter instructions for the AI to generate a response"
                                            rows={3}
                                          />
                                          <div className="text-xs text-gray-500 italic hidden">
                                            <p>Available variables: <span className="font-mono">{'{user}'}</span>, <span className="font-mono">{'{comment}'}</span>, <span className="font-mono">{'{keyword}'}</span></p>
                                            <p>Example: "Respond to {'{user}'} who mentioned {'{keyword}'} in their comment: {'{comment}'}"</p>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div>
                                        <label className={`block text-sm font-medium ${settingsData?.commentDmEnabled ? 'text-gray-700' : 'text-gray-400'}`}>Template</label>
                                        <textarea
                                          className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 ${!settingsData?.commentDmEnabled ? 'bg-white' : ''}`}
                                          value={trigger.template || ""}
                                          onChange={(e) => {
                                            const newTriggers = [...(settingsData?.keywordTriggers || [])];
                                            newTriggers[index].template = e.target.value;
                                            setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                                          }}
                                          disabled={!settingsData?.commentDmEnabled}
                                          placeholder="Enter a fixed response"
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-col w-1/6">
                                    <label className={`block text-sm font-medium ${settingsData?.commentDmEnabled ? 'text-gray-700' : 'text-gray-400'}`}>Delay (seconds)</label>
                                    <input
                                      type="number"
                                      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 ${!settingsData?.commentDmEnabled ? 'bg-white' : ''}`}
                                      value={trigger.delay || 0}
                                      onChange={(e) => {
                                        const newTriggers = [...(settingsData?.keywordTriggers || [])];
                                        newTriggers[index].delay = Number(e.target.value);
                                        setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                                      }}
                                      disabled={!settingsData?.commentDmEnabled}
                                    />
                                  </div>
                                  <button
                                    onClick={() => {
                                      const newTriggers = [...(settingsData?.keywordTriggers || [])];
                                      newTriggers.splice(index, 1);
                                      setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                                    }}
                                    className={`mt-4 p-1 rounded-full ${settingsData?.commentDmEnabled ? 'text-red-500 hover:text-white hover:bg-red-500' : 'text-gray-400'}`}
                                    disabled={!settingsData?.commentDmEnabled}
                                    title="Delete trigger"
                                  >
                                    <IconTrash className="w-6 h-6 mx-auto" />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => {
                                  const newTriggers = [...(settingsData?.keywordTriggers || []), { keyword: '', prompt: '', delay: 0 }];
                                  setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                                }}
                                className={`text-sm font-medium ${settingsData?.commentDmEnabled ? 'text-blue-500 hover:text-blue-700' : 'text-gray-400'}`}
                                disabled={!settingsData?.commentDmEnabled}
                              >
                                + Add Keyword Trigger
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Like DMs */}
                  <div className="bg-white p-6 rounded-lg">
                    <div className="flex items-center justify-between p-0 bg-white rounded-lg mb-4">
                      <div className="flex items-center gap-3">
                        <ToggleSwitch
                          checked={settingsData?.likeDmEnabled}
                          onChange={(enabled) => setSettingsData({ ...settingsData, likeDmEnabled: enabled })}
                          primaryColor={config.primaryColor}
                        />
                        <h3 className="text-lg font-semibold text-gray-900">Post Like DMs</h3>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className={`space-y-6 ${!settingsData?.likeDmEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <ToggleSwitch
                                checked={settingsData?.likeDmFirstOnly}
                                onChange={(enabled) => setSettingsData({ ...settingsData, likeDmFirstOnly: enabled })}
                                primaryColor={config.primaryColor}
                                disabled={!settingsData?.likeDmEnabled}
                              />
                              <span className="text-sm font-medium text-gray-700">Send DM Only on First Like</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="space-y-4">
                            <TextAreaField
                              label="Default Like DM Prompt"
                              value={settingsData?.likeDmPrompt || "Thanks for liking our post! We're glad you enjoyed it. How can we help you today?"}
                              onChange={(value) => setSettingsData({ ...settingsData, likeDmPrompt: value })}
                              disabled={!settingsData?.likeDmEnabled}
                              primaryColor={config.primaryColor}
                            />
                            <NumberField
                              label="Default Delay (seconds)"
                              value={settingsData?.likeDmDelay}
                              onChange={(value) => setSettingsData({ ...settingsData, likeDmDelay: value })}
                              disabled={!settingsData?.likeDmEnabled}
                              primaryColor={config.primaryColor}
                            />
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-4">Specific Post Settings</h4>
                          <div className="space-y-4">
                            {(settingsData?.likeDmSpecificPosts || []).map((post, index) => (
                              <div key={index} className="flex flex-col gap-3 p-4 bg-white rounded-lg">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Post URL</label>
                                  <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="https://facebook.com/..."
                                    value={post.postUrl}
                                    onChange={(e) => {
                                      const newPosts = [...(settingsData?.likeDmSpecificPosts || [])];
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
                                      const newPosts = [...(settingsData?.likeDmSpecificPosts || [])];
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
                                      const newPosts = [...(settingsData?.likeDmSpecificPosts || [])];
                                      newPosts[index].delay = Number(e.target.value);
                                      setSettingsData({ ...settingsData, likeDmSpecificPosts: newPosts });
                                    }}
                                  />
                                </div>
                                <button
                                  onClick={() => {
                                    const newPosts = [...(settingsData?.likeDmSpecificPosts || [])];
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
                                const newPosts = [...(settingsData?.likeDmSpecificPosts || []), { postUrl: '', prompt: '', delay: undefined }];
                                setSettingsData({ ...settingsData, likeDmSpecificPosts: newPosts });
                              }}
                              className="text-sm font-medium text-blue-500 hover:text-blue-700"
                              disabled={!settingsData?.likeDmEnabled}
                            >
                              + Add Specific Post
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacebookReactions;
