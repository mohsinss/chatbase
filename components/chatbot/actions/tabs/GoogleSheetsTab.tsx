"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { FileSpreadsheet, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

interface GoogleSheetConfig {
  sheetId: string
  sheetName: string
  connected: boolean
}

interface GoogleSheetsTabProps {
  googleSheetConfig: GoogleSheetConfig
  setGoogleSheetConfig: (config: GoogleSheetConfig) => void
}

const GoogleSheetsTab = ({ googleSheetConfig, setGoogleSheetConfig }: GoogleSheetsTabProps) => {
  const [isConnecting, setIsConnecting] = useState(false)

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

  return (
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
  )
}

export default GoogleSheetsTab
