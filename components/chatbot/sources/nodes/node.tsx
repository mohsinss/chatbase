"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface NodeData {
  label?: string
  message?: string
  question?: string
  options?: string[]
  image?: string
  id?: string
  position?: { x: number; y: number }
  onNodesChange?: (callback: (nodes: any[]) => any[]) => void
  onEdgesChange?: (callback: (edges: any[]) => any[]) => void
}

export default function FlowNode({ data, isConnectable }: NodeProps<NodeData>) {
  const [label, setLabel] = useState(data.label || "Node")
  const [message, setMessage] = useState(data.message || "")
  const [question, setQuestion] = useState(data.question || "")
  const [options, setOptions] = useState<string[]>(data.options || [])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        data.image = imageUrl

        if (data.onNodesChange) {
          data.onNodesChange((nodes) =>
            nodes.map((node) => {
              if (node.id === data.id) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    image: imageUrl,
                  },
                }
              }
              return node
            }),
          )
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  useEffect(() => {
    setOptions(data.options || []);
  }, [data])

  const hasOptions = options.length > 0

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value
    setLabel(newLabel)
    data.label = newLabel

    // Update the parent component's state
    if (data.onNodesChange) {
      data.onNodesChange((nodes) => {
        return nodes.map((node) => {
          if (node.id === data.id) {
            return {
              ...node,
              data: {
                ...node.data,
                label: newLabel,
              },
            }
          }
          return node
        })
      })
    }
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value
    setMessage(newMessage)
    data.message = newMessage

    // Update the parent component's state
    if (data.onNodesChange) {
      data.onNodesChange((nodes) => {
        return nodes.map((node) => {
          if (node.id === data.id) {
            return {
              ...node,
              data: {
                ...node.data,
                message: newMessage,
              },
            }
          }
          return node
        })
      })
    }
  }

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuestion = e.target.value
    setQuestion(newQuestion)
    data.question = newQuestion

    // Update the parent component's state
    if (data.onNodesChange) {
      data.onNodesChange((nodes) => {
        return nodes.map((node) => {
          if (node.id === data.id) {
            return {
              ...node,
              data: {
                ...node.data,
                question: newQuestion,
              },
            }
          }
          return node
        })
      })
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
    data.options = newOptions

    // Update the parent component's state
    if (data.onNodesChange) {
      data.onNodesChange((nodes) => {
        return nodes.map((node) => {
          if (node.id === data.id) {
            return {
              ...node,
              data: {
                ...node.data,
                options: newOptions,
              },
            }
          }
          return node
        })
      })
    }
  }

  const addOption = () => {
    // If this is a node without options, add 2 options
    if (options.length === 0) {
      const newOptions = ["Option 1", "Option 2"]
      setOptions(newOptions)
      data.options = newOptions
      data.question = data.question || "What would you like to do?"

      // Create two new nodes and connect them
      if (data.onNodesChange && data.onEdgesChange) {
        // Create first node
        const newNodeId1 = `node-${Date.now()}`
        const newNode1 = {
          id: newNodeId1,
          type: "node",
          position: {
            x: data.position?.x + 100 || 200,
            y: data.position?.y + 150 || 250,
          },
          data: {
            label: "Response 1",
            message: "Response for option 1",
            position: {
              x: data.position?.x + 100 || 200,
              y: data.position?.y + 150 || 250,
            },
          },
        }

        // Create second node
        const newNodeId2 = `node-${Date.now() + 1}`
        const newNode2 = {
          id: newNodeId2,
          type: "node",
          position: {
            x: data.position?.x + 200 || 300,
            y: data.position?.y + 150 || 250,
          },
          data: {
            label: "Response 2",
            message: "Response for option 2",
            position: {
              x: data.position?.x + 200 || 300,
              y: data.position?.y + 150 || 250,
            },
          },
        }

        // Create edges
        const newEdge1 = {
          id: `e-${Date.now()}`,
          source: data.id,
          target: newNodeId1,
          sourceHandle: "0",
        }

        const newEdge2 = {
          id: `e-${Date.now() + 1}`,
          source: data.id,
          target: newNodeId2,
          sourceHandle: "1",
        }

        // Add nodes and edges
        data.onNodesChange((nodes) => [...nodes.map((node) => {
          if (node.id === data.id) {
            return {
              ...node,
              data: {
                ...node.data,
                options: newOptions,
                question: data.question || "What would you like to do?",
              },
            }
          }
          return node
        }), newNode1, newNode2])
        data.onEdgesChange((edges) => [...edges, newEdge1, newEdge2])
      }
    } else {
      // Just add one more option if we already have options
      const newOptions = [...options, `Option ${options.length + 1}`]
      setOptions(newOptions)
      data.options = newOptions

      // Create a new node
      const newNodeId = `node-${Date.now()}`
      const newNode = {
        id: newNodeId,
        type: "node",
        position: {
          x: data.position?.x + 150 || 250,
          y: data.position?.y + 150 || 250,
        },
        data: {
          label: `Response ${options.length + 1}`,
          message: `Response for option ${options.length + 1}`,
          position: {
            x: data.position?.x + 150 || 250,
            y: data.position?.y + 150 || 250,
          },
        },
      }

      // Create a new edge connecting this node to the new node
      const newEdge = {
        id: `e-${Date.now()}`,
        source: data.id,
        target: newNodeId,
        sourceHandle: options.length.toString(),
      }

      // Add the new node and edge to the flow
      if (data.onNodesChange && data.onEdgesChange) {
        data.onNodesChange((nodes) => [...nodes.map((node) => {
          if (node.id === data.id) {
            return {
              ...node,
              data: {
                ...node.data,
                options: newOptions,
              },
            }
          }
          return node
        }), newNode])
        data.onEdgesChange((edges) => [...edges, newEdge])
      }
    }
  }

  const removeOption = (index: number) => {
    // If we have only 2 options, don't allow deletion
    if (options.length <= 2) {
      alert(
        "Nodes with options must have at least 2 options. Add another option before deleting, or remove all options.",
      )
      return
    }

    // First, find any edges that use this option's source handle
    if (data.onEdgesChange && data.onNodesChange) {
      data.onEdgesChange((edges) => {
        // Find edges connected to this option
        const edgesToRemove = edges.filter((edge) => edge.source === data.id && edge.sourceHandle === index.toString())

        // Get the target node IDs to remove
        const targetNodeIds = edgesToRemove.map((edge) => edge.target)

        // Remove the connected nodes
        data.onNodesChange?.((nodes) => {
          // First, find all descendant nodes that should be removed
          const getAllDescendants = (nodeIds: string[], allNodes: any[], allEdges: any[]): string[] => {
            const descendants = [...nodeIds]

            // For each node ID, find its children
            nodeIds.forEach((nodeId) => {
              // Find edges where this node is the source
              const childEdges = allEdges.filter((edge) => edge.source === nodeId)
              // Get the target node IDs
              const childNodeIds = childEdges.map((edge) => edge.target)

              if (childNodeIds.length > 0) {
                // Recursively get descendants of children
                const childDescendants = getAllDescendants(childNodeIds, allNodes, allEdges)
                descendants.push(...childDescendants)
              }
            })

            return descendants
          }

          // Get all descendant nodes to remove
          const allNodesToRemove = getAllDescendants(targetNodeIds, nodes, edges)

          // Remove the option from the options array
          const newOptions = options.filter((_, i) => i !== index)
          setOptions(newOptions)
          data.options = newOptions

          // Filter out the nodes to remove
          return nodes.filter((node) => !allNodesToRemove.includes(node.id)).map((node) => {
            if (node.id === data.id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  options: newOptions,
                },
              }
            }
            return node
          })
        })

        // Remove the edges
        return edges.filter((edge) => {
          // Remove direct edges from this option
          if (edge.source === data.id && edge.sourceHandle === index.toString()) {
            return false
          }

          // Also remove any edges connected to nodes we're removing
          const targetNodeIds = edgesToRemove.map((e) => e.target)
          if (targetNodeIds.includes(edge.source) || targetNodeIds.includes(edge.target)) {
            return false
          }

          return true
        })
      })
    }

    // Update the sourceHandles of the remaining edges to maintain proper indexing
    if (data.onEdgesChange) {
      data.onEdgesChange((edges) => {
        return edges.map((edge) => {
          if (edge.source === data.id && edge.sourceHandle) {
            const handleIndex = Number.parseInt(edge.sourceHandle)
            if (handleIndex > index) {
              // Decrement the sourceHandle index for edges after the removed option
              return {
                ...edge,
                sourceHandle: (handleIndex - 1).toString(),
              }
            }
          }
          return edge
        })
      })
    }
  }

  const removeAllOptions = () => {
    // First, remove all connected nodes and edges
    if (data.onEdgesChange && data.onNodesChange) {
      data.onEdgesChange((edges) => {
        // Find all edges connected to this node
        const edgesToRemove = edges.filter((edge) => edge.source === data.id)

        // Get the target node IDs to remove
        const targetNodeIds = edgesToRemove.map((edge) => edge.target)

        // Remove the connected nodes and their descendants
        data.onNodesChange?.((nodes) => {
          // First, find all descendant nodes that should be removed
          const getAllDescendants = (nodeIds: string[], allNodes: any[], allEdges: any[]): string[] => {
            const descendants = [...nodeIds]

            // For each node ID, find its children
            nodeIds.forEach((nodeId) => {
              // Find edges where this node is the source
              const childEdges = allEdges.filter((edge) => edge.source === nodeId)
              // Get the target node IDs
              const childNodeIds = childEdges.map((edge) => edge.target)

              if (childNodeIds.length > 0) {
                // Recursively get descendants of children
                const childDescendants = getAllDescendants(childNodeIds, allNodes, allEdges)
                descendants.push(...childDescendants)
              }
            })

            return descendants
          }

          // Get all descendant nodes to remove
          const allNodesToRemove = getAllDescendants(targetNodeIds, nodes, edges)

          // Filter out the nodes to remove
          return nodes.filter((node) => !allNodesToRemove.includes(node.id))
        })

        // Remove all edges connected to this node
        return edges.filter((edge) => edge.source !== data.id)
      })
    }

    // Clear all options
    setOptions([])
    data.options = []
    data.question = ""

    // Update the parent component's state
    if (data.onNodesChange) {
      data.onNodesChange((nodes) => {
        return nodes.map((node) => {
          if (node.id === data.id) {
            return {
              ...node,
              data: {
                ...node.data,
                options: [],
                question: "",
              },
            }
          }
          return node
        })
      })
    }
  }

  return (
    <Card className="w-64 border-gray-300 bg-white">
      <CardHeader className="p-3 pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-gray-800">Node</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 -mr-2 hidden"
            onClick={() => {
              if (data.onNodesChange) {
                data.onNodesChange((nodes) => nodes.filter(node => node.id !== data.id));
              }
              if (data.onEdgesChange) {
                data.onEdgesChange((edges) => edges.filter(edge =>
                  edge.source !== data.id && edge.target !== data.id
                ));
              }
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2">
          <div>
            <Label htmlFor="label" className="text-xs">
              Label
            </Label>
            <Input id="label" value={label} onChange={handleLabelChange} className="h-7 text-sm" />
          </div>

          <div>
            <Label htmlFor="message" className="text-xs">
              Message
            </Label>
            <Textarea id="message" value={message} onChange={handleMessageChange} className="text-sm min-h-[60px]" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Image</Label>
            {data.image && (
              <img src={data.image} alt="Attached" className="rounded-md max-h-32 object-cover" />
            )}
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={triggerFileInput}>
              {data.image ? "Change Image" : "Attach Image"}
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs">Options</Label>
              <div className="flex gap-1">
                {options.length > 0 && (
                  <Button variant="outline" size="sm" className="h-6 text-xs" onClick={removeAllOptions}>
                    Remove All
                  </Button>
                )}
                <Button variant="outline" size="sm" className="h-6 text-xs" onClick={addOption}>
                  <Plus className="h-3 w-3 mr-1" /> Add Option
                </Button>
              </div>
            </div>

            {options.length > 0 && (
              <div>
                <Label htmlFor="question" className="text-xs">
                  Question
                </Label>
                <Input
                  id="question"
                  value={question}
                  onChange={handleQuestionChange}
                  className="h-7 text-sm mb-2"
                  placeholder="What would you like to do?"
                />
              </div>
            )}

            <div className="space-y-1">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-1">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="h-7 text-sm flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => removeOption(index)}
                    disabled={options.length <= 2}
                  >
                    <Trash className={`h-4 w-4 ${options.length <= 2 ? "text-gray-400" : ""}`} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      {options.length > 0 ? (
        options.map((_, index) => (
          <Handle
            key={index}
            id={index.toString()}
            type="source"
            position={Position.Bottom}
            style={{ left: `${((index + 1) / (options.length + 1)) * 100}%` }}
            isConnectable={isConnectable}
          />
        ))
      ) : (
        <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
      )}
    </Card>
  )
}

