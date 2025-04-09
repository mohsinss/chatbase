'use client'

import { useState, type ChangeEvent, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RefreshCcw, Send } from 'lucide-react'
import { HexColorPicker } from "react-colorful"
import { Input } from "@/components/ui/input"
import toast from 'react-hot-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BrandingConfig {
  logoUrl: string
  headerUrl: string
  logoLink: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  textColor: string
  backgroundColor: string
}

interface BrandingSettingsProps {
  chatbotId: string;
}

const defaultConfig: BrandingConfig = {
  logoUrl: "",
  headerUrl: "",
  logoLink: "",
  primaryColor: "#4285f4",
  secondaryColor: "#34a853",
  accentColor: "#fbbc05",
  textColor: "#202124",
  backgroundColor: "#ffffff"
}

export default function BrandingSettings({ chatbotId }: BrandingSettingsProps) {
  const [config, setConfig] = useState<BrandingConfig>(defaultConfig)
  const [loading, setLoading] = useState(false)
  const [logo, setLogo] = useState<string>("")
  const [header, setHeader] = useState<string>("")
  const logoInputRef = useRef<HTMLInputElement>(null)
  const headerInputRef = useRef<HTMLInputElement>(null)
  const [showPrimaryColorPicker, setShowPrimaryColorPicker] = useState(false)
  const [showSecondaryColorPicker, setShowSecondaryColorPicker] = useState(false)
  const [showAccentColorPicker, setShowAccentColorPicker] = useState(false)
  const [showTextColorPicker, setShowTextColorPicker] = useState(false)
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(false)
  const primaryColorPickerRef = useRef<HTMLDivElement>(null)
  const secondaryColorPickerRef = useRef<HTMLDivElement>(null)
  const accentColorPickerRef = useRef<HTMLDivElement>(null)
  const textColorPickerRef = useRef<HTMLDivElement>(null)
  const backgroundColorPickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchSettings()
  }, [chatbotId])

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/chatbot/branding-settings?chatbotId=${chatbotId}`)
      const data = await response.json()
      
      if (response.ok) {
        setConfig({
          ...defaultConfig,
          ...data
        })
        setLogo(data.logoUrl || "")
        setHeader(data.headerUrl || "")
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
      
      // Prepare the request payload
      const requestPayload = {
        chatbotId,
        logoUrl: logo,
        headerUrl: header,
        logoLink: config.logoLink,
        primaryColor: config.primaryColor,
        secondaryColor: config.secondaryColor,
        accentColor: config.accentColor,
        textColor: config.textColor,
        backgroundColor: config.backgroundColor
      };
      
      console.log('Request payload:', JSON.stringify(requestPayload));

      const response = await fetch('/api/chatbot/branding-settings', {
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

      console.log('After save - Server response:', savedData);

      // Verify the save worked
      const verifyResponse = await fetch(`/api/chatbot/branding-settings?chatbotId=${chatbotId}`);
      const verifyData = await verifyResponse.json();
      console.log('Verification fetch - Full data:', verifyData);

      // Update local state
      setConfig(prev => ({
        ...prev,
        ...savedData
      }));
      
      toast.success('Settings saved successfully.')
    } catch (error) {
      console.error('Save error:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      
      toast.error(error instanceof Error ? error.message : "Failed to save settings.")
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (key: keyof BrandingConfig, value: any) => {
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

  const handleReset = (field: keyof BrandingConfig) => {
    const defaults: Partial<BrandingConfig> = {
      primaryColor: "#4285f4",
      secondaryColor: "#34a853",
      accentColor: "#fbbc05",
      textColor: "#202124",
      backgroundColor: "#ffffff"
    }
    if (field in defaults) {
      handleConfigChange(field, defaults[field])
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (primaryColorPickerRef.current && !primaryColorPickerRef.current.contains(event.target as Node)) {
        setShowPrimaryColorPicker(false)
      }
      if (secondaryColorPickerRef.current && !secondaryColorPickerRef.current.contains(event.target as Node)) {
        setShowSecondaryColorPicker(false)
      }
      if (accentColorPickerRef.current && !accentColorPickerRef.current.contains(event.target as Node)) {
        setShowAccentColorPicker(false)
      }
      if (textColorPickerRef.current && !textColorPickerRef.current.contains(event.target as Node)) {
        setShowTextColorPicker(false)
      }
      if (backgroundColorPickerRef.current && !backgroundColorPickerRef.current.contains(event.target as Node)) {
        setShowBackgroundColorPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">xx Branding</h1>
        <Button 
          className="w-[200px]" 
          size="lg" 
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>

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
                    Primary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative" ref={primaryColorPickerRef}>
                      <div 
                        className="w-8 h-8 rounded-full border cursor-pointer"
                        style={{ backgroundColor: config.primaryColor }}
                        onClick={() => setShowPrimaryColorPicker(!showPrimaryColorPicker)}
                      />
                      {showPrimaryColorPicker && (
                        <div className="absolute top-full mt-2 z-10">
                          <HexColorPicker 
                            color={config.primaryColor} 
                            onChange={(color) => handleConfigChange('primaryColor', color)} 
                          />
                        </div>
                      )}
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => handleReset('primaryColor')}>
                      Reset
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Secondary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative" ref={secondaryColorPickerRef}>
                      <div 
                        className="w-8 h-8 rounded-full border cursor-pointer"
                        style={{ backgroundColor: config.secondaryColor }}
                        onClick={() => setShowSecondaryColorPicker(!showSecondaryColorPicker)}
                      />
                      {showSecondaryColorPicker && (
                        <div className="absolute top-full mt-2 z-10">
                          <HexColorPicker 
                            color={config.secondaryColor} 
                            onChange={(color) => handleConfigChange('secondaryColor', color)} 
                          />
                        </div>
                      )}
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => handleReset('secondaryColor')}>
                      Reset
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative" ref={accentColorPickerRef}>
                      <div 
                        className="w-8 h-8 rounded-full border cursor-pointer"
                        style={{ backgroundColor: config.accentColor }}
                        onClick={() => setShowAccentColorPicker(!showAccentColorPicker)}
                      />
                      {showAccentColorPicker && (
                        <div className="absolute top-full mt-2 z-10">
                          <HexColorPicker 
                            color={config.accentColor} 
                            onChange={(color) => handleConfigChange('accentColor', color)} 
                          />
                        </div>
                      )}
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => handleReset('accentColor')}>
                      Reset
                    </Button>
                  </div>
                </div>

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
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 