/**
 * Handler for interactive messages in WhatsApp webhook
 */
import { 
  getWhatsAppNumber, 
  getOrCreateConversation, 
  addAssistantMessageToConversation,
  isAutoReplyDisabled,
  getConversationAIResponse
} from '@/components/webhook/whatsapp/services/conversationService';
import { markMessageAsRead, sendTextMessage } from '@/components/webhook/whatsapp/services/whatsappService';
import { getQuestionFlow, processButtonReply } from '@/components/webhook/whatsapp/services/questionFlowService';
import { applyConfiguredDelay } from '@/components/webhook/whatsapp/utils/helpers';

/**
 * Handle button reply from WhatsApp
 */
export async function handleButtonReply(
  from: string,
  phoneNumberId: string,
  messageId: string,
  buttonReply: {
    id: string;
    title: string;
  }
): Promise<{ success: boolean, message: string }> {
  try {
    // Extract button data
    const buttonId = buttonReply.id;
    const buttonTitle = buttonReply.title;
    
    // Parse node ID and option index from button ID
    const [nodeId, _, optionIndex] = buttonId.split('-');
    
    if (!nodeId || !optionIndex) {
      return { 
        success: false, 
        message: "Invalid button ID format" 
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
    const { delay } = whatsappSettings;

    // Apply configured delay
    await applyConfiguredDelay(delay);

    // Mark message as read
    await markMessageAsRead(phoneNumberId, messageId);

    // Get conversation
    const { conversation } = await getOrCreateConversation(
      chatbotId,
      from,
      whatsappNumber.display_phone_number,
      buttonTitle
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

    // Process button reply if question flow is enabled
    if (qfEnabled && flow) {
      // processButtonReply now returns false if there's no next node (end of flow)
      const hasNextNode = await processButtonReply(
        phoneNumberId, 
        from, 
        conversation, 
        flow, 
        nodeId, 
        optionIndex,
        chatbotId,
        whatsappSettings.prompt
      );
      
      // If we've reached the end of the flow and AI responses are enabled
      if (!hasNextNode && aiResponseEnabled) {
        // Get AI response
        const responseText = await getConversationAIResponse(
          chatbotId,
          conversation,
          buttonTitle, // Use the button title as the user's message
          whatsappSettings.prompt
        );

        // Send response
        await sendTextMessage(phoneNumberId, from, responseText);
        
        // Update conversation
        await addAssistantMessageToConversation(conversation, responseText);
        
        return { 
          success: true, 
          message: "AI response sent after flow completion" 
        };
      }
      
      return { 
        success: true, 
        message: hasNextNode ? "Button reply processed" : "Flow completed" 
      };
    }

    return { 
      success: true, 
      message: "Interactive message processed" 
    };
  } catch (error) {
    console.error('Error handling interactive message:', error);
    return { 
      success: false, 
      message: `Error: ${error.message}` 
    };
  }
}

/**
 * Handle interactive message from WhatsApp
 */
export async function handleInteractiveMessage(
  from: string,
  phoneNumberId: string,
  messageId: string,
  interactive: any
): Promise<{ success: boolean, message: string }> {
  try {
    // Handle different types of interactive messages
    if (interactive.type === 'button_reply') {
      return await handleButtonReply(
        from,
        phoneNumberId,
        messageId,
        interactive.button_reply
      );
    }
    
    // Add handlers for other interactive types if needed
    
    return { 
      success: false, 
      message: `Unsupported interactive type: ${interactive.type}` 
    };
  } catch (error) {
    console.error('Error handling interactive message:', error);
    return { 
      success: false, 
      message: `Error: ${error.message}` 
    };
  }
}
