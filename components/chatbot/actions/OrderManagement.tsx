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
  }>({
    messageTemplate: "Hello! I'm at table {table} and would like to place an order.",
    phoneNumber: ""
  })

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

          // Set action name and enabled status
          setActionName(action.name || "Restaurant Order Management");
          setIsEnabled(action.enabled !== undefined ? action.enabled : true);

          // Parse metadata if it exists
          if (action.metadata) {
            const metadata = action.metadata;

            if (metadata.menuItems) setMenuItems(metadata.menuItems);
            if (metadata.categories) setCategories(metadata.categories);
            if (metadata.tables) setTables(metadata.tables);
            if (metadata.googleSheetConfig) setGoogleSheetConfig(metadata.googleSheetConfig);
            if (metadata.messageTemplate) setMetadata(prev => ({ ...prev, messageTemplate: metadata.messageTemplate }));
            if (metadata.phoneNumber) setMetadata(prev => ({ ...prev, phoneNumber: metadata.phoneNumber }));
          }

          toast.success("Configuration loaded");
        } else {
          // Sample data for new action
          setMenuItems([
            {
              id: "1",
              name: "Margherita Pizza",
              description: "Classic pizza with tomato sauce, mozzarella, and basil",
              price: 12.99,
              category: "1",
              available: true,
              images: []
            },
            {
              id: "2",
              name: "Caesar Salad",
              description: "Fresh romaine lettuce with Caesar dressing and croutons",
              price: 8.99,
              category: "2",
              available: true,
              images: []
            }
          ]);

          setTables([
            {
              id: "1",
              tableNumber: "Table 1",
              qrCodeUrl: ""
            },
            {
              id: "2",
              tableNumber: "Table 2",
              qrCodeUrl: ""
            }
          ]);
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
      toast.error("Action name is required");
      return;
    }

    setIsSaving(true);

    try {
      // Prepare metadata
      const actionMetadata: OrderManagementConfig = {
        menuItems,
        categories,
        tables,
        googleSheetConfig,
        messageTemplate: metadata.messageTemplate,
        phoneNumber: metadata.phoneNumber
      };

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
        };

      // Make API request
      const response = await fetch(`/api/chatbot/action`, {
        method: actionId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to save configuration.");
      }

      toast.success("Configuration saved successfully");

      // Redirect to main actions page
      router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/actions/main`);
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast.error(error?.message || "Failed to save configuration");
    } finally {
      setIsSaving(false);
    }
  };

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
          <h1 className="text-2xl font-bold">Order Management</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Enabled</span>
          <Switch checked={isEnabled} onCheckedChange={handleToggle} />
        </div>
      </div>

      {/* Action Name Inputt */}
      <div className="mb-6">
        <Label htmlFor="action-name">Action Name</Label>
        <Input
          id="action-name"
          value={actionName}
          onChange={(e) => setActionName(e.target.value)}
          placeholder="Enter a name for this action"
          className="max-w-md"
        />
        <p className="text-sm text-gray-500 mt-1">
          Enabling this action will automatically disable other actions.
        </p>
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
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="menu">
        <TabsList className="mb-4">
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tables">Table QR Codes</TabsTrigger>
          <TabsTrigger value="sheets">Google Sheets</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default OrderManagement;
