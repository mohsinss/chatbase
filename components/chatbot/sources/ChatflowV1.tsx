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
import { sampleFlow } from '@/types';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

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
  qFlowEnabled: boolean;
  qFlowAIEnabled: boolean;
}
// Initialize with a simple flow
//@ts-ignore
const initialNodes: Node[] = sampleFlow.nodes;

const initialEdges: Edge[] = sampleFlow.edges;

export default function ChatflowV1({
  qFlow,
  setQFlow,
  chatbotId,
  qFlowEnabled,
  qFlowAIEnabled
}: ChatbotFlowProps) {
  const [nodes, setNodes, onNodesChange2] = useNodesState(qFlow?.nodes ?? []);
  const [edges, setEdges, onEdgesChange2] = useEdgesState(qFlow?.edges ?? []);
  const [isSaving, setIsSaving] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);
  const [enabled, setEnabled] = useState(qFlowEnabled);
  const [isEnabling1, setIsEnabling1] = useState(false);
  const [enabled1, setEnabled1] = useState(qFlowAIEnabled);

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

  useEffect(() => {
    setEnabled(qFlowEnabled);
  }, [qFlowEnabled])

  useEffect(() => {
    setEnabled1(qFlowAIEnabled);
  }, [qFlowAIEnabled])

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
      const updatedNodes = await Promise.all(nodes.map(async (node) => {
        if (node.data.image && node.data.image.startsWith('data:image')) {
          const base64Data = node.data.image.split(',')[1];
          const mimeType = node.data.image.match(/data:(image\/.*?);base64/)?.[1] || 'image/jpeg';
          const extension = mimeType.split('/')[1];
          const buffer = Buffer.from(base64Data, 'base64');
          const newFileName = `node-image-${Date.now()}.${extension}`;
          const key = `node-images/${chatbotId}/${newFileName}`;
  
          await s3Client.send(
            new PutObjectCommand({
              Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
              Key: key,
              Body: buffer,
              ContentType: mimeType,
            })
          );
  
          const fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
  
          return {
            ...node,
            data: {
              ...node.data,
              image: fileUrl,
            },
          };
        }
        return node;
      }));

      const response = await fetch('/api/chatbot/train/questionflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatbotId,
          questionFlow: { 
            nodes: updatedNodes, 
            edges 
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update flow status');
      }
      toast.success("Question Flow is saved.")
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
      toast.success("successfully updated")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update flow status');
      console.error('Error updating flow status:', error);
    } finally {
      setIsEnabling(false)
    }
  };

  const toggleFlowAIEnabled = async () => {
    setIsEnabling1(true);
    try {
      const response = await fetch('/api/chatbot/train/questionflow/enable-ai-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enabled: !enabled1,
          chatbotId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update flow status');
      }

      setEnabled1(!enabled1);
      toast.success("successfully updated")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update flow status');
      console.error('Error updating flow status:', error);
    } finally {
      setIsEnabling1(false)
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
          <div className="flex items-center justify-between gap-2 mt-2">
            <span className={`text-sm ${enabled1 ? 'text-green-600' : 'text-red-600'}`}>
              {enabled1 ? 'AI response' : 'AI response'}
            </span>
            <Button
              onClick={toggleFlowAIEnabled}
              variant={enabled1 ? 'destructive' : 'default'}
              size="sm"
              disabled={isEnabling1}
            >
              {enabled1 ? 'Turn Off' : 'Turn On'}
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

