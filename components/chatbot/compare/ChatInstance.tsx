"use client"
import React, { useState, useEffect, useRef } from "react"
import { IconSend, IconSettings, IconDotsVertical, IconTrash, IconInfoCircle } from "@tabler/icons-react"
import toast from "react-hot-toast"
import ModelSettings from "./model-settings"
import InstanceActions from "./instance-actions"
interface Message {
  role: "user" | "assistant"
  content: string
  confidenceScore?: number
  reasonal_content?: string
}

interface ChatInstanceType {
  id: string
  name: string
  messages: Message[]
  input: string
  isLoading: boolean
  config: any
  aiSettings: any
}

interface ChatInstanceProps {
  instance: ChatInstanceType
  updateInstance: (id: string, updates: Partial<ChatInstanceType>) => void
  syncEnabled: boolean
  onSync: () => void
  onSettings: () => void
  onMoveLeft: () => void
  onMoveRight: () => void
  onClearChat: () => void
  onDeleteInstance: () => void
  handleSubmit: (e: React.FormEvent) => void
  allInstances: ChatInstanceType[]
  setAllInstances: React.Dispatch<React.SetStateAction<ChatInstanceType[]>>
}

const ChatInstance: React.FC<ChatInstanceProps> = ({
  instance,
  updateInstance,
  syncEnabled,
  onSync,
  onSettings,
  onMoveLeft,
  onMoveRight,
  onClearChat,
  onDeleteInstance,
  allInstances,
  setAllInstances,
  handleSubmit
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showActions, setShowActions] = useState(false)

  useEffect(() => {
    if (!instance.aiSettings) {
      updateInstance(instance.id, {
        aiSettings: {
          model: "gpt-4o",
          temperature: 0,
          maxTokens: 1000,
          systemPrompt: "You are a helpful assistant.",
          instructions: "### Role\nYou are a Developer Assistant who helps with coding tasks.",
        },
      })
    }
  }, [instance.id, instance.aiSettings, updateInstance])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [instance.messages])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const isClickOutsideSettings = !target.closest('[data-settings-menu]')
      const isClickOutsideActions = !target.closest('[data-actions-menu]')
      if (isClickOutsideSettings && showSettings) {
        setShowSettings(false)
      }
      if (isClickOutsideActions && showActions) {
        setShowActions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSettings, showActions])

  const toggleSettings = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowSettings(!showSettings)
    setShowActions(false)
  }

  const toggleActions = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowActions(!showActions)
    setShowSettings(false)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onDeleteInstance()
  }

  return (
    <div
      className="flex flex-col border rounded-lg bg-white overflow-visible"
      style={{
        height: "calc(100vh - 120px)",
        width: "400px",
      }}
    >
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6">
            <IconInfoCircle />
          </div>
          <div>
            <span className="font-medium">{instance.name}</span>
            {instance.aiSettings?.model && (
              <div className="text-xs text-gray-500">
                {instance.aiSettings.model} • Temp: {instance.aiSettings.temperature || 0}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={syncEnabled} onChange={onSync} className="sr-only peer" />
              <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ms-1 text-sm font-medium text-gray-600">Sync</span>
            </label>
          </div>
          <div className="relative">
            <button onClick={toggleSettings} className="p-1.5 rounded-full hover:bg-gray-100">
              <IconSettings className="w-4 h-4" />
            </button>
            {showSettings && (
              <ModelSettings
                data-settings-menu
                instance={instance}
                updateInstance={updateInstance}
                onClose={() => setShowSettings(false)}
              />
            )}
          </div>
          <div className="relative">
            <button onClick={toggleActions} className="p-1.5 rounded-full hover:bg-gray-100">
              <IconDotsVertical className="w-4 h-4" />
            </button>
            {showActions && (
              <InstanceActions
                data-actions-menu
                onMoveLeft={onMoveLeft}
                onMoveRight={onMoveRight}
                onClearChat={onClearChat}
                onDeleteInstance={onDeleteInstance}
                onClose={() => setShowActions(false)}
              />
            )}
          </div>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-full hover:bg-gray-100 text-red-500"
            title="Delete Instance"
          >
            <IconTrash className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        {instance.messages.length === 0 && (
          <div className="p-4 rounded-lg bg-gray-50">Hi! What can I help you with?</div>
        )}
        {instance.messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === "assistant" ? "" : "flex justify-end"}`}>
            <div
              className={`p-3 inline-block max-w-[80%] rounded-xl ${message.role === "assistant" ? "prose prose-sm max-w-none bg-gray-50" : "text-white bg-blue-600"
                }`}
            >
              {message.role === "assistant" ? (
                <div dangerouslySetInnerHTML={{ __html: message.content }} />
              ) : (
                <p className="p-1">{message.content}</p>
              )}
              {message.role === "assistant" && message.confidenceScore !== -1 && (
                <div className="mt-2">
                  <span className="px-1 py-0.5 text-xs rounded bg-blue-100">{message.confidenceScore}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {instance.isLoading && <span className="loading loading-spinner loading-xs"></span>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t p-3">
        <div className="relative">
          <input
            type="text"
            value={instance.input}
            onChange={(e) => updateInstance(instance.id, { input: e.target.value })}
            placeholder="Message..."
            className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            disabled={instance.isLoading}
          />
          <button
            type="submit"
            disabled={instance.isLoading || !instance.input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <IconSend className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatInstance
