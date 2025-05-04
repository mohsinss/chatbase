"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, Loader2, ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"

// Import tab components
import MenuTab from "./OMtabs/MenuTab"
import CategoriesTab from "./OMtabs/CategoriesTab"
import TablesTab from "./OMtabs/TablesTab"
import GoogleSheetsTab from "./OMtabs/GoogleSheetsTab"
import CashierPageTab from "./OMtabs/CashierPageTab"
import FollowUpTab from "./OMtabs/FollowUpTab"
import LocalizationTab from "./OMtabs/LocalizationTab"

// Supported languages for selection
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
];

interface OrderManagementProps {
  teamId: string
  chatbotId: string
  chatbot: {
    name: string
    id: string
    settings?: {
      model?: string
      temperature?: number
      maxTokens?: number
      systemPrompt?: string
      language?: string
    }
  }
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  available: boolean
  images: string[]
}

interface Category {
  id: string
  name: string
}

interface TableInfo {
  id: string
  tableNumber: string
  qrCodeUrl: string
}

interface GoogleSheetConfig {
  sheetId: string
  sheetName: string
  connected: boolean
}

interface OrderManagementConfig {
  menuItems: MenuItem[]
  categories: Category[]
  tables: TableInfo[]
  googleSheetConfig: GoogleSheetConfig
  messageTemplate?: string
  phoneNumber?: string
}

const OrderManagement = ({ teamId, chatbotId, chatbot }: OrderManagementProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const actionId = searchParams.get("actionId")

  // State for action name and enabled status
  const [actionName, setActionName] = useState<string>("Restaurant Order Management")
  const [isEnabled, setIsEnabled] = useState<boolean>(true)

  // State for language selection, initialized from chatbot settings or default to 'en'
  const [language, setLanguage] = useState<string>(chatbot.settings?.language ?? "en")

  // Get translation for a key
  const getTranslation = (key: string, section: string = 'messages') => {
    if (translations[language]?.[section]?.[key]) {
      return translations[language][section][key]
    }
    // Fallback to English if translation not found
    return translations['en']?.[section]?.[key] || key
  }

  // Sync language with chatbot settings
  useEffect(() => {
    if (chatbot.settings?.language) {
      setLanguage(chatbot.settings.language)
    }
  }, [chatbot.settings?.language])

  // Update chatbot settings when language changes
  const handleLanguageChange = async (newLanguage: string) => {
    try {
      const response = await fetch(`/api/chatbot/ai-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbotId,
          language: newLanguage
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update language')
      }

      setLanguage(newLanguage)
      toast.success('Language updated successfully')
    } catch (error) {
      console.error('Error updating language:', error)
      toast.error('Failed to update language')
    }
  }

  // State for menu items
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  // State for categories
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Appetizer" },
    { id: "2", name: "Main" },
    { id: "3", name: "Dessert" },
    { id: "4", name: "Beverage" },
    { id: "5", name: "Special" }
  ])

  // State for tables
  const [tables, setTables] = useState<TableInfo[]>([])

  // State for Google Sheets integration
  const [googleSheetConfig, setGoogleSheetConfig] = useState<GoogleSheetConfig>({
    sheetId: "",
    sheetName: "Orders",
    connected: false
  })

  // State for WhatsApp metadata
  const [metadata, setMetadata] = useState<{
    messageTemplate?: string;
    phoneNumber?: string;
    followUpSettings?: {
      enabled: boolean;
      messageTemplate: string;
      timeWindow: number;
      suggestItems: boolean;
    };
    currency?: string; // Add currency field to metadata
  }>({
    messageTemplate: "Hello! I'm at table {table} and would like to place an order.",
    phoneNumber: "",
    followUpSettings: {
      enabled: false,
      messageTemplate: "Thank you for your order! We hope you enjoyed your meal. Would you like to order anything else, such as dessert or drinks?",
      timeWindow: 30,
      suggestItems: true
    },
    currency: "USD" // Default currency
  })

  // Add translations state
  const [translations, setTranslations] = useState<any>({})

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        if (actionId) {
          // Fetch existing action data
          const res = await fetch(`/api/chatbot/action?actionId=${actionId}`);
          if (!res.ok) {
            throw new Error("Failed to fetch action");
          }

          const action = await res.json();
          console.log('Fetched action data:', action);

          // Set action name and enabled status
          setActionName(action.name || "Restaurant Order Management");
          setIsEnabled(action.enabled !== undefined ? action.enabled : true);

          // Parse metadata if it exists
          if (action.metadata) {
            const metadata = action.metadata;
            console.log('Fetched metadata:', metadata);

            if (metadata.menuItems) setMenuItems(metadata.menuItems);
            if (metadata.categories) setCategories(metadata.categories);
            if (metadata.tables) setTables(metadata.tables);
            if (metadata.googleSheetConfig) setGoogleSheetConfig(metadata.googleSheetConfig);
            if (metadata.messageTemplate) setMetadata(prev => ({ ...prev, messageTemplate: metadata.messageTemplate }));
            if (metadata.phoneNumber) setMetadata(prev => ({ ...prev, phoneNumber: metadata.phoneNumber }));
            if (metadata.followUpSettings) setMetadata(prev => ({ ...prev, followUpSettings: metadata.followUpSettings }));
            if (metadata.language) setLanguage(metadata.language);
            if (metadata.currency) setMetadata(prev => ({ ...prev, currency: metadata.currency }));
            if (metadata.translations) {
              console.log('Loading translations from metadata:', metadata.translations);
              setTranslations(metadata.translations);
              // Also update metadata with translations to ensure consistency
              setMetadata(prev => ({
                ...prev,
                translations: metadata.translations
              }));
            }
          }

          toast.success("Configuration loaded");
        } else {
          // Initialize with default translations
          const defaultTranslations = {
            en: {
              categories: categories.reduce((acc, category) => ({
                ...acc,
                [category.id]: category.name
              }), {}),
              messages: {
                orderTemplate: metadata.messageTemplate || '',
                followUpTemplate: metadata.followUpSettings?.messageTemplate || '',
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
          };
          setTranslations(defaultTranslations);
        }
      } catch (error) {
        console.error("Failed to load order management data:", error);
        toast.error("Failed to load configuration");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [actionId, chatbotId]);

  // Handle toggle for enabled/disabled state
  const handleToggle = async (checked: boolean) => {
    try {
      if (actionId) {
        const response = await fetch(`/api/chatbot/action`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ actionId, enabled: checked }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to update.");
        }

        toast.success('Successfully updated.');
      }

      setIsEnabled(checked);
    } catch (error) {
      console.error("Failed to toggle action status:", error);
      toast.error(error?.message || "Failed to update status.");
    }
  };

  // Save all configuration
  const saveConfiguration = async () => {
    if (!actionName.trim()) {
      toast.error("Action name is required")
      return
    }

    setIsSaving(true)

    try {
      // Prepare metadata
      const actionMetadata = {
        menuItems,
        categories,
        tables,
        googleSheetConfig,
        messageTemplate: metadata.messageTemplate,
        phoneNumber: metadata.phoneNumber,
        followUpSettings: metadata.followUpSettings,
        language, // Save selected language in metadata
        currency: metadata.currency,
        translations // Add translations directly to metadata
      }

      // Prepare request body
      const requestBody = actionId
        ? {
          actionId,
          name: actionName,
          url: "", // Not used for QRoder but required by the model
          instructions: "Use this action to manage restaurant orders via QR codes", // Default instructions
          enabled: isEnabled,
          type: "ordermanagement",
          metadata: actionMetadata
        }
        : {
          chatbotId,
          name: actionName,
          url: "", // Not used for QRoder but required by the model
          instructions: "Use this action to manage restaurant orders via QR codes", // Default instructions
          enabled: isEnabled,
          type: "ordermanagement",
          metadata: actionMetadata
        }

      // Make API request
      const response = await fetch(`/api/chatbot/action`, {
        method: actionId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Failed to save configuration.")
      }

      toast.success("Configuration saved successfully")

      // Redirect to main actions page
      router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/actions/main`)
    } catch (error) {
      console.error("Error saving configuration:", error)
      toast.error(error?.message || "Failed to save configuration")
    } finally {
      setIsSaving(false)
    }
  }

  const handleBack = () => {
    router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/actions/main`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{getTranslation('orderManagement', 'messages')}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{getTranslation('enabled', 'messages')}</span>
          <Switch checked={isEnabled} onCheckedChange={handleToggle} />
        </div>
      </div>

      {/* Action Name and Language Selection */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1">
          <Label htmlFor="action-name">{getTranslation('actionName', 'messages')}</Label>
          <Input
            id="action-name"
            value={actionName}
            onChange={(e) => setActionName(e.target.value)}
            placeholder={getTranslation('enterActionName', 'messages')}
            className="max-w-md"
          />
          <p className="text-sm text-gray-500 mt-1">
            {getTranslation('actionWarning', 'messages')}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Label htmlFor="language-select">{getTranslation('language', 'messages')}</Label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm max-w-xs"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="currency-select">{getTranslation('currency', 'messages')}</Label>
            <select
              id="currency-select"
              value={metadata.currency || "USD"}
              onChange={(e) => setMetadata(prev => ({ ...prev, currency: e.target.value }))}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm max-w-xs"
            >
              <option value="USD">USD</option>
              <option value="SAR">SAR</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="CNY">CNY</option>
              <option value="INR">INR</option>
              <option value="AUD">AUD</option>
              <option value="CAD">CAD</option>
              <option value="CHF">CHF</option>
              <option value="KRW">KRW</option>
              <option value="BRL">BRL</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <Button
          onClick={saveConfiguration}
          disabled={isSaving}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {getTranslation('saving', 'messages')}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {getTranslation('saveConfiguration', 'messages')}
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="menu">
        <TabsList className="mb-4">
          <TabsTrigger value="menu">{getTranslation('menuManagement', 'messages')}</TabsTrigger>
          <TabsTrigger value="categories">{getTranslation('categories', 'messages')}</TabsTrigger>
          <TabsTrigger value="tables">{getTranslation('tableQRCodes', 'messages')}</TabsTrigger>
          <TabsTrigger value="follow-up">{getTranslation('followUp', 'messages')}</TabsTrigger>
          <TabsTrigger value="sheets">{getTranslation('googleSheets', 'messages')}</TabsTrigger>
          <TabsTrigger value="cashier">{getTranslation('cashier', 'messages')}</TabsTrigger>
          <TabsTrigger value="localization">{getTranslation('localization', 'messages')}</TabsTrigger>
        </TabsList>

        {/* Menu Management Tab */}
        <TabsContent value="menu">
          <MenuTab
            menuItems={menuItems}
            setMenuItems={setMenuItems}
            categories={categories}
          />
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <CategoriesTab
            categories={categories}
            setCategories={setCategories}
            menuItems={menuItems}
            setMenuItems={setMenuItems}
          />
        </TabsContent>

        {/* Table QR Codes Tab */}
        <TabsContent value="tables">
          <TablesTab
            tables={tables}
            setTables={setTables}
            chatbotId={chatbotId}
            metadata={{
              messageTemplate: metadata?.messageTemplate,
              phoneNumber: metadata?.phoneNumber
            }}
            updateMetadata={(whatsappMetadata) => {
              // Update only the WhatsApp-related metadata
              setMetadata({
                ...metadata,
                messageTemplate: whatsappMetadata.messageTemplate,
                phoneNumber: whatsappMetadata.phoneNumber
              });
            }}
          />
        </TabsContent>

        {/* Google Sheets Integration Tab */}
        <TabsContent value="sheets">
          <GoogleSheetsTab
            googleSheetConfig={googleSheetConfig}
            setGoogleSheetConfig={setGoogleSheetConfig}
            chatbotId={chatbotId}
            teamId={teamId}
          />
        </TabsContent>

        {/* Follow-up Tab */}
        <TabsContent value="follow-up">
          <FollowUpTab
            chatbotId={chatbotId}
            metadata={metadata}
            updateMetadata={(newMetadata) => {
              setMetadata(newMetadata);
            }}
          />
        </TabsContent>

        {/* Cashier Page Tab */}
        <TabsContent value="cashier">
          <CashierPageTab
            chatbotId={chatbotId}
            actionId={actionId}
          />
        </TabsContent>

        {/* Localization Tab */}
        <TabsContent value="localization">
          <LocalizationTab
            categories={categories}
            menuItems={menuItems}
            metadata={metadata}
            initialTranslations={translations}
            onUpdateTranslations={(newTranslations) => {
              console.log('Updating translations:', newTranslations);
              setTranslations(newTranslations)
              // Update metadata with translations
              setMetadata(prev => ({
                ...prev,
                translations: newTranslations
              }))
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderManagement;
