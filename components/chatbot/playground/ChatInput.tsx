import React from 'react';
import { IconSend } from "@tabler/icons-react";
import { ChatConfig } from './types';

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  config: ChatConfig;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  handleSubmit,
  isLoading,
  config,
  disabled
}) => {
  return (
    <form 
      onSubmit={handleSubmit} 
      className={`border-t p-3 ${config.theme === 'dark' ? 'border-gray-800 bg-gray-900' : ''}`}
    >
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={config.messagePlaceholder}
          className={`w-full p-3 pr-10 border focus:outline-none focus:border-blue-500 text-sm ${
            config.roundedChatCorners ? 'rounded-lg' : 'rounded-md'
          } ${config.theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim() || disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full disabled:opacity-50"
          style={{
            backgroundColor: !isLoading && input.trim() && !disabled ? config.userMessageColor : 'transparent',
            color: !isLoading && input.trim() && !disabled ? 'white' : config.theme === 'dark' ? '#9ca3af' : 'gray'
          }}
        >
          <IconSend className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
