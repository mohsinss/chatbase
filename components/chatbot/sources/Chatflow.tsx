"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  type Connection,
  type Edge,
  type NodeTypes,
  type NodeProps,
  Handle,
  Position,
  MarkerType,
  BackgroundVariant,
} from "reactflow"
import "reactflow/dist/style.css"
import { Search, MessageSquare, LayoutTemplate, FileInput, Layout, Sliders, Calendar, PlusCircle, GitFork, Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { v4 as uuidv4 } from "uuid"
import toast from "react-hot-toast"

const TriggerNode = ({ data, id }: NodeProps) => (
  <div className="p-3 rounded-md bg-white shadow-md w-64 border border-gray-200">
    <div className="flex items-start">
      <div className="w-1 h-full bg-red-500 mr-3 self-stretch"></div>
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <div className="text-red-500 mr-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13 5L21 12L13 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="font-medium">{data.label}</div>
        </div>
      </div>
    </div>
    <Handle type="source" position={Position.Bottom} id="a" style={{ bottom: -8, background: "#9ca3af" }} />
  </div>
)

const MessageNode = ({ data, id }: NodeProps) => (
  <div className="p-3 rounded-md bg-white shadow-md w-64 border border-gray-200">
    <div className="flex items-start">
      <div className={`w-1 h-full ${data.color} mr-3 self-stretch`}></div>
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <div className={`${data.iconColor} mr-2`}>{data.icon}</div>
          <div className="font-medium">{data.title}</div>
        </div>
        <div className="text-sm text-gray-600">{data.message}</div>
      </div>
    </div>
    <Handle type="target" position={Position.Top} id="b" style={{ top: -8, background: "#9ca3af" }} />
    <Handle type="source" position={Position.Bottom} id="a" style={{ bottom: -8, background: "#9ca3af" }} />
  </div>
)

const OptionNode = ({ data, id }: NodeProps) => (
  <div className="px-4 py-2 rounded-md bg-gray-500 text-white shadow-md">
    <div className="font-medium">{data.label}</div>
    <Handle type="target" position={Position.Top} id="b" style={{ top: -8, background: "#9ca3af" }} />
    <Handle type="source" position={Position.Bottom} id="a" style={{ bottom: -8, background: "#9ca3af" }} />
  </div>
)

// Define node types
const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  message: MessageNode,
  option: OptionNode,
}

const templateFlow = {
  nodes: [
    {
      id: "1",
      type: "trigger",
      position: { x: 250, y: 50 },
      data: { label: "Bot should be triggered at first conversation." },
    },
    {
      id: "2",
      type: "message",
      position: { x: 250, y: 150 },
      data: {
        // title: "Greetings",
        message: "Hi there! My name is Specter. Welcome to ACME Corp!",
        color: "bg-cyan-500",
        iconColor: "text-cyan-500",
        // icon: <MessageSquare size={16} />,
      },
    },
    {
      id: "3",
      type: "message",
      position: { x: 250, y: 250 },
      data: {
        // title: "Choose from menu",
        message: "How can I help you today?",
        color: "bg-yellow-500",
        iconColor: "text-cyan-500",
        // icon: <MessageSquare size={16} />,
        // icon: <Layout size={16} />,
      },
    },
    {
      id: "4",
      type: "option",
      position: { x: 150, y: 350 },
      data: { label: "Explore Service" },
    },
    {
      id: "5",
      type: "option",
      position: { x: 350, y: 350 },
      data: { label: "Contact Sales" },
    },
  ],
  edges: [
    { id: "e1-2", source: "1", target: "2", markerEnd: { type: MarkerType.Arrow }, style: { stroke: "#9ca3af" } },
    { id: "e2-3", source: "2", target: "3", markerEnd: { type: MarkerType.Arrow }, style: { stroke: "#9ca3af" } },
    { id: "e3-4", source: "3", target: "4", markerEnd: { type: MarkerType.Arrow }, style: { stroke: "#9ca3af" } },
    { id: "e3-5", source: "3", target: "5", markerEnd: { type: MarkerType.Arrow }, style: { stroke: "#9ca3af" } },
  ]
}

interface ChatbotFlowProps {
  qFlow: any;
  setQFlow: React.Dispatch<React.SetStateAction<any>>;
}

export default function ChatbotFlow({ qFlow, setQFlow }: ChatbotFlowProps) {

  console.log(qFlow)
  //@ts-ignore
  const [nodes, setNodes, onNodesChange] = useNodesState(qFlow?.nodes ?? []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(qFlow?.edges ?? []);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const hasTriggerNode = nodes.some(node => node.type === 'trigger');

  const loadTemplate = () => {
    //@ts-ignore
    setNodes(templateFlow.nodes);
    setEdges(templateFlow.edges);
  }

  // Update qFlow whenever nodes or edges change
  useEffect(() => {
    setQFlow({ nodes, edges });
  }, [nodes, edges, setQFlow]);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      setEdges((eds) =>
        addEdge({ ...params, markerEnd: { type: MarkerType.Arrow }, style: { stroke: "#9ca3af" } }, eds),
      )
    },
    [setEdges],
  )

  const handleSave = () => {
    const triggerNodes = nodes.filter(node => node.type === 'trigger');

    if (triggerNodes.length > 1) {
      toast.error('Only one trigger node is allowed');
      return;
    }

    if (triggerNodes.length === 0) {
      toast.error('A trigger node is required');
      return;
    }

    console.log(nodes)
    console.log(edges)
  }

  const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    setSelectedNode(node.id)
    setEditingNode(null)
  }, [])

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Delete" && selectedNode) {
        setNodes((nds) => nds.filter((node) => node.id !== selectedNode))
        setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode && edge.target !== selectedNode))
        setSelectedNode(null)
      }
    },
    [selectedNode, setNodes, setEdges],
  )

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [onKeyDown])

  const addNode = (type: string) => {
    if (reactFlowInstance) {
      const newNode = {
        id: uuidv4(),
        type,
        position: reactFlowInstance.project({ x: 100, y: 100 }),
        data: { label: `New ${type} node` },
      }
      setNodes((nds) => nds.concat(newNode))
    }
  }

  const startEditing = () => {
    if (selectedNode) {
      const node = nodes.find((n) => n.id === selectedNode)
      if (node) {
        setEditingNode(selectedNode)
        setEditText(node.data.label || node.data.message || "")
      }
    }
  }

  const saveEdit = () => {
    if (editingNode) {
      setNodes((nds: any) =>
        nds.map((node: any) => {
          if (node.id === editingNode) {
            return {
              ...node,
              data: {
                ...node.data,
                label: node.type === "message" ? node.data.label : editText,
                message: node.type === "message" ? editText : node.data.message,
              },
            }
          }
          return node
        }),
      )
      setEditingNode(null)
    }
  }

  return (
    <div className="w-full h-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        onInit={setReactFlowInstance}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

        <Panel position="top-left" className="bg-white p-4 rounded-md shadow-md">
          <div className="flex flex-col space-y-2">
            <Button onClick={loadTemplate}
              className="w-full justify-start">
              <LayoutTemplate size={16} className="mr-2" />
              Load Template
            </Button>
            <Button onClick={() => addNode("trigger")}
              className="w-full justify-start"
              disabled={hasTriggerNode}
              title={hasTriggerNode ? "Only one trigger node is allowed" : ""}>
              <PlusCircle size={16} className="mr-2" />
              Add Trigger
            </Button>
            <Button onClick={() => addNode("message")} className="w-full justify-start">
              <MessageSquare size={16} className="mr-2" />
              Add Message
            </Button>
            <Button onClick={() => addNode("option")} className="w-full justify-start">
              <GitFork size={16} className="mr-2" />
              Add Option
            </Button>
            {selectedNode && (
              <>
                <Button onClick={startEditing} className="w-full justify-start">
                  <Edit2 size={16} className="mr-2" />
                  Edit Node
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setNodes((nds) => nds.filter((node) => node.id !== selectedNode))
                    setEdges((eds) =>
                      eds.filter((edge) => edge.source !== selectedNode && edge.target !== selectedNode),
                    )
                    setSelectedNode(null)
                  }}
                  className="w-full justify-start"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Node
                </Button>
              </>
            )}
          </div>
        </Panel>

        <Panel position="top-center" className="hidden">
          <div className="bg-white p-2 rounded-md shadow-md flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={loadTemplate}>
              Load Template
            </Button>
            <Button size="sm" onClick={handleSave}>Save</Button>
          </div>
        </Panel>

        {editingNode && (
          <Panel position="top-center" className="w-64 mt-16">
            <div className="bg-white p-4 rounded-md shadow-md">
              <Input value={editText} onChange={(e) => setEditText(e.target.value)} className="mb-2" />
              <div className="flex justify-end space-x-2">
                <Button onClick={() => setEditingNode(null)} variant="outline" size="sm">
                  Cancel
                </Button>
                <Button onClick={saveEdit} size="sm">
                  Save
                </Button>
              </div>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div >
  )
}
