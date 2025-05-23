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
import Playground from "../playground/Playground"

const calComTemplate = {
  name: "Cal com",
  url: "",
  instructions:
    'Use when the user mentions booking an appointment. If no date is specified, automatically set the window from today to 1 week from today and display these dates to the user without asking for confirmation. If a date window is specified, set the search window to that specific date window and display it to the user.After performing the search, respond with either "I have found available slots" or "I have not found available slots "Display the search window but do not provide a list of slots or links. After using the tool, check whether the user booked an appointment or not from the tool result.',
}

export default function Calcom(
  params
    :
    {
      teamId: string;
      chatbotId: string;
      chatbot: {
        name: string;
        id: string;
        settings?: {
          model?: string;
          temperature?: number;
          maxTokens?: number;
          systemPrompt?: string;
          language?: string;
        };
      },
    }
) {
  const router = useRouter()
  const [isEnabled, setIsEnabled] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  // Initialize formData with all keys to avoid uncontrolled to controlled input warning
  const [formData, setFormData] = useState({
    ...calComTemplate,
  })
  const searchParams = useSearchParams()
  const actionId = searchParams.get("actionId")
  const [isformDataValid, setIsformDataValid] = useState(false);

  useEffect(() => {
    const fetchAction = async () => {
      if (actionId) {
        try {
          const res = await fetch(`/api/chatbot/action?actionId=${actionId}`);
          if (!res.ok) {
            throw new Error("Failed to fetch action");
          }
          const action = await res.json();
          // Ensure formData keys are always defined to avoid uncontrolled input warning
          setFormData({
            name: action.name ?? "",
            url: action.url ?? "",
            instructions: action.instructions ?? "",
            ...action
          });
          console.log(action)
          setIsEnabled(action.enabled);
        } catch (error) {
          console.error("Error fetching action:", error);
        }
      }
    };

    fetchAction();
  }, [actionId]);

  const isValidCalComUrl = (url: string) => /^https:\/\/cal\.com\/.+/.test(url);

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
    const isValid =
      formData.name?.trim().length > 0 &&
      isValidCalComUrl(formData.url || '') &&
      formData.instructions?.trim().length > 0;

    console.log(formData.name, formData.url, formData.instructions)

    if (!isValid) {
      toast.error('The data is not valid.😒');
      return;
    }
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

      if (!response.ok) {
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

      <div className="flex flex-wrap justify-center gap-8">
        <div className="flex-grow">
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex items-center gap-2 mb-6 hidden">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white">
                <div className="h-3 w-3 text-center text-2xl flex items-center justify-center">C </div>
              </div>
              <h2 className="font-medium text-lg">Cal.com</h2>
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

        <div className="w-fit flex justify-end">
          <Playground chatbot={params.chatbot} embed={true} standalone={true} mocking={true} mockingData={formData} isMockingDataValid={isformDataValid} />
        </div>
      </div>
    </div>
  )
}
