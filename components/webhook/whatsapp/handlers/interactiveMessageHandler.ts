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
    // Extract information from button ID
    let tableName: string = '', actionId: string = '', itemId: string = '';
    
    // Parse button ID based on its type
    if (buttonId.startsWith('om-category-')) {
      // Format: om-category-{tableName}-{actionId}-{categoryId}
      const parts = buttonId.replace('om-category-', '').split('-');
      itemId = parts.pop(); // Category ID
      actionId = parts.pop(); // Action ID
      tableName = parts.join('-'); // Table name
    } 
    else if (buttonId.startsWith('om-menu-')) {
      // Format: om-menu-{tableName}-{actionId}-{menuId}
      const parts = buttonId.replace('om-menu-', '').split('-');
      itemId = parts.pop(); // Menu ID
      actionId = parts.pop(); // Action ID
      tableName = parts.join('-'); // Table name
    }
    else if (buttonId.startsWith('om-confirm-')) {
      // Format: om-confirm-{tableName}-{actionId}-{menuId}
      const parts = buttonId.replace('om-confirm-', '').split('-');
      itemId = parts.pop(); // Menu ID
      actionId = parts.pop(); // Action ID
      tableName = parts.join('-'); // Table name
    }
    else if (buttonId.startsWith('om-back-')) {
      // Format: om-back-{tableName}-{actionId}
      const parts = buttonId.replace('om-back-', '').split('-');
      actionId = parts.pop(); // Action ID
      tableName = parts.join('-'); // Table name
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
    
    // Get the action
    const action = await ChatbotAction.findById(actionId);
    if (!action) {
      await sendTextMessage(
        phoneNumberId, 
        from, 
        "Sorry, we couldn't find the restaurant information. Please scan the QR code again."
      );
      return { 
        success: false, 
        message: "Order management action not found" 
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
      await sendTextMessage(
        phoneNumberId, 
        from, 
        `Welcome back! You're at table ${tableName}. Please select a category to view our menu:`
      );
      
      // Prepare buttons for categories
      const buttons = categories.slice(0, 3).map((category: any) => ({
        type: "reply",
        reply: {
          id: `om-category-${tableName}-${action.id}-${category.id}`,
          title: category.name
        }
      }));
      
      // Send interactive button message with categories
      const buttonsPayload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: "Menu Categories"
          },
          action: {
            buttons
          }
        }
      };
      
      // Send the buttons via WhatsApp API
      await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}`
        },
        body: JSON.stringify(buttonsPayload)
      });
      
      // Add to conversation history
      await addAssistantMessageToConversation(
        conversation, 
        JSON.stringify(buttonsPayload)
      );
      
      return { 
        success: true, 
        message: "Categories sent" 
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
  // Get menu items for this category
  const menuItems = (action.metadata?.menuItems || []).filter(
    (item: any) => item.category === categoryId && item.available
  );
  
  if (menuItems.length === 0) {
    await sendTextMessage(
      phoneNumberId, 
      from, 
      "Sorry, there are no available items in this category."
    );
    return { 
      success: true, 
      message: "No menu items in category" 
    };
  }
  
  // Prepare buttons for menu items (max 3 buttons allowed by WhatsApp)
  const buttons = menuItems.slice(0, 2).map((item: any) => ({
    type: "reply",
    reply: {
      id: `om-menu-${tableName}-${action.id}-${item.id}`,
      title: item.name
    }
  }));
  
  // Add back button
  buttons.push({
    type: "reply",
    reply: {
      id: `om-back-${tableName}-${action.id}`,
      title: "Back to Categories"
    }
  });
  
  // Send interactive button message with menu items
  const buttonsPayload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: from,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: `Menu items in ${categoryId} for table ${tableName}:`
      },
      action: {
        buttons
      }
    }
  };
  
  // Send the buttons via WhatsApp API
  await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}`
    },
    body: JSON.stringify(buttonsPayload)
  });
  
  // Add to conversation history
  await addAssistantMessageToConversation(
    conversation, 
    JSON.stringify(buttonsPayload)
  );
  
  return { 
    success: true, 
    message: "Category menu items sent" 
  };
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
  // Find the menu item
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
  
  // Get the category for the back button
  const categoryId = menuItem.category;
  
  // Send menu item details
  let messageText = `*${menuItem.name}*\n\n`;
  if (menuItem.description) {
    messageText += `${menuItem.description}\n\n`;
  }
  messageText += `Price: $${menuItem.price.toFixed(2)}`;
  
  await sendTextMessage(
    phoneNumberId, 
    from, 
    messageText
  );
  
  // Send image if available
  if (menuItem.images && menuItem.images.length > 0) {
    const imageUrl = menuItem.images[0];
    
    // Send image message
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
          link: imageUrl
        }
      })
    });
  }
  
  // Prepare confirmation buttons
  const buttons = [
    {
      type: "reply",
      reply: {
        id: `om-confirm-${tableName}-${action.id}-${menuId}`,
        title: "Order Now"
      }
    },
    {
      type: "reply",
      reply: {
        id: `om-category-${tableName}-${action.id}-${categoryId}`,
        title: "Back to Menu"
      }
    }
  ];
  
  // Send interactive button message with confirmation options
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
        buttons
      }
    }
  };
  
  // Send the buttons via WhatsApp API
  await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}`
    },
    body: JSON.stringify(buttonsPayload)
  });
  
  // Add to conversation history
  await addAssistantMessageToConversation(
    conversation, 
    JSON.stringify(buttonsPayload)
  );
  
  return { 
    success: true, 
    message: "Menu item details sent" 
  };
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
  // Find the menu item
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
  
  // Add order to conversation metadata
  const orders = conversation.metadata?.orders || [];
  orders.push({
    menuId,
    menuName: menuItem.name,
    price: menuItem.price,
    timestamp: new Date()
  });
  
  conversation.metadata = {
    ...conversation.metadata,
    orders
  };
  
  await conversation.save();
  
  // Send confirmation message
  await sendTextMessage(
    phoneNumberId, 
    from, 
    `Thank you! Your order for *${menuItem.name}* has been placed for table ${tableName}. A staff member will assist you shortly.`
  );
  
  // Get categories for next order
  const categories = action.metadata?.categories || [];
  
  if (categories.length > 0) {
    // Prepare buttons for categories (max 3 buttons allowed by WhatsApp)
    const buttons = categories.slice(0, 3).map((category: any) => ({
      type: "reply",
      reply: {
        id: `om-category-${tableName}-${action.id}-${category.id}`,
        title: category.name
      }
    }));
    
    // Send interactive button message with categories for next order
    const buttonsPayload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: "Would you like to order anything else?"
        },
        action: {
          buttons
        }
      }
    };
    
    // Send the buttons via WhatsApp API
    await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}`
      },
      body: JSON.stringify(buttonsPayload)
    });
    
    // Add to conversation history
    await addAssistantMessageToConversation(
      conversation, 
      JSON.stringify(buttonsPayload)
    );
  }
  
  return { 
    success: true, 
    message: "Order confirmed" 
  };
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
