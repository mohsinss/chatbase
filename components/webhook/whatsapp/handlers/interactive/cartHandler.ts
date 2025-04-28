/**
 * Handler for cart-related button clicks in WhatsApp webhook
 */
import { addAssistantMessageToConversation } from '@/components/webhook/whatsapp/services/conversationService';
import { applyMessageDelay } from './utils';
import { sendTextMessage } from '@/components/webhook/whatsapp/services/whatsappService';

/**
 * Handle add to cart button click
 */
export async function handleAddToCartButton(
  from: string,
  phoneNumberId: string,
  menuId: string,
  quantity: number,
  action: any,
  conversation: any,
  tableName: string
): Promise<{ success: boolean, message: string }> {
  try {
    // Import the order management functions
    const { addToCart } = await import('@/components/chatbot/api/order-management');

    // Find the menu item to get its details
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

    // Add the item to cart using the tool with isWhatsApp=true
    const cartResult = await addToCart(action.chatbotId, menuId, quantity, true);

    // Check if we got a JSON response
    if (typeof cartResult === 'object') {
      // Send cart confirmation message
      let cartMessage = `*Cart Updated*\n\n`;
      cartResult.cart.items.forEach((item: any) => {
        cartMessage += `${item.qty} x ${item.name} - $${(item.price * item.qty).toFixed(2)}\n`;
      });
      cartMessage += `\n*Total: $${cartResult.cart.total.toFixed(2)}*`;

      await applyMessageDelay();
      await sendTextMessage(
        phoneNumberId,
        from,
        cartMessage
      );

      // Replace placeholders in button IDs with actual values
      if (cartResult.buttons && cartResult.buttons.length > 0) {
        cartResult.buttons.forEach((button: any) => {
          if (button.id) {
            button.id = button.id
              .replace('{tableName}', tableName)
              .replace('{actionId}', action._id);
          }
        });
      }

      // Send buttons for next actions
      const buttonsPayload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: "What would you like to do next?"
          },
          action: {
            buttons: cartResult.buttons.map((button: any) => ({
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
        console.error('Error sending cart buttons to WhatsApp:', apiError);
        // No need to send a fallback message here as we've already sent the cart confirmation
        // message above
      }

      // Add to conversation history
      await addAssistantMessageToConversation(
        conversation,
        JSON.stringify(buttonsPayload)
      );

      return {
        success: true,
        message: "Item added to cart with buttons"
      };
    } else {
      // If we didn't get a JSON response, send the result as a text message
      await applyMessageDelay();
      await sendTextMessage(
        phoneNumberId,
        from,
        cartResult
      );

      // Add to conversation history
      await addAssistantMessageToConversation(
        conversation,
        cartResult
      );

      return {
        success: true,
        message: "Item added to cart as text"
      };
    }
  } catch (error) {
    console.error('Error using addToCart tool:', error);
    await applyMessageDelay();
    await sendTextMessage(
      phoneNumberId,
      from,
      "Sorry, we're experiencing technical difficulties with our cart system. Please try again later."
    );

    return {
      success: false,
      message: `Error using addToCart tool: ${error.message}`
    };
  }
}
