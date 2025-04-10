'use client'

import { useState, type ChangeEvent, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RefreshCcw, Send } from 'lucide-react'
import { HexColorPicker } from "react-colorful"
import { Input } from "@/components/ui/input"
import toast from 'react-hot-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatbotBrandingSettings, defaultBrandingSettings } from '@/models/ChatbotBrandingSettings'

interface BrandingSettingsProps {
  chatbotId: string;
}

export default function BrandingSettings({ chatbotId }: BrandingSettingsProps) {
  const [config, setConfig] = useState<ChatbotBrandingSettings>(defaultBrandingSettings)
  const [loading, setLoading] = useState(false)
  const [logo, setLogo] = useState<string>("")
  const [header, setHeader] = useState<string>("")
  const logoInputRef = useRef<HTMLInputElement>(null)
  const headerInputRef = useRef<HTMLInputElement>(null)
  const [selectedStyle, setSelectedStyle] = useState<string>("default")
  const [showTextColorPicker, setShowTextColorPicker] = useState(false)
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(false)
  const textColorPickerRef = useRef<HTMLDivElement>(null)
  const backgroundColorPickerRef = useRef<HTMLDivElement>(null)

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

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/chatbot/branding-settings?chatbotId=${chatbotId}`)
      const data = await response.json()
      
      if (response.ok) {
        setConfig({
          ...defaultBrandingSettings,
          ...data
        })
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
      
      const requestPayload = {
        chatbotId,
        ...config,
        logoUrl: logo,
        headerUrl: header,
        selectedStyle // Include the selected style in the payload
      };
      
      const response = await fetch('/api/chatbot/branding-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      const savedData = await response.json();

      if (!response.ok) {
        throw new Error(savedData.error || savedData.details || 'Failed to save settings');
      }

      // Update local state with saved data
      setConfig(prev => ({
        ...prev,
        ...savedData
      }));
      
      toast.success('Settings saved successfully.')
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to save settings.")
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (key: keyof ChatbotBrandingSettings, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }))
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
                      className="h-32 w-32 rounded-lg bg-gray-200 overflow-hidden"
                      style={{
                        backgroundImage: logo ? `url(${logo})` : 'none',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
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
                      className="h-48 w-full rounded-lg bg-gray-200 overflow-hidden"
                      style={{
                        backgroundImage: header ? `url(${header})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
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
                            <div className="absolute top-full mt-2 z-10">
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
                            <div className="absolute top-full mt-2 z-10">
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
    </div>
  )
} 