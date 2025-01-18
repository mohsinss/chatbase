'use client'

import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotSettings {
  profilePictureUrl: string;
  displayName: string;
  messagePlaceholder: string;
  roundedHeaderCorners: boolean;
  roundedChatCorners: boolean;
  userMessageColor: string;
  syncColors: boolean;
  footerText: string;
  initialMessage: string;
}

export default function ChatbotPage({ params }: { params: { chatbotId: string } }) {
  const [settings, setSettings] = useState<ChatbotSettings | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`/api/chatbot/interface-settings?chatbotId=${params.chatbotId}`);
        const data = await response.json();
        setSettings(data);
        // Add initial message if it exists
        if (data.initialMessage) {
          setMessages([{ role: 'assistant', content: data.initialMessage }]);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, [params.chatbotId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          chatbotId: params.chatbotId
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      let botResponse = '';

      if (reader) {
        let done = false;
        while (!done) {
          const { done: isDone, value } = await reader.read();
          done = isDone;

          const text = new TextDecoder().decode(value);
          const lines = text.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(5);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  botResponse += parsed.text;
                  setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage?.role === 'assistant') {
                      lastMessage.content = botResponse;
                    } else {
                      newMessages.push({ role: 'assistant', content: botResponse });
                    }
                    return newMessages;
                  });
                }
              } catch (e) {
                console.error('Error parsing JSON:', e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!settings) return null;

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div 
        className={`p-4 border-b flex items-center justify-between ${
          settings.roundedHeaderCorners ? 'rounded-t-xl' : ''
        }`}
        style={{
          backgroundColor: settings.syncColors ? settings.userMessageColor : undefined,
          color: settings.syncColors ? 'white' : undefined
        }}
      >
        <div className="flex items-center gap-3">
          {settings.profilePictureUrl && (
            <div 
              className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden"
              style={{
                backgroundImage: `url(${settings.profilePictureUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          )}
          <div className="font-medium">{settings.displayName}</div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${message.role === 'user' ? 'ml-auto' : ''} max-w-[80%]`}
          >
            <div
              className={`p-3 ${
                settings.roundedChatCorners ? 'rounded-xl' : 'rounded-lg'
              } ${
                message.role === 'user' 
                  ? 'text-white' 
                  : 'bg-gray-100'
              }`}
              style={message.role === 'user' ? { backgroundColor: settings.userMessageColor } : undefined}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <div className="loading-dots">...</div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input 
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={settings.messagePlaceholder}
            className={`flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ${
              settings.roundedChatCorners ? 'rounded-lg' : 'rounded-md'
            }`}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isLoading}
            className={`p-2 bg-black text-white ${
              settings.roundedChatCorners ? 'rounded-lg' : 'rounded-md'
            } ${isLoading ? 'opacity-50' : ''}`}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 text-center text-sm text-gray-500 flex items-center justify-center gap-1">
          <span>Powered By ChatSA.co</span>
          <span>{settings.footerText}</span>
        </div>
      </div>
    </div>
  );
} 