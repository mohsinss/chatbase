import { Message } from "./types";
import { memo } from "react";

// Define types for different message content formats
interface ImageContent {
  type: 'image';
  image: string;
}

interface ButtonReply {
  id: string;
  title: string;
}

interface ListRow {
  id: string;
  title: string;
  description?: string;
}

interface InteractiveButton {
  type: 'interactive';
  interactive: {
    type: 'button';
    body: {
      text: string;
    };
    action: {
      buttons: Array<{
        reply: ButtonReply;
      }>;
    };
  };
}

interface InteractiveList {
  type: 'interactive';
  interactive: {
    type: 'list';
    body: {
      text: string;
    };
    footer?: {
      text: string;
    };
    action: {
      button: string;
      sections: Array<{
        title: string;
        rows: ListRow[];
      }>;
    };
  };
}

type MessageContent = ImageContent | InteractiveButton | InteractiveList | string;

interface MessageItemProps {
  message: Message;
  isUserMessage: boolean;
}

// Component for deleted messages
const DeletedMessage = () => (
  <div className="text-red-500 italic text-sm bg-red-100 px-2 py-1 rounded-xl inline-block">
    Message deleted
  </div>
);

// Component for image messages
const ImageMessage = ({ src }: { src: string }) => (
  <img src={src} alt="Chat Image" className="max-w-full h-auto rounded" />
);

// Component for interactive button messages
const InteractiveButtonMessage = ({ 
  bodyText, 
  buttons 
}: { 
  bodyText: string; 
  buttons: Array<{ reply: ButtonReply }> 
}) => (
  <div>
    <p className="mb-2">{bodyText}</p>
    <div className="flex flex-col gap-2">
      {buttons.map((button) => (
        <button
          key={button.reply.id}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={() => console.log(`Button clicked: ${button.reply.title}`)}
        >
          {button.reply.title}
        </button>
      ))}
    </div>
  </div>
);

// Component for interactive list messages
const InteractiveListMessage = ({ 
  bodyText, 
  buttonText,
  sections,
  footerText
}: { 
  bodyText: string;
  buttonText: string;
  sections: Array<{
    title: string;
    rows: ListRow[];
  }>;
  footerText?: string;
}) => (
  <div>
    <p className="mb-2">{bodyText}</p>
    
    <div className="mb-3">
      <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
        {buttonText}
      </button>
    </div>
    
    <div className="border rounded-md overflow-hidden">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="border-b last:border-b-0">
          <div className="bg-gray-100 px-3 py-1 font-medium text-gray-700">
            {section.title}
          </div>
          <div className="divide-y">
            {section.rows.map((row) => (
              <div 
                key={row.id} 
                className="p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => console.log(`List item clicked: ${row.title}`)}
              >
                <div className="font-medium">{row.title}</div>
                {row.description && (
                  <div className="text-sm text-gray-500">{row.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    
    {footerText && (
      <p className="mt-2 text-xs text-gray-500">{footerText}</p>
    )}
  </div>
);

// Component for text messages
const TextMessage = ({ content }: { content: string }) => (
  <div className="html-content" dangerouslySetInnerHTML={{ __html: content }} />
);

// Function to determine message content type and parse if needed
const getMessageContent = (content: string): MessageContent => {
  try {
    const parsed = JSON.parse(content);
    if (parsed?.type === 'image' && parsed.image) {
      return parsed as ImageContent;
    }
    if (parsed?.type === 'interactive') {
      if (parsed.interactive?.type === 'button') {
        return parsed as InteractiveButton;
      }
      if (parsed.interactive?.type === 'list') {
        return parsed as InteractiveList;
      }
    }
    // If it's JSON but not a recognized type, stringify it for display
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    // If it's not valid JSON, return as is
    return content;
  }
};

// Main message component
const MessageItem = memo(({ message, isUserMessage }: MessageItemProps) => {
  // Render message content based on type
  const renderMessageContent = () => {
    if (message?.deleted) {
      return <DeletedMessage />;
    }

    const content = getMessageContent(message.content);

    if (typeof content === 'string') {
      return <TextMessage content={content} />;
    }

    if (content.type === 'image') {
      return <ImageMessage src={content.image} />;
    }

    if (content.type === 'interactive') {
      if (content.interactive.type === 'button') {
        return (
          <InteractiveButtonMessage 
            bodyText={content.interactive.body.text} 
            buttons={content.interactive.action.buttons} 
          />
        );
      }
      
      if (content.interactive.type === 'list') {
        return (
          <InteractiveListMessage 
            bodyText={content.interactive.body.text}
            buttonText={content.interactive.action.button}
            sections={content.interactive.action.sections}
            footerText={content.interactive.footer?.text}
          />
        );
      }
    }

    // Fallback for unexpected content types
    return <TextMessage content={message.content} />;
  };

  return (
    <div className={`mb-4 ${isUserMessage ? 'flex justify-end' : ''}`}>
      <div className={`rounded-lg p-4 inline-block max-w-[80%] ${isUserMessage ? 'bg-blue-500 text-white' : 'bg-white'}`}>
        {renderMessageContent()}
        <div className={`text-xs mt-1 ${isUserMessage ? 'text-blue-200' : 'text-gray-500'}`}>
          {new Date(message.timestamp).toLocaleString()}
          {!isUserMessage && ` by ${message?.from ?? 'Bot'}`}
        </div>
      </div>
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

export default MessageItem;
