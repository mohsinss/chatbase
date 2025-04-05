"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconInfoCircle } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";

const WordPressReactions = () => {
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
  const [settingsData, setSettingsData] = useState({
    prompt: "",
    delay: 0,
    commentEnabled: false,
    commentPrompt: "Thanks for your comment! How can I help?",
    commentDelay: 0,
    contactFormEnabled: false,
    contactFormPrompt: "Thanks for reaching out! I'll get back to you soon.",
    contactFormDelay: 0,
    pageSpecificEnabled: false,
    pageSpecificSettings: [],
    keywordEnabled: false,
    keywordSettings: []
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900">WordPress Reactions</h1>
      <p className="mt-2 text-gray-600">Manage your WordPress chatbot reactions and settings.</p>
      
      <div className="flex flex-col gap-6 mt-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comment Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.commentEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, commentEnabled: enabled })}
                  className={`${settingsData.commentEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.commentPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, commentPrompt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.commentDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, commentDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Form Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.contactFormEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, contactFormEnabled: enabled })}
                  className={`${settingsData.contactFormEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span className={`${settingsData.contactFormEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Respond to Contact Form Submissions</span>
              </div>
            </div>

            <div className={`space-y-4 ${!settingsData.contactFormEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Response Template</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.contactFormPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, contactFormPrompt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.contactFormDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, contactFormDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Page-Specific Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.pageSpecificEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, pageSpecificEnabled: enabled })}
                  className={`${settingsData.pageSpecificEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span className={`${settingsData.pageSpecificEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Enable Page-Specific Settings</span>
              </div>
            </div>

            <div className={`space-y-4 ${!settingsData.pageSpecificEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              {(settingsData.pageSpecificSettings || []).map((setting, index) => (
                <div key={index} className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Page URL</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="text-sm font-medium text-blue-500 hover:text-blue-700"
              >
                + Add Page Setting
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyword Triggers</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.keywordEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, keywordEnabled: enabled })}
                  className={`${settingsData.keywordEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span className={`${settingsData.keywordEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Enable Keyword Triggers</span>
              </div>
            </div>

            <div className={`space-y-4 ${!settingsData.keywordEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              {(settingsData.keywordSettings || []).map((setting, index) => (
                <div key={index} className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Keyword</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter response for this keyword"
                      value={setting.response}
                      onChange={(e) => {
                        const newSettings = [...(settingsData.keywordSettings || [])];
                        newSettings[index].response = e.target.value;
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
                  const newSettings = [...(settingsData.keywordSettings || []), { keyword: '', response: '' }];
                  setSettingsData({ ...settingsData, keywordSettings: newSettings });
                }}
                className="text-sm font-medium text-blue-500 hover:text-blue-700"
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

export default WordPressReactions; 