"use client";

import { useState } from "react";
import { Copy, Eye, EyeOff, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface ApiKey {
  id: string;
  key: string;
  lastFour: string;
}

export function ApiKeysSettings({ teamId }: { teamId: string }) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: "1", key: "f807••••••••c737", lastFour: "c737" }
  ]);
  const [showKey, setShowKey] = useState<string | null>(null);

  const handleCopyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      toast.success("API key copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy API key");
    }
  };

  const handleCreateKey = () => {
    // Here you would typically make an API call to create a new key
    toast.success("New API key created");
  };

  const handleDeleteKey = (id: string) => {
    // Here you would typically make an API call to delete the key
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast.success("API key deleted");
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKey(showKey === id ? null : id);
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl">API Keys</h2>
            <p className="text-gray-500 mt-2">
              Manage your API keys. Click on a key to copy it to your clipboard key value.
            </p>
          </div>
          <button
            onClick={handleCreateKey}
            className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg"
          >
            <span>+</span>
            Create API Key
          </button>
        </div>

        <div className="mt-6 rounded-xl border">
          {apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex-1 flex items-center gap-4">
                <div
                  className="flex-1 font-mono cursor-pointer"
                  onClick={() => handleCopyKey(apiKey.key)}
                >
                  {showKey === apiKey.id ? apiKey.key : apiKey.key.replace(/[^•]/g, "•")}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyKey(apiKey.key)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    {showKey === apiKey.id ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteKey(apiKey.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {apiKeys.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No API keys found. Create one to get started.
            </div>
          )}
        </div>
      </div>
    </>
  );
} 