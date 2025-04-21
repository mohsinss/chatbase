/**
 * Helper utilities for WhatsApp webhook
 */
import { sleep } from '@/libs/utils';

/**
 * Extract message data from webhook payload
 */
export function extractMessageData(data: any) {
  if (!data?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
    return null;
  }

  const message = data.entry[0].changes[0].value.messages[0];
  const metadata = data.entry[0].changes[0].value.metadata;

  return {
    from: message.from,
    phoneNumberId: metadata.phone_number_id,
    messageId: message.id,
    timestamp: message.timestamp,
    type: message.type,
    text: message.type === 'text' ? message.text?.body : null,
    interactive: message.type === 'interactive' ? message.interactive : null
  };
}

/**
 * Check if a message is too old to process
 * @param messageTimestamp Message timestamp in seconds
 * @param currentTimestamp Current timestamp in seconds
 * @returns Boolean indicating if message is too old
 */
export function isMessageTooOld(messageTimestamp: number, currentTimestamp: number): boolean {
  // If message is older than 60 seconds, consider it too old
  return messageTimestamp + 60 < currentTimestamp;
}

/**
 * Apply configured delay for message processing
 */
export async function applyConfiguredDelay(delayInSeconds: number | undefined): Promise<void> {
  if (delayInSeconds && delayInSeconds > 0) {
    await sleep(delayInSeconds * 1000); // delay is in seconds, converting to milliseconds
  }
}

/**
 * Filter conversation messages to get recent context
 * @param messages All messages in the conversation
 * @returns Filtered messages (last hour or last 10)
 */
export function filterRecentMessages(messages: any[]): any[] {
  if (messages.length <= 20) {
    return messages;
  }
  
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  
  try {
    // Try to filter by timestamp if available
    const recentMessages = messages.filter((msg: any) => {
      // Try different timestamp fields that might exist
      const msgTime = msg.timestamp || msg.createdAt || null;
      return msgTime ? new Date(msgTime).getTime() >= oneHourAgo : true;
    });
    
    // If we have recent messages, use them, otherwise use the last 10 messages
    return recentMessages.length > 0 ? recentMessages : messages.slice(-10);
  } catch (e) {
    // If any error occurs, fallback to the last 10 messages
    return messages.slice(-10);
  }
}
