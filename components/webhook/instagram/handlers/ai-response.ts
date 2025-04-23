import { getAIResponse } from '@/libs/utils-ai';
import { sendMessage, sendTypingIndicator } from '../messaging';
import { addAssistantMessageToConversation, getRecentMessages } from '../conversation';

// Handle AI response for Messenger
export async function handleAIResponse(
  instagramPage: any,
  chatbotId: string,
  sender: string,
  text: string,
  conversation: any,
  prompt?: string
): Promise<void> {
  // Get recent messages (last hour)
  let messages = getRecentMessages(conversation);

  // Ensure at least the current message is included
  if (messages.length === 0) {
    messages = [{ role: 'user', content: text }];
  }

  // Get AI response
  const response_text = await getAIResponse(chatbotId, messages, text, prompt);

  // Send typing indicator
  await sendTypingIndicator(instagramPage.pageId, instagramPage.access_token, sender);

  // Send response
  await sendMessage(instagramPage.pageId, instagramPage.access_token, sender, response_text);

  // Update conversation
  await addAssistantMessageToConversation(conversation, response_text);
}
