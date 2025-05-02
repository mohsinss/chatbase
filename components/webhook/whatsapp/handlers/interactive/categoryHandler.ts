/**
 * Handler for category button clicks in WhatsApp webhook
 */
import { addAssistantMessageToConversation } from '@/components/webhook/whatsapp/services/conversationService';
import { applyMessageDelay } from './utils';
import { sendTextMessage } from '@/components/webhook/whatsapp/services/whatsappService';
import { translateText, translateJsonFields } from '@/components/chatbot/api/translation';

/**
 * Handle category button click
 */
export async function handleCategoryButton(
  from: string,
  phoneNumberId: string,
  categoryId: string,
  action: any,
  conversation: any,
  tableName: string
): Promise<{ success: boolean, message: string }> {
  try {
    // Import the order management functions
    const { getMenus } = await import('@/components/chatbot/api/order-management');

    // Get menu items for this category using the tool with isWhatsApp=true
    const menuResult = await getMenus(action.chatbotId, categoryId, true);

    // Check if we got a JSON response
    if (typeof menuResult === 'object') {
      // Replace placeholders in button IDs with actual values
      if (menuResult.sections && menuResult.sections.length > 0) {
        menuResult.sections.forEach((section: any) => {
          if (section.rows && section.rows.length > 0) {
            section.rows.forEach((row: any) => {
              if (row.id) {
                row.id = row.id
                  .replace('{tableName}', tableName)
                  .replace('{actionId}', action._id);
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
            text: menuResult.body || `Menu items in category:`
          },
          footer: {
            text: menuResult.footer || "Select an item to view details or order."
          },
          action: {
            button: menuResult.button || "View Menu Items",
            sections: menuResult.sections || []
          }
        }
      };

      // Translate listPayload fields before sending
      const targetLanguage = action?.metadata?.language || 'en';
      if (targetLanguage !== 'en') {
        if (listPayload.interactive?.body?.text) {
          listPayload.interactive.body.text = await translateText(listPayload.interactive.body.text, targetLanguage);
        }
        if (listPayload.interactive?.footer?.text) {
          listPayload.interactive.footer.text = await translateText(listPayload.interactive.footer.text, targetLanguage);
        }
        if (listPayload.interactive?.action) {
          if (listPayload.interactive.action.button) {
            listPayload.interactive.action.button = await translateText(listPayload.interactive.action.button, targetLanguage);
          }
          if (listPayload.interactive.action.sections && Array.isArray(listPayload.interactive.action.sections)) {
            for (const section of listPayload.interactive.action.sections) {
              if (section.title) {
                section.title = await translateText(section.title, targetLanguage);
              }
              if (section.rows && Array.isArray(section.rows)) {
                for (const row of section.rows) {
                  // if (row.title) {
                  //   row.title = await translateText(row.title, targetLanguage);
                  // }
                  // if (row.description) {
                  //   row.description = await translateText(row.description, targetLanguage);
                  // }
                }
              }
            }
          }
        }
      }

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
          const errorText = await response.text();
          console.error(`WhatsApp API error (${response.status}):`, errorText);
          throw new Error(`WhatsApp API returned ${response.status}: ${errorText}`);
        }

        // Add to conversation history
        await addAssistantMessageToConversation(
          conversation,
          JSON.stringify(listPayload)
        );

        return {
          success: true,
          message: "Category menu items list sent"
        };
      } catch (apiError) {
        console.error('Error sending WhatsApp message:', apiError);
        // Send a simple text message as fallback
        await applyMessageDelay();
        await sendTextMessage(
          phoneNumberId,
          from,
          "We're having trouble displaying the menu. Please try again later."
        );

        return {
          success: false,
          message: `Error sending WhatsApp message: ${apiError.message}`
        };
      }
    } else {
      // If we didn't get a JSON response, send the result as a text message
      await applyMessageDelay();
      await sendTextMessage(
        phoneNumberId,
        from,
        menuResult
      );

      // Add to conversation history
      await addAssistantMessageToConversation(
        conversation,
        menuResult
      );

      return {
        success: true,
        message: "Category menu items list sent as text"
      };
    }
  } catch (error) {
    console.error('Error using getMenus tool:', error);
    await applyMessageDelay();
    await sendTextMessage(
      phoneNumberId,
      from,
      "Sorry, we're experiencing technical difficulties with our menu system. Please try again later."
    );

    return {
      success: false,
      message: `Error using getMenus tool: ${error.message}`
    };
  }
}
