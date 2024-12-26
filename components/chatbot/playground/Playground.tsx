"use client";

import { useState } from "react";
import { IconSend, IconRefresh } from "@tabler/icons-react";

const Playground = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="relative min-h-screen bg-[#fafafa] p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Playground
            <span className="inline-block w-5 h-5 rounded-full border flex items-center justify-center text-sm">?</span>
          </h1>
          <button className="px-4 py-2 border rounded-lg">Compare</button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg">Chatbot 12/26/2024, 12:11:01 AM</h2>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <IconRefresh className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-[calc(100vh-280px)] overflow-y-auto p-4">
            <div>
              <div className="bg-gray-100 rounded-lg p-4 inline-block">
                <p>Hi! What can I help you with?</p>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t p-4">
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message..."
                className="w-full p-4 pr-12 rounded-lg border focus:outline-none focus:border-blue-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600">
                <IconSend className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground; 