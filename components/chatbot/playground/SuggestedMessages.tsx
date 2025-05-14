import React from 'react';
import { ChatConfig } from './types';
import { toast } from 'react-hot-toast';

interface SuggestedMessagesProps {
  config: ChatConfig;
  theme: string;
  handleSendMessage: (message: string) => Promise<void>;
  disabled: boolean;
  showLeadForm: boolean;
}

const SuggestedMessages: React.FC<SuggestedMessagesProps> = ({
  config,
  theme,
  handleSendMessage,
  disabled,
  showLeadForm
}) => {
  if (!config.suggestedMessages) return null;

  const handleSuggestedMessageClick = (message: string) => {
    if (showLeadForm) {
      toast.error('Please submit the form. 🙂');
      return;
    }

    handleSendMessage(message);
  };

  return (
    <div className={`w-full ${theme === 'dark' ? 'bg-gray-900' : ''}`}>
      <div className="flex overflow-x-auto py-2 px-4 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex space-x-2 flex-nowrap">
          {config.suggestedMessages.split('\n').filter(Boolean).map((message: string, i: number) => (
            <button
              key={i}
              className={`whitespace-nowrap flex-shrink-0 px-3 py-1.5 text-xs rounded-full ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-white hover:bg-gray-700' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => handleSuggestedMessageClick(message)}
              disabled={disabled}
            >
              {message}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestedMessages;
