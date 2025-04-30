'use client';

import React from 'react';
import { X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatbotDemoProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleDemo: () => void;
}

export default function ChatbotDemo({ isOpen, onClose, onScheduleDemo }: ChatbotDemoProps) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
      <div className="bg-white rounded-xl w-[400px] h-[900px] max-w-[95vw] max-h-[95vh] flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold">AI Chatbot Demo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 min-h-0 relative">
          <iframe
            src="https://chatsa.co/chatbot/3Fio_IIfzQDKTGsjEKwil?embed=true&fullsize=true"
            className="absolute inset-0 w-full h-full border-0"
            title="Chatbot Demo"
            allow="microphone; camera"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>

        <div className="p-6 border-t bg-gray-50">
          <Button
            onClick={onScheduleDemo}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center gap-2 py-6 text-lg"
          >
            <Calendar className="h-5 w-5" />
            Schedule Your Demo
          </Button>
        </div>
      </div>
    </div>
  );
} 