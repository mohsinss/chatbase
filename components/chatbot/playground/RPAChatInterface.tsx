"use client"

import { useState, useEffect, useRef } from "react"
import type { Node, Edge } from "reactflow"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "bot" | "user"
  options?: string[]
}

interface ChatInterfaceProps {
  nodes: Node[]
  edges: Edge[]
}

export default function RPAChatInterface({ nodes, edges }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Start the chat with the first node
  useEffect(() => {
    const startFlow = () => {
      if (nodes.length === 0) return

      // Find the first node (we'll assume it's the one with the lowest y position)
      const startNode = [...nodes].sort((a, b) => (a.position?.y || 0) - (b.position?.y || 0))[0]

      if (!startNode) return

      // Add the message to chat
      addBotMessage(startNode.data.message)

      // If the node has options, add them
      if (startNode.data.options && startNode.data.options.length > 0) {
        addBotOptions(startNode.data.question, startNode.data.options)
        setCurrentNodeId(startNode.id)
      }
    }

    if (nodes.length > 0 && messages.length === 0) {
      startFlow()
    }
  }, [nodes, messages])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addBotMessage = (content: string) => {
    if (!content) return

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content,
        sender: "bot",
      },
    ])
  }

  const addBotOptions = (question: string, options: string[]) => {
    if (!question || !options || options.length === 0) return

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: question,
        sender: "bot",
        options,
      },
    ])
  }

  const addUserMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content,
        sender: "user",
      },
    ])
  }

  const handleSendMessage = () => {
    if (!input.trim()) return

    addUserMessage(input)
    setInput("")

    // For simplicity, we'll just echo back the message
    setTimeout(() => {
      addBotMessage("I received your message: " + input)
    }, 500)
  }

  const handleOptionClick = (option: string, index: number) => {
    addUserMessage(option)

    if (!currentNodeId) return

    // Find the edge from the current node with the matching source handle
    const nextEdge = edges.find((edge) => edge.source === currentNodeId && edge.sourceHandle === index.toString())

    if (!nextEdge) return

    // Find the next node
    const nextNode = nodes.find((node) => node.id === nextEdge.target)
    if (!nextNode) return

    // Add the message
    setTimeout(() => {
      addBotMessage(nextNode.data.message)

      // If the node has options, add them
      if (nextNode.data.options && nextNode.data.options.length > 0) {
        addBotOptions(nextNode.data.question, nextNode.data.options)
        setCurrentNodeId(nextNode.id)
      } else {
        setCurrentNodeId(null)
      }
    }, 500)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Chat with Bot</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                <Avatar className={message.sender === "user" ? "bg-blue-500" : "bg-gray-500"}>
                  <AvatarFallback>{message.sender === "user" ? "U" : "B"}</AvatarFallback>
                </Avatar>
                <div>
                  <div
                    className={`rounded-lg p-3 ${message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                  >
                    {message.content}
                  </div>
                  {message.options && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleOptionClick(option, index)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage()
            }}
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

