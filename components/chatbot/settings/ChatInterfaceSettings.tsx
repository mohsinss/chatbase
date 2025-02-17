'use client'

import { useState, type ChangeEvent, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RefreshCcw, Bold, Italic, Underline, Link2, Undo2, Redo2, AlignLeft, AlignCenter, AlignRight, Send } from 'lucide-react'
import { HexColorPicker } from "react-colorful"
import { CustomNotification } from './GeneralSettings'
import { Input } from "@/components/ui/input"
import toast from 'react-hot-toast'

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
    theme: 'light',
    displayName: "Chatbot",
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
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [chatIcon, setChatIcon] = useState<string>("");
  const profileInputRef = useRef<HTMLInputElement>(null);
  const chatIconInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
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

  const fetchSettings = async () => {
    try {
      console.log('Fetching settings for chatbotId:', chatbotId);
      const response = await fetch(`/api/chatbot/interface-settings?chatbotId=${chatbotId}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log('Fetched settings - Full data:', data);
        console.log('Fetched settings - Background:', {
          url: data.chatBackgroundUrl,
          opacity: data.chatBackgroundOpacity
        });
        
        if (data) {
          const newConfig = {
            ...config,
            ...data,
            chatBackgroundOpacity: data.chatBackgroundOpacity ?? 0.1
          };
          console.log('Setting new config:', newConfig);
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
    setLoading(true);
    try {
      const configToSave = {
        ...config,
        profilePictureUrl: profilePicture,
        chatIconUrl: chatIcon,
        chatBackgroundUrl: config.chatBackgroundUrl,
        chatBackgroundOpacity: config.chatBackgroundOpacity ?? 0.1,
        chatWidth: config.chatWidth
      };

      console.log('Before save - Full config:', configToSave);
      console.log('Before save - Background settings:', {
        url: configToSave.chatBackgroundUrl,
        opacity: configToSave.chatBackgroundOpacity
      });

      const response = await fetch('/api/chatbot/interface-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatbotId,
          ...configToSave
        }),
      });

      const savedData = await response.json();

      if (!response.ok) {
        throw new Error(savedData.error || 'Failed to save settings');
      }

      console.log('After save - Server response:', savedData);
      console.log('After save - Background in response:', {
        url: savedData.chatBackgroundUrl,
        opacity: savedData.chatBackgroundOpacity
      });

      // Verify the save worked
      const verifyResponse = await fetch(`/api/chatbot/interface-settings?chatbotId=${chatbotId}`);
      const verifyData = await verifyResponse.json();
      console.log('Verification fetch - Full data:', verifyData);
      console.log('Verification fetch - Background:', {
        url: verifyData.chatBackgroundUrl,
        opacity: verifyData.chatBackgroundOpacity
      });

      // Update local state
      setConfig(prev => ({
        ...prev,
        ...savedData
      }));

      // Send message to update embedded chat
      window.postMessage({
        type: 'chatbot-settings-update',
        settings: configToSave
      }, '*');
      
      toast.success('Settings saved successfully.')
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to save settings.")
    } finally {
      setLoading(false);
    }
  };

  const [showUserColorPicker, setShowUserColorPicker] = useState(false)
  const [showBubbleColorPicker, setShowBubbleColorPicker] = useState(false)

  const handleConfigChange = (key: keyof ChatConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }))
  }

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
      {/* {notification && (
        <CustomNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )} */}
      <div className="grid grid-cols-[1fr_400px] gap-10 p-4 h-screen">
        {/* Configuration Panel */}
        <div className="space-y-6 overflow-y-auto relative pb-16">
          <h1 className="text-2xl font-bold">Chat Interface</h1>
          
          {/* Initial Messages */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Initial Messages
            </label>
            <textarea 
              value={config.initialMessage}
              onChange={(e) => handleConfigChange('initialMessage', e.target.value)}
              placeholder="Enter each message in a new line."
              className="flex w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[50px]"
            />
            <Button variant="secondary" size="sm" onClick={() => handleReset('initialMessage')}>
              Reset
            </Button>
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
              className="flex w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[50px]"
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
              className="flex h-20 w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

          {/* Footer Editor */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Footer
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
            <textarea 
              value={config.footerText}
              onChange={(e) => handleConfigChange('footerText', e.target.value)}
              className="flex w-[90%] min-h-[50px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Theme
            </label>
            <select
              value={config.theme}
              onChange={(e) => handleConfigChange('theme', e.target.value as 'light' | 'dark')}
              className="flex h-10 w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Display Name
            </label>
            <Input 
              value={config.displayName}
              onChange={(e) => handleConfigChange('displayName', e.target.value)}
              className="flex h-10 w-full max-w-xl"
              placeholder="Enter chatbot name"
            />
          </div>

          {/* Color Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                User Message Color
              </label>
              <div className="flex items-center gap-2">
                <div className="relative">
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
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Chat Bubble Button Color
              </label>
              <div className="flex items-center gap-2">
                <div className="relative">
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

          {/* Alignment Control */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Align Chat Bubble Button
            </label>
            <select
              value={config.bubbleAlignment}
              onChange={(e) => handleConfigChange('bubbleAlignment', e.target.value as 'left' | 'right')}
              className="flex h-10 w-[100px] max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>

          {/* Auto Show Delay */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Auto show initial messages pop-ups after
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="number"
                value={config.autoShowDelay}
                onChange={(e) => handleConfigChange('autoShowDelay', parseInt(e.target.value))}
                min="-1"
                className="flex h-10 w-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <span className="text-sm text-gray-500">seconds (negative to disable)</span>
            </div>
          </div>

          {/* Chat Window Width */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Chat Window Width
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="number"
                value={config.chatWidth}
                onChange={(e) => handleConfigChange('chatWidth', Math.max(300, Math.min(800, parseInt(e.target.value))))}
                min="300"
                max="800"
                className="flex h-10 w-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <span className="text-sm text-gray-500">pixels (300-800)</span>
            </div>
          </div>

          {/* Image Uploads */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Profile Picture
              </label>
              <div className="space-y-4">
                {/* Preview */}
                <div 
                  className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden"
                  style={{
                    backgroundImage: profilePicture ? `url(${profilePicture})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                {/* Upload controls */}
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

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Chat Icon
              </label>
              <div className="space-y-4">
                {/* Preview */}
                <div 
                  className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden"
                  style={{
                    backgroundImage: chatIcon ? `url(${chatIcon})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                {/* Upload controls */}
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
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Chat Background
            </label>
            <div className="space-y-4">
              {/* Preview */}
              <div 
                className="h-32 w-full rounded-lg bg-gray-200 overflow-hidden"
                style={{
                  backgroundImage: config.chatBackgroundUrl ? `url(${config.chatBackgroundUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: config.chatBackgroundOpacity
                }}
              />
              {/* Upload controls */}
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
                    step="0.1"
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
          <div className="bottom-0 pb-4 pt-2 bg-background">
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        {/* Preview Panel - Add position relative and move to right */}
        <div className="relative">
          <Card 
            className="h-full flex flex-col max-h-[70%] absolute right-0" 
            style={{ width: `${config.chatWidth}px` }}
          >
            <div 
              className={`p-4 border-b flex items-center justify-between ${
                config.roundedHeaderCorners ? 'rounded-t-xl' : ''
              }`}
              style={{
                backgroundColor: config.syncColors ? config.userMessageColor : undefined,
                color: config.syncColors ? 'white' : undefined
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
              className="flex-1 p-4 space-y-4 overflow-y-auto relative"
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
                    backgroundColor: 'white',
                    opacity: 1 - config.chatBackgroundOpacity
                  }}
                />
              )}
              {/* Keep existing chat messages */}
              <div className="relative z-10">
                <div className={`bg-gray-100 p-3 ${
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
                className="absolute -bottom-5 right-14 h-12 w-12 rounded-full shadow-lg overflow-hidden cursor-pointer"
                style={{
                  backgroundImage: `url(${config.chatIconUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            )}

            <div className="p-4 border-t">
              {/* Suggested Messages - display only */}
              <div className="mb-4 flex flex-wrap gap-2">
                {config.suggestedMessages.split('\n').filter(msg => msg.trim()).map((message, index) => (
                  <button
                    key={index}
                    className="px-4 py-2 bg-gray-100 rounded-full text-sm"
                  >
                    {message}
                  </button>
                ))}
              </div>

              {/* Message input area */}
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder={config.messagePlaceholder}
                  className={`flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ${
                    config.roundedChatCorners ? 'rounded-lg' : 'rounded-md'
                  }`}
                />
                <Button size="icon" className={config.roundedChatCorners ? 'rounded-lg' : ''}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Footer */}
              <div className="mt-2 text-center text-sm text-gray-500 flex items-center justify-center gap-1">
                <span>Powered By ChatSA.co</span>
                <span>{config.footerText}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

