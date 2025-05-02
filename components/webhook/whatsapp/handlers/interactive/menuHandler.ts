/**
 * Handler for menu item button clicks in WhatsApp webhook
 */
import { addAssistantMessageToConversation } from '@/components/webhook/whatsapp/services/conversationService';
import { applyMessageDelay } from './utils';
import { sendTextMessage } from '@/components/webhook/whatsapp/services/whatsappService';
import { translateText, translateJsonFields } from '@/components/chatbot/api/translation';

/**
 * Handle menu item button click
 */
export async function handleMenuButton(
  from: string,
  phoneNumberId: string,
  menuId: string,
  action: any,
  conversation: any,
  tableName: string
): Promise<{ success: boolean, message: string }> {
  try {
    // Import the order management functions
    const { getMenu } = await import('@/components/chatbot/api/order-management');

    // Get menu item details using the tool
    // We need the category ID, which should be stored in the menu item
    // For now, we'll try to extract it from the action's metadata
    const menuItem = (action.metadata?.menuItems || []).find(
      (item: any) => item.id === menuId
    );

    if (!menuItem) {
      await applyMessageDelay();
      await sendTextMessage(
        phoneNumberId,
        from,
        "Sorry, we couldn't find that menu item. Please try again."
      );
      return {
        success: false,
        message: "Menu item not found"
      };
    }

    const categoryId = menuItem.category;

    // Get menu item details using the tool with isWhatsApp=true
    const menuItemResult = await getMenu(action.chatbotId, menuId, categoryId, true);

    // Check if we got a JSON response
    if (typeof menuItemResult === 'object') {
      // First send item details as a text message
      const targetLanguage = action?.metadata?.language || 'en';
      const currencyCode = action?.metadata?.currency || 'USD';
      const currencySymbols: Record<string, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
        CNY: '¥',
        INR: '₹',
        AUD: 'A$',
        CAD: 'C$',
        CHF: 'CHF',
        KRW: '₩',
        BRL: 'R$',
        ZAR: 'R'
      };
      const currencySymbol = currencySymbols[currencyCode] || currencyCode;

      let messageText = `*${menuItemResult.item.name}*\n\n`;
      if (menuItemResult.item.description) {
        messageText += `${menuItemResult.item.description}\n\n`;
      }
      messageText += `Price: ${currencySymbol}${menuItemResult.item.price.toFixed(2)}`;

      if (targetLanguage !== 'en') {
        messageText = await translateText(messageText, targetLanguage);
      }

      await applyMessageDelay();
      await sendTextMessage(
        phoneNumberId,
        from,
        messageText
      );

      // Send image if available
      if (menuItemResult.item.image) {
        await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}`
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: from,
            type: "image",
            image: {
              link: menuItemResult.item.image
            }
          })
        });
        await applyMessageDelay(4000);
      }

      // Replace placeholders in button IDs with actual values
      if (menuItemResult.buttons && menuItemResult.buttons.length > 0) {
        menuItemResult.buttons.forEach((button: any) => {
          if (button.id) {
            button.id = button.id
              .replace('{tableName}', tableName)
              .replace('{actionId}', action._id);
          }
        });
      }

      // Send buttons for actions
      const buttonsPayload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: "Would you like to order this item?"
          },
          action: {
            buttons: menuItemResult.buttons.map((button: any) => ({
              type: "reply",
              reply: {
                id: button.id,
                title: button.title
              }
            }))
          }
        }
      };

      // Send the buttons via WhatsApp API
      try {
        const response = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}`
          },
          body: JSON.stringify(buttonsPayload)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`WhatsApp API error (${response.status}):`, errorText);
          throw new Error(`WhatsApp API returned ${response.status}: ${errorText}`);
        }
      } catch (apiError) {
        console.error('Error sending menu item buttons to WhatsApp:', apiError);
        // Send a simpler fallback message if the interactive message fails
        await applyMessageDelay();
        await sendTextMessage(
          phoneNumberId,
          from,
          `${menuItemResult.item.name} is available for $${menuItemResult.item.price.toFixed(2)}. You can order this item by replying "order ${menuItemResult.item.name}".`
        );
      }

      // Add to conversation history
      await addAssistantMessageToConversation(
        conversation,
        JSON.stringify(buttonsPayload)
      );

      return {
        success: true,
        message: "Menu item details sent with buttons"
      };
    } else {
      // If we didn't get a JSON response, send the result as a text message
      await applyMessageDelay();
      await sendTextMessage(
        phoneNumberId,
        from,
        menuItemResult
      );

      // Add to conversation history
      await addAssistantMessageToConversation(
        conversation,
        menuItemResult
      );

      return {
        success: true,
        message: "Menu item details sent as text"
      };
    }
  } catch (error) {
    console.error('Error using getMenu tool:', error);
    await applyMessageDelay();
    await sendTextMessage(
      phoneNumberId,
      from,
      "Sorry, we're experiencing technical difficulties with our menu system. Please try again later."
    );

    return {
      success: false,
      message: `Error using getMenu tool: ${error.message}`
    };
  }
}
