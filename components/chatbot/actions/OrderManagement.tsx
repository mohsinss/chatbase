"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { QrCode, FileSpreadsheet, Plus, Trash2, Download, Save, Loader2, ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

const OrderManagement = ({ teamId, chatbotId, chatbot }: OrderManagementProps) => {
  // State for menu items
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [newMenuItem, setNewMenuItem] = useState<MenuItem>({
    id: "",
    name: "",
    description: "",
    price: 0,
    category: "Main",
    available: true
  })

  // State for tables
  const [tables, setTables] = useState<TableInfo[]>([])
  const [newTable, setNewTable] = useState<string>("")
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null)
  const [showQRDialog, setShowQRDialog] = useState(false)

  // State for Google Sheets integration
  const [googleSheetConfig, setGoogleSheetConfig] = useState<GoogleSheetConfig>({
    sheetId: "",
    sheetName: "Orders",
    connected: false
  })
  const [isConnecting, setIsConnecting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  // Categories for menu items
  const categories = ["Appetizer", "Main", "Dessert", "Beverage", "Special"]

  // Ref for QR code download
  const qrCodeRef = useRef<HTMLDivElement>(null)

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Simulate API call to load data
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Sample data for demonstration
        setMenuItems([
          {
            id: "1",
            name: "Margherita Pizza",
            description: "Classic pizza with tomato sauce, mozzarella, and basil",
            price: 12.99,
            category: "Main",
            available: true
          },
          {
            id: "2",
            name: "Caesar Salad",
            description: "Fresh romaine lettuce with Caesar dressing and croutons",
            price: 8.99,
            category: "Appetizer",
            available: true
          }
        ])
        
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
        ])
        
        toast.success("Configuration loaded")
      } catch (error) {
        console.error("Failed to load order management data:", error)
        toast.error("Failed to load configuration")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [chatbotId])

  // Save all configuration
  const saveConfiguration = async () => {
    setIsSaving(true)
    try {
      // Simulate API call to save data
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success("Configuration saved successfully")
    } catch (error) {
      console.error("Error saving configuration:", error)
      toast.error("Failed to save configuration")
    } finally {
      setIsSaving(false)
    }
  }

  // Handle adding a new menu item
  const handleAddMenuItem = () => {
    if (!newMenuItem.name || !newMenuItem.price) {
      toast.error("Name and price are required")
      return
    }

    const newItem = {
      ...newMenuItem,
      id: Date.now().toString()
    }

    setMenuItems([...menuItems, newItem])
    setNewMenuItem({
      id: "",
      name: "",
      description: "",
      price: 0,
      category: "Main",
      available: true
    })
  }

  // Handle deleting a menu item
  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id))
  }

  // Handle adding a new table
  const handleAddTable = () => {
    if (!newTable) {
      toast.error("Table number is required")
      return
    }

    // Check if table already exists
    if (tables.some(table => table.tableNumber === newTable)) {
      toast.error("Table already exists")
      return
    }

    const newTableInfo: TableInfo = {
      id: Date.now().toString(),
      tableNumber: newTable,
      qrCodeUrl: ""
    }

    setTables([...tables, newTableInfo])
    setNewTable("")
  }

  // Handle deleting a table
  const handleDeleteTable = (id: string) => {
    setTables(tables.filter(table => table.id !== id))
  }

  // Generate QR code for a table
  const handleGenerateQR = (table: TableInfo) => {
    setSelectedTable(table)
    setShowQRDialog(true)
  }

  // Connect to Google Sheets
  const handleConnectGoogleSheet = async () => {
    if (!googleSheetConfig.sheetId) {
      toast.error("Google Sheet ID is required")
      return
    }

    setIsConnecting(true)
    try {
      // Simulate API call to connect to Google Sheets
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setGoogleSheetConfig({
        ...googleSheetConfig,
        connected: true
      })
      
      toast.success("Connected to Google Sheet successfully")
    } catch (error) {
      console.error("Error connecting to Google Sheet:", error)
      toast.error("Failed to connect to Google Sheet")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleBack = () => {
    router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/actions/main`)
  }

  // Generate WhatsApp URL with table number
  const generateWhatsAppUrl = (tableNumber: string) => {
    // Format: https://wa.me/[phone-number]?text=[pre-filled-message]
    const phoneNumber = "1234567890" // Replace with actual WhatsApp business number
    const message = encodeURIComponent(`Hello! I'm at table ${tableNumber} and would like to place an order.`)
    return `https://wa.me/${phoneNumber}?text=${message}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    )
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
          <TabsTrigger value="tables">Table QR Codes</TabsTrigger>
          <TabsTrigger value="sheets">Google Sheets</TabsTrigger>
        </TabsList>

        {/* Menu Management Tab */}
        <TabsContent value="menu">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Menu Items</CardTitle>
                <p className="text-sm text-gray-500">
                  Manage your restaurant menu items that will be available for ordering
                </p>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Add New Menu Item</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="item-name">Item Name</Label>
                      <Input
                        id="item-name"
                        value={newMenuItem.name}
                        onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                        placeholder="e.g. Margherita Pizza"
                      />
                    </div>
                    <div>
                      <Label htmlFor="item-price">Price</Label>
                      <Input
                        id="item-price"
                        type="number"
                        value={newMenuItem.price || ""}
                        onChange={(e) => setNewMenuItem({ ...newMenuItem, price: parseFloat(e.target.value) || 0 })}
                        placeholder="e.g. 12.99"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="item-description">Description</Label>
                    <Textarea
                      id="item-description"
                      value={newMenuItem.description}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                      placeholder="Brief description of the item"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="item-category">Category</Label>
                      <div className="relative">
                        <select
                          id="item-category"
                          value={newMenuItem.category}
                          onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-8">
                      <Switch
                        id="item-available"
                        checked={newMenuItem.available}
                        onCheckedChange={(checked) => setNewMenuItem({ ...newMenuItem, available: checked })}
                      />
                      <Label htmlFor="item-available">Available</Label>
                    </div>
                  </div>
                  <Button onClick={handleAddMenuItem} className="w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                  </Button>
                </div>

                {/* Menu Items List */}
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Menu Items</h3>
                  {menuItems.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No menu items added yet</p>
                  ) : (
                    <div className="space-y-4">
                      {menuItems.map((item) => (
                        <div key={item.id} className="border rounded-md p-4 flex justify-between items-start">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {item.description && (
                              <div className="text-sm text-gray-500">{item.description}</div>
                            )}
                            <div className="flex items-center mt-2 space-x-4">
                              <span className="text-sm bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                              <span className="font-medium">${item.price.toFixed(2)}</span>
                              <div className="flex items-center">
                                <Switch
                                  checked={item.available}
                                  onCheckedChange={(checked) => {
                                    setMenuItems(
                                      menuItems.map((menuItem) =>
                                        menuItem.id === item.id
                                          ? { ...menuItem, available: checked }
                                          : menuItem
                                      )
                                    )
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-sm">Available</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMenuItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Table QR Codes Tab */}
        <TabsContent value="tables">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Tables</CardTitle>
                <p className="text-sm text-gray-500">
                  Manage tables and generate QR codes for each table
                </p>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Add New Table</h3>
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <Label htmlFor="table-number">Table Number/Name</Label>
                      <Input
                        id="table-number"
                        value={newTable}
                        onChange={(e) => setNewTable(e.target.value)}
                        placeholder="e.g. Table 1 or Patio 3"
                      />
                    </div>
                    <Button onClick={handleAddTable}>
                      <Plus className="mr-2 h-4 w-4" /> Add Table
                    </Button>
                  </div>
                </div>

                {/* Tables List */}
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-4">Restaurant Tables</h3>
                  {tables.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No tables added yet</p>
                  ) : (
                    <div className="space-y-4">
                      {tables.map((table) => (
                        <div key={table.id} className="border rounded-md p-4 flex justify-between items-center">
                          <div className="font-medium">{table.tableNumber}</div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateQR(table)}
                            >
                              <QrCode className="mr-2 h-4 w-4" /> Generate QR
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTable(table.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Google Sheets Integration Tab */}
        <TabsContent value="sheets">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Google Sheets Integration</CardTitle>
                <p className="text-sm text-gray-500">
                  Connect to Google Sheets to track and manage orders
                </p>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="sheet-id">Google Sheet ID</Label>
                      <Input
                        id="sheet-id"
                        value={googleSheetConfig.sheetId}
                        onChange={(e) => setGoogleSheetConfig({ ...googleSheetConfig, sheetId: e.target.value })}
                        placeholder="Enter Google Sheet ID"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Find this in your Google Sheet URL: https://docs.google.com/spreadsheets/d/
                        <span className="font-mono">SHEET_ID</span>/edit
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="sheet-name">Sheet Name</Label>
                      <Input
                        id="sheet-name"
                        value={googleSheetConfig.sheetName}
                        onChange={(e) => setGoogleSheetConfig({ ...googleSheetConfig, sheetName: e.target.value })}
                        placeholder="e.g. Orders"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleConnectGoogleSheet} 
                    disabled={isConnecting || !googleSheetConfig.sheetId}
                    className={googleSheetConfig.connected ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : googleSheetConfig.connected ? (
                      <>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Connected
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Connect to Google Sheet
                      </>
                    )}
                  </Button>
                </div>

                <div className="bg-gray-100 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Order Data Structure</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Your Google Sheet will be updated with the following columns:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div className="bg-white p-2 rounded">Order ID</div>
                    <div className="bg-white p-2 rounded">Table Number</div>
                    <div className="bg-white p-2 rounded">Timestamp</div>
                    <div className="bg-white p-2 rounded">Customer Phone</div>
                    <div className="bg-white p-2 rounded">Items</div>
                    <div className="bg-white p-2 rounded">Quantity</div>
                    <div className="bg-white p-2 rounded">Total Amount</div>
                    <div className="bg-white p-2 rounded">Status</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code for Table {selectedTable?.tableNumber}</DialogTitle>
            <DialogDescription>
              Scan this QR code to place an order via WhatsApp
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-4" ref={qrCodeRef}>
            {selectedTable && (
              <div className="border-4 border-black w-[200px] h-[200px] flex items-center justify-center">
                <p className="text-center">QR Code for Table {selectedTable.tableNumber}</p>
                <p className="text-xs text-gray-500 mt-2">
                  (Actual QR code would be generated here)
                </p>
              </div>
            )}
            <p className="mt-4 text-center text-sm">
              Table {selectedTable?.tableNumber}
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQRDialog(false)}>
              Close
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" /> Download QR Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OrderManagement
