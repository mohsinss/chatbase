/**
 * Handler for order management button clicks in WhatsApp webhook
 */
import { addAssistantMessageToConversation } from '@/components/webhook/whatsapp/services/conversationService';
import { applyMessageDelay } from './utils';
import { sendTextMessage } from '@/components/webhook/whatsapp/services/whatsappService';
import ChatbotAction from '@/models/ChatbotAction';
import { handleCategoryButton } from './categoryHandler';
import { handleMenuButton } from './menuHandler';
import { translateText, translateJsonFields } from '@/components/chatbot/api/translation';

/**
 * Handle order management button clicks
 */
export async function handleOrderManagementButton(
  from: string,
  phoneNumberId: string,
  buttonId: string,
  buttonTitle: string,
  conversation: any,
  chatbotId: string
): Promise<{ success: boolean, message: string }> {
  try {
    // Extract information from button ID with error handling
    let tableName: string = '', actionId: string = '', itemId: string = '';

    try {
      // Parse button ID based on its type
      if (buttonId.startsWith('om-category-')) {
        // Format: om-category-{tableName}-{actionId}-{categoryId}
        const parts = buttonId.replace('om-category-', '').split('-');
        if (parts.length < 2) {
          throw new Error(`Invalid category button ID format: ${buttonId}`);
        }
        itemId = parts.pop() || ''; // Category ID
        actionId = parts.pop() || ''; // Action ID
        tableName = parts.join('-'); // Table name
      }
      else if (buttonId.startsWith('om-menu-')) {
        // Format: om-menu-{tableName}-{actionId}-{menuId}
        const parts = buttonId.replace('om-menu-', '').split('-');
        if (parts.length < 2) {
          throw new Error(`Invalid menu button ID format: ${buttonId}`);
        }
        itemId = parts.pop() || ''; // Menu ID
        actionId = parts.pop() || ''; // Action ID
        tableName = parts.join('-'); // Table name
      }
      else if (buttonId.startsWith('om-confirm-')) {
        // Format: om-confirm-{tableName}-{actionId}-{menuId}
        const parts = buttonId.replace('om-confirm-', '').split('-');
        if (parts.length < 2) {
          throw new Error(`Invalid confirm button ID format: ${buttonId}`);
        }
        itemId = parts.pop() || ''; // Menu ID
        actionId = parts.pop() || ''; // Action ID
        tableName = parts.join('-'); // Table name
      }
      else if (buttonId.startsWith('om-add-to-cart-')) {
        // Format: om-add-to-cart-{tableName}-{actionId}-{menuId}-{quantity}
        const parts = buttonId.replace('om-add-to-cart-', '').split('-');
        if (parts.length < 3) {
          throw new Error(`Invalid add to cart button ID format: ${buttonId}`);
        }
        const quantity = parseInt(parts.pop() || '1', 10); // Get quantity from the end
        itemId = parts.pop() || ''; // Menu ID
        actionId = parts.pop() || ''; // Action ID
        tableName = parts.join('-'); // Table name

        // Store quantity in conversation metadata for later use
        if (!conversation.metadata) {
          conversation.metadata = {};
        }
        conversation.metadata.cartQuantity = quantity;
      }
      else if (buttonId.startsWith('om-back-')) {
        // Format: om-back-{tableName}-{actionId}
        const parts = buttonId.replace('om-back-', '').split('-');
        if (parts.length < 1) {
          throw new Error(`Invalid back button ID format: ${buttonId}`);
        }
        actionId = parts.pop() || ''; // Action ID
        tableName = parts.join('-'); // Table name
      }
      else {
        throw new Error(`Unknown button ID prefix: ${buttonId}`);
      }
    } catch (parseError) {
      console.error('Error parsing order management button ID:', parseError);
      await applyMessageDelay();
      await sendTextMessage(
        phoneNumberId,
        from,
        "Sorry, we couldn't process your selection due to a technical issue. Please scan the QR code again."
      );
      return {
        success: false,
        message: `Button ID parsing error: ${parseError.message}`
      };
    }

    if (!tableName || !actionId) {
      await applyMessageDelay();
      await sendTextMessage(
        phoneNumberId,
        from,
        "Sorry, we couldn't process your selection. Please scan the QR code again."
      );
      return {
        success: false,
        message: "Invalid button ID format"
      };
    }

    // Update conversation metadata with the extracted information
    if (!conversation.metadata) {
      conversation.metadata = {};
    }

    conversation.metadata.tableName = tableName;
    conversation.metadata.orderManagementActionId = actionId;
    await conversation.save();

    // Get the action with error handling
    let action;
    try {
      action = await ChatbotAction.findById(actionId);
      if (!action) {
        throw new Error(`Action not found with ID: ${actionId}`);
      }
    } catch (dbError) {
      console.error('Error fetching order management action:', dbError);
      // await applyMessageDelay();
      // await sendTextMessage(
      //   phoneNumberId,
      //   from,
      //   "Sorry, we couldn't find the restaurant information. Please scan the QR code again."
      // );
      return {
        success: false,
        message: `Order management action error: ${dbError.message}`
      };
    }

    // Handle different button types
    if (buttonId.startsWith('om-category-')) {
      return await handleCategoryButton(
        from,
        phoneNumberId,
        itemId, // Category ID
        action,
        conversation,
        tableName
      );
    }
    else if (buttonId.startsWith('om-menu-')) {
      return await handleMenuButton(
        from,
        phoneNumberId,
        itemId, // Menu ID
        action,
        conversation,
        tableName
      );
    }
    else if (buttonId.startsWith('om-confirm-') || buttonId.startsWith('om-add-to-cart-')) {
      const { processOrderManagementWithAI } = await import('@/components/webhook/whatsapp/services/orderManagementAIService');
      
      try {
        // Process the message using AI with tool calling
        const result = await processOrderManagementWithAI(
          chatbotId,
          conversation,
          buttonTitle,
          phoneNumberId,
          from,
          actionId
        );
        
        // If successful, return the result
        if (result.success) {
          return result;
        } else {
          // If AI processing was not successful but returned a result object
          // Send a message to the user about the issue
          // await applyMessageDelay();
          // await sendTextMessage(
          //   phoneNumberId,
          //   from,
          //   result.message || "Sorry, we couldn't process your order confirmation. Please try again."
          // );
          
          return result;
        }
      } catch (aiError) {
        // Handle any errors that might occur during AI processing
        console.error('Error processing order with AI:', aiError);
        // await applyMessageDelay();
        // await sendTextMessage(
        //   phoneNumberId,
        //   from,
        //   "Sorry, we encountered a technical issue while processing your order. Please try again later."
        // );
        
        return {
          success: false,
          message: `Error processing order with AI: ${aiError.message}`
        };
      }
    }
    else if (buttonId.startsWith('om-back-')) {
      // Handle back button - show categories again
      const categories = action.metadata?.categories || [];

      if (categories.length === 0) {
        await applyMessageDelay();
        await sendTextMessage(
          phoneNumberId,
          from,
          "Sorry, there are no categories available."
        );
        return {
          success: true,
          message: "No categories available"
        };
      }

      // Prepare list rows from categories
      const sections = [
        {
          title: "Menu Categories",
          rows: categories.map((category: any) => ({
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

      // Send the list message via WhatsApp API with error handling
      try {
        // Safely stringify the payload
        let payloadString;
        try {
          payloadString = JSON.stringify(listPayload);
        } catch (stringifyError) {
          console.error('Error stringifying category list payload:', stringifyError);
          throw new Error(`Failed to stringify category list payload: ${stringifyError.message}`);
        }

        const response = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}`
          },
          body: payloadString
        });

        if (!response.ok) {
          const responseText = await response.text();
          console.error(`WhatsApp API error (${response.status}):`, responseText);
          throw new Error(`WhatsApp API returned ${response.status}: ${responseText}`);
        }
      } catch (apiError) {
        console.error('Error sending category menu to WhatsApp:', apiError);
        // Send a simpler fallback message if the interactive message fails
        // await applyMessageDelay();
        // await sendTextMessage(
        //   phoneNumberId,
        //   from,
        //   `Please select a category to view our menu. If you're having trouble, please scan the QR code again.`
        // );
      }

      // Add to conversation history
      await addAssistantMessageToConversation(
        conversation,
        JSON.stringify(listPayload)
      );

      return {
        success: true,
        message: "Categories list sent"
      };
    }

    // Unknown button type
    // await applyMessageDelay();
    // await sendTextMessage(
    //   phoneNumberId,
    //   from,
    //   "Sorry, we couldn't process your selection. Please try again."
    // );
    return {
      success: false,
      message: "Unknown button type"
    };
  } catch (error) {
    console.error('Error handling order management button:', error);
    // await applyMessageDelay();
    // await sendTextMessage(
    //   phoneNumberId,
    //   from,
    //   "Sorry, an error occurred while processing your request. Please try again."
    // );
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
}
