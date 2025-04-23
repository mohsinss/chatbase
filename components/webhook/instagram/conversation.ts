import ChatbotConversation from '@/models/ChatbotConversation';

// Helper function to find or create conversation
export async function findOrCreateConversation(
  chatbotId: string,
  platform: string,
  from: string,
  to: string,
  initialMessage: string | null = null,
  mid: string | null = null,
  metadata: Record<string, any> = {}
): Promise<{ conversation: any; isNew: boolean }> {
  let conversation = await ChatbotConversation.findOne({
    chatbotId,
    platform,
    "metadata.from": from,
    "metadata.to": to
  });

  let isNew = false;

  if (!conversation) {
    isNew = true;
    conversation = new ChatbotConversation({
      chatbotId,
      platform,
      disable_auto_reply: false,
      metadata: { from, to, ...metadata },
      messages: initialMessage ? [{ role: "user", content: initialMessage, mid }] : []
    });
  } else if (initialMessage) {
    conversation.messages.push({ role: "user", content: initialMessage, mid });
  }

  await conversation.save();
  return { conversation, isNew };
}

// Helper function to add assistant message to conversation
export async function addAssistantMessageToConversation(
  conversation: any,
  content: string
): Promise<void> {
  conversation.messages.push({ role: "assistant", content });
  await conversation.save();
}

// Helper function to check if conversation is recent
export function isConversationRecent(conversation: any, timeThresholdMinutes: number = 60): boolean {
  const lastMessageTimestamp = conversation.updatedAt.getTime() / 1000;
  const currentTimestamp = (new Date().getTime()) / 1000;
  return currentTimestamp - lastMessageTimestamp <= timeThresholdMinutes * 60;
}

// Helper function to get recent messages from conversation
export function getRecentMessages(conversation: any, timeThresholdMinutes: number = 60): any[] {
  const oneHourAgo = Date.now() - (timeThresholdMinutes * 60 * 1000);
  //@ts-ignore
  return conversation.messages.filter(msg => new Date(msg.timestamp).getTime() >= oneHourAgo);
}
