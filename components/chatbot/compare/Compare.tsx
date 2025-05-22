"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { IconArrowLeft } from "@tabler/icons-react"
import toast from "react-hot-toast"
import ChatInstance from "./ChatInstance"
import { AI_MODELS } from "@/types/config"

// Find a default model (first one marked as default)
const getDefaultModel = () => {
  for (const [provider, models] of Object.entries(AI_MODELS)) {
    const defaultModel = models.find(model => model.default);
    if (defaultModel) {
      return {
        value: defaultModel.value,
        label: defaultModel.label,
        provider
      };
    }
  }
  // Fallback to GPT-4o if no default is found
  return { value: "gpt-4o", label: "GPT-4o", provider: "OpenAI" };
};

const defaultModel = getDefaultModel();

interface Message {
  role: "user" | "assistant"
  content: string
  confidenceScore?: number
  reasonal_content?: string
}

interface ChatInstance {
  id: string
  name: string
  messages: Message[]
  input: string
  isLoading: boolean
  config: any
  aiSettings: any
}

// Update the CompareProps interface to use a single chatbot prop
interface CompareProps {
  chatbot?: {
    name: string
    id: string
    settings?: {
      model?: string
      temperature?: number
      maxTokens?: number
      systemPrompt?: string
      language?: string
    }
  }
  team?: any
}

// In the Compare component, add default values and checks for undefined chatbots
const Compare = ({ chatbot, team }: CompareProps) => {
  const [instances, setInstances] = useState<ChatInstance[]>([])
  const [syncEnabled, setSyncEnabled] = useState<boolean[]>([])
  const [activeSettings, setActiveSettings] = useState<string | null>(null)

  useEffect(() => {
    // Initialize with the same chatbot for all instances if available
    if (chatbot && instances.length === 0) {
      // Create two instances with independent settings objects
      const initialInstances = [1, 2].map(() => {
        // Create a fresh copy of settings for each instance
        const instanceSettings = chatbot.settings ?
          JSON.parse(JSON.stringify(chatbot.settings)) :
          {
            model: defaultModel.value,
            temperature: 0,
            maxTokens: 1000,
            systemPrompt: "You are a helpful assistant.",
            instructions: "### Role\nYou are a Developer Assistant who helps with coding tasks.",
          };

        return {
          id: `default-${Math.random().toString(36).substring(7)}`,
          name: chatbot.name || defaultModel.label,
          messages: [] as Message[],
          input: "",
          isLoading: false,
          config: {},
          aiSettings: instanceSettings, // Each instance gets its own settings object
        }
      })
      setInstances(initialInstances)
      setSyncEnabled(new Array(initialInstances.length).fill(true))
    } else if (!chatbot && instances.length === 0) {
      // Create default instances if no chatbot is provided
      const defaultInstances = [1, 2].map(() => {
        // Create a fresh settings object for each instance
        return {
          id: `default-${Math.random().toString(36).substring(7)}`,
          name: defaultModel.label,
          messages: [] as Message[],
          input: "",
          isLoading: false,
          config: {},
          aiSettings: {
            model: defaultModel.value,
            temperature: 0,
            maxTokens: 1000,
            systemPrompt: "You are a helpful assistant.",
            instructions: "### Role\nYou are a Developer Assistant who helps with coding tasks.",
          },
        }
      })
      setInstances(defaultInstances)
      setSyncEnabled(new Array(defaultInstances.length).fill(true))
    }
  }, [chatbot, instances.length])

  // Reset instances with independent settings objects
  const handleReset = () => {
    if (chatbot) {
      // Reset with two instances of the same chatbot, each with its own settings
      const initialInstances = [1, 2].map(() => {
        // Create a fresh copy of settings for each instance
        const instanceSettings = chatbot.settings ?
          JSON.parse(JSON.stringify(chatbot.settings)) :
          {
            model: defaultModel.value,
            temperature: 0,
            maxTokens: 1000,
            systemPrompt: "You are a helpful assistant.",
            instructions: "### Role\nYou are a Developer Assistant who helps with coding tasks.",
          };

        return {
          id: `default-${Math.random().toString(36).substring(7)}`,
          name: chatbot.name || defaultModel.label,
          messages: [] as Message[],
          input: "",
          isLoading: false,
          config: {},
          aiSettings: instanceSettings, // Each instance gets its own settings object
        }
      })
      setInstances(initialInstances)
      setSyncEnabled(new Array(initialInstances.length).fill(true))
    } else {
      // Reset with default instances if no chatbot is provided
      const defaultInstances = [1, 2].map(() => {
        // Create a fresh settings object for each instance
        return {
          id: `default-${Math.random().toString(36).substring(7)}`,
          name: defaultModel.label,
          messages: [] as Message[],
          input: "",
          isLoading: false,
          config: {},
          aiSettings: {
            model: defaultModel.value,
            temperature: 0,
            maxTokens: 1000,
            systemPrompt: "You are a helpful assistant.",
            instructions: "### Role\nYou are a Developer Assistant who helps with coding tasks.",
          },
        }
      })
      setInstances(defaultInstances)
      setSyncEnabled(new Array(defaultInstances.length).fill(true))
    }
  }

  // Add a new instance with its own independent settings
  const handleAddInstance = () => {
    if (chatbot) {
      setInstances((prev) => [
        ...prev,
        {
          id: `default-${Math.random().toString(36).substring(7)}`,
          name: chatbot.name || defaultModel.label,
          messages: [],
          input: "",
          isLoading: false,
          config: {},
          // Create a fresh copy of settings for the new instance
          aiSettings: chatbot.settings ?
            JSON.parse(JSON.stringify(chatbot.settings)) :
            {
              model: defaultModel.value,
              temperature: 0,
              maxTokens: 1000,
              systemPrompt: "You are a helpful assistant.",
              instructions: "### Role\nYou are a Developer Assistant who helps with coding tasks.",
            },
        },
      ])
    } else {
      // Add a default instance if no chatbot is provided
      setInstances((prev) => [
        ...prev,
        {
          id: `default-${Math.random().toString(36).substring(7)}`,
          name: defaultModel.label,
          messages: [],
          input: "",
          isLoading: false,
          config: {},
          // Create a fresh settings object for the new instance
          aiSettings: {
            model: defaultModel.value,
            temperature: 0,
            maxTokens: 1000,
            systemPrompt: "You are a helpful assistant.",
            instructions: "### Role\nYou are a Developer Assistant who helps with coding tasks.",
          },
        },
      ])
    }
    setSyncEnabled((prev) => [...prev, true])
  }

  // New function to send chat request to all synced instances
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const inputElement = form.querySelector('input[type="text"]') as HTMLInputElement | null;
    if (!inputElement) return;
    const input = inputElement.value;
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    const syncedInstances = instances.filter((_, idx) => syncEnabled[idx]);

    // Update all synced instances with the user message and set loading
    const updatedInstances = instances.map((instance) => {
      if (syncEnabled[instances.findIndex(i => i.id === instance.id)]) {
        return {
          ...instance,
          messages: [...instance.messages, userMessage],
          input: "",
          isLoading: true,
        };
      }
      return instance;
    });
    setInstances(updatedInstances);

    // Send chat request for each synced instance in parallel without awaiting all to finish
    syncedInstances.forEach(async (instance) => {
      let messages = [...instance.messages, userMessage];

      const aiSettings = instance.aiSettings || {
        model: defaultModel.value,
        temperature: 0,
        maxTokens: 1000,
        systemPrompt: "You are a helpful assistant.",
        language: "en",
      };

      try {
        const response = await fetch("/api/chatbot/compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages,
            chatbotId: chatbot.id,
            language: aiSettings.language,
            model: aiSettings.model,
            temperature: aiSettings.temperature,
            maxTokens: aiSettings.maxTokens,
            systemPrompt: aiSettings.systemPrompt,
            instructions: aiSettings.instructions,
            confidenceScoring: true,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log("Error response:", errorData);
          console.log("Error response:", response);
          throw new Error(errorData.error || `API request failed with status: ${response.status}`);
        }

        const assistantMessage: Message = {
          role: "assistant",
          content: "",
          confidenceScore: -1,
          reasonal_content: "",
        };

        messages.push(assistantMessage);
        updateInstance(instance.id, {
          messages,
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          let accumulatedContent = "";
          let done = false;
          let lastMessageIndex = messages.length - 1;
          while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(5).trim();
                if (data === "[DONE]") {
                  updateInstance(instance.id, { isLoading: false });
                  continue;
                }
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.text) {
                    accumulatedContent += parsed.text;
                    let confidenceScore = -1;
                    let content = accumulatedContent;
                    if (content.includes(":::")) {
                      const parts = content.split(":::");
                      if (parts.length > 1 && parts[1].trim()) {
                        confidenceScore = Number(parts[1].trim());
                        content = parts[0];
                      }
                    }
                    updateInstance(instance.id, {
                      messages: messages.map((msg, idx) => {
                        if (idx === lastMessageIndex && msg.role === "assistant") {
                          return {
                            ...msg,
                            content: content,
                            confidenceScore: confidenceScore,
                          };
                        }
                        return msg;
                      }),
                    });
                  }
                } catch (error) {
                  console.error("Error parsing JSON:", error);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Chat error:", error);
        toast.error(`${error.message}`);
        updateInstance(instance.id, { isLoading: false });
      }
    });
  };

  const handleClearAll = () => {
    setInstances((prevInstances) =>
      prevInstances.map((instance) => ({ ...instance, messages: [] as Message[], input: "" })),
    )
  }

  // Update instance with proper handling of nested settings
  const updateInstance = (id: string, updates: Partial<ChatInstance>) => {
    // Create a completely new copy of the updates to avoid reference issues
    const safeUpdates = JSON.parse(JSON.stringify(updates));

    setInstances((prevInstances) => {
      return prevInstances.map((instance) => {
        if (instance.id === id) {
          // Create a new instance with the updates
          const updatedInstance = { ...instance };

          // Handle aiSettings specially to ensure deep merge
          if (safeUpdates.aiSettings) {
            // Create a completely new settings object
            updatedInstance.aiSettings = JSON.parse(JSON.stringify({
              ...updatedInstance.aiSettings,
              ...safeUpdates.aiSettings,
            }));

            // Remove aiSettings from updates to avoid double-application
            const { aiSettings, ...otherUpdates } = safeUpdates;

            // Apply other updates
            Object.assign(updatedInstance, otherUpdates);
          } else {
            // Apply all updates directly
            Object.assign(updatedInstance, safeUpdates);
          }

          return updatedInstance;
        }
        return instance;
      });
    });

    // Handle input syncing separately - only sync input, not settings
    if (updates.input !== undefined) {
      const index = instances.findIndex((instance) => instance.id === id);
      if (index !== -1 && syncEnabled[index]) {
        setInstances((prevInstances) => {
          return prevInstances.map((instance, idx) => {
            if (instance.id !== id && syncEnabled[idx]) {
              return { ...instance, input: updates.input as string };
            }
            return instance;
          });
        });
      }
    }
  };

  const handleSyncToggle = (index: number) => {
    setSyncEnabled((prevSyncEnabled) => {
      const newSyncEnabled = [...prevSyncEnabled]
      newSyncEnabled[index] = !newSyncEnabled[index]
      return newSyncEnabled
    })
  }

  const handleSettingsToggle = (id: string) => {
    setActiveSettings((prev) => (prev === id ? null : id))
  }

  // Handle moving instances left or right
  const handleMoveInstance = (index: number, direction: "left" | "right") => {
    if ((direction === "left" && index === 0) || (direction === "right" && index === instances.length - 1)) {
      toast.error("Can't move further in that direction.")
      return // Can't move further left/right
    }

    const targetIndex = direction === "left" ? index - 1 : index + 1

    // Create copies of the arrays
    const newInstances = [...instances]
    const newSyncEnabled = [...syncEnabled]

    // Get references to the instances being swapped
    const instanceA = newInstances[index]
    const instanceB = newInstances[targetIndex]

    // Swap the instances
    newInstances[index] = instanceB
    newInstances[targetIndex] = instanceA

    // Swap the sync settings
    const syncA = newSyncEnabled[index]
    const syncB = newSyncEnabled[targetIndex]
    newSyncEnabled[index] = syncB
    newSyncEnabled[targetIndex] = syncA

    // Update the state
    setInstances(newInstances)
    setSyncEnabled(newSyncEnabled)
  }

  const handleClearChat = (id: string) => {
    updateInstance(id, { messages: [] })
  }

  // Handle deleting an instance while maintaining minimum required instances
  const handleDeleteInstance = (id: string) => {
    // Check if we have more than 2 instances
    if (instances.length <= 2) {
      toast.error("Cannot delete instance. At least two instances are required.")
      return
    }

    // Create a new array without the instance to delete
    const newInstances = instances.filter((instance) => instance.id !== id)

    // Create a new syncEnabled array without the corresponding entry
    const index = instances.findIndex((instance) => instance.id === id)
    const newSyncEnabled = [...syncEnabled]
    if (index !== -1) {
      newSyncEnabled.splice(index, 1)
    }

    // Update both states
    setInstances(newInstances)
    setSyncEnabled(newSyncEnabled)
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg hover:bg-gray-100"
            onClick={() => {
              if (team?.teamId && chatbot?.id) {
                window.location.href = `/dashboard/${team.teamId}/chatbot/${chatbot.id}`;
              } else {
                window.location.href = "/dashboard";
              }
            }}
          >
            <IconArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Compare</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleClearAll} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
            Clear all chats
          </button>
          <button onClick={handleReset} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
            Reset
          </button>
          <button
            onClick={handleAddInstance}
            className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Add an instance
          </button>
        </div>
      </div>
      <div
        className="w-[100vw] overflow-scroll"
        style={{
          backgroundImage: "radial-gradient(circle, #e5e5e5 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          minHeight: "calc(100vh - 73px)",
        }}
      >
        <div className="p-4 flex justify-center gap-4 w-fit min-w-full">
          {instances.map((instance, index) => (
            <ChatInstance
              key={instance.id}
              instance={instance}
              updateInstance={updateInstance}
              syncEnabled={syncEnabled[index]}
              onSync={() => handleSyncToggle(index)}
              onSettings={() => handleSettingsToggle(instance.id)}
              onMoveLeft={() => handleMoveInstance(index, "left")}
              onMoveRight={() => handleMoveInstance(index, "right")}
              onClearChat={() => handleClearChat(instance.id)}
              onDeleteInstance={() => handleDeleteInstance(instance.id)}
              allInstances={instances}
              setAllInstances={setInstances}
              handleSubmit={handleSubmit}
              team={team}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Compare
