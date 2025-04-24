import React from 'react';
import { Message } from './types';

interface MessageDisplayProps {
  message: Message;
  isUserMessage: boolean;
  roundedChatCorners: boolean;
  theme: string;
  userMessageColor: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({
  message,
  isUserMessage,
  roundedChatCorners,
  theme,
  userMessageColor
}) => {
  const getBackgroundColor = (confidenceScore: number) => {
    if (confidenceScore === -1) {
      return 'rgb(241, 241, 241)';
    }
    const normalizedScore = confidenceScore / 100;

    // Calculate the color based on the normalized score
    const red = Math.max(256 - Math.floor(normalizedScore * 15), 0); // Red decreases as score increases
    const green = Math.min(Math.floor(normalizedScore * 241), 241); // Green increases as score increases
    const blue = 241; // Keep blue constant

    return `rgb(${red}, ${green}, ${blue})`; // Return the RGB color
  };

  const getTextColor = (confidenceScore: number) => {
    const bgColor = getBackgroundColor(confidenceScore);
    const rgb = bgColor.match(/\d+/g)?.map(Number) || [255, 255, 255];

    // Calculate luminance
    const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]);

    // Return black for bright backgrounds, white for dark backgrounds
    return luminance > 186 ? '#000000' : '#FFFFFF';
  };

  return (
    <div className={`mb-4 ${isUserMessage ? 'flex justify-end' : ''}`}>
      <div 
        className={`p-3 inline-block max-w-[80%] ${
          roundedChatCorners ? 'rounded-xl' : 'rounded-lg'
        } ${
          isUserMessage
            ? 'text-white'
            : (theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-black') + ' prose prose-sm bg-gray-50'
        }`}
        style={{
          backgroundColor: isUserMessage ? userMessageColor : undefined,
          transition: 'background-color 0.3s ease'
        }}
      >
        {message.reasonal_content && (
          <p className="p-1 rounded-sm bg-slate-100 pb-3 hidden">{message.reasonal_content}</p>
        )}
        
        {isUserMessage ? (
          <p className="p-1">{message.content}</p>
        ) : (
          <div className="html-content" dangerouslySetInnerHTML={{ __html: message.content }} />
        )}
        
        {!isUserMessage && message.confidenceScore !== -1 && (
          <div className="mt-2">
            <span 
              style={{
                backgroundColor: getBackgroundColor(message.confidenceScore),
                color: getTextColor(message.confidenceScore),
                padding: '2px 4px', 
                borderRadius: '4px'
              }}
            >
              {message.confidenceScore}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageDisplay;
