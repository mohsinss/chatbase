"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
  chatbotId: string
  teamId: string
}

// Define fixed columns for Order Data Structure
interface OrderColumn {
  id: string;
  name: string;
  enabled: boolean;
}

const DEFAULT_ORDER_COLUMNS: OrderColumn[] = [
  // { id: 'order_id', name: 'Order ID', enabled: true },
  { id: 'table_name', name: 'Table Name', enabled: true },
  { id: 'timestamp', name: 'Timestamp', enabled: true },
  { id: 'customer_phone', name: 'Customer Phone', enabled: true },
  { id: 'total_amount', name: 'Total Amount', enabled: true },
  { id: 'description', name: 'Description', enabled: true },
  { id: 'status', name: 'Status', enabled: true },
  // { id: 'quantity', name: 'Quantity', enabled: true },
  // { id: 'items', name: 'Items', enabled: true },
  // { id: 'customer_name', name: 'Customer Name', enabled: false },
  // { id: 'customer_email', name: 'Customer Email', enabled: false },
  // { id: 'payment_method', name: 'Payment Method', enabled: false },
];

const GoogleSheetsTab = ({ googleSheetConfig, setGoogleSheetConfig, chatbotId, teamId }: GoogleSheetsTabProps) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isAuthorizing, setIsAuthorizing] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [spreadsheetColumns, setSpreadsheetColumns] = useState<string[]>([])
  const [isLoadingColumns, setIsLoadingColumns] = useState(false)
  const [availableSheets, setAvailableSheets] = useState<string[]>([])
  const [isLoadingSheets, setIsLoadingSheets] = useState(false)
  const [orderColumns, setOrderColumns] = useState<OrderColumn[]>(DEFAULT_ORDER_COLUMNS)
  const [connectedSheets, setConnectedSheets] = useState<Set<string>>(new Set())
  const [isSheetConnected, setIsSheetConnected] = useState(false);
  const [connectedSheet, setConnectedSheet] = useState<string>("");

  // Update spreadsheetColumns whenever orderColumns changes
  useEffect(() => {
    if (googleSheetConfig.connected && spreadsheetColumns.length > 0) {
      const enabledColumns = orderColumns
        .filter(column => column.enabled)
        .map(column => column.name);
      
      setSpreadsheetColumns(enabledColumns);
    }
  }, [orderColumns]);

  // Fetch Google Auth URL and check connection status on component mount
  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      try {
        const response = await fetch(`/api/chatbot/integrations/google/status?chatbotId=${chatbotId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (data.connected) {
          setGoogleSheetConfig({
            ...googleSheetConfig,
            connected: true
          });

          // If connected, fetch available sheets
          fetchAvailableSheets();
        }
      } catch (error) {
        console.error("Error checking Google connection status:", error);
      }
    };

    checkConnection();

    setConnectedSheet(`${googleSheetConfig.sheetId}|${googleSheetConfig.sheetName}`);
  }, [chatbotId, teamId]);

  const fetchGoogleAuthUrl = async () => {
    try {
      const response = await fetch(`/api/chatbot/integrations/google/auth-url?chatbotId=${chatbotId}&teamId=${teamId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Google Auth URL");
      }

      const data = await response.json();
      return data.authUrl;
    } catch (error) {
      console.error("Error fetching Google Auth URL:", error);
    }
  };

  // Fetch available sheets from the user's Google Drive
  const fetchAvailableSheets = async () => {
    if (!googleSheetConfig.connected) return;

    setIsLoadingSheets(true);
    try {
      // Fetch available sheets
      const response = await fetch(`/api/chatbot/integrations/google/sheets/list?chatbotId=${chatbotId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch available sheets");
      }

      const data = await response.json();
      setAvailableSheets(data.sheets || []);

      // Also fetch connected sheets
      const connectedResponse = await fetch(`/api/chatbot/integrations/google/sheets/connected?chatbotId=${chatbotId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (connectedResponse.ok) {
        const connectedData = await connectedResponse.json();
        const connectedSet = new Set<string>();
        
        if (connectedData.sheets && Array.isArray(connectedData.sheets)) {
          connectedData.sheets.forEach((sheet: any) => {
            if (sheet.sheetId && sheet.sheetName) {
              connectedSet.add(`${sheet.sheetId}|${sheet.sheetName}`);
            }
          });
        }
        
        setConnectedSheets(connectedSet);
        
        // Check if current sheet is connected
        const currentSheetKey = `${googleSheetConfig.sheetId}|${googleSheetConfig.sheetName}`;
        setIsSheetConnected(connectedSet.has(currentSheetKey));
      }
    } catch (error) {
      console.error("Error fetching sheets:", error);
      toast.error("Failed to load available sheets");
    } finally {
      setIsLoadingSheets(false);
    }
  };

  useEffect(() => {
    setIsSheetConnected(connectedSheet == `${googleSheetConfig.sheetId}|${googleSheetConfig.sheetName}`);
  }, [connectedSheets, connectedSheet, googleSheetConfig.sheetId, googleSheetConfig.sheetName]);

  // Set up message listener for auth window communication
  useEffect(() => {
    // Handler for messages from the auth window
    const handleAuthMessage = (event: MessageEvent) => {
      // Check if the message is from our auth window
      if (event.data && (event.data.type === 'GOOGLE_AUTH_SUCCESS' || event.data.type === 'GOOGLE_AUTH_FAILURE')) {
        console.log('Received auth message:', event.data);

        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          // Handle successful authentication
          setIsAuthorizing(false);
          toast.success("Successfully authorized with Google");

          // Update the Google Sheet config
          setGoogleSheetConfig({
            ...googleSheetConfig,
            connected: true
          });

          // Fetch available sheets
          setTimeout(() => {
            fetchAvailableSheets();
          }, 500);
        } else if (event.data.type === 'GOOGLE_AUTH_FAILURE') {
          // Handle authentication failure
          setIsAuthorizing(false);
          toast.error(event.data.message || "Authentication failed. Please try again.");
        }
      }
    };

    // Add event listener
    window.addEventListener('message', handleAuthMessage);

    // Clean up
    return () => {
      window.removeEventListener('message', handleAuthMessage);
    };
  }, [googleSheetConfig, chatbotId]); // Re-add listener if these dependencies change

  // Authorize with Google
  const handleAuthorizeGoogle = async () => {
    setIsAuthorizing(true);

    // Variable to track if we've handled the window closing
    let windowCloseHandled = false;
    let authWindow: Window | null = null;
    let checkWindowClosed: NodeJS.Timeout;
    let authTimeout: NodeJS.Timeout;

    try {
      let googleAuthUrl = await fetchGoogleAuthUrl();
      // Force open in a new window, not a tab
      authWindow = window.open(
        googleAuthUrl,
        "googleAuthWindow",
        "width=600,height=700,menubar=no,toolbar=no,location=no,resizable=yes,scrollbars=yes"
      );

      // Check if window was blocked by popup blocker
      if (!authWindow) {
        setIsAuthorizing(false);
        toast.error("Popup was blocked. Please allow popups for this site.");
        return;
      }

      // Try to focus the window
      authWindow.focus();

      console.log("Auth window opened");

      // Set a backup timeout in case we don't receive a message
      authTimeout = setTimeout(() => {
        if (isAuthorizing && !windowCloseHandled) {
          windowCloseHandled = true;
          setIsAuthorizing(false);
          toast.error("Authorization timed out. Please try again.");

          // Check if we're actually authorized despite the timeout
          checkAuthorizationStatus();
        }
      }, 120000); // 2 minutes timeout

      // Set up a fallback for window closing without sending a message
      checkWindowClosed = setInterval(() => {
        try {
          // This will throw an error if the window reference is invalid
          if (authWindow && authWindow.closed) {
            console.log("Auth window was manually closed");

            if (!windowCloseHandled) {
              windowCloseHandled = true;
              clearInterval(checkWindowClosed);
              clearTimeout(authTimeout);

              setIsAuthorizing(false);
              // toast.error("Authentication window was closed. Please try again.");

              // Small delay before checking status to allow any in-flight requests to complete
              // setTimeout(() => {
              //   checkAuthorizationStatus();
              // }, 1000);
            }
          }
        } catch (e) {
          console.error("Error checking window status:", e);
          // If we can't access the window reference, assume it's closed
          if (!windowCloseHandled) {
            windowCloseHandled = true;
            clearInterval(checkWindowClosed);
            clearTimeout(authTimeout);

            setIsAuthorizing(false);
            // toast.error("Authentication window was closed. Please try again.");
            checkAuthorizationStatus();
          }
        }
      }, 500); // Check more frequently
    } catch (error) {
      console.error("Error in Google authorization process:", error);
      setIsAuthorizing(false);
      toast.error("An error occurred during authorization. Please try again.");
    }
  };

  // Check authorization status as a fallback
  const checkAuthorizationStatus = async () => {
    try {
      const response = await fetch(`/api/chatbot/integrations/google/status?chatbotId=${chatbotId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setIsAuthorizing(false);
        toast.error("Sth went wrong while get auth status. Please try again.");
        return;
      }

      const data = await response.json();
      if (data.connected) {
        setIsAuthorizing(false);
        toast.success("Successfully authorized with Google");
        setGoogleSheetConfig({
          ...googleSheetConfig,
          connected: true
        });

        // Fetch available sheets
        fetchAvailableSheets();
      } else {
        setIsAuthorizing(false);
        toast.error("Authentication window was closed. Please try again.");
      }
    } catch (error) {
      console.error("Error checking Google auth status:", error);
      setIsAuthorizing(false);
      toast.error("Failed to verify authentication status. Please try again.");
    }
  };

  // Remove Google authorization
  const handleRemoveAuthorization = async () => {
    if (!confirm("Are you sure you want to remove Google authorization? This will disconnect all Google Sheets integrations.")) {
      return;
    }

    setIsRemoving(true);
    try {
      const response = await fetch(`/api/chatbot/integrations/google/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatbotId
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove Google authorization");
      }

      // Reset state
      setGoogleSheetConfig({
        sheetId: "",
        sheetName: "",
        connected: false
      });
      setSpreadsheetColumns([]);
      setAvailableSheets([]);

      toast.success("Google authorization removed successfully");
    } catch (error) {
      console.error("Error removing Google authorization:", error);
      toast.error("Failed to remove Google authorization");
    } finally {
      setIsRemoving(false);
    }
  };

  // Connect to Google Sheets
  const handleConnectGoogleSheet = async () => {
    if (!googleSheetConfig.sheetId) {
      toast.error("Google Sheet ID is required");
      return;
    }

    if (!googleSheetConfig.connected) {
      toast.error("Please authorize with Google first");
      return;
    }

    // Check if at least one column is enabled
    const enabledColumns = orderColumns.filter(column => column.enabled);
    if (enabledColumns.length === 0) {
      toast.error("Please enable at least one column for your order data");
      return;
    }

    setIsConnecting(true);
    try {
      const response = await fetch(`/api/chatbot/integrations/google/sheets/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatbotId,
          sheetId: googleSheetConfig.sheetId,
          sheetName: googleSheetConfig.sheetName,
          // Pass the enabled column names to the API
          columns: enabledColumns.map(col => col.name)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to connect to Google Sheet");
      }

      // Update spreadsheet columns with enabled columns
      const enabledColumnNames = enabledColumns.map(col => col.name);
      setSpreadsheetColumns(enabledColumnNames);
      
      // Update connected status
      setIsSheetConnected(true);
      
      // Add to connected sheets set
      const sheetKey = `${googleSheetConfig.sheetId}|${googleSheetConfig.sheetName}`;
      setConnectedSheet(sheetKey);
      // Update connected sheets state
      setConnectedSheets(prev => {
        const newSet = new Set(prev);
        newSet.add(sheetKey);
        return newSet;
      });

      toast.success("Connected to Google Sheet successfully");
    } catch (error) {
      console.error("Error connecting to Google Sheet:", error);
      toast.error(error.message || "Failed to connect to Google Sheet");
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle sheet selection from dropdown
  const handleSheetSelection = (sheetInfo: string) => {
    if (!sheetInfo) return;

    // Format is "sheetId|sheetName"
    const [sheetId, sheetName] = sheetInfo.split("|");

    setGoogleSheetConfig({
      ...googleSheetConfig,
      sheetId,
      sheetName
    });
  };

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
            {/* Google Authorization Section */}
            <div className="mb-6 p-4 border rounded-md bg-gray-50">
              <h3 className="text-lg font-medium mb-2">Google Authorization</h3>
              <p className="text-sm text-gray-500 mb-4">
                First, authorize with Google to access your Google Sheets.
              </p>
              <div className="flex space-x-2">
                {!googleSheetConfig.connected ? (
                  <Button
                    onClick={handleAuthorizeGoogle}
                    disabled={isAuthorizing}
                  >
                    {isAuthorizing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Authorizing...
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Authorize with Google
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      disabled
                    >
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Authorized with Google
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleRemoveAuthorization}
                      disabled={isRemoving}
                    >
                      {isRemoving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Removing...
                        </>
                      ) : (
                        <>
                          Remove Authorization
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Google Sheets Configuration */}
            {googleSheetConfig.connected && (
              <div className="mb-6 p-4 border rounded-md">
                <div className="flex gap-4 mb-2">
                  <h3 className="text-lg font-medium">Select Google Sheet</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchAvailableSheets}
                    disabled={isLoadingSheets}
                    className="h-8 w-8 p-0"
                    title="Refresh sheets list"
                  >
                    {isLoadingSheets ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )}
                  </Button>
                </div>

                {isLoadingSheets ? (
                  <div className="flex items-center py-2">
                    <span>Loading available sheets...</span>
                  </div>
                ) : availableSheets.length > 0 ? (
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sheet-select">Available Google Sheets</Label>
                    </div>
                    <div className="relative mt-2">
                      <select
                        id="sheet-select"
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10"
                        onChange={(e) => handleSheetSelection(e.target.value)}
                        value={`${googleSheetConfig.sheetId}|${googleSheetConfig.sheetName}`}
                        disabled={isLoadingSheets}
                      >
                        <option value="">Select a Google Sheet</option>
                        {availableSheets.map((sheet, index) => {
                          const [id, name, title] = sheet.split("|");
                          return (
                            <option key={`sheet-${index}`} value={`${id}|${name}`}>
                              {title || name} ({id.substring(0, 24)}...) - {name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Select from your available Google Sheets or enter details manually below
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-4">
                    No Google Sheets found. Enter sheet details manually below.
                  </p>
                )}

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
              </div>
            )}
            <Button
              onClick={handleConnectGoogleSheet}
              disabled={isConnecting || !googleSheetConfig.sheetId || !googleSheetConfig.connected || isSheetConnected}
              className={isSheetConnected ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : isSheetConnected ? (
                <>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Connected to Sheet
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
              Configure which columns will be used in your Google Sheet:
            </p>
            
            <div className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orderColumns.map((column, index) => (
                  <div key={`column-${index}`} className="flex items-center justify-between bg-white p-3 rounded">
                    <span>{column.name}</span>
                    <Switch
                      checked={column.enabled}
                      onCheckedChange={(checked) => {
                        const updatedColumns = [...orderColumns];
                        updatedColumns[index].enabled = checked;
                        setOrderColumns(updatedColumns);
                      }}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Toggle switches to enable or disable columns. Only enabled columns will be used in your Google Sheet.
              </p>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Active Columns Preview</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {orderColumns
                  .filter(column => column.enabled)
                  .map((column, index) => (
                    <div key={`active-column-${index}`} className="bg-white p-2 rounded border-l-4 border-green-500">
                      {column.name}
                    </div>
                  ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                These columns will be used when syncing orders to your Google Sheet.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GoogleSheetsTab
