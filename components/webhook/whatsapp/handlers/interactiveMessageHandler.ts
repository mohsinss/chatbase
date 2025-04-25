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
import ChatbotAction from '@/models/ChatbotAction';

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
    
    // Check if this is an order management button
    if (buttonId.startsWith('om-')) {
      return await handleOrderManagementButton(
        from,
        phoneNumberId,
        buttonId,
        buttonTitle,
        conversation,
        chatbotId
      );
    }
    
    // Parse node ID and option index from button ID for question flow
    const [nodeId, _, optionIndex] = buttonId.split('-');
    
    if (!nodeId || !optionIndex) {
      return { 
        success: false, 
        message: "Invalid button ID format" 
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
 * Handle order management button clicks
 */
async function handleOrderManagementButton(
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
      await sendTextMessage(
        phoneNumberId, 
        from, 
        "Sorry, we couldn't find the restaurant information. Please scan the QR code again."
      );
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
    else if (buttonId.startsWith('om-confirm-')) {
      return await handleConfirmButton(
        from,
        phoneNumberId,
        itemId, // Menu ID
        action,
        conversation,
        tableName
      );
    }
    else if (buttonId.startsWith('om-back-')) {
      // Handle back button - show categories again
      const categories = action.metadata?.categories || [];
      
      if (categories.length === 0) {
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
      
      // Send welcome message
      // await sendTextMessage(
      //   phoneNumberId, 
      //   from, 
      //   `Welcome back! You're at table ${tableName}. Please select a category to view our menu:`
      // );
      
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
    await sendTextMessage(
      phoneNumberId,
      from,
      `Please select a category to view our menu. If you're having trouble, please scan the QR code again.`
    );
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
    await sendTextMessage(
      phoneNumberId, 
      from, 
      "Sorry, we couldn't process your selection. Please try again."
    );
    return { 
      success: false, 
      message: "Unknown button type" 
    };
  } catch (error) {
    console.error('Error handling order management button:', error);
    await sendTextMessage(
      phoneNumberId, 
      from, 
      "Sorry, an error occurred while processing your request. Please try again."
    );
    return { 
      success: false, 
      message: `Error: ${error.message}` 
    };
  }
}

/**
 * Handle category button click
 */
async function handleCategoryButton(
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

/**
 * Handle menu item button click
 */
async function handleMenuButton(
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
      let messageText = `*${menuItemResult.item.name}*\n\n`;
      if (menuItemResult.item.description) {
        messageText += `${menuItemResult.item.description}\n\n`;
      }
      messageText += `Price: $${menuItemResult.item.price.toFixed(2)}`;
      
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
                id: button.id === "order_now" 
                  ? `om-confirm-${tableName}-${action._id}-${menuId}`
                  : `om-category-${tableName}-${action._id}-${categoryId}`,
                title: button.title
              }
            }))
          }
        }
      };
      
      // Send the buttons via WhatsApp API
      const response = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}`
        },
        body: JSON.stringify(buttonsPayload)
      });
      
      if (!response.ok) {
        throw new Error(`WhatsApp API returned ${response.status}`);
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

/**
 * Handle confirm order button click
 */
async function handleConfirmButton(
  from: string,
  phoneNumberId: string,
  menuId: string,
  action: any,
  conversation: any,
  tableName: string
): Promise<{ success: boolean, message: string }> {
  try {
    // Import the order management functions
    const { submitOrder } = await import('@/components/chatbot/api/order-management');
    
    // Find the menu item to get its details
    const menuItem = (action.metadata?.menuItems || []).find(
      (item: any) => item.id === menuId
    );
    
    if (!menuItem) {
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
    
    // Create an order object
    const order = {
      table: tableName,
      items: [
        {
          item_id: menuId,
          name: menuItem.name,
          qty: 1,
          price: menuItem.price
        }
      ]
    };
    
    // Submit the order using the tool with isWhatsApp=true
    const orderResult = await submitOrder(action.chatbotId, order, true);
    
    // Check if we got a JSON response
    if (typeof orderResult === 'object') {
      // Send confirmation message
      await sendTextMessage(
        phoneNumberId,
        from,
        `Thank you! Your order #${orderResult.order.id} has been placed for table ${tableName}. A staff member will assist you shortly.`
      );
      
      // Format order summary
      let orderSummary = "*Order Summary*\n\n";
      orderResult.order.items.forEach((item: any) => {
        orderSummary += `${item.qty} x ${item.name} - $${(item.price * item.qty).toFixed(2)}\n`;
      });
      orderSummary += `\n*Total: $${orderResult.order.total.toFixed(2)}*`;
      
      // Send order summary
      await sendTextMessage(
        phoneNumberId,
        from,
        orderSummary
      );
      
      // Send buttons for next actions
      const buttonsPayload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: "Would you like to place another order or track this order?"
          },
          action: {
            buttons: orderResult.buttons.map((button: any) => ({
              type: "reply",
              reply: {
                id: button.id === "place_another_order" 
                  ? `om-back-${tableName}-${action._id}`
                  : `om-track-${tableName}-${action._id}-${button.orderId || ''}`,
                title: button.title
              }
            }))
          }
        }
      };
      
      // Send the buttons via WhatsApp API
      const response = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}`
        },
        body: JSON.stringify(buttonsPayload)
      });
      
      if (!response.ok) {
        throw new Error(`WhatsApp API returned ${response.status}`);
      }
      
      // Add to conversation history
      await addAssistantMessageToConversation(
        conversation,
        JSON.stringify(buttonsPayload)
      );
      
      return {
        success: true,
        message: "Order confirmed with buttons"
      };
    } else {
      // If we didn't get a JSON response, send the result as a text message
      await sendTextMessage(
        phoneNumberId,
        from,
        orderResult
      );
      
      // Add to conversation history
      await addAssistantMessageToConversation(
        conversation,
        orderResult
      );
      
      return {
        success: true,
        message: "Order confirmed as text"
      };
    }
  } catch (error) {
    console.error('Error using submitOrder tool:', error);
    await sendTextMessage(
      phoneNumberId,
      from,
      "Sorry, we're experiencing technical difficulties with our ordering system. Please try again later."
    );
    
    return {
      success: false,
      message: `Error using submitOrder tool: ${error.message}`
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
    else if (interactive.type === 'list_reply') {
      // Handle list replies similar to button replies
      return await handleButtonReply(
        from,
        phoneNumberId,
        messageId,
        interactive.list_reply
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
