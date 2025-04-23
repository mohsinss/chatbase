import { sampleFlow } from '@/types';
import { sleep } from '@/libs/utils';
import { 
  sendTypingIndicator, 
  sendMessage, 
  sendImage, 
  sendButtons,
  createButtonPayloadForLogging
} from '../messaging';
import { addAssistantMessageToConversation } from '../conversation';

// Handle question flow for Messenger
export async function handleQuestionFlow(
  instagramPage: any, 
  sender: string, 
  questionFlow: any, 
  conversation: any,
  nodeId?: string,
  optionIndex?: string
): Promise<void> {
  const { nodes, edges } = (questionFlow && questionFlow.nodes && questionFlow.edges) 
    ? questionFlow 
    : sampleFlow;

  let targetNode;

  if (nodeId && optionIndex) {
    // Find the next node based on the selected option
    //@ts-ignore
    const nextEdge = edges.find(edge => edge.source === nodeId && edge.sourceHandle === optionIndex);
    //@ts-ignore
    targetNode = nodes.find(node => node.id === nextEdge?.target);
  } else {
    // Find the top parent node (node with no incoming edges)
    //@ts-ignore
    const childNodeIds = new Set(edges.map(edge => edge.target));
    //@ts-ignore
    targetNode = nodes.find(node => !childNodeIds.has(node.id));
  }

  if (!targetNode) {
    return;
  }

  const nodeMessage = targetNode.data.message || '';
  const nodeOptions = targetNode.data.options || [];
  const nodeQuestion = targetNode.data.question || '';
  const nodeImage = targetNode.data.image || '';

  // Send initial message
  if (nodeMessage) {
    await sendMessage(instagramPage.pageId, instagramPage.access_token, sender, nodeMessage);
    await addAssistantMessageToConversation(conversation, nodeMessage);
  }

  // Send image if available
  if (nodeImage) {
    await sendTypingIndicator(instagramPage.pageId, instagramPage.access_token, sender);
    await sendImage(instagramPage.pageId, instagramPage.access_token, sender, nodeImage);
    await sleep(2000);

    await addAssistantMessageToConversation(
      conversation,
      JSON.stringify({
        type: "image",
        image: nodeImage
      })
    );
  }

  // Send buttons if available
  if (nodeOptions.length > 0) {
    await sendTypingIndicator(instagramPage.pageId, instagramPage.access_token, sender);

    // Create button payload for logging
    const buttonsPayloadForLogging = createButtonPayloadForLogging(
      targetNode.id,
      nodeQuestion,
      nodeOptions
    );

    // Send buttons to Instagram
    await sendButtons(
      instagramPage.pageId, 
      instagramPage.access_token, 
      sender, 
      nodeQuestion, 
      nodeOptions, 
      targetNode.id
    );

    await addAssistantMessageToConversation(conversation, JSON.stringify(buttonsPayloadForLogging));
  }
}
