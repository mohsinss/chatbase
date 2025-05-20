'use client'

import { useState, type ChangeEvent, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RefreshCcw, Bold, Italic, Underline, Link2, Undo2, Redo2, AlignLeft, AlignCenter, AlignRight, Send } from 'lucide-react'
import { HexColorPicker } from "react-colorful"
import { Input } from "@/components/ui/input"
import toast from 'react-hot-toast'
import { Slider } from "../../../components/ui/slider"

interface ChatConfig {
  initialMessage: string
  suggestedMessages: string
  messagePlaceholder: string
  collectFeedback: boolean
  regenerateMessages: boolean
  userMessageColor: string
  chatBubbleColor: string
  syncColors: boolean
  bubbleAlignment: 'left' | 'right'
  autoShowDelay: number
  tooltipDelay: number
  theme: 'light' | 'dark'
  displayName: string
  footerText: string
  roundedHeaderCorners: boolean
  roundedChatCorners: boolean
  profilePictureUrl: string
  chatIconUrl: string
  chatWidth: number
  chatBackgroundUrl: string
  chatBackgroundOpacity: number
}

interface ChatInterfaceSettingsProps {
  chatbotId: string;
}

export default function ChatInterfaceSettings({ chatbotId }: ChatInterfaceSettingsProps) {
  const [config, setConfig] = useState<ChatConfig>({
    initialMessage: "Hi! What can I help you with?",
    suggestedMessages: "how are you ?\nwho are they ?\nwhat dates the event will start",
    messagePlaceholder: "Message...",
    collectFeedback: true,
    regenerateMessages: true,
    userMessageColor: "#4285f4",
    chatBubbleColor: "#000000",
    syncColors: false,
    bubbleAlignment: 'right',
    autoShowDelay: 3,
    tooltipDelay: 1,
    theme: 'light',
    displayName: "Loading...",
    footerText: "",
    roundedHeaderCorners: false,
    roundedChatCorners: false,
    profilePictureUrl: "",
    chatIconUrl: "",
    chatWidth: 448,
    chatBackgroundUrl: "",
    chatBackgroundOpacity: 0.1
  })
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [chatIcon, setChatIcon] = useState<string>("");
  const profileInputRef = useRef<HTMLInputElement>(null);
  const chatIconInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const [widthInputValue, setWidthInputValue] = useState(config.chatWidth.toString())
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUserColorPicker, setShowUserColorPicker] = useState(false)
  const [showBubbleColorPicker, setShowBubbleColorPicker] = useState(false)
  const userColorPickerRef = useRef<HTMLDivElement>(null)
  const bubbleColorPickerRef = useRef<HTMLDivElement>(null)
  const [topHeight, setTopHeight] = useState(40)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartY = useRef(0)
  const dragStartHeight = useRef(0)

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragStartY.current = e.clientY
    dragStartHeight.current = topHeight
  }

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging) return

    const deltaY = e.clientY - dragStartY.current
    const deltaPercent = (deltaY / window.innerHeight) * 100
    const newHeight = Math.max(20, Math.min(80, dragStartHeight.current + deltaPercent))
    
    setTopHeight(newHeight)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove)
      window.addEventListener('mouseup', handleDragEnd)
    }

    return () => {
      window.removeEventListener('mousemove', handleDragMove)
      window.removeEventListener('mouseup', handleDragEnd)
    }
  }, [isDragging])

  useEffect(() => {
    fetchSettings();
  }, [chatbotId]);

  // Refresh settings when window gains focus (to sync with changes from other tabs/components)
  useEffect(() => {
    const handleFocus = () => {
      fetchSettings();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Listen for name updates from GeneralSettings
  useEffect(() => {
    const handleNameUpdate = (event: CustomEvent) => {
      const { chatbotId: updatedChatbotId, name } = event.detail;
      
      // Only update if it's for this chatbot
      if (updatedChatbotId === chatbotId) {
        setConfig(prev => ({
          ...prev,
          displayName: name
        }));
      }
    };

    // Add event listener with type assertion
    window.addEventListener('chatbot-name-updated', handleNameUpdate as EventListener);
    
    return () => {
      window.removeEventListener('chatbot-name-updated', handleNameUpdate as EventListener);
    };
  }, [chatbotId]);

  useEffect(() => {
    const chatbotIconDiv = document.getElementById('chatbot-widget-icon');
    if (chatbotIconDiv) {
      chatbotIconDiv.innerHTML = `
        <div 
          class="absolute -bottom-5 right-14 h-12 w-12 rounded-full shadow-lg overflow-hidden cursor-pointer"
          style="background-image: url(${config.chatIconUrl}); background-size: cover; background-position: center;">
        </div>
      `;
    }
  }, [config.chatIconUrl]);

  useEffect(() => {
    setWidthInputValue(config.chatWidth.toString())
  }, [config.chatWidth])

  // Debug tooltip delay when it changes
  useEffect(() => {
    console.log("Current tooltipDelay value:", config.tooltipDelay);
  }, [config.tooltipDelay]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userColorPickerRef.current && !userColorPickerRef.current.contains(event.target as Node)) {
        setShowUserColorPicker(false)
      }
      if (bubbleColorPickerRef.current && !bubbleColorPickerRef.current.contains(event.target as Node)) {
        setShowBubbleColorPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const fetchSettings = async () => {
    try {
      console.log('Fetching settings for chatbotId:', chatbotId);
      
      // First, fetch chatbot details to get the latest name
      const chatbotResponse = await fetch(`/api/chatbot/list/single?chatbotId=${chatbotId}`);
      const chatbotData = await chatbotResponse.json();
      const chatbotName = chatbotData.chatbot?.name || "Chatbot";
      
      // Then fetch interface settings
      const response = await fetch(`/api/chatbot/interface-settings?chatbotId=${chatbotId}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log('Fetched settings - Raw data:', JSON.stringify(data));
        console.log('Fetched settings - Full data:', data);
        console.log('Fetched settings - Has tooltipDelay property:', data.hasOwnProperty('tooltipDelay'));
        console.log('Fetched settings - Tooltip delay:', data.tooltipDelay);
        console.log('Fetched settings - Tooltip delay type:', typeof data.tooltipDelay);
        console.log('Fetched settings - Background:', {
          url: data.chatBackgroundUrl,
          opacity: data.chatBackgroundOpacity
        });
        
        if (data) {
          // Handle tooltipDelay explicitly with appropriate defaults
          let tooltipDelayValue;
          
          if (data.hasOwnProperty('tooltipDelay')) {
            // If tooltipDelay exists in the response, use it as a number
            tooltipDelayValue = Number(data.tooltipDelay);
            console.log('Using tooltipDelay from response:', tooltipDelayValue);
          } else {
            // If not, use default value 1
            tooltipDelayValue = 1;
            console.log('Using default tooltipDelay:', tooltipDelayValue);
          }
          
          const newConfig = {
            ...config,
            ...data,
            // Always use the name from the chatbot (GeneralSettings)
            displayName: chatbotName,
            // Set tooltipDelay explicitly to ensure it's not undefined
            tooltipDelay: tooltipDelayValue,
            chatBackgroundOpacity: data.chatBackgroundOpacity ?? 0.1
          };
          
          console.log('Setting new config:', newConfig);
          console.log('New config tooltip delay:', newConfig.tooltipDelay);
          console.log('New config background:', {
            url: newConfig.chatBackgroundUrl,
            opacity: newConfig.chatBackgroundOpacity
          });
          
          setConfig(newConfig);
          setProfilePicture(data.profilePictureUrl || "");
          setChatIcon(data.chatIconUrl || "");
        }
      } else {
        throw new Error(data.error || 'Failed to fetch settings');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error("Failed to load settings.")
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Prepare the request payload
      const requestPayload = {
        chatbotId,
        initialMessage: config.initialMessage,
        suggestedMessages: config.suggestedMessages,
        messagePlaceholder: config.messagePlaceholder,
        collectFeedback: config.collectFeedback,
        regenerateMessages: config.regenerateMessages,
        userMessageColor: config.userMessageColor,
        chatBubbleColor: config.chatBubbleColor,
        syncColors: config.syncColors,
        bubbleAlignment: config.bubbleAlignment,
        autoShowDelay: config.autoShowDelay,
        tooltipDelay: Number(config.tooltipDelay) || 1, // Ensure it's a number
        theme: config.theme,
        displayName: config.displayName,
        footerText: config.footerText,
        roundedHeaderCorners: config.roundedHeaderCorners,
        roundedChatCorners: config.roundedChatCorners,
        profilePictureUrl: profilePicture,
        chatIconUrl: chatIcon,
        chatBackgroundUrl: config.chatBackgroundUrl,
        chatBackgroundOpacity: config.chatBackgroundOpacity ?? 0.1,
        chatWidth: config.chatWidth
      };
      
      console.log('Request payload:', JSON.stringify(requestPayload));

      const response = await fetch('/api/chatbot/interface-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      const savedData = await response.json();

      if (!response.ok) {
        console.error('Server returned error:', response.status);
        console.error('Error response data:', savedData);
        throw new Error(savedData.error || savedData.details || 'Failed to save settings');
      }

      // Update dataset name in Trieve to keep it in sync
      const datasetResponse = await fetch(`/api/chatbot/update/dataset-name`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatbotId,
          name: config.displayName,
        }),
      });

      if (!datasetResponse.ok) {
        console.warn('Failed to update dataset name in Trieve');
      }

      console.log('After save - Server response:', savedData);
      console.log('After save - Tooltip delay in response:', savedData.tooltipDelay);
      console.log('After save - Tooltip delay type in response:', typeof savedData.tooltipDelay);
      console.log('After save - Background in response:', {
        url: savedData.chatBackgroundUrl,
        opacity: savedData.chatBackgroundOpacity
      });

      // Verify the save worked
      const verifyResponse = await fetch(`/api/chatbot/interface-settings?chatbotId=${chatbotId}`);
      const verifyData = await verifyResponse.json();
      console.log('Verification fetch - Full data:', verifyData);
      console.log('Verification fetch - Has tooltipDelay:', verifyData.hasOwnProperty('tooltipDelay'));
      console.log('Verification fetch - tooltipDelay value:', verifyData.tooltipDelay);
      console.log('Verification fetch - tooltipDelay type:', typeof verifyData.tooltipDelay);
      console.log('Verification fetch - Background:', {
        url: verifyData.chatBackgroundUrl,
        opacity: verifyData.chatBackgroundOpacity
      });

      // Update local state
      setConfig(prev => {
        console.log('Updating local state with savedData:', savedData);
        console.log('savedData.tooltipDelay:', savedData.tooltipDelay);
        
        // Make sure tooltipDelay is properly set from the server response
        const tooltipDelayValue = savedData.tooltipDelay !== undefined 
          ? Number(savedData.tooltipDelay) 
          : prev.tooltipDelay;
        
        console.log('Using tooltipDelayValue:', tooltipDelayValue);
        
        return {
          ...prev,
          ...savedData,
          tooltipDelay: tooltipDelayValue
        };
      });

      // Send message to update embedded chat
      window.postMessage({
        type: 'chatbot-settings-update',
        settings: requestPayload
      }, '*');
      
      toast.success('Settings saved successfully.')
    } catch (error) {
      console.error('Save error:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      
      toast.error(error instanceof Error ? error.message : "Failed to save settings.")
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (key: keyof ChatConfig, value: any) => {
    // Ensure tooltipDelay is always stored as a number
    if (key === 'tooltipDelay') {
      // Convert to number and handle invalid cases
      const numValue = Number(value);
      const finalValue = !isNaN(numValue) ? numValue : 1;
      console.log(`Converting tooltipDelay from ${value} (${typeof value}) to ${finalValue} (number)`);
      
      setConfig(prev => ({
        ...prev,
        [key]: finalValue
      }));

      // Immediately update the embed script with the new tooltip delay
      window.postMessage({
        type: 'chatbot-settings-update',
        settings: {
          ...config,
          tooltipDelay: finalValue
        }
      }, '*');
    } else if (key === 'displayName') {
      // Update display name in config
      setConfig(prev => ({
        ...prev,
        displayName: value
      }));
      
      // Sync chatbot name with display name
      syncChatbotName(value);
    } else {
      setConfig(prev => ({
        ...prev,
        [key]: value
      }));
    }
  }

  // Function to sync chatbot name in database when displayName changes
  const syncChatbotName = async (name: string) => {
    try {
      // Update chatbot name in the database
      const response = await fetch(`/api/chatbot/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatbotId,
          name: name,
        }),
      });

      if (!response.ok) {
        console.warn('Failed to sync chatbot name in database');
      }
    } catch (error) {
      console.error('Error syncing chatbot name:', error);
    }
  };

  const handleImageUpload = async (type: 'profile' | 'icon' | 'background') => {
    const inputRef = type === 'profile' ? profileInputRef : type === 'icon' ? chatIconInputRef : backgroundInputRef;
    inputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>, type: 'profile' | 'icon' | 'background') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (1MB limit)
    if (file.size > 1024 * 1024) {
      toast.error("File size must be less than 1MB");
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
      toast.error("Only JPG, PNG, and SVG files are supported.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('chatbotId', chatbotId);
      formData.append('imageType', type);

      const response = await fetch('/api/chatbot/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Upload failed');
      }

      // Update state and config based on image type
      if (type === 'profile') {
        setProfilePicture(data.url);
        handleConfigChange('profilePictureUrl', data.url);
      } else if (type === 'icon') {
        setChatIcon(data.url);
        handleConfigChange('chatIconUrl', data.url);
      } else if (type === 'background') {
        handleConfigChange('chatBackgroundUrl', data.url);
      }
      
      toast.success("Image uploaded successfully.")
    } catch (error) {
      console.error('Upload error:', error);

      toast.error(error instanceof Error ? error.message : "Failed to upload image.")
    }
  };

  const handleReset = (field: keyof ChatConfig) => {
    const defaults: Partial<ChatConfig> = {
      userMessageColor: "#4285f4",
      chatBubbleColor: "#000000",
    }
    if (field in defaults) {
      handleConfigChange(field, defaults[field])
    }
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-200px)]">
        {/* Preview Panel - Now on top for mobile */}
        <div 
          className="lg:w-[40%] overflow-y-auto order-first lg:order-last relative lg:min-h-[calc(100vh-200px)]"
          style={{ height: `${topHeight}vh` }}
        >
          <div className="h-[500px] lg:min-h-[calc(100vh-200px)]">
            <Card 
              className={`h-full flex flex-col mx-auto transition-all duration-300 ease-in-out ${
                config.theme === 'dark' ? 'bg-gray-900 border-gray-800' : ''
              }`}
              style={{ 
                width: isExpanded ? '300px' : `${config.chatWidth}px`,
              }}
            >
              <div 
                className={`p-4 border-b flex items-center justify-between ${
                  config.roundedHeaderCorners ? 'rounded-t-xl' : ''
                } ${config.theme === 'dark' ? 'border-gray-800' : ''}`}
                style={{
                  backgroundColor: config.syncColors ? config.userMessageColor : config.theme === 'dark' ? '#1f2937' : undefined,
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
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={config.syncColors ? 'text-white hover:bg-white/10' : ''}
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>

              <div 
                className={`flex-1 p-4 space-y-4 overflow-y-auto relative ${
                  config.theme === 'dark' ? 'bg-gray-900 text-white' : ''
                }`}
                style={{
                  backgroundImage: config.chatBackgroundUrl ? `url(${config.chatBackgroundUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Add a background overlay div to control opacity */}
                {config.chatBackgroundUrl && (
                  <div 
                    className="absolute inset-0" 
                    style={{
                      backgroundColor: config.theme === 'dark' ? '#111827' : 'white',
                      opacity: 1 - config.chatBackgroundOpacity
                    }}
                  />
                )}
                {/* Keep existing chat messages */}
                <div className="relative z-10">
                  <div className={`${
                    config.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100'
                  } p-3 ${
                    config.roundedChatCorners ? 'rounded-xl' : 'rounded-lg'
                  } max-w-[80%]`}>
                    {config.initialMessage}
                  </div>
                  <div 
                    className={`ml-auto p-3 mt-3 ${
                      config.roundedChatCorners ? 'rounded-xl' : 'rounded-lg'
                    } max-w-[80%] text-white`}
                    style={{ backgroundColor: config.userMessageColor }}
                  >
                    Hello
                  </div>
                </div>
              </div>

              {/* Chat Icon in the bottom right */}
              {config.chatIconUrl && (
                <div 
                  className="absolute -bottom-[56px] right-0 h-12 w-12 rounded-full shadow-lg overflow-hidden cursor-pointer"
                  style={{
                    backgroundImage: `url(${config.chatIconUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              )}

              <div className={`p-4 border-t ${config.theme === 'dark' ? 'border-gray-800' : ''}`}>
                {/* Suggested Messages - display only */}
                <div className="mb-4 flex flex-wrap gap-2 overflow-x-auto pb-2 lg:pb-0">
                  <div className="flex gap-2 min-w-full lg:min-w-0">
                    {config.suggestedMessages.split('\n').filter(msg => msg.trim()).map((message, index) => (
                      <button
                        key={index}
                        className={`px-4 py-2 ${
                          config.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100'
                        } rounded-full text-sm whitespace-nowrap`}
                      >
                        {message}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message input area */}
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder={config.messagePlaceholder}
                    className={`flex h-10 w-full border ${
                      config.theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-background border-input'
                    } px-3 py-2 text-sm ${
                      config.roundedChatCorners ? 'rounded-lg' : 'rounded-md'
                    }`}
                  />
                  <Button 
                    size="icon" 
                    className={config.roundedChatCorners ? 'rounded-lg' : ''}
                    style={{ backgroundColor: config.userMessageColor }}
                  >
                    <Send className="h-4 w-4 text-white" />
                  </Button>
                </div>

                {/* Footer */}
                <div className="mt-2 flex items-center justify-center gap-1 text-sm" style={{ color: config.theme === 'dark' ? '#9ca3af' : '#6b7280', fontFamily: 'inherit' }}>
                  <span className="whitespace-nowrap">Powered By ChatSA.co</span>
                  {config.footerText && <span className="ml-0" style={{ color: 'inherit', fontFamily: 'inherit' }}>{config.footerText}</span>}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Draggable Divider */}
        <div 
          className="h-2 bg-gray-200 cursor-ns-resize hover:bg-gray-300 transition-colors lg:hidden"
          onMouseDown={handleDragStart}
        />

        {/* Configuration Panel - Now on bottom for mobile */}
        <div 
          className="flex-1 overflow-y-auto relative order-last lg:order-first lg:min-h-[calc(100vh-200px)]"
          style={{ height: `${100 - topHeight}vh`, maxHeight: `${100 - topHeight}vh`, overflowY: 'auto' }}
        >
          <div className="sticky top-0 z-10 bg-background border-b p-4 hidden lg:block">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Chat Interface</h1>
              <Button 
                className="w-[200px]" 
                size="lg" 
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
          
          <div className="p-4 space-y-8">
            {/* Basic Settings Section */}
            <div className="space-y-6 p-6 bg-card rounded-lg border">
              <h2 className="text-lg font-semibold">Basic Settings</h2>
              <div className="space-y-4">
                {/* Display Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Display Name
                  </label>
                  <Input 
                    value={config.displayName}
                    onChange={(e) => handleConfigChange('displayName', e.target.value)}
                    className="flex h-10 w-full"
                    placeholder="Enter chatbot name"
                  />
                </div>

                {/* Theme */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Theme
                  </label>
                  <select
                    value={config.theme}
                    onChange={(e) => {
                      const newTheme = e.target.value as 'light' | 'dark';
                      handleConfigChange('theme', newTheme)
                      
                      // Immediately update the embed script with the new theme
                      window.postMessage({
                        type: 'chatbot-settings-update',
                        settings: {
                          ...config,
                          theme: newTheme
                        }
                      }, '*');
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                {/* Chat Window Width */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Chat Window Width
                  </label>
                  <div className="flex flex-col gap-4">
                    <Slider 
                      value={[config.chatWidth]}
                      onValueChange={(value: number[]) => {
                        handleConfigChange('chatWidth', value[0])
                        setWidthInputValue(value[0].toString())
                      }}
                      min={200}
                      max={900}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex items-center">
                      <button
                        className="px-2 py-1 border rounded-l"
                        onClick={() => {
                          const newWidth = Math.max(200, config.chatWidth - 10)
                          handleConfigChange('chatWidth', newWidth)
                          setWidthInputValue(newWidth.toString())
                        }}
                      >
                        -
                      </button>
                      <input 
                        type="number"
                        value={widthInputValue}
                        onChange={(e) => setWidthInputValue(e.target.value)}
                        onBlur={(e) => {
                          const num = parseInt(e.target.value)
                          const validNum = Math.max(200, Math.min(900, num || 200))
                          handleConfigChange('chatWidth', validNum)
                          setWidthInputValue(validNum.toString())
                        }}
                        min="200"
                        max="900"
                        className="flex h-10 w-[100px] border-y bg-background px-3 py-2 text-sm text-center"
                      />
                      <button
                        className="px-2 py-1 border rounded-r"
                        onClick={() => {
                          const newWidth = Math.min(900, config.chatWidth + 10)
                          handleConfigChange('chatWidth', newWidth)
                          setWidthInputValue(newWidth.toString())
                        }}
                      >
                        +
                      </button>
                      <span className="ml-2 text-sm text-gray-500">pixels</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Footer Text
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Button variant="outline" size="icon"><Bold className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon"><Italic className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon"><Underline className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon"><Link2 className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon"><AlignLeft className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon"><AlignCenter className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon"><AlignRight className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon"><Undo2 className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon"><Redo2 className="h-4 w-4" /></Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 whitespace-nowrap">Powered By ChatSA.co</span>
                    <textarea 
                      value={config.footerText}
                      onChange={(e) => handleConfigChange('footerText', e.target.value)}
                      className="flex w-full max-h-[35px] rounded-md border border-input bg-background px-1 py-2 text-sm"
                      placeholder="Add your custom footer text here..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Appearance Section */}
            <div className="space-y-6 p-6 bg-card rounded-lg border">
              <h2 className="text-lg font-semibold">Appearance</h2>
              <div className="space-y-4">
                {/* Color Controls */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      User Message Color
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative" ref={userColorPickerRef}>
                        <div 
                          className="w-8 h-8 rounded-full border cursor-pointer"
                          style={{ backgroundColor: config.userMessageColor }}
                          onClick={() => setShowUserColorPicker(!showUserColorPicker)}
                        />
                        {showUserColorPicker && (
                          <div className="absolute top-full mt-2 z-10">
                            <HexColorPicker 
                              color={config.userMessageColor} 
                              onChange={(color) => handleConfigChange('userMessageColor', color)} 
                            />
                          </div>
                        )}
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => handleReset('userMessageColor')}>
                        Reset
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div
                      className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        config.syncColors ? 'bg-primary' : 'bg-input'
                      }`}
                      onClick={() => handleConfigChange('syncColors', !config.syncColors)}
                    >
                      <span
                        className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                          config.syncColors ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                    <label className="text-sm font-medium leading-none">
                      Sync User Message Color with Chatbot Header
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      Chat Bubble Button Color
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative" ref={bubbleColorPickerRef}>
                        <div 
                          className="w-8 h-8 rounded-full border cursor-pointer"
                          style={{ backgroundColor: config.chatBubbleColor }}
                          onClick={() => setShowBubbleColorPicker(!showBubbleColorPicker)}
                        />
                        {showBubbleColorPicker && (
                          <div className="absolute top-full mt-2 z-10">
                            <HexColorPicker 
                              color={config.chatBubbleColor} 
                              onChange={(color) => handleConfigChange('chatBubbleColor', color)} 
                            />
                          </div>
                        )}
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => handleReset('chatBubbleColor')}>
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Corner Settings */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        config.roundedHeaderCorners ? 'bg-primary' : 'bg-input'
                      }`}
                      onClick={() => handleConfigChange('roundedHeaderCorners', !config.roundedHeaderCorners)}
                    >
                      <span
                        className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                          config.roundedHeaderCorners ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                    <label className="text-sm font-medium leading-none">
                      Rounded Header Corners
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div
                      className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        config.roundedChatCorners ? 'bg-primary' : 'bg-input'
                      }`}
                      onClick={() => handleConfigChange('roundedChatCorners', !config.roundedChatCorners)}
                    >
                      <span
                        className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                          config.roundedChatCorners ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                    <label className="text-sm font-medium leading-none">
                      Rounded Chat Corners
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Behavior Section */}
            <div className="space-y-6 p-6 bg-card rounded-lg border">
              <h2 className="text-lg font-semibold">Chat Behavior</h2>
              <div className="space-y-4">
                {/* Initial Messages */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Initial Messages
                  </label>
                  <textarea 
                    value={config.initialMessage}
                    onChange={(e) => handleConfigChange('initialMessage', e.target.value)}
                    placeholder="Enter each message in a new line."
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[50px]"
                  />
                </div>

                {/* Suggested Messages */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Suggested Messages
                  </label>
                  <textarea 
                    value={config.suggestedMessages}
                    onChange={(e) => handleConfigChange('suggestedMessages', e.target.value)}
                    placeholder="Enter each message in a new line."
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[50px]"
                  />
                </div>

                {/* Message Placeholder */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Message Placeholder
                  </label>
                  <input 
                    type="text"
                    value={config.messagePlaceholder}
                    onChange={(e) => handleConfigChange('messagePlaceholder', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>

                {/* Toggles */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium leading-none">
                      Collect User Feedback
                    </label>
                    <div
                      className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        config.collectFeedback ? 'bg-primary' : 'bg-input'
                      }`}
                      onClick={() => handleConfigChange('collectFeedback', !config.collectFeedback)}
                    >
                      <span
                        className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                          config.collectFeedback ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium leading-none">
                      Regenerate Messages
                    </label>
                    <div
                      className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        config.regenerateMessages ? 'bg-primary' : 'bg-input'
                      }`}
                      onClick={() => handleConfigChange('regenerateMessages', !config.regenerateMessages)}
                    >
                      <span
                        className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                          config.regenerateMessages ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Display Settings Section */}
            <div className="space-y-6 p-6 bg-card rounded-lg border">
              <h2 className="text-lg font-semibold">Display Settings</h2>
              <div className="space-y-4">
                {/* Alignment Control */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Align Chat Bubble Button
                  </label>
                  <select
                    value={config.bubbleAlignment}
                    onChange={(e) => handleConfigChange('bubbleAlignment', e.target.value as 'left' | 'right')}
                    className="flex h-10 w-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>

                {/* Auto Show Delay */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Auto show initial messages pop-ups after
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      value={config.autoShowDelay}
                      onChange={(e) => handleConfigChange('autoShowDelay', parseInt(e.target.value))}
                      min="-1"
                      className="flex h-10 w-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                    <span className="text-sm text-gray-500">seconds (negative to disable)</span>
                  </div>
                </div>

                {/* Tooltip Delay */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Show tooltip message
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={config.tooltipDelay === 0 ? "immediate" : 
                            config.tooltipDelay === -1 ? "never" : 
                            [1, 2, 3, 5, 10].includes(config.tooltipDelay) ? config.tooltipDelay.toString() : "custom"}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "immediate") {
                          handleConfigChange('tooltipDelay', 0);
                        } else if (value === "never") {
                          handleConfigChange('tooltipDelay', -1);
                        } else if (value === "custom") {
                          if (!([0, -1].includes(config.tooltipDelay) || [1, 2, 3, 5, 10].includes(config.tooltipDelay))) {
                          } else {
                            handleConfigChange('tooltipDelay', 4);
                          }
                        } else {
                          handleConfigChange('tooltipDelay', parseInt(value));
                        }
                      }}
                      className="flex h-10 w-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="immediate">Immediately</option>
                      <option value="never">Never</option>
                      <option value="1">After 1 second</option>
                      <option value="2">After 2 seconds</option>
                      <option value="3">After 3 seconds</option>
                      <option value="5">After 5 seconds</option>
                      <option value="10">After 10 seconds</option>
                      <option value="custom">Custom...</option>
                    </select>
                    
                    {config.tooltipDelay > 0 && 
                      ![1, 2, 3, 5, 10].includes(config.tooltipDelay) && (
                      <div className="flex items-center gap-2 ml-2">
                        <input 
                          type="number"
                          value={config.tooltipDelay}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value > 0) {
                              handleConfigChange('tooltipDelay', value);
                            }
                          }}
                          onBlur={(e) => {
                            const value = parseInt(e.target.value);
                            if (isNaN(value) || value <= 0) {
                              handleConfigChange('tooltipDelay', 4);
                            }
                          }}
                          min="1"
                          className="flex h-10 w-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                        <span className="text-sm text-gray-500">seconds</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div className="space-y-6 p-6 bg-card rounded-lg border">
              <h2 className="text-lg font-semibold">Media</h2>
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Profile Picture
                  </label>
                  <div className="space-y-4">
                    <div 
                      className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden"
                      style={{
                        backgroundImage: profilePicture ? `url(${profilePicture})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          ref={profileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'profile')}
                        />
                        <Button onClick={() => handleImageUpload('profile')}>
                          Upload Image
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="url"
                          placeholder="Or enter image URL..."
                          value={config.profilePictureUrl}
                          onChange={(e) => {
                            setProfilePicture(e.target.value);
                            handleConfigChange('profilePictureUrl', e.target.value);
                          }}
                          className="flex-1"
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setProfilePicture("");
                            handleConfigChange('profilePictureUrl', "");
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Supports JPG, PNG, and SVG files up to 1MB</p>
                  </div>
                </div>

                {/* Chat Icon */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Chat Icon
                  </label>
                  <div className="space-y-4">
                    <div 
                      className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden"
                      style={{
                        backgroundImage: chatIcon ? `url(${chatIcon})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          ref={chatIconInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'icon')}
                        />
                        <Button onClick={() => handleImageUpload('icon')}>
                          Upload Image
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="url"
                          placeholder="Or enter image URL..."
                          value={config.chatIconUrl}
                          onChange={(e) => {
                            setChatIcon(e.target.value);
                            handleConfigChange('chatIconUrl', e.target.value);
                          }}
                          className="flex-1"
                        />
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setChatIcon("");
                            handleConfigChange('chatIconUrl', "");
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Supports JPG, PNG, and SVG files up to 1MB</p>
                  </div>
                </div>

                {/* Chat Background */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Chat Background
                  </label>
                  <div className="space-y-4">
                    <div 
                      className="h-32 w-full rounded-lg bg-gray-200 overflow-hidden"
                      style={{
                        backgroundImage: config.chatBackgroundUrl ? `url(${config.chatBackgroundUrl})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: config.chatBackgroundOpacity
                      }}
                    />
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          ref={backgroundInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'background')}
                        />
                        <Button onClick={() => handleImageUpload('background')}>
                          Upload Background
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="url"
                          placeholder="Or enter image URL..."
                          value={config.chatBackgroundUrl}
                          onChange={(e) => handleConfigChange('chatBackgroundUrl', e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          variant="outline"
                          onClick={() => handleConfigChange('chatBackgroundUrl', "")}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                    
                    {/* Opacity Control */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Background Opacity</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={config.chatBackgroundOpacity}
                          onChange={(e) => handleConfigChange('chatBackgroundOpacity', parseFloat(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-500">
                          {Math.round(config.chatBackgroundOpacity * 100)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Supports JPG, PNG, and SVG files up to 1MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}