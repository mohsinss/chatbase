import { Metadata } from 'next';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Chatbot Templates | ChatSa',
  description: 'Create bots for Facebook Messenger and Websites in minutes. No coding or technical skills required. Browse our collection of professional chatbot templates.',
  keywords: 'chatbot templates, instagram bots, facebook messenger bots, chatbot automation, no-code chatbots, ChatSa templates',
  openGraph: {
    title: 'Chatbot Templates | ChatSa',
    description: 'Create bots for Facebook Messenger and Websites in minutes. No coding or technical skills required.',
    type: 'website',
    url: 'https://chatsa.com/chatbot-templates',
    images: [
      {
        url: '/chatbase-icon.png',
        width: 512,
        height: 512,
        alt: 'ChatSa Chatbot Templates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chatbot Templates | ChatSa',
    description: 'Create bots for Facebook Messenger and Websites in minutes. No coding or technical skills required.',
    images: ['/chatbase-icon.png'],
  },
  alternates: {
    canonical: 'https://chatsa.com/chatbot-templates',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function ChatbotTemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="pt-20">
        {children}
      </div>
    </>
  );
} 