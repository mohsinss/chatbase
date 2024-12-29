"use client";

import { useState } from "react";
import { Copy, Eye, EyeOff, Trash2 } from "lucide-react";

interface ApiKey {
  id: string;
  key: string;
  lastFour: string;
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
      <button 
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
    </div>
  </div>
);

export function ApiKeysSettings({ teamId }: { teamId: string }) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: "1", key: "f807••••••••c737", lastFour: "c737" }
  ]);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationType | null>(null);

  const handleCopyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setNotification({
        message: "API key copied to clipboard",
        type: "success"
      });
    } catch (error) {
      setNotification({
        message: "Failed to copy API key",
        type: "error"
      });
    }
  };

  const handleCreateKey = () => {
    // Here you would typically make an API call to create a new key
    setNotification({
      message: "New API key created",
      type: "success"
    });
  };

  const handleDeleteKey = (id: string) => {
    // Here you would typically make an API call to delete the key
    setApiKeys(apiKeys.filter(key => key.id !== id));
    setNotification({
      message: "API key deleted",
      type: "success"
    });
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKey(showKey === id ? null : id);
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