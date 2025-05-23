'use client';

import Script from 'next/script';

export default function ChatbotScripts() {
  return (
    <>
      <Script
        id="chatbot-config"
        dangerouslySetInnerHTML={{
          __html: `
            window.embeddedChatbotConfig = {
              chatbotId: "3Fio_IIfzQDKTGsjEKwil",
              domain: "${process.env.NODE_ENV === 'development' ? 'localhost:3000' : 'chatsa.co'}",
              protocol: "${process.env.NODE_ENV === 'development' ? 'http:' : 'https:'}"
            }
          `
        }}
      />
      <Script 
        src={`${process.env.NODE_ENV === 'development' ? 'http:' : 'https:'}//${process.env.NEXT_PUBLIC_DOMAIN}/embed.min.js`}
        defer
      />
    </>
  );
} 