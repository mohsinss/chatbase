"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, RefreshCw, Trash2, Plus, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import toast from "react-hot-toast"
import Playground from "../playground/Playground"

const calComTemplate = {
  name: "Custom Button",
  url: "https://news.com",
  instructions:
    'Use when user ask about the news',
  buttonType: "button", // default to "button"
  buttonText: "Click me", // default button text
}

export default function LinkButton(
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
  // Change formData to an array of buttons
  const [buttons, setButtons] = useState([calComTemplate])
  // Track the index of the selected button
  // Remove selectedIndex state as we will show all buttons as expandable sections
  // const [selectedIndex, setSelectedIndex] = useState(0)
  const [expandedIndices, setExpandedIndices] = useState<number[]>([0])
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
          // Assuming action can be multiple buttons, if not, wrap in array
          const loadedButtons = Array.isArray(action.metadata) ? action.metadata : [action.metadata];
          setButtons(
            loadedButtons.map((btn: any) => ({
              ...btn,
            }))
          );
          setIsEnabled(action?.enabled ?? true);
          // Remove setSelectedIndex usage
        } catch (error) {
          console.error("Error fetching action:", error);
        }
      }
    };

    fetchAction();
  }, [actionId]);

  const isValidUrl = (url: string) => /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(url);

  // Remove handleChange for selectedIndex, replaced by handleButtonChange
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target
  //   setButtons((prev) => {
  //     const newButtons = [...prev]
  //     newButtons[selectedIndex] = { ...newButtons[selectedIndex], [name]: value }
  //     return newButtons
  //   })
  // }

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
    // Validate all buttons before saving
    const allValid = buttons.every((btn) =>
      btn.name?.trim().length > 0 &&
      isValidUrl(btn.url || '') &&
      btn.instructions?.trim().length > 0
    );

    if (!allValid) {
      toast.error('One or more buttons have invalid data.😒');
      return;
    }
    setIsSaving(true);
    try {
      const payload = actionId
        ? {
          actionId,
          enabled: isEnabled,
          metadata: buttons,
          name: 'custom button',
          type: 'button',
        }
        : {
          chatbotId: params.chatbotId,
          enabled: isEnabled,
          metadata: buttons,
          type: 'button',
          name: 'custom button',
        };

      const response = await fetch(`/api/chatbot/action`, {
        method: actionId ? "PUT" : "POST", // Use POST if creating new, PUT if updating existing
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  // Handle select change to switch between buttons
  // Remove select dropdown and selectedIndex usage
  // Render all buttons as expandable sections

  // Helper to toggle expanded state of a section
  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  // Handle change for a specific button by index
  const handleButtonChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setButtons((prev) => {
      const newButtons = [...prev];
      newButtons[index] = { ...newButtons[index], [name]: value };
      return newButtons;
    });
  };

  // Handle buttonType change for a specific button by index
  const handleButtonTypeChange = (index: number, value: string) => {
    setButtons((prev) => {
      const newButtons = [...prev];
      newButtons[index] = { ...newButtons[index], buttonType: value };
      return newButtons;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Custom Button</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Enabled</span>
          <Switch checked={isEnabled} onCheckedChange={handleToggle} />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        <div className="flex-grow">
          <div className="bg-white rounded-lg border p-6 mb-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Buttons</h2>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const newButton = { ...calComTemplate, name: `New Button ${buttons.length + 1}` };
                  setButtons((prev) => [...prev, newButton]);
                  setExpandedIndices((prev) => [...prev, buttons.length]);
                }}
                aria-label="Add new button"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {buttons.map((btn, idx) => {
              const isExpanded = expandedIndices.includes(idx);
              return (
                <div key={idx} className="border rounded-md">
                  <div className="flex justify-between gap-2 items-center px-4 py-2 bg-gray-100 hover:bg-gray-200">
                    <button
                      className="flex-grow flex text-left justify-between focus:outline-none"
                      onClick={() => toggleExpand(idx)}
                      aria-expanded={isExpanded}
                      aria-controls={`div-section-${idx}`}
                    >
                      <div className="font-medium">{btn.name || `Button ${idx + 1}`}</div>
                      {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (buttons.length === 1) {
                          setButtons([calComTemplate]);
                          setExpandedIndices([0]);
                        } else {
                          setButtons((prev) => prev.filter((_, i) => i !== idx));
                          setExpandedIndices((prev) => prev.filter((i) => i !== idx).map(i => (i > idx ? i - 1 : i)));
                        }
                      }}
                      aria-label={`Delete button ${idx + 1}`}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                  {isExpanded && (
                    <div id={`button-section-${idx}`} className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Action Name</label>
                        <p className="text-xs text-gray-500 mb-2">
                          A descriptive name for this action. This will help the AI Agent know when to use it.
                        </p>
                        <Input name="name" value={btn.name} onChange={(e) => handleButtonChange(idx, e)} className="w-full" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Url</label>
                        <p className="text-xs text-gray-500 mb-2">
                          The URL to open when the button is clicked.
                        </p>
                        <Input name="url" value={btn.url} onChange={(e) => handleButtonChange(idx, e)} className="w-full" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Button Type</label>
                        <div className="flex gap-4 mb-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`buttonType-${idx}`}
                              value="button"
                              checked={btn.buttonType === "button"}
                              onChange={() => handleButtonTypeChange(idx, "button")}
                              className="form-radio"
                            />
                            <span className="ml-2">Button</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`buttonType-${idx}`}
                              value="clickableText"
                              checked={btn.buttonType === "clickableText"}
                              onChange={() => handleButtonTypeChange(idx, "clickableText")}
                              className="form-radio"
                            />
                            <span className="ml-2">Clickable Text</span>
                          </label>
                        </div>
                      </div>

                      {btn.buttonType === "button" && (
                        <div>
                          <label className="block text-sm font-medium mb-1">Button Text</label>
                          <p className="text-xs text-gray-500 mb-2">
                            The text displayed on the button.
                          </p>
                          <Input
                            name="buttonText"
                            value={btn.buttonText || ""}
                            onChange={(e) => handleButtonChange(idx, e)}
                            className="w-full"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium mb-1">When to use</label>
                        <p className="text-xs text-gray-500 mb-2 max-w-[500px]">
                          Explain when the AI Agent should use this action. Include a description of what this action does, the data it provides, and any updates it makes, Include example queries that should trigger this action.
                        </p>
                        <Textarea
                          name="instructions"
                          value={btn.instructions}
                          onChange={(e) => handleButtonChange(idx, e)}
                          className="w-full min-h-[200px]"
                          placeholder="Example: Use this action when the user asks about a product or service"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" type="button" onClick={() => {
                setButtons([calComTemplate]);
                setExpandedIndices([0]);
              }}>
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

        <div className="w-fit flex justify-end">
          <Playground chatbot={params.chatbot} embed={true} standalone={true} mocking={true} mockingData={buttons[0]} isMockingDataValid={isformDataValid} />
        </div>
      </div>
    </div>
  );
}
