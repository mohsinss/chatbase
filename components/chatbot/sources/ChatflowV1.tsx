"use client"

import React, { useCallback, useEffect, useState } from "react"
import { Search, MessageSquare, LayoutTemplate, FileInput, Layout, Sliders, Calendar, PlusCircle, GitFork, Trash2, Edit2 } from "lucide-react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeTypes,
  type Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import FlowNode from "./nodes/node"
import toast from "react-hot-toast"

interface FlowEditorProps {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: (nodes: Node[]) => void
  onEdgesChange: (edges: Edge[]) => void
}

const nodeTypes: NodeTypes = {
  node: FlowNode,
}

interface ChatbotFlowProps {
  qFlow: any;
  setQFlow: React.Dispatch<React.SetStateAction<any>>;
  chatbotId: string;
}
// Initialize with a simple flow
const initialNodes: Node[] = [
  {
    "id": "1",
    "type": "node",
    "position": {
      "x": 145.7474048442907,
      "y": -179.85813148788935
    },
    "data": {
      "label": "Welcome",
      "message": "Hello! How can I help you today?",
      "question": "What would you like to do?",
      "options": [
        "Get Support",
        "Learn More",
        "Provide Feedback"
      ],
      "id": "1",
      "position": {
        "x": 145.7474048442907,
        "y": -179.85813148788935
      }
    },
    "width": 256,
    "height": 394,
    "selected": false,
    "positionAbsolute": {
      "x": 145.7474048442907,
      "y": -179.85813148788935
    },
    "dragging": false
  },
  {
    "id": "2",
    "type": "node",
    "position": {
      "x": -167.3497444177745,
      "y": 262.02049386656955
    },
    "data": {
      "label": "Support",
      "message": "Our support team is available 24/7. What issue are you experiencing?",
      "id": "2",
      "position": {
        "x": -167.3497444177745,
        "y": 262.02049386656955
      }
    },
    "width": 256,
    "height": 242,
    "selected": true,
    "positionAbsolute": {
      "x": -167.3497444177745,
      "y": 262.02049386656955
    },
    "dragging": false
  },
  {
    "id": "3",
    "type": "node",
    "position": {
      "x": 140.54183508867038,
      "y": 252.38292898741372
    },
    "data": {
      "label": "Learn More",
      "message": "We offer a variety of products and services. What would you like to learn more about?",
      "id": "3",
      "position": {
        "x": 140.54183508867038,
        "y": 252.38292898741372
      }
    },
    "width": 256,
    "height": 242,
    "selected": false,
    "positionAbsolute": {
      "x": 140.54183508867038,
      "y": 252.38292898741372
    },
    "dragging": false
  },
  {
    "id": "4",
    "type": "node",
    "position": {
      "x": 438.91429498190985,
      "y": 256.15109507737907
    },
    "data": {
      "label": "Feedback",
      "message": "We appreciate your feedback! What would you like to share with us?",
      "id": "4",
      "position": {
        "x": 438.91429498190985,
        "y": 256.15109507737907
      }
    },
    "width": 256,
    "height": 242,
    "selected": false,
    "positionAbsolute": {
      "x": 438.91429498190985,
      "y": 256.15109507737907
    },
    "dragging": false
  }
]

const initialEdges: Edge[] = [
  {
    "id": "e1-2",
    "source": "1",
    "target": "2",
    "sourceHandle": "0"
  },
  {
    "id": "e1-3",
    "source": "1",
    "target": "3",
    "sourceHandle": "1"
  },
  {
    "id": "e1-4",
    "source": "1",
    "target": "4",
    "sourceHandle": "2"
  }
]

export default function ChatflowV1({
  qFlow,
  setQFlow,
  chatbotId,
}: ChatbotFlowProps) {
  const [nodes, setNodes, onNodesChange2] = useNodesState(qFlow?.nodes ?? []);
  const [edges, setEdges, onEdgesChange2] = useEdgesState(qFlow?.edges ?? []);
  const [isSaving, setIsSaving] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);
  const [enabled, setEnabled] = useState(true);

  const loadTemplate = () => {
    //@ts-ignore
    setNodes([...initialNodes]);
    setEdges([...initialEdges]);
  }

  // Update qFlow whenever nodes or edges change
  // useEffect(() => {
  //   setQFlow({ nodes, edges });
  // }, [nodes, edges, setQFlow]);

  // Update qFlow whenever nodes or edges change
  useEffect(() => {
    if (qFlow) {
      setNodes(qFlow.nodes);
      setEdges(qFlow.edges);
    }
  }, [qFlow]);

  const handleNodesChange = useCallback(
    (changes: any) => {
      // Update nodes with callbacks
      const nodesWithCallbacks = nodes.map((node) => {
        return {
          ...node,
          data: {
            ...node.data,
            id: node.id,
            position: node.position,
            onNodesChange: (callback: (nodes: Node[]) => Node[]) => {
              const updatedNodes = callback(nodes)
              setNodes(updatedNodes)
            },
            onEdgesChange: (callback: (edges: Edge[]) => Edge[]) => {
              const updatedEdges = callback(edges)
              setEdges(updatedEdges)
            },
          },
        }
      })

      setNodes(nodesWithCallbacks)
      onNodesChange2(changes)
    },
    [nodes, onNodesChange2, setNodes, setEdges],
  )

  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChange2(changes)
    },
    [edges, onEdgesChange2],
  )

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/chatbot/train/questionflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatbotId,
          questionFlow: { nodes, edges },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update flow status');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update flow status');
      console.error('Error updating flow status:', error);
    } finally {
      setIsSaving(false);
    }
  }

  const toggleFlowEnabled = async () => {
    setIsEnabling(true);
    try {
      const response = await fetch('/api/chatbot/train/enable-question-flow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enabled: !enabled,
          chatbotId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update flow status');
      }

      setEnabled(!enabled);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update flow status');
      console.error('Error updating flow status:', error);
    } finally {
      setIsEnabling(false)
    }
  };

  return (
    <div className="h-full border rounded-md">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        // onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />

        <Panel position="top-left" className="bg-white p-4 rounded-md shadow-md">
          <Button onClick={handleSave} className="w-full justify-start" disabled={isSaving}>
            {isSaving ? (
              <span className="animate-spin mr-2">⏳</span>
            ) : (
              <Sliders size={16} className="mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <div className="flex items-center justify-between gap-2 mt-2">
            <span className={`text-sm ${enabled ? 'text-green-600' : 'text-red-600'}`}>
              {enabled ? 'Enabled' : 'Disabled'}
            </span>
            <Button
              onClick={toggleFlowEnabled}
              variant={enabled ? 'destructive' : 'default'}
              size="sm"
              disabled={isEnabling}
            >
              {enabled ? 'Turn Off' : 'Turn On'}
            </Button>
          </div>
          <Button onClick={loadTemplate}
            className="w-full justify-start mt-2">
            <LayoutTemplate size={16} className="mr-2" />
            Load Template
          </Button>
        </Panel>

      </ReactFlow>
    </div>
  )
}

