/**
 * Main entry point for interactive message handling in WhatsApp webhook
 */
import { handleButtonReply } from './buttonReplyHandler';

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

// Export all handlers for direct access if needed
export * from './buttonReplyHandler';
export * from './orderManagementHandler';
export * from './categoryHandler';
export * from './menuHandler';
export * from './cartHandler';
export * from './utils';
