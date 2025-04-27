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

    // Check if auto-reply is disabled
    if (isAutoReplyDisabled(conversation)) {
      return {
        success: true,
        message: "Auto response is disabled"
      };
    }

    // Find enabled OrderManagement actions with error handling
    let enabledOMAction = null;
    try {
      enabledOMAction = await ChatbotAction.findOne({
        chatbotId,
        enabled: true,
        type: "ordermanagement",
        'metadata.phoneNumber': whatsappNumber.display_phone_number
      });
    } catch (error) {
      console.error('Error fetching order management actions:', error);
      // Continue with empty array if query fails
    }
    
    // Check if the message matches a table order template
    let isTableOrder = false;
    let tableName = null;

    if (enabledOMAction) {
      console.log('Found order management actions:', enabledOMAction.name);
        try {
          if (enabledOMAction.metadata?.messageTemplate) {
            const template = enabledOMAction.metadata?.messageTemplate;
            if (template) {
              const templateRegex = templateToRegex(template);
              const match = text.match(templateRegex);
  
              if (match?.groups?.table) {
                isTableOrder = true;
                tableName = match.groups.table.trim();
              }
            }
          }
        } catch (error) {
          console.error('Error processing order template match:', error);
          // Continue to next enabledOMAction if one fails
        }
    }

    // If this is a table order, handle it using the order management tools
    if (isTableOrder && tableName && enabledOMAction) {
      console.log(`Received order from table: ${tableName}`);
      
      // Import the order management functions
      const { getCategories } = await import('@/components/chatbot/api/order-management');
      
      try {
        // Get categories using the tool with isWhatsApp=true
        const categoriesResult = await getCategories(chatbotId, true);
        
        // Send welcome message
        await sendTextMessage(
          phoneNumberId,
          from,
          `Welcome to our restaurant! You're at table ${tableName}. Please select a category to view our menu:`
        );
        
        // Check if we got a JSON response
        if (typeof categoriesResult === 'object') {
          // Replace placeholders in button IDs with actual values
          if (categoriesResult.sections && categoriesResult.sections.length > 0) {
            categoriesResult.sections.forEach((section: any) => {
              if (section.rows && section.rows.length > 0) {
                section.rows.forEach((row: any) => {
                  if (row.id) {
                    row.id = row.id
                      .replace('{tableName}', tableName)
                      .replace('{actionId}', enabledOMAction._id);
                  }
                });
              }
            });
          }
          
          // Create a WhatsApp list message from the JSON response
          const listPayload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: from,
            type: "interactive",
            interactive: {
              type: "list",
              body: {
                text: categoriesResult.body || "Please choose a menu category:"
              },
              footer: {
                text: categoriesResult.footer || "Select a category to continue."
              },
              action: {
                button: categoriesResult.button || "Select Category",
                sections: categoriesResult.sections || []
              }
            }
          };
          
          // Send the list message via WhatsApp API
          try {
            const response = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}`
              },
              body: JSON.stringify(listPayload)
            });
            
            if (!response.ok) {
              throw new Error(`WhatsApp API returned ${response.status}`);
            }
          } catch (apiError) {
            console.error('Error sending WhatsApp message:', apiError);
            // Send a simple text message as fallback
            await sendTextMessage(
              phoneNumberId,
              from,
              "Please select from our menu categories. If you're having trouble, please scan the QR code again."
            );
          }
        } else {
          // If we didn't get a JSON response, send the result as a text message
          await sendTextMessage(
            phoneNumberId,
            from,
            categoriesResult
          );
        }
        
        // Save the table number in the conversation metadata for future reference
        conversation.metadata = {
          ...conversation.metadata,
          tableName,
          orderManagementActionId: enabledOMAction._id
        };
        await conversation.save();
        
        // Add to conversation history
        await addAssistantMessageToConversation(
          conversation,
          categoriesResult
        );
        
        return {
          success: true,
          message: `Table order initiated for table ${tableName}`
        };
      } catch (error) {
        console.error('Error using order management tools:', error);
        await sendTextMessage(
          phoneNumberId,
          from,
          `Welcome to our restaurant! You're at table ${tableName}. We're experiencing technical difficulties with our menu system. A staff member will assist you shortly.`
        );
        
        return {
          success: false,
          message: `Error using order management tools: ${error.message}`
        };
      }
    }


    if (enabledOMAction) {
      try {
        // Import the order management AI service
        const { processOrderManagementWithAI } = await import('@/components/webhook/whatsapp/services/orderManagementAIService');
        
        // Process the message using AI with tool calling
        const result = await processOrderManagementWithAI(
          chatbotId,
          conversation,
          text,
          phoneNumberId,
          from,
          enabledOMAction._id
        );
        
        // If successful, return the result
        if (result.success) {
          return result;
        }
        // Otherwise, continue with normal flow
      } catch (error) {
        console.error('Error processing order management with AI:', error);
        // Continue with normal flow if tool calling fails
      }
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
