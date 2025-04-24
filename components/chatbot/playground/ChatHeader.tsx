import React from 'react';
import { IconRefresh, IconX } from "@tabler/icons-react";
import { ChatConfig } from './types';

interface ChatHeaderProps {
  config: ChatConfig;
  handleRefresh: () => void;
  isMobile: boolean;
  disabled: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  config,
  handleRefresh,
  isMobile,
  disabled
}) => {
  return (
    <div
      className={`flex items-center justify-between p-3 border-b ${
        config.roundedHeaderCorners ? 'rounded-t-xl' : ''
      }`}
      style={{
        backgroundColor: config.syncColors ? config.userMessageColor :
          config.theme === 'dark' ? '#1e3a8a' : undefined, // Dark blue for dark theme
        color: config.syncColors || config.theme === 'dark' ? 'white' : undefined
      }}
    >
      <div className="flex items-center gap-3">
        {/* Profile Picture */}
        {config.profilePictureUrl && (
          <div
            className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden"
            style={{
              backgroundImage: `url(${config.profilePictureUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        )}
        <div className="font-medium">{config.displayName}</div>
      </div>
      <div className="flex justify-center items-center">
        <button
          onClick={handleRefresh}
          className={`p-1.5 rounded-full ${
            config.syncColors
              ? 'hover:bg-white/10 text-white'
              : 'hover:bg-gray-100'
          }`}
          disabled={disabled}
        >
          <IconRefresh className="w-4 h-4" />
        </button>
        <button
          onClick={() => { window.parent.postMessage({ action: 'closeIframe' }, '*') }}
          className={`p-1.5 rounded-full ${
            config.syncColors
              ? 'hover:bg-white/10 text-white'
              : 'hover:bg-gray-100'
          } ${isMobile ? '' : 'hidden'}`}
        >
          <IconX className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
