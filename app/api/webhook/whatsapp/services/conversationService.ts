/**
 * Service for managing WhatsApp conversations
 */
import connectMongo from "@/libs/mongoose";
import WhatsAppNumber from '@/models/WhatsAppNumber';
import ChatbotConversation from '@/models/ChatbotConversation';
import Dataset from '@/models/Dataset';
import { getAIResponse } from '@/libs/utils-ai';
import { filterRecentMessages } from '../utils/helpers';

/**
 * Get WhatsApp number details by phone number ID
 */
export async function getWhatsAppNumber(phoneNumberId: string): Promise<any> {
  await connectMongo();
  const whatsappNumber = await WhatsAppNumber.findOne({ phoneNumberId });
  return whatsappNumber;
}

/**
 * Get or create a conversation for a WhatsApp chat
 */
export async function getOrCreateConversation(
  chatbotId: string, 
  from: string, 
  to: string, 
  text: string
): Promise<{ conversation: any, isNew: boolean, triggerQF: boolean }> {
  await connectMongo();
  
  let conversation = await ChatbotConversation.findOne({ 
    chatbotId, 
    platform: "whatsapp", 
    "metadata.from": from, 
    "metadata.to": to 
  });
  
  let triggerQF = false;
  let isNew = false;

  if (conversation) {
    // Check if last message was a question flow (JSON content)
    const lastMessageContent = conversation.messages[conversation.messages.length - 1].content;
    try {
      JSON.parse(lastMessageContent);
      triggerQF = true; // Set triggerQF to true if parsing succeeds (content is JSON)
    } catch (e) {
      // Content is not JSON, do nothing
    }

    // Update existing conversation
    conversation.messages.push({ role: "user", content: text });
    
    // Check if conversation timeout has been reached
    const dataset = await Dataset.findOne({ chatbotId });
    const { restartQFTimeoutMins, questionAIResponseEnable } = dataset;
    const currentTimestamp = (new Date().getTime()) / 1000;
    const lastMessageTimestamp = conversation.updatedAt.getTime() / 1000;
    
    if (currentTimestamp - lastMessageTimestamp > (restartQFTimeoutMins || 30) * 60) {
      triggerQF = true;
    }
    
    // If AI responses are disabled, always trigger question flow
    const isAiResponseEnabled = questionAIResponseEnable !== undefined ? questionAIResponseEnable : true;
    if (!isAiResponseEnabled) {
      triggerQF = true;
    }
  } else {
    // Create new conversation
    conversation = new ChatbotConversation({
      chatbotId,
      platform: "whatsapp",
      disable_auto_reply: false,
      metadata: { from, to },
      messages: [{ role: "user", content: text }]
    });
    
    isNew = true;
    triggerQF = true;
  }

  await conversation.save();
  return { conversation, isNew, triggerQF };
}

/**
 * Get AI response for a conversation
 */
export async function getConversationAIResponse(
  chatbotId: string, 
  conversation: any, 
  text: string, 
  customPrompt?: string
): Promise<string> {
  // Get all messages from the conversation for context
  let messages = filterRecentMessages(conversation.messages);
  
  // Ensure the current message is included
  if (!messages.some((msg: any) => msg.role === 'user' && msg.content === text)) {
    messages.push({ role: 'user', content: text });
  }
  
  // Get AI response
  return await getAIResponse(chatbotId, messages, text, customPrompt);
}

/**
 * Update conversation with assistant message
 */
export async function addAssistantMessageToConversation(
  conversation: any, 
  content: string | object
): Promise<any> {
  // If content is an object, stringify it
  const messageContent = typeof content === 'object' ? JSON.stringify(content) : content;
  
  conversation.messages.push({ 
    role: "assistant", 
    content: messageContent 
  });
  
  return await conversation.save();
}

/**
 * Check if auto-reply is disabled for a conversation
 */
export function isAutoReplyDisabled(conversation: any): boolean {
  return conversation?.disable_auto_reply === true;
}
