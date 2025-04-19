"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { QrCode, Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Download } from "lucide-react"
import toast from "react-hot-toast"

interface TableInfo {
  id: string
  tableNumber: string
  qrCodeUrl: string
}

interface TablesTabProps {
  tables: TableInfo[]
  setTables: (tables: TableInfo[]) => void
}

const TablesTab = ({ tables, setTables }: TablesTabProps) => {
  const [newTable, setNewTable] = useState<string>("")
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null)
  const [showQRDialog, setShowQRDialog] = useState(false)

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
    const phoneNumber = "1234567890" // Replace with actual WhatsApp business number
    const message = encodeURIComponent(`Hello! I'm at table ${tableNumber} and would like to place an order.`)
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

export default TablesTab
