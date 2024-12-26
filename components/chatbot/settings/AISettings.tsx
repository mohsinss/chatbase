"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import * as React from "react"

interface AISettingsProps {
  chatbotId: string;
}

const AISettings = ({ chatbotId }: AISettingsProps) => {
  const [temperature, setTemperature] = useState(0.7)
  const [model, setModel] = useState("gpt-3.5-turbo")

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="flex h-10 w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
            </select>
            <p className="text-sm text-gray-500">Select the AI model to power your chatbot</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Temperature ({temperature})
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full max-w-xl"
            />
            <p className="text-sm text-gray-500">
              Controls randomness: Lowering results in more focused and deterministic responses, 
              while increasing leads to more creative and varied outputs
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              System Message
            </label>
            <textarea
              rows={4}
              placeholder="You are a helpful AI assistant..."
              className="flex w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-sm text-gray-500">Define the AI's personality and behavior</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Knowledge Cutoff
            </label>
            <input
              type="date"
              className="flex h-10 w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-sm text-gray-500">Set the knowledge cutoff date for the AI model</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <h3 className="text-xl font-semibold">Advanced Settings</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Maximum Tokens
            </label>
            <input
              type="number"
              placeholder="4096"
              className="flex h-10 w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-sm text-gray-500">Maximum number of tokens per response</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Context Window
            </label>
            <input
              type="number"
              placeholder="16000"
              className="flex h-10 w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-sm text-gray-500">Number of tokens to consider from conversation history</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button>Save Advanced Settings</Button>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-2xl font-semibold">Training</h3>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Last trained at
          </label>
          <p className="text-lg">
            December 26, 2024 at 12:11 AM
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AISettings; 