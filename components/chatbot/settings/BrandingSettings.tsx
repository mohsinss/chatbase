'use client'

import { useState, type ChangeEvent, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RefreshCcw, Send, X, Download } from 'lucide-react'
import { HexColorPicker } from "react-colorful"
import { Input } from "@/components/ui/input"
import toast from 'react-hot-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatbotBrandingSettings, defaultBrandingSettings } from '@/models/ChatbotBrandingSettings'
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Custom event for branding settings updates
export const BRANDING_UPDATED_EVENT = 'brandingSettingsUpdated';

interface BrandingSettingsProps {
  chatbotId: string;
}

export default function BrandingSettings({ chatbotId }: BrandingSettingsProps) {
  const [config, setConfig] = useState<ChatbotBrandingSettings>(defaultBrandingSettings)
  const [loading, setLoading] = useState(false)
  const [logo, setLogo] = useState<string>("")
  const [header, setHeader] = useState<string>("")
  const [enlargedImage, setEnlargedImage] = useState<string>("")
  const [showEnlargedImage, setShowEnlargedImage] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const headerInputRef = useRef<HTMLInputElement>(null)
  const [selectedStyle, setSelectedStyle] = useState<string>("default")
  const [showTextColorPicker, setShowTextColorPicker] = useState(false)
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(false)
  const [showHeaderTextColorPicker, setShowHeaderTextColorPicker] = useState(false)
  const textColorPickerRef = useRef<HTMLDivElement>(null)
  const backgroundColorPickerRef = useRef<HTMLDivElement>(null)
  const headerTextColorPickerRef = useRef<HTMLDivElement>(null)

  const stylePresets = {
    default: {
      background: "#ffffff",
      text: "#000000",
      button: "#3b82f6",
      buttonShadow: "#1d4ed8",
      accent: "#10b981"
    },
    dark: {
      background: "#1f2937",
      text: "#f3f4f6",
      button: "#6366f1",
      buttonShadow: "#4f46e5",
      accent: "#8b5cf6"
    },
    light: {
      background: "#f9fafb",
      text: "#111827",
      button: "#f59e0b",
      buttonShadow: "#d97706",
      accent: "#ec4899"
    },
    modern: {
      background: "#f8fafc",
      text: "#0f172a",
      button: "#06b6d4",
      buttonShadow: "#0891b2",
      accent: "#f43f5e"
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [chatbotId])

  // Ensure header properties are never undefined in the UI
  useEffect(() => {
    const updatedConfig = {...config};
    let needsUpdate = false;
    
    if (config.headerText === undefined) {
      console.log("[FRONTEND] Fixing undefined headerText in config");
      updatedConfig.headerText = "";
      needsUpdate = true;
    }
    
    if (config.headerTextColor === undefined) {
      console.log("[FRONTEND] Fixing undefined headerTextColor in config");
      updatedConfig.headerTextColor = "#ffffff";
      needsUpdate = true;
    }
    
    if (config.headerFontSize === undefined) {
      console.log("[FRONTEND] Fixing undefined headerFontSize in config");
      updatedConfig.headerFontSize = "3rem";
      needsUpdate = true;
    }
    
    if (config.headerFontFamily === undefined) {
      console.log("[FRONTEND] Fixing undefined headerFontFamily in config");
      updatedConfig.headerFontFamily = "Inter, sans-serif";
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      setConfig(updatedConfig);
    }
  }, [config.headerText, config.headerTextColor, config.headerFontSize, config.headerFontFamily]);

  // Handle clicking outside color pickers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close text color picker when clicking outside
      if (textColorPickerRef.current && !textColorPickerRef.current.contains(event.target as Node)) {
        setShowTextColorPicker(false);
      }
      
      // Close background color picker when clicking outside
      if (backgroundColorPickerRef.current && !backgroundColorPickerRef.current.contains(event.target as Node)) {
        setShowBackgroundColorPicker(false);
      }
      
      // Close header text color picker when clicking outside
      if (headerTextColorPickerRef.current && !headerTextColorPickerRef.current.contains(event.target as Node)) {
        setShowHeaderTextColorPicker(false);
      }
    }
    
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/chatbot/branding-settings?chatbotId=${chatbotId}`)
      const data = await response.json()
      
      if (response.ok) {
        console.log("[Frontend GET] Fetched branding settings:", data)
        console.log("[Frontend GET] headerText in response:", data.headerText)
        console.log("[Frontend GET] headerTextColor in response:", data.headerTextColor)
        console.log("[Frontend GET] headerFontSize in response:", data.headerFontSize)
        console.log("[Frontend GET] headerFontFamily in response:", data.headerFontFamily)
        
        setConfig({
          ...defaultBrandingSettings,
          ...data
        })
        
        console.log("[Frontend GET] Config after update:", {
          ...defaultBrandingSettings,
          ...data
        })
        console.log("[Frontend GET] headerText in config:", data.headerText)
        console.log("[Frontend GET] headerTextColor in config:", data.headerTextColor)
        console.log("[Frontend GET] headerFontSize in config:", data.headerFontSize)
        console.log("[Frontend GET] headerFontFamily in config:", data.headerFontFamily)
        
        setLogo(data.logoUrl || "")
        setHeader(data.headerUrl || "")
        
        // Find matching preset based on current colors
        const currentColors = {
          background: data.backgroundColor || defaultBrandingSettings.backgroundColor,
          text: data.textColor || defaultBrandingSettings.textColor,
          button: data.primaryColor || defaultBrandingSettings.primaryColor,
          buttonShadow: data.secondaryColor || defaultBrandingSettings.secondaryColor,
          accent: data.accentColor || defaultBrandingSettings.accentColor
        }
        
        const matchingPreset = Object.entries(stylePresets).find(([_, preset]) => 
          Object.entries(preset).every(([key, value]) => 
            currentColors[key as keyof typeof currentColors] === value
          )
        )
        
        setSelectedStyle(matchingPreset ? matchingPreset[0] : "default")
      } else {
        throw new Error(data.error || 'Failed to fetch settings')
      }
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error("Failed to load settings.")
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true);
      
      console.log("[Frontend SAVE] Current config before save:", config);
      console.log("[Frontend SAVE] headerText in config:", config.headerText);
      console.log("[Frontend SAVE] headerTextColor in config:", config.headerTextColor);
      console.log("[Frontend SAVE] headerFontSize in config:", config.headerFontSize);
      console.log("[Frontend SAVE] headerFontFamily in config:", config.headerFontFamily);
      
      const requestPayload = {
        chatbotId,
        logoUrl: logo,
        headerUrl: header,
        logoLink: config.logoLink,
        headerText: config.headerText,
        headerTextColor: config.headerTextColor,
        headerFontSize: config.headerFontSize,
        headerFontFamily: config.headerFontFamily,
        primaryColor: config.primaryColor,
        secondaryColor: config.secondaryColor,
        accentColor: config.accentColor,
        textColor: config.textColor,
        backgroundColor: config.backgroundColor,
      };
      
      console.log("[Frontend SAVE] Payload being sent:", requestPayload);
      console.log("[Frontend SAVE] headerText in payload:", requestPayload.headerText);
      console.log("[Frontend SAVE] headerTextColor in payload:", requestPayload.headerTextColor);
      console.log("[Frontend SAVE] headerFontSize in payload:", requestPayload.headerFontSize);
      console.log("[Frontend SAVE] headerFontFamily in payload:", requestPayload.headerFontFamily);
      
      const response = await fetch('/api/chatbot/branding-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      const savedData = await response.json();
      console.log("[Frontend SAVE] Response from API:", savedData);
      console.log("[Frontend SAVE] headerText in response:", savedData.headerText);
      console.log("[Frontend SAVE] headerTextColor in response:", savedData.headerTextColor);
      console.log("[Frontend SAVE] headerFontSize in response:", savedData.headerFontSize);
      console.log("[Frontend SAVE] headerFontFamily in response:", savedData.headerFontFamily);

      if (!response.ok) {
        throw new Error(savedData.error || savedData.details || 'Failed to save settings');
      }

      // Update local state with saved data
      setConfig(prev => {
        const newConfig = {
          ...prev,
          ...savedData
        };
        console.log("[Frontend SAVE] Updated config:", newConfig);
        console.log("[Frontend SAVE] headerText in updated config:", newConfig.headerText);
        console.log("[Frontend SAVE] headerTextColor in updated config:", newConfig.headerTextColor);
        console.log("[Frontend SAVE] headerFontSize in updated config:", newConfig.headerFontSize);
        console.log("[Frontend SAVE] headerFontFamily in updated config:", newConfig.headerFontFamily);
        return newConfig;
      });
      
      // Dispatch custom event with updated branding settings to notify DashboardNav
      const brandingUpdatedEvent = new CustomEvent(BRANDING_UPDATED_EVENT, { 
        detail: {
          ...requestPayload,
          chatbotId
        }
      });
      window.dispatchEvent(brandingUpdatedEvent);
      
      toast.success('Settings saved successfully.')
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to save settings.")
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (key: keyof ChatbotBrandingSettings, value: any) => {
    if (key === 'headerText') {
      console.log(`[Frontend CHANGE] Setting headerText to: "${value}"`);
    }
    
    setConfig(prev => {
      const updated = {
        ...prev,
        [key]: value
      };
      
      if (key === 'headerText') {
        console.log(`[Frontend CHANGE] Updated config headerText: "${updated.headerText}"`);
      }
      
      return updated;
    });
  }

  const handleImageUpload = async (type: 'logo' | 'header') => {
    const inputRef = type === 'logo' ? logoInputRef : headerInputRef
    inputRef.current?.click()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>, type: 'logo' | 'header') => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 1024 * 1024) {
      toast.error("File size must be less than 1MB")
      return
    }

    if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
      toast.error("Only JPG, PNG, and SVG files are supported.")
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('chatbotId', chatbotId)
      formData.append('imageType', type)

      const response = await fetch('/api/chatbot/upload-image', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Upload failed')
      }

      if (type === 'logo') {
        setLogo(data.url)
        handleConfigChange('logoUrl', data.url)
      } else {
        setHeader(data.url)
        handleConfigChange('headerUrl', data.url)
      }
      
      toast.success("Image uploaded successfully.")
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : "Failed to upload image.")
    }
  }

  const handleReset = (field: keyof ChatbotBrandingSettings) => {
    if (field in defaultBrandingSettings) {
      handleConfigChange(field, defaultBrandingSettings[field])
    }
  }

  const handleStyleChange = (style: string) => {
    setSelectedStyle(style)
    const preset = stylePresets[style as keyof typeof stylePresets]
    setConfig(prev => ({
      ...prev,
      backgroundColor: preset.background,
      textColor: preset.text,
      primaryColor: preset.button,
      secondaryColor: preset.buttonShadow,
      accentColor: preset.accent
    }))
  }

  const handleImageClick = (imageUrl: string) => {
    if (imageUrl) {
      setEnlargedImage(imageUrl)
      setShowEnlargedImage(true)
    }
  }

  const handleDownload = () => {
    if (enlargedImage) {
      const link = document.createElement('a')
      link.href = enlargedImage
      link.download = 'image'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Branding</h1>
        <Button 
          className="w-[200px]" 
          size="lg" 
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto pr-4">
        <Tabs defaultValue="logo" className="space-y-6">
          <TabsList>
            <TabsTrigger value="logo">Logo</TabsTrigger>
            <TabsTrigger value="header">Header</TabsTrigger>
            <TabsTrigger value="colors">Branding Colors</TabsTrigger>
          </TabsList>

          <TabsContent value="logo" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Logo
                  </label>
                  <div className="space-y-4">
                    <div 
                      className="h-32 w-32 rounded-lg bg-gray-200 overflow-hidden cursor-pointer"
                      style={{
                        backgroundImage: logo ? `url(${logo})` : 'none',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                      onClick={() => handleImageClick(logo)}
                    />
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          ref={logoInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'logo')}
                        />
                        <Button onClick={() => handleImageUpload('logo')}>
                          Upload Logo
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="url"
                          placeholder="Or enter image URL..."
                          value={logo}
                          onChange={(e) => {
                            setLogo(e.target.value)
                            handleConfigChange('logoUrl', e.target.value)
                          }}
                          className="flex-1"
                        />
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setLogo("")
                            handleConfigChange('logoUrl', "")
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
                  <label className="text-sm font-medium leading-none">
                    Logo Link
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="Enter URL to link the logo to..."
                      value={config.logoLink}
                      onChange={(e) => handleConfigChange('logoLink', e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline"
                      onClick={() => handleConfigChange('logoLink', "")}
                    >
                      Clear
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">Leave empty to disable logo link</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="header" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Header Image
                  </label>
                  <div className="space-y-4">
                    <div 
                      className="h-48 w-full rounded-lg bg-gray-200 overflow-hidden cursor-pointer relative"
                      style={{
                        backgroundImage: header ? `url(${header})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                      onClick={() => handleImageClick(header)}
                    >
                      {config.headerText && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <h2 className="font-bold drop-shadow-lg p-4 text-center"
                              style={{
                                textShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
                                color: config.headerTextColor || defaultBrandingSettings.headerTextColor,
                                fontSize: config.headerFontSize || defaultBrandingSettings.headerFontSize,
                                fontFamily: config.headerFontFamily || defaultBrandingSettings.headerFontFamily
                              }}>
                            {config.headerText}
                          </h2>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          ref={headerInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'header')}
                        />
                        <Button onClick={() => handleImageUpload('header')}>
                          Upload Header
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="url"
                          placeholder="Or enter image URL..."
                          value={header}
                          onChange={(e) => {
                            setHeader(e.target.value)
                            handleConfigChange('headerUrl', e.target.value)
                          }}
                          className="flex-1"
                        />
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setHeader("")
                            handleConfigChange('headerUrl', "")
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
                  <label className="text-sm font-medium leading-none">
                    Header Text
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter text to display on header..."
                      value={config.headerText}
                      onChange={(e) => handleConfigChange('headerText', e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline"
                      onClick={() => handleConfigChange('headerText', "")}
                    >
                      Clear
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">Text will be displayed centered on the header image</p>
                </div>

                {/* Header Text Color */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Header Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative" ref={headerTextColorPickerRef}>
                      <div 
                        className="w-8 h-8 rounded-full border cursor-pointer"
                        style={{ backgroundColor: config.headerTextColor || defaultBrandingSettings.headerTextColor }}
                        onClick={() => setShowHeaderTextColorPicker(!showHeaderTextColorPicker)}
                      />
                      {showHeaderTextColorPicker && (
                        <div className="absolute top-full left-0 mt-1 z-50 border border-gray-300 rounded-md shadow-lg bg-white p-2">
                          <HexColorPicker 
                            color={config.headerTextColor || defaultBrandingSettings.headerTextColor} 
                            onChange={(color) => handleConfigChange('headerTextColor', color)} 
                          />
                        </div>
                      )}
                    </div>
                    <Input
                      type="text"
                      placeholder="#ffffff"
                      value={config.headerTextColor || defaultBrandingSettings.headerTextColor}
                      onChange={(e) => handleConfigChange('headerTextColor', e.target.value)}
                      className="w-24"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleConfigChange('headerTextColor', defaultBrandingSettings.headerTextColor)}
                    >
                      Reset
                    </Button>
                  </div>
                </div>

                {/* Header Font Size */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Header Font Size
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={config.headerFontSize || defaultBrandingSettings.headerFontSize}
                      onChange={(e) => handleConfigChange('headerFontSize', e.target.value)}
                      className="select select-bordered flex-1"
                    >
                      <option value="1.5rem">Small</option>
                      <option value="2rem">Medium</option>
                      <option value="3rem">Large</option>
                      <option value="4rem">Extra Large</option>
                    </select>
                    <Button 
                      variant="outline"
                      onClick={() => handleConfigChange('headerFontSize', defaultBrandingSettings.headerFontSize)}
                    >
                      Reset
                    </Button>
                  </div>
                </div>

                {/* Header Font Family */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Header Font Family
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={config.headerFontFamily || defaultBrandingSettings.headerFontFamily}
                      onChange={(e) => handleConfigChange('headerFontFamily', e.target.value)}
                      className="select select-bordered flex-1"
                      style={{ fontFamily: config.headerFontFamily || defaultBrandingSettings.headerFontFamily }}
                    >
                      <option value="Inter, sans-serif" style={{ fontFamily: "Inter, sans-serif" }}>Inter</option>
                      <option value="Arial, sans-serif" style={{ fontFamily: "Arial, sans-serif" }}>Arial</option>
                      <option value="'Times New Roman', serif" style={{ fontFamily: "'Times New Roman', serif" }}>Times New Roman</option>
                      <option value="Georgia, serif" style={{ fontFamily: "Georgia, serif" }}>Georgia</option>
                      <option value="'Courier New', monospace" style={{ fontFamily: "'Courier New', monospace" }}>Courier New</option>
                      <option value="'Trebuchet MS', sans-serif" style={{ fontFamily: "'Trebuchet MS', sans-serif" }}>Trebuchet MS</option>
                      <option value="Verdana, sans-serif" style={{ fontFamily: "Verdana, sans-serif" }}>Verdana</option>
                    </select>
                    <Button 
                      variant="outline"
                      onClick={() => handleConfigChange('headerFontFamily', defaultBrandingSettings.headerFontFamily)}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="colors" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      Style Presets
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.keys(stylePresets).map((style) => (
                        <div
                          key={style}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedStyle === style ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => handleStyleChange(style)}
                          style={{
                            backgroundColor: stylePresets[style as keyof typeof stylePresets].background,
                            color: stylePresets[style as keyof typeof stylePresets].text
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium capitalize">{style}</span>
                            <div className="flex gap-1">
                              <div 
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: stylePresets[style as keyof typeof stylePresets].button }}
                              />
                              <div 
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: stylePresets[style as keyof typeof stylePresets].accent }}
                              />
                            </div>
                          </div>
                          <div className="h-8 rounded-md"
                            style={{ 
                              backgroundColor: stylePresets[style as keyof typeof stylePresets].button,
                              boxShadow: `0 4px 6px -1px ${stylePresets[style as keyof typeof stylePresets].buttonShadow}`
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">
                        Text Color
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative" ref={textColorPickerRef}>
                          <div 
                            className="w-8 h-8 rounded-full border cursor-pointer"
                            style={{ backgroundColor: config.textColor }}
                            onClick={() => setShowTextColorPicker(!showTextColorPicker)}
                          />
                          {showTextColorPicker && (
                            <div className="absolute top-full left-0 mt-1 z-50 border border-gray-300 rounded-md shadow-lg bg-white p-2">
                              <HexColorPicker 
                                color={config.textColor} 
                                onChange={(color) => handleConfigChange('textColor', color)} 
                              />
                            </div>
                          )}
                        </div>
                        <Button variant="secondary" size="sm" onClick={() => handleReset('textColor')}>
                          Reset
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">
                        Background Color
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative" ref={backgroundColorPickerRef}>
                          <div 
                            className="w-8 h-8 rounded-full border cursor-pointer"
                            style={{ backgroundColor: config.backgroundColor }}
                            onClick={() => setShowBackgroundColorPicker(!showBackgroundColorPicker)}
                          />
                          {showBackgroundColorPicker && (
                            <div className="absolute top-full left-0 mt-1 z-50 border border-gray-300 rounded-md shadow-lg bg-white p-2">
                              <HexColorPicker 
                                color={config.backgroundColor} 
                                onChange={(color) => handleConfigChange('backgroundColor', color)} 
                              />
                            </div>
                          )}
                        </div>
                        <Button variant="secondary" size="sm" onClick={() => handleReset('backgroundColor')}>
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showEnlargedImage} onOpenChange={setShowEnlargedImage}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          <div className="relative flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEnlargedImage(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 p-4 flex items-center justify-center overflow-auto">
              <div className="relative">
                <img 
                  src={enlargedImage} 
                  alt="Enlarged view" 
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                {config.headerText && enlargedImage === header && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="font-bold drop-shadow-lg p-4 text-center"
                        style={{
                          textShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
                          color: config.headerTextColor || defaultBrandingSettings.headerTextColor,
                          fontSize: config.headerFontSize || defaultBrandingSettings.headerFontSize,
                          fontFamily: config.headerFontFamily || defaultBrandingSettings.headerFontFamily
                        }}>
                      {config.headerText}
                    </h2>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 