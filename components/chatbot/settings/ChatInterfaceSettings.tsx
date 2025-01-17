'use client'

import { useState, type ChangeEvent, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RefreshCcw, Bold, Italic, Underline, Link2, Undo2, Redo2, AlignLeft, AlignCenter, AlignRight, Send } from 'lucide-react'
import { HexColorPicker } from "react-colorful"
import { CustomNotification } from './GeneralSettings'
import { Input } from "@/components/ui/input"

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
}

interface ChatInterfaceSettingsProps {
  chatbotId: string;
}

export default function ChatInterfaceSettings({ chatbotId }: ChatInterfaceSettingsProps) {
  const [config, setConfig] = useState<ChatConfig>({
    initialMessage: "Hi! What can I help you with?",
    suggestedMessages: "What is example.com?",
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
    chatIconUrl: ""
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

  useEffect(() => {
    fetchSettings();
  }, [chatbotId]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/chatbot/interface-settings?chatbotId=${chatbotId}`);
      const data = await response.json();
      
      if (data) {
        setConfig(prev => ({
          ...prev,
          ...data
        }));
        setProfilePicture(data.profilePictureUrl || "");
        setChatIcon(data.chatIconUrl || "");
      }
    } catch (error) {
      setNotification({
        message: "Failed to load settings",
        type: "error"
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/chatbot/interface-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatbotId,
          ...config
        }),
      });

      if (!response.ok) throw new Error();

      setNotification({
        message: "Settings saved successfully",
        type: "success"
      });
    } catch (error) {
      setNotification({
        message: "Failed to save settings",
        type: "error"
      });
    }
    setLoading(false);
  };

  const [showUserColorPicker, setShowUserColorPicker] = useState(false)
  const [showBubbleColorPicker, setShowBubbleColorPicker] = useState(false)

  const handleConfigChange = (key: keyof ChatConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleImageUpload = async (type: 'profile' | 'icon') => {
    const inputRef = type === 'profile' ? profileInputRef : chatIconInputRef;
    inputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>, type: 'profile' | 'icon') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (1MB limit)
    if (file.size > 1024 * 1024) {
      setNotification({
        message: "File size must be less than 1MB",
        type: "error"
      });
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
      setNotification({
        message: "Only JPG, PNG, and SVG files are supported",
        type: "error"
      });
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

      // Update state and config
      if (type === 'profile') {
        setProfilePicture(data.url);
        handleConfigChange('profilePictureUrl', data.url);
      } else {
        setChatIcon(data.url);
        handleConfigChange('chatIconUrl', data.url);
      }

      setNotification({
        message: "Image uploaded successfully",
        type: "success"
      });
    } catch (error) {
      console.error('Upload error:', error);
      setNotification({
        message: error instanceof Error ? error.message : "Failed to upload image",
        type: "error"
      });
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
      {notification && (
        <CustomNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
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
              className="flex h-10 w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
              className="flex mx-auto w-[90%] min-h-[50px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
              className="flex h-10 w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <span className="text-sm text-gray-500">seconds (negative to disable)</span>
            </div>
          </div>

          {/* Image Uploads */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div 
                  className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden"
                  style={{
                    backgroundImage: profilePicture ? `url(${profilePicture})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
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
              <p className="text-sm text-gray-500">Supports JPG, PNG, and SVG files up to 1MB</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Chat Icon
              </label>
              <div className="flex items-center gap-4">
                <div 
                  className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden"
                  style={{
                    backgroundImage: chatIcon ? `url(${chatIcon})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
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
              <p className="text-sm text-gray-500">Supports JPG, PNG, and SVG files up to 1MB</p>
            </div>
          </div>
          <div className="sticky bottom-0 pb-4 pt-2 bg-background">
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

        {/* Preview Panel */}
        <Card className="h-full flex flex-col">
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

          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className={`bg-gray-100 p-3 ${
              config.roundedChatCorners ? 'rounded-xl' : 'rounded-lg'
            } max-w-[80%]`}>
              {config.initialMessage}
            </div>
            <div 
              className={`ml-auto p-3 ${
                config.roundedChatCorners ? 'rounded-xl' : 'rounded-lg'
              } max-w-[80%] text-white`}
              style={{ backgroundColor: config.userMessageColor }}
            >
              Hello
            </div>
          </div>

          {/* Chat Icon in the bottom right */}
          {config.chatIconUrl && (
            <div 
              className="absolute bottom-20 right-4 h-12 w-12 rounded-full shadow-lg overflow-hidden cursor-pointer"
              style={{
                backgroundImage: `url(${config.chatIconUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          )}

          <div className="p-4 border-t">
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
            <div className="mt-2 text-center text-sm text-gray-500 flex items-center justify-center gap-1">
              <span>Powered By ChatSA.co</span>
              <span>{config.footerText}</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}

