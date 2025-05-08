"use client";

import { useState } from "react";
import { Info, Pencil, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface OpenAISettingsProps {
  teamId: string;
}

export function OpenAISettings({ teamId }: OpenAISettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [openAIKey, setOpenAIKey] = useState("");

  const handleSave = async () => {
    try {
      // Here you would make an API call to save the OpenAI key
      setIsEditing(false);
      toast.success("OpenAI key saved successfully");
    } catch (error) {
      toast.error("Failed to save OpenAI key");
    }
  };

  return (
    <>
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