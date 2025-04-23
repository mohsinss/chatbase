import { NextResponse } from 'next/server';
import { setCorsHeaders } from './cors';
import { sampleFlow } from '@/types';

export async function handleQuestionFlow(
  dataset: any,
  nodeId: string | null,
  optionIndex: number | null,
  messages: any[]
) {
  const { questionFlow, questionFlowEnable, questionAIResponseEnable } = dataset;
  const isAiResponseEnabled = questionAIResponseEnable !== undefined ? questionAIResponseEnable : true;

  let nextNode = null;

  if (questionFlowEnable && questionFlow) {
    const { nodes, edges } = (questionFlow && questionFlow.nodes && questionFlow.edges) ? questionFlow : sampleFlow;

    // If only one message and no nodeId, set nodeId to first node
    if (!nodeId && messages.length == 0) {
      // Find the top parent node (node without incoming edges)
      //@ts-ignore
      const childNodeIds = new Set(edges.map(edge => edge.target));
      //@ts-ignore
      const topParentNode = nodes.find(node => !childNodeIds.has(node.id));
      nextNode = topParentNode;
    }

    if (nodeId) {
      // User selected an option or initial message, find next node based on selected option or initial node
      //@ts-ignore
      const nextEdge = edges.find(edge => edge.source === nodeId && edge.sourceHandle === optionIndex?.toString());
      //@ts-ignore
      nextNode = nodes.find(node => node.id === nextEdge?.target);
    }

    if (!nextNode && !isAiResponseEnabled) {
      // Find the top parent node (node without incoming edges)
      //@ts-ignore
      const childNodeIds = new Set(edges.map(edge => edge.target));
      //@ts-ignore
      const topParentNode = nodes.find(node => !childNodeIds.has(node.id));
      nextNode = topParentNode;
    }

    if (nextNode) {
      const responsePayload: any = {
        message: nextNode.data.message || '',
        question: nextNode.data.question || '',
        options: nextNode.data.options || [],
        image: nextNode.data.image || '',
        nextNodeId: nextNode.id,
      };

      return setCorsHeaders(NextResponse.json(responsePayload, { status: 200 }));
    }
  }

  // Return null if no question flow node is found
  return null;
}
