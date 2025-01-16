"use client";

import { useEffect } from 'react';
import Script from 'next/script';

interface ChatbotEmbedProps {
  chatbotId?: string;
  domain?: string;
}

export default function ChatbotEmbed({ 
  chatbotId = "2rmMdD8T2OPVDpL25_6CP",
  domain = "localhost:3000"
}: ChatbotEmbedProps) {
  useEffect(() => {
    // Initialize chatbot config
    window.embeddedChatbotConfig = {
      chatbotId,
      domain
    };
  }, [chatbotId, domain]);

  return (
    <>
      <Script
        id="chatbot-config"
        strategy="beforeInteractive"
      >
        {`
          window.embeddedChatbotConfig = {
            chatbotId: "${chatbotId}",
            domain: "${domain}"
          }
        `}
      </Script>
      <Script
        id="chatbot-embed"
        src="https://www.chatsa.co/embed.min.js"
        strategy="afterInteractive"
        onError={(e) => {
          console.error('Error loading chatbot script:', e);
        }}
      />
    </>
  );
} 