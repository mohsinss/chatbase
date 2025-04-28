"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Clock, Save } from "lucide-react"
import toast from "react-hot-toast"

interface FollowUpTabProps {
  chatbotId: string
  metadata?: {
    followUpSettings?: {
      enabled: boolean
      messageTemplate: string
      timeWindow: number
      suggestItems: boolean
    }
  }
  updateMetadata?: (metadata: any) => void
}

const FollowUpTab = ({ chatbotId, metadata = {}, updateMetadata }: FollowUpTabProps) => {
  // Extract follow-up settings from metadata or use defaults
  const followUpSettings = metadata.followUpSettings || {
    enabled: false,
    messageTemplate: "Thank you for your order! We hope you enjoyed your meal. Would you like to order anything else, such as dessert or drinks?",
    timeWindow: 30,
    suggestItems: true
  }
  
  // State for form fields
  const [enabled, setEnabled] = useState<boolean>(followUpSettings.enabled)
  const [messageTemplate, setMessageTemplate] = useState<string>(followUpSettings.messageTemplate)
  const [timeWindow, setTimeWindow] = useState<number>(followUpSettings.timeWindow)
  const [suggestItems, setSuggestItems] = useState<boolean>(followUpSettings.suggestItems)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [lastRunTime, setLastRunTime] = useState<string>("")
  const [lastRunStatus, setLastRunStatus] = useState<string>("")
  
  // Update local state when metadata changes
  useEffect(() => {
    if (metadata && metadata.followUpSettings) {
      setEnabled(metadata.followUpSettings.enabled);
      setMessageTemplate(metadata.followUpSettings.messageTemplate);
      setTimeWindow(metadata.followUpSettings.timeWindow);
      setSuggestItems(metadata.followUpSettings.suggestItems);
    }
  }, [metadata]);
  
  // Handle saving settings
  const handleSaveSettings = async () => {
    if (!updateMetadata) return;
    
    setIsSaving(true);
    
    try {
      // Update metadata with current form values
      updateMetadata({
        ...metadata,
        followUpSettings: {
          enabled,
          messageTemplate,
          timeWindow,
          suggestItems
        }
      });
      
      toast.success("Follow-up settings saved successfully");
    } catch (error) {
      console.error("Error saving follow-up settings:", error);
      toast.error("Failed to save follow-up settings");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle manual trigger of the follow-up check
  const handleManualTrigger = async () => {
    try {
      // Call the API endpoint to check for new orders
      const response = await fetch(`/api/order-management/check-new-orders?chatbotId=${chatbotId}&minutes=${timeWindow}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to trigger follow-up check");
      }
      
      const data = await response.json();
      
      // Update last run information
      setLastRunTime(new Date().toLocaleString());
      setLastRunStatus(`${data.message} (${data.notificationsSent} sent)`);
      
      toast.success(`Follow-up check completed: ${data.message}`);
    } catch (error) {
      console.error("Error triggering follow-up check:", error);
      toast.error("Failed to trigger follow-up check");
      setLastRunStatus("Failed");
    }
  };
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Follow-Up Settings</CardTitle>
          <p className="text-sm text-gray-500">
            Configure automatic follow-up messages for completed orders
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Enable/Disable Follow-up */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="follow-up-enabled" className="text-base">Enable Follow-up Messages</Label>
                <p className="text-sm text-gray-500">
                  Automatically send follow-up messages after orders are completed
                </p>
              </div>
              <Switch
                id="follow-up-enabled"
                checked={enabled}
                onCheckedChange={setEnabled}
              />
            </div>
            
            {/* Time Window Setting */}
            <div className="space-y-2">
              <Label htmlFor="time-window">Follow-up Time Window (minutes)</Label>
              <div className="flex items-center gap-4">
                <div className="w-full">
                  <select
                    id="time-window"
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={timeWindow.toString()}
                    onChange={(e) => setTimeWindow(parseInt(e.target.value, 10))}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500">
                Send follow-up messages to customers who completed their orders within this time window
              </p>
            </div>
            
            {/* Message Template */}
            <div className="space-y-2">
              <Label htmlFor="message-template">Follow-up Message Template</Label>
              <Textarea
                id="message-template"
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                placeholder="Enter follow-up message template"
                className="min-h-[100px]"
              />
              <p className="text-xs text-gray-500">
                This message will be sent to customers after they complete their order
              </p>
            </div>
            
            {/* Suggest Items Option */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="suggest-items" className="text-base">Suggest Menu Items</Label>
                <p className="text-sm text-gray-500">
                  Include suggestions for desserts or drinks in follow-up messages
                </p>
              </div>
              <Switch
                id="suggest-items"
                checked={suggestItems}
                onCheckedChange={setSuggestItems}
              />
            </div>
            
            {/* Manual Trigger and Save Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <Button 
                  variant="outline" 
                  onClick={handleManualTrigger}
                  disabled={!enabled}
                >
                  Run Follow-up Check Now
                </Button>
                {lastRunTime && (
                  <div className="mt-2 text-xs text-gray-500">
                    Last run: {lastRunTime} - {lastRunStatus}
                  </div>
                )}
              </div>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
            
            {/* Cron Job Information */}
            <div className="bg-gray-50 p-4 rounded-md mt-6">
              <h4 className="font-medium mb-2">Cron Job Setup</h4>
              <p className="text-sm text-gray-600 mb-2">
                To automate follow-up messages, set up a cron job to call this endpoint every 15-30 minutes:
              </p>
              <div className="bg-gray-100 p-2 rounded font-mono text-sm overflow-x-auto">
                GET /api/order-management/check-new-orders?chatbotId={chatbotId}&minutes={timeWindow}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This endpoint will check for completed orders and send follow-up messages based on your settings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FollowUpTab
