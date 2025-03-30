"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import toast from "react-hot-toast"

const calComTemplate = {
  name: "Cal com",
  url: "",
  instructions:
    'Use when the user mentions booking an appointment. If no date is specified, automatically set the window from today to 1 week from today and display these dates to the user without asking for confirmation. If a date window is specified, set the search window to that specific date window and display it to the user.After performing the search, respond with either "I have found available slots" or "I have not found available slots "Display the search window but do not provide a list of slots or links. After using the tool, check whether the user booked an appointment or not from the tool result.',
}

export default function Calcom(
  params
    :
    { teamId: string; chatbotId: string; }
) {
  const router = useRouter()
  const [isEnabled, setIsEnabled] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState(calComTemplate)
  const searchParams = useSearchParams()
  const actionId = searchParams.get("actionId")

  useEffect(() => {
    const fetchAction = async () => {
      if (actionId) {
        try {
          const res = await fetch(`/api/chatbot/action?actionId=${actionId}`);
          if (!res.ok) {
            throw new Error("Failed to fetch action");
          }
          const action = await res.json();
          setFormData({
            ...action
          });
          setIsEnabled(action.enabled);
        } catch (error) {
          console.error("Error fetching action:", error);
        }
      }
    };

    fetchAction();
  }, [actionId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggle = async (checked: boolean) => {
    try {
      const response = await fetch(`/api/chatbot/action`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionId, enabled: checked }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to update.")
      }

      toast.success('Successfully updated.')
      setIsEnabled(checked);
    } catch (error) {
      console.error("Failed to toggle action status:", error);
      toast.error(error?.message)
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/chatbot/action`, {
        method: actionId ? "PUT" : "POST", // Use POST if creating new, PUT if updating existing
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          actionId
            ? {
              actionId,
              name: formData.name,
              url: formData.url,
              instructions: formData.instructions,
              enabled: isEnabled,
              type: 'calcom',
            }
            : {
              chatbotId: params.chatbotId,
              name: formData.name,
              url: formData.url,
              instructions: formData.instructions,
              enabled: isEnabled,
              type: 'calcom',
            }
        ),
      });

      const data = await response.json();

      if(!response.ok){
        throw new Error(data?.error || "Failed to save.")
      }

      toast.success("Successfully to save.");
      router.push(`/dashboard/${params.teamId}/chatbot/${params.chatbotId}/actions/main`);
    } catch (error) {
      console.error("Failed to save action:", error);
      toast.error(error?.meesage || "Failed to save.")
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    router.push(`/dashboard/${params.teamId}/chatbot/${params.chatbotId}/actions/main`)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Cal.com get available slots</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Enabled</span>
          <Switch checked={isEnabled} onCheckedChange={handleToggle} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                ✓
              </div>
              <h2 className="font-medium text-lg">General</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Action Name</label>
                <p className="text-xs text-gray-500 mb-2">
                  A descriptive name for this action. This will help the AI Agent know when to use it.
                </p>
                <Input name="name" value={formData.name} onChange={handleChange} className="w-full" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Cal.com Event URL</label>
                <Input name="url" value={formData.url} onChange={handleChange} className="w-full" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">When to use</label>
                <p className="text-xs text-gray-500 mb-2">
                </p>
                <Textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  className="w-full min-h-[200px]"
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <Button variant="outline" type="button" onClick={() => setFormData(calComTemplate)}>
                  Reset
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="bg-gray-800 hover:bg-gray-700">
                  {isSaving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm">Chatbot 12/26/2024, 12:11:01 AM</div>
              <RefreshCw className="h-4 w-4" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3 text-gray-800 mb-4">
              <p className="text-sm">Hi! What can I help you with?</p>
            </div>
            <div className="mt-auto pt-4">
              <div className="relative">
                <Input
                  placeholder="Message..."
                  className="w-full bg-white/10 border-none text-white placeholder:text-white/60"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 2L11 13"></path>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

