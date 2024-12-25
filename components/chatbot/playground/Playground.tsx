"use client";

import { useState } from "react";
import { IconSend, IconRefresh } from "@tabler/icons-react";

const Playground = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">
          Chatbot 12/26/2024, 12:11:01 AM
        </h2>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <IconRefresh className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-100 rounded-lg p-4 inline-block">
            <p>Hi! What can I help you with?</p>
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <div className="border-t p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message..."
              className="w-full p-4 pr-12 rounded-lg border focus:outline-none focus:border-primary"
            />
            <button 
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
            >
              <IconSend className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground; 