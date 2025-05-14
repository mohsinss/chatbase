import React, { useRef, useEffect, useState } from 'react';
import { ChatConfig } from './types';
import { toast } from 'react-hot-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  
  // Check if scroll indicators should be shown
  useEffect(() => {
    const checkScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 10);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    };
    
    // Initial check
    checkScroll();
    
    // Add scroll event listener
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      
      // Check after content might have changed size
      setTimeout(checkScroll, 100);
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScroll);
      }
    };
  }, [config.suggestedMessages]);
  
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 200; // pixels to scroll
    const currentScroll = scrollContainerRef.current.scrollLeft;
    
    scrollContainerRef.current.scrollTo({
      left: direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleSuggestedMessageClick = (message: string) => {
    if (showLeadForm) {
      toast.error('Please submit the form. 🙂');
      return;
    }

    handleSendMessage(message);
  };

  const messages = config.suggestedMessages.split('\n').filter(Boolean);
  
  if (messages.length === 0) return null;

  return (
    <div className={`w-full border-b relative ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'border-gray-200'}`}>
      {/* Left scroll indicator */}
      {showLeftScroll && (
        <button 
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full shadow-md ${
            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'
          }`}
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} />
        </button>
      )}
      
      {/* Right scroll indicator */}
      {showRightScroll && (
        <button 
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full shadow-md ${
            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'
          }`}
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight size={16} />
        </button>
      )}
      
      {/* Main scroll container with gradient edges */}
      <div className="relative">
        {/* Left fade gradient */}
        {showLeftScroll && (
          <div 
            className={`absolute left-0 top-0 bottom-0 w-8 z-[1] pointer-events-none ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-gray-900 to-transparent' 
                : 'bg-gradient-to-r from-white to-transparent'
            }`}
          />
        )}
        
        {/* Right fade gradient */}
        {showRightScroll && (
          <div 
            className={`absolute right-0 top-0 bottom-0 w-8 z-[1] pointer-events-none ${
              theme === 'dark' 
                ? 'bg-gradient-to-l from-gray-900 to-transparent' 
                : 'bg-gradient-to-l from-white to-transparent'
            }`}
          />
        )}
        
        {/* Scroll container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto py-3 px-4 no-scrollbar relative"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollSnapType: 'x mandatory'
          }}
        >
          <div className="flex gap-2 flex-nowrap px-2">
            {messages.map((message, i) => (
              <button
                key={i}
                className={`whitespace-nowrap flex-shrink-0 px-3 py-2 text-sm rounded-full transition-colors duration-200 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 text-white hover:bg-gray-700' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => handleSuggestedMessageClick(message)}
                disabled={disabled}
                style={{ scrollSnapAlign: 'start' }}
              >
                {message}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestedMessages;
