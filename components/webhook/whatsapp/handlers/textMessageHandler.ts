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
import ChatbotAction from '@/models/ChatbotAction';

function templateToRegex(template: string): RegExp {
  // Escape all regex‑special chars except {}
  const escaped = template.replace(/[-\/\\^$+?.()|[\]^]/g, '\\$&');

  // Replace {key} → (?<key>.+?) for each placeholder
  const withGroups = escaped.replace(/\{(\w+)\}/g, (_, name) => `(?<${name}>.+?)`);

  return new RegExp(`^${withGroups}$`);
}

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

    // Find enabled OrderManagement actions
    const enabledOMActions = await ChatbotAction.find({
      chatbotId,
      enabled: true,
      type: "ordermanagement",
      'metadata.phoneNumber': whatsappNumber.display_phone_number
    });
    console.log(enabledOMActions)
    // Check if the message matches a table order template
    let isTableOrder = false;
    let tableName = null;

    if (enabledOMActions.length > 0) {
      for (const action of enabledOMActions) {
        if (action.metadata?.messageTemplate) {
          const template = action.metadata?.messageTemplate;
          if (!template) continue;

          const templateRegex = templateToRegex(template);
          const match = text.match(templateRegex);

          if (match?.groups?.table) {
            isTableOrder = true;
            tableName = match.groups.table.trim();
            break;
          }
        }
      }
    }

    // If this is a table order, handle it specially
    if (isTableOrder && tableName) {
      console.log(`Received order from table: ${tableName}`);

      // Get categories from the OrderManagement action
      const action = enabledOMActions[0]; // Use the first enabled action
      const categories = action.metadata?.categories || [];

      if (categories.length === 0) {
        // If no categories, send a simple confirmation
        await sendTextMessage(
          phoneNumberId,
          from,
          `Thank you for your order from table ${tableName}. A staff member will assist you shortly.`
        );

        await addAssistantMessageToConversation(
          conversation,
          `Thank you for your order from table ${tableName}. A staff member will assist you shortly.`
        );
      } else {
        // Send welcome message
        await sendTextMessage(
          phoneNumberId,
          from,
          `Welcome to our restaurant! You're at table ${tableName}. Please select a category to view our menu:`
        );

        // Prepare list rows from categories
        const sections = [
          {
            title: "Menu Categories",
            rows: categories.map((category: { id: string, name: string }) => ({
              id: `om-category-${tableName}-${action.id}-${category.id}`,
              title: category.name,
              description: "" // Optional: you can add a short description here
            }))
          }
        ];

        // Build the list message payload
        const listPayload = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: from,
          type: "interactive",
          interactive: {
            type: "list",
            body: {
              text: "Please choose a menu category:"
            },
            footer: {
              text: "Select a category to continue." // Optional footer text
            },
            action: {
              button: "Select Category", // This is the button label users tap
              sections: sections
            }
          }
        };

        // Send the list message via WhatsApp API
        await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}`
          },
          body: JSON.stringify(listPayload)
        });

        // Save the table number in the conversation metadata for future reference
        conversation.metadata = {
          ...conversation.metadata,
          tableName,
          orderManagementActionId: action.id
        };
        await conversation.save();

        // Add to conversation history
        await addAssistantMessageToConversation(
          conversation,
          JSON.stringify(listPayload)
        );
      }

      return {
        success: true,
        message: `Table order initiated for table ${tableName}`
      };
    }

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
