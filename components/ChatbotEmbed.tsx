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
        src={`https://${domain}/embed.min.js`}
        defer
      />
    </>
  );
} 