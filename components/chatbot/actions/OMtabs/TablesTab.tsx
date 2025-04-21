"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { QrCode, Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Download } from "lucide-react"
import toast from "react-hot-toast"
import { QRCodeCanvas } from 'qrcode.react'
import { Textarea } from "@/components/ui/textarea"

interface TableInfo {
  id: string
  tableNumber: string
  qrCodeUrl: string
}

interface TablesTabProps {
  tables: TableInfo[]
  setTables: (tables: TableInfo[]) => void
  chatbotId: string
}

const TablesTab = ({ tables, setTables, chatbotId }: TablesTabProps) => {
  const [newTable, setNewTable] = useState<string>("")
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null)
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [messageTemplate, setMessageTemplate] = useState<string>("Hello! I'm at table {table} and would like to place an order.")
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [isLoadingPhoneNumber, setIsLoadingPhoneNumber] = useState<boolean>(true)
  const [phoneNumbers, setPhoneNumbers] = useState<any[]>([])
  
  // Fetch WhatsApp business phone number
  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      setIsLoadingPhoneNumber(true)
      try {
        const response = await fetch(`/api/chatbot/integrations/whatsapp?chatbotId=${chatbotId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch phone numbers");
        }

        const data = await response.json();
        setPhoneNumbers(data);
        
        // Set the first phone number as default if available
        if (data.length > 0) {
          const number = data[0]?.display_phone_number || "";
          // Remove any non-digit characters
          setPhoneNumber(number.replace(/\D/g, ''));
        }
      } catch (error) {
        console.error("Error fetching phone numbers:", error);
        toast.error("Failed to fetch WhatsApp phone numbers");
      }
      setIsLoadingPhoneNumber(false)
    };

    fetchPhoneNumbers();
  }, [chatbotId]);

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

  // Generate WhatsApp URL with table number
  const generateWhatsAppUrl = (tableNumber: string) => {
    // Format: https://wa.me/[phone-number]?text=[pre-filled-message]
    const message = encodeURIComponent(messageTemplate.replace('{table}', tableNumber))
    return `https://wa.me/${phoneNumber}?text=${message}`
  }

  return (
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
            <h3 className="text-lg font-medium mb-4">WhatsApp Configuration</h3>
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div>
                <Label htmlFor="phone-number">WhatsApp Business Phone Number</Label>
                {isLoadingPhoneNumber ? (
                  <div className="py-2">Loading WhatsApp phone numbers...</div>
                ) : phoneNumbers.length > 0 ? (
                  <div>
                    <select
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    >
                      {phoneNumbers.map((phone, index) => (
                        <option 
                          key={`phone-option-${index}`} 
                          value={phone.display_phone_number.replace(/\D/g, '')}
                        >
                          {phone.display_phone_number} ({phone.verified_name})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Select a WhatsApp business phone number from your connected accounts</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-amber-600 mt-1">
                      No WhatsApp business phone numbers found. Please connect a WhatsApp account in the Integrations section.
                    </p>
                    <Input
                      id="phone-number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter phone number (numbers only)"
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="message-template">Message Template</Label>
                <Textarea
                  id="message-template"
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  placeholder="Enter message template"
                  className="min-h-[80px]"
                />
                <p className="text-xs text-gray-500 mt-1">Use {'{table}'} as a placeholder for the table number</p>
              </div>
            </div>
            
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

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code for Table {selectedTable?.tableNumber}</DialogTitle>
            <DialogDescription>
              Scan this QR code to place an order via WhatsApp
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-4">
            {selectedTable && (
              <div className="border-2 border-gray-200 p-4 rounded-md">
                <QRCodeCanvas 
                  id={`qr-code-${selectedTable.id}`}
                  value={generateWhatsAppUrl(selectedTable.tableNumber)}
                  size={200}
                  level="H"
                />
              </div>
            )}
            <p className="mt-4 text-center text-sm font-medium">
              Table {selectedTable?.tableNumber}
            </p>
            <p className="text-xs text-gray-500 mt-1 text-center max-w-[300px]">
              Scanning this QR code will open WhatsApp with a pre-filled message for table {selectedTable?.tableNumber}
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQRDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              if (selectedTable) {
                const canvas = document.getElementById(`qr-code-${selectedTable.id}`) as HTMLCanvasElement;
                if (canvas) {
                  const url = canvas.toDataURL("image/png");
                  const link = document.createElement('a');
                  link.download = `QR-Table-${selectedTable.tableNumber}.png`;
                  link.href = url;
                  link.click();
                }
              }
            }}>
              <Download className="mr-2 h-4 w-4" /> Download QR Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TablesTab
