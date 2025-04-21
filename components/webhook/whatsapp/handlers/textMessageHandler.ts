/**
 * Handler for text messages in WhatsApp webhook
 */
import { 
  getWhatsAppNumber, 
  getOrCreateConversation, 
  getConversationAIResponse, 
  addAssistantMessageToConversation,
  isAutoReplyDisabled
} from '@/components/webhook/whatsapp/services/conversationService';
import { markMessageAsRead, sendTextMessage } from '@/components/webhook/whatsapp/services/whatsappService';
import { getQuestionFlow, processInitialNode } from '@/components/webhook/whatsapp/services/questionFlowService';
import { isMessageTooOld, applyConfiguredDelay } from '@/components/webhook/whatsapp/utils/helpers';

/**
 * Handle text message from WhatsApp
 */
export async function handleTextMessage(
  from: string,
  phoneNumberId: string,
  messageId: string,
  timestamp: number,
  text: string
): Promise<{ success: boolean, message: string }> {
  try {
    // Check if message is too old
    const currentTimestamp = (new Date().getTime()) / 1000;
    if (isMessageTooOld(timestamp, currentTimestamp)) {
      return { 
        success: true, 
        message: 'Delivery denied due to long delay' 
      };
    }

    // Get WhatsApp number details
    const whatsappNumber = await getWhatsAppNumber(phoneNumberId);
    if (!whatsappNumber) {
      return { 
        success: false, 
        message: "WhatsApp number not registered to the site" 
      };
    }

    const chatbotId = whatsappNumber.chatbotId;
    const whatsappSettings = whatsappNumber.settings || {};
    const { prompt: customPrompt, delay } = whatsappSettings;

    // Apply configured delay
    await applyConfiguredDelay(delay);

    // Mark message as read
    await markMessageAsRead(phoneNumberId, messageId);

    // Get or create conversation
    const { conversation, triggerQF } = await getOrCreateConversation(
      chatbotId,
      from,
      whatsappNumber.display_phone_number,
      text
    );

    // Check if auto-reply is disabled
    if (isAutoReplyDisabled(conversation)) {
      return { 
        success: true, 
        message: "Auto response is disabled" 
      };
    }

    // Get question flow settings
    const { enabled: qfEnabled, flow, aiResponseEnabled } = await getQuestionFlow(chatbotId);

    // Process question flow if enabled and triggered
    if (qfEnabled && flow && triggerQF) {
      await processInitialNode(phoneNumberId, from, conversation, flow);
      return { 
        success: true, 
        message: "Question flow processed" 
      };
    } 
    // If QF is not triggered or not enabled, use AI response
    else {
      // Only proceed with AI response if QF is not enabled or AI responses are enabled
      if (!qfEnabled || aiResponseEnabled) {
        // Get AI response
        const responseText = await getConversationAIResponse(
          chatbotId,
          conversation,
          text,
          customPrompt
        );

        // Send response
        await sendTextMessage(phoneNumberId, from, responseText);
        
        // Update conversation
        await addAssistantMessageToConversation(conversation, responseText);
        
        return { 
          success: true, 
          message: "AI response sent" 
        };
      }
    }

    return { 
      success: true, 
      message: "Message processed" 
    };
  } catch (error) {
    console.error('Error handling text message:', error);
    return { 
      success: false, 
      message: `Error: ${error.message}` 
    };
  }
}
