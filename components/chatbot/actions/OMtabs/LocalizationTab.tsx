import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"

interface LocalizationTabProps {
  categories: { id: string; name: string }[]
  menuItems: {
    id: string
    name: string
    description: string
    category: string
  }[]
  metadata: {
    messageTemplate?: string
    followUpSettings?: {
      messageTemplate: string
      suggestItems: boolean
    }
  }
  initialTranslations?: Translations
  onUpdateTranslations: (translations: any) => void
}

interface Translations {
  [language: string]: {
    [section: string]: {
      [key: string]: any
    }
  }
}

const SUPPORTED_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'nl', label: 'Dutch' },
  { value: 'pl', label: 'Polish' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ar', label: 'Arabic' }
]

const LocalizationTab = ({
  categories,
  menuItems,
  metadata,
  initialTranslations,
  onUpdateTranslations
}: LocalizationTabProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [translations, setTranslations] = useState<Translations>(initialTranslations || {})
  const [isGenerating, setIsGenerating] = useState<{ [key: string]: boolean }>({})

  // Initialize English translations if no translations exist
  useEffect(() => {
    console.log('LocalizationTab mounted with translations:', translations);
    if (!translations.en) {
      console.log('Initializing English translations');
      const englishTranslations: Translations = {
        en: {
          categories: categories.reduce((acc, category) => ({
            ...acc,
            [category.id]: category.name
          }), {}),
          messages: {
            orderTemplate: metadata.messageTemplate || '',
            followUpTemplate: metadata.followUpSettings?.messageTemplate || '',
            // UI translations
            orderManagement: 'Order Management',
            enabled: 'Enabled',
            actionName: 'Action Name',
            enterActionName: 'Enter a name for this action',
            actionWarning: 'Enabling this action will automatically disable other actions.',
            language: 'Language',
            currency: 'Currency',
            saving: 'Saving...',
            saveConfiguration: 'Save Configuration',
            menuManagement: 'Menu Management',
            categories: 'Categories',
            tableQRCodes: 'Table QR Codes',
            followUp: 'Follow-up',
            googleSheets: 'Google Sheets',
            cashier: 'Cashier',
            localization: 'Localization'
          },
          menuItems: menuItems.reduce((acc, item) => ({
            ...acc,
            [item.id]: {
              name: item.name,
              description: item.description
            }
          }), {})
        }
      }
      console.log('Setting initial translations:', englishTranslations);
      setTranslations(englishTranslations)
      onUpdateTranslations(englishTranslations)
    }
  }, [categories, menuItems, metadata, translations.en])

  const handleTranslationChange = (section: string, field: string, value: string) => {
    console.log('Translation change:', { section, field, value, selectedLanguage });
    const newTranslations = {
      ...translations,
      [selectedLanguage]: {
        ...translations[selectedLanguage],
        [section]: {
          ...translations[selectedLanguage]?.[section],
          [field]: value
        }
      }
    }
    console.log('New translations after change:', newTranslations);
    setTranslations(newTranslations)
    onUpdateTranslations(newTranslations)
  }

  const generateTranslations = async (section: string) => {
    if (selectedLanguage === 'en') {
      toast.error("Cannot generate translations for English")
      return
    }

    setIsGenerating(prev => ({ ...prev, [section]: true }))
    try {
      const response = await fetch('/api/chatbot/actions/localization/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceLanguage: 'en',
          targetLanguage: selectedLanguage,
          content: {
            [section]: translations.en?.[section] || {}
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate translations')
      }

      const generatedTranslations = await response.json()
      
      setTranslations(prev => ({
        ...prev,
        [selectedLanguage]: {
          ...prev[selectedLanguage],
          [section]: generatedTranslations[section]
        }
      }))
      
      onUpdateTranslations({
        ...translations,
        [selectedLanguage]: {
          ...translations[selectedLanguage],
          [section]: generatedTranslations[section]
        }
      })

      toast.success(`${section} translations generated successfully`)
    } catch (error) {
      console.error('Error generating translations:', error)
      toast.error('Failed to generate translations')
    } finally {
      setIsGenerating(prev => ({ ...prev, [section]: false }))
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
        <TabsList>
          {SUPPORTED_LANGUAGES.map(lang => (
            <TabsTrigger key={lang.value} value={lang.value}>
              {lang.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedLanguage}>
          <div className="grid gap-6">
            {/* Categories Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Menu Categories</CardTitle>
                {selectedLanguage !== 'en' && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => generateTranslations('categories')}
                    disabled={isGenerating['categories']}
                    className="border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600"
                  >
                    {isGenerating['categories'] ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'AI Translate'
                    )}
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {categories.map(category => (
                  <div key={category.id} className="space-y-2">
                    <Label>Category: {translations.en?.categories?.[category.id]}</Label>
                    <Input
                      value={translations[selectedLanguage]?.categories?.[category.id] || ''}
                      onChange={(e) => handleTranslationChange('categories', category.id, e.target.value)}
                      placeholder={`Translate "${translations.en?.categories?.[category.id]}" to ${SUPPORTED_LANGUAGES.find(l => l.value === selectedLanguage)?.label}`}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Message Templates Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Message Templates</CardTitle>
                {selectedLanguage !== 'en' && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => generateTranslations('messages')}
                    disabled={isGenerating['messages']}
                    className="border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600"
                  >
                    {isGenerating['messages'] ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'AI Translate'
                    )}
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Order Message Template</Label>
                  <Textarea
                    value={translations[selectedLanguage]?.messages?.orderTemplate || ''}
                    onChange={(e) => handleTranslationChange('messages', 'orderTemplate', e.target.value)}
                    placeholder={`Translate "${translations.en?.messages?.orderTemplate}" to ${SUPPORTED_LANGUAGES.find(l => l.value === selectedLanguage)?.label}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Follow-up Message Template</Label>
                  <Textarea
                    value={translations[selectedLanguage]?.messages?.followUpTemplate || ''}
                    onChange={(e) => handleTranslationChange('messages', 'followUpTemplate', e.target.value)}
                    placeholder={`Translate "${translations.en?.messages?.followUpTemplate}" to ${SUPPORTED_LANGUAGES.find(l => l.value === selectedLanguage)?.label}`}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Menu Items Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Menu Items</CardTitle>
                {selectedLanguage !== 'en' && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => generateTranslations('menuItems')}
                    disabled={isGenerating['menuItems']}
                    className="border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600"
                  >
                    {isGenerating['menuItems'] ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'AI Translate'
                    )}
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {categories.map(category => {
                  const categoryItems = menuItems.filter(item => item.category === category.id)
                  if (categoryItems.length === 0) return null

                  return (
                    <div key={category.id} className="space-y-4">
                      <h3 className="font-medium">{translations.en?.categories?.[category.id]}</h3>
                      {categoryItems.map(item => (
                        <div key={item.id} className="space-y-2 pl-4">
                          <Label>Item: {translations.en?.menuItems?.[item.id]?.name}</Label>
                          <Input
                            value={translations[selectedLanguage]?.menuItems?.[item.id]?.name || ''}
                            onChange={(e) => handleTranslationChange('menuItems', `${item.id}.name`, e.target.value)}
                            placeholder={`Translate "${translations.en?.menuItems?.[item.id]?.name}" to ${SUPPORTED_LANGUAGES.find(l => l.value === selectedLanguage)?.label}`}
                          />
                          <Textarea
                            value={translations[selectedLanguage]?.menuItems?.[item.id]?.description || ''}
                            onChange={(e) => handleTranslationChange('menuItems', `${item.id}.description`, e.target.value)}
                            placeholder={`Translate "${translations.en?.menuItems?.[item.id]?.description}" to ${SUPPORTED_LANGUAGES.find(l => l.value === selectedLanguage)?.label}`}
                          />
                        </div>
                      ))}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default LocalizationTab 