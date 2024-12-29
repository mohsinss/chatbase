"use client";

import { useState } from "react";
import { Info, Pencil, X } from "lucide-react";
import Link from "next/link";

interface OpenAISettingsProps {
  teamId: string;
}

type NotificationType = {
  message: string;
  type: 'success' | 'error';
};

const CustomNotification = ({ message, type, onClose }: NotificationType & { onClose: () => void }) => (
  <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
    type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }`}>
    <div className="flex justify-between items-center">
      <p>{message}</p>
      <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">×</button>
    </div>
  </div>
);

export function OpenAISettings({ teamId }: OpenAISettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [openAIKey, setOpenAIKey] = useState("");
  const [notification, setNotification] = useState<NotificationType | null>(null);

  const handleSave = async () => {
    try {
      // Here you would make an API call to save the OpenAI key
      setIsEditing(false);
      setNotification({
        message: "OpenAI key saved successfully",
        type: "success"
      });
    } catch (error) {
      setNotification({
        message: "Failed to save OpenAI key",
        type: "error"
      });
    }
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

      <div>
        <h2 className="text-2xl">OpenAI Key</h2>

        <div className="mt-6 rounded-xl border p-6">
          <div className="flex items-start gap-2 mb-6">
            <Info className="w-5 h-5 text-gray-500 mt-1" />
            <div className="flex-1">
              <h3 className="font-medium">Notice</h3>
              <p className="text-gray-600">
                If you want to use GPT-4, make sure you have access to it on your OpenAI account. By navigating to{" "}
                <Link href="https://platform.openai.com" className="text-blue-500 hover:underline" target="_blank">
                  OpenAI Platform
                </Link>
                {" "}click on the⚙️ settings page, and check the Limits Tab. You can find more info{" "}
                <Link href="#" className="text-blue-500 hover:underline">
                  here
                </Link>
              </p>
            </div>
          </div>

          {!isEditing ? (
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="font-mono">
                You have not set an OpenAI Key.
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="password"
                value={openAIKey}
                onChange={(e) => setOpenAIKey(e.target.value)}
                placeholder="sk-..."
                className="w-full p-3 rounded-lg border"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-black text-white"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 