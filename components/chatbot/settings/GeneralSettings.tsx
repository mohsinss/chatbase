"use client";

import { useState } from "react"
import { Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import * as React from "react"

interface GeneralSettingsProps {
  chatbotId: string;
}

const GeneralSettings = ({ chatbotId }: GeneralSettingsProps) => {
  const [creditLimit, setCreditLimit] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* General Section */}
      <Card className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">General</h1>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Chatbot ID
            </label>
            <div className="flex items-center gap-2">
              <span className="text-lg font-mono">{chatbotId}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => copyToClipboard(chatbotId)}
                title="Copy ID"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Number of characters
            </label>
            <p className="text-lg">4,295</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Name
            </label>
            <input
              type="text"
              id="name"
              defaultValue="Chatbot 12/26/2024, 12:11:01 AM"
              className="flex h-10 w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Credit Limit
                </label>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4"
                  title="Toggle credit limit"
                >
                  <div className="rounded-full border h-4 w-4 flex items-center justify-center text-xs">?</div>
                </Button>
              </div>
              <div
                className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  creditLimit ? 'bg-primary' : 'bg-input'
                }`}
                onClick={() => setCreditLimit(!creditLimit)}
              >
                <span
                  className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                    creditLimit ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
            
            {creditLimit && (
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Enter credit limit"
                  className="flex h-10 w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <p className="text-sm text-gray-500">Enter the maximum number of credits this chatbot can use</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button>Save</Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <div className="space-y-6">
        <h2 className="text-red-500 text-center">DANGER ZONE</h2>
        
        <Card className="border-red-200">
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-red-500 mb-2">Delete All Conversations</h3>
                <p className="text-gray-600">
                  Once you delete all your conversations, there is no going back. Please be certain.
                </p>
                <p className="text-gray-600">
                  All the conversations on this chatbot will be deleted. <span className="font-semibold">This action is not reversible</span>
                </p>
              </div>
              <Button variant="destructive">Delete</Button>
            </div>
          </div>
        </Card>

        <Card className="border-red-200">
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-red-500 mb-2">Delete Chatbot</h3>
                <p className="text-gray-600">
                  Once you delete your chatbot, there is no going back. Please be certain.
                </p>
                <p className="text-gray-600">
                  All your uploaded data will be deleted. <span className="font-semibold">This action is not reversible</span>
                </p>
              </div>
              <Button variant="destructive">Delete</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GeneralSettings; 