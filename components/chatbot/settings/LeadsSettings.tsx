"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CustomNotification } from './GeneralSettings'
import toast from "react-hot-toast";
import { IconTrash, IconRefresh, IconFile, IconDownload, IconEye, IconImageInPicture, IconPdf } from "@tabler/icons-react";

interface LeadsSettingsProps {
  chatbotId: string;
}

export default function LeadsSettings({ chatbotId }: LeadsSettingsProps) {
  const [title, setTitle] = useState("Let us know how to contact you");
  const [nameEnabled, setNameEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [phoneEnabled, setPhoneEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [delay, setDelay] = useState(1);
  const [enableLead, setEnableLead] = useState('never');
  const [leads, setLeads] = useState([]);
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);

  useEffect(() => {
    fetchSettings();
    fetchLeads();
  }, [chatbotId]);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`/api/chatbot/lead?chatbotId=${chatbotId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setLeads(data);
    } catch (error) {
      toast.error("Failed to load leads " + error.message)
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/chatbot/leads-settings?chatbotId=${chatbotId}`);
      const data = await response.json();

      if (data) {
        setTitle(data.title || "Let us know how to contact you");
        setNameEnabled(data.nameEnabled ?? true);
        setEmailEnabled(data.emailEnabled ?? true);
        setPhoneEnabled(data.phoneEnabled ?? true);
        setDelay(data.delay ?? 0);
        setEnableLead(data.enableLead);
        setCustomQuestions(data?.customQuestions);
      }
    } catch (error) {
      toast.error("Failed to load settings " + error.message);
    }
  };

  const handleSave = async () => {
    // Check if at least one setting is enabled
    if (!nameEnabled && !emailEnabled && !phoneEnabled) {
      setNotification({
        message: "At least one setting must be enabled in Name, Email, Phone",
        type: "error"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/chatbot/leads-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatbotId,
          title,
          nameEnabled,
          emailEnabled,
          phoneEnabled,
          delay,
          enableLead,
          customQuestions
        }),
      });

      if (!response.ok) throw new Error();
      
      toast.success('Settings saved successfully.')
    } catch (error) {
      toast.error('Failed to save settings.')
    }
    setLoading(false);
  };

  const handleReset = () => {
    setTitle("Let us know how to contact you");
  };

  const checkAndUpdate = (setter: React.Dispatch<React.SetStateAction<boolean>>, updatable: boolean, value: boolean) => {
    if (updatable) {
      toast.error("At least one setting must be enabled")
    } else {
      setter(value);
    }
  };

  const handleAddQuestion = () => {
        // Check if there's an empty question
        if (customQuestions.some(question => question.trim() === "")) {
          toast.error("Please fill out all questions before adding a new one.");
          return;
        }

    setCustomQuestions([...customQuestions, ""]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...customQuestions];
    newQuestions[index] = value;
    setCustomQuestions(newQuestions);
  };

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = [...customQuestions];
    newQuestions.splice(index, 1);
    setCustomQuestions(newQuestions);
  };

  return (
    <>
      {notification && (
        <CustomNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="w-full max-w-2xl">
        <div className="space-y-6">
          <p className="text-sm text-gray-500">
            Note: Leads form only appears when chatting through the iframe or the chat bubble.
          </p>

          {/* enableLead Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-base font-medium">When to show</label>
            </div>
            <select
              value={enableLead}
              //@ts-ignore
              onChange={(e) => setEnableLead(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="immediately">Immediately</option>
              <option value="after">After (x) messages</option>
              <option value="never">Never</option>
            </select>
          </div>

          {/* Delay Field */}
          {
            enableLead == "after" &&
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-base font-medium">Delay</label>
              </div>
              <input
                type="number"
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Enter delay in messages"
                min={1}
              />
            </div>
          }

          {/* Title Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-base font-medium">Title</label>
              <button
                onClick={handleReset}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Reset
              </button>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Enter form title"
            />
          </div>

          {/* Fields Section */}
          <div className="space-y-4">

            {/* Name Field */}
            <div className="flex items-center justify-between py-4 border-t">
              <label className="text-base font-medium">Name</label>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={nameEnabled}
                  onChange={(e) => checkAndUpdate(setNameEnabled, nameEnabled && !emailEnabled && !phoneEnabled, e.target.checked)}
                  className="peer sr-only"
                  id="name-toggle"
                />
                <label
                  htmlFor="name-toggle"
                  className={`absolute cursor-pointer rounded-full w-12 h-6 
                            ${nameEnabled ? 'bg-violet-600' : 'bg-gray-200'}
                            transition-colors duration-300 ease-in-out
                            before:content-[''] before:absolute before:w-4 before:h-4 
                            before:bg-white before:rounded-full before:top-1 before:left-1
                            before:transition-transform before:duration-300 before:ease-in-out
                            peer-checked:before:translate-x-6`}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="flex items-center justify-between py-4 border-t">
              <label className="text-base font-medium">Email</label>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={(e) => checkAndUpdate(setEmailEnabled, !nameEnabled && emailEnabled && !phoneEnabled, e.target.checked)}
                  className="peer sr-only"
                  id="email-toggle"
                />
                <label
                  htmlFor="email-toggle"
                  className={`absolute cursor-pointer rounded-full w-12 h-6 
                            ${emailEnabled ? 'bg-violet-600' : 'bg-gray-200'}
                            transition-colors duration-300 ease-in-out
                            before:content-[''] before:absolute before:w-4 before:h-4 
                            before:bg-white before:rounded-full before:top-1 before:left-1
                            before:transition-transform before:duration-300 before:ease-in-out
                            peer-checked:before:translate-x-6`}
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="flex items-center justify-between py-4 border-t">
              <label className="text-base font-medium">Phone</label>
              <div className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={phoneEnabled}
                  onChange={(e) => checkAndUpdate(setPhoneEnabled, !nameEnabled && !emailEnabled && phoneEnabled, e.target.checked)}
                  className="peer sr-only"
                  id="phone-toggle"
                />
                <label
                  htmlFor="phone-toggle"
                  className={`absolute cursor-pointer rounded-full w-12 h-6 
                            ${phoneEnabled ? 'bg-violet-600' : 'bg-gray-200'}
                            transition-colors duration-300 ease-in-out
                            before:content-[''] before:absolute before:w-4 before:h-4 
                            before:bg-white before:rounded-full before:top-1 before:left-1
                            before:transition-transform before:duration-300 before:ease-in-out
                            peer-checked:before:translate-x-6`}
                />
              </div>
            </div>
          </div>

          {/* Custom Questions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-base font-medium">Custom Questions</label>
              <button
                onClick={handleAddQuestion}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md bg-gray-300"
              >
                Add Question
              </button>
            </div>
        {customQuestions.map((question, index) => (
          <div className="flex items-center space-x-2">
            <input
              key={index}
              type="text"
              value={question}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Enter custom question"
            />
            <button
              onClick={() => handleDeleteQuestion(index)}
              className="text-red-500 hover:text-red-700 flex"
            >
              <IconTrash className="w-5 h-5"  />
            </button>
          </div>
        ))}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

      </div>
    </>
  );
} 