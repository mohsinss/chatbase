/**
 * Service for handling question flows in WhatsApp
 */
import Dataset from '@/models/Dataset';
import { sampleFlow } from '@/types';
import { sendNodeContent } from '@/app/api/webhook/whatsapp/services/whatsappService';
import { addAssistantMessageToConversation } from '@/app/api/webhook/whatsapp/services/conversationService';

/**
 * Get question flow for a chatbot
 */
export async function getQuestionFlow(chatbotId: string): Promise<{
  enabled: boolean;
  flow: any;
  aiResponseEnabled: boolean;
}> {
  const dataset = await Dataset.findOne({ chatbotId });
  
  if (!dataset) {
    return {
      enabled: false,
      flow: null,
      aiResponseEnabled: true
    };
  }
  
  const { questionFlow, questionFlowEnable, questionAIResponseEnable } = dataset;
  
  return {
    enabled: questionFlowEnable || false,
    flow: (questionFlow && questionFlow.nodes && questionFlow.edges) ? questionFlow : sampleFlow,
    aiResponseEnabled: questionAIResponseEnable !== undefined ? questionAIResponseEnable : true
  };
}

/**
 * Get the top parent node of a question flow
 */
export function getTopParentNode(flow: any): any {
  const { nodes, edges } = flow;
  
  // Find nodes that are not targets of any edge (top parent nodes)
  const childNodeIds = new Set(edges.map((edge: any) => edge.target));
  return nodes.find((node: any) => !childNodeIds.has(node.id));
}

/**
 * Get the next node based on button selection
 */
export function getNextNode(flow: any, nodeId: string, optionIndex: string): any {
  const { nodes, edges } = flow;
  
  // Find the edge that connects from the current node with the selected option
  const nextEdge = edges.find((edge: any) => 
    edge.source === nodeId && edge.sourceHandle === optionIndex
  );
  
  if (!nextEdge) {
    return null;
  }
  
  // Find the target node
  return nodes.find((node: any) => node.id === nextEdge.target);
}

/**
 * Process the initial question flow node
 */
export async function processInitialNode(
  phoneNumberId: string,
  from: string,
  conversation: any,
  flow: any
): Promise<void> {
  const topParentNode = getTopParentNode(flow);
  
  if (!topParentNode) {
    return;
  }
  
  const nodeMessage = topParentNode.data.message || '';
  const nodeOptions = topParentNode.data.options || [];
  const nodeQuestion = topParentNode.data.question || '';
  const nodeImage = topParentNode.data.image || '';
  
  // Send node content (message, image, buttons)
  const responses = await sendNodeContent(
    phoneNumberId,
    from,
    topParentNode.id,
    nodeMessage,
    nodeQuestion,
    nodeOptions,
    nodeImage
  );
  
  // Add responses to conversation
  if (nodeMessage) {
    await addAssistantMessageToConversation(conversation, nodeMessage);
  }
  
  if (nodeImage) {
    await addAssistantMessageToConversation(conversation, {
      type: "image",
      image: nodeImage
    });
  }
  
  if (nodeOptions.length > 0 && nodeQuestion) {
    const buttonsPayload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: nodeQuestion
        },
        action: {
          buttons: nodeOptions.slice(0, 3).map((option: string, index: number) => ({
            type: "reply",
            reply: {
              id: `${topParentNode.id}-option-${index}`,
              title: option
            }
          }))
        }
      }
    };
    
    await addAssistantMessageToConversation(conversation, buttonsPayload);
  }
}

/**
 * Process a button reply in the question flow
 */
export async function processButtonReply(
  phoneNumberId: string,
  from: string,
  conversation: any,
  flow: any,
  nodeId: string,
  optionIndex: string
): Promise<void> {
  const nextNode = getNextNode(flow, nodeId, optionIndex);
  
  if (!nextNode) {
    return;
  }
  
  const nodeMessage = nextNode.data.message || '';
  const nodeOptions = nextNode.data.options || [];
  const nodeQuestion = nextNode.data.question || '';
  const nodeImage = nextNode.data.image || '';
  
  // Send node content (message, image, buttons)
  const responses = await sendNodeContent(
    phoneNumberId,
    from,
    nextNode.id,
    nodeMessage,
    nodeQuestion,
    nodeOptions,
    nodeImage
  );
  
  // Add responses to conversation
  if (nodeMessage) {
    await addAssistantMessageToConversation(conversation, nodeMessage);
  }
  
  if (nodeImage) {
    await addAssistantMessageToConversation(conversation, {
      type: "image",
      image: nodeImage
    });
  }
  
  if (nodeOptions.length > 0 && nodeQuestion) {
    const buttonsPayload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: nodeQuestion
        },
        action: {
          buttons: nodeOptions.slice(0, 3).map((option: string, index: number) => ({
            type: "reply",
            reply: {
              id: `${nextNode.id}-option-${index}`,
              title: option
            }
          }))
        }
      }
    };
    
    await addAssistantMessageToConversation(conversation, buttonsPayload);
  }
}
