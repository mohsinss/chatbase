import { sleep } from '@/libs/utils';
import { getAIResponse } from '@/libs/utils-ai';
import { getSettings, getInstagramPage } from '../models';
import { replyToComment } from '../messaging';
import { findOrCreateConversation, addAssistantMessageToConversation, getRecentMessages } from '../conversation';
import { handleCommentDM } from './dm-handler';

// Handle comment events
export async function handleCommentEvent(data: any): Promise<any> {
  const instagram_business_account = data.entry[0].id;
  const from = data.entry[0].changes[0].value.from.id;
  const from_name = data.entry[0].changes[0].value.from.username;
  const media_id = data.entry[0].changes[0].value.media_id;
  const comment_id = data.entry[0].changes[0].value.id;
  const parent_id = data.entry[0].changes[0].value.parent_id;
  const text = data.entry[0].changes[0].value.text;

  // Skip if comment is from the page itself
  if (instagram_business_account == from) {
    return { status: "Skip for same source." };
  }

  // Skip replies to comments
  if (parent_id) {
    return { status: "Skip for reply comments." };
  }

  // Get Instagram page
  const instagramPage = await getInstagramPage(instagram_business_account);
  if (!instagramPage) {
    return { status: "Instagram page doesn't registered to the site." };
  }

  const chatbotId = instagramPage.chatbotId;

  // Find or create conversation
  const { conversation, isNew } = await findOrCreateConversation(
    chatbotId,
    "instagram-comment",
    from,
    media_id,
    text,
    comment_id,
    { from_name, instagram_business_account, comment_id }
  );

  // Skip if auto-reply is disabled
  if (conversation?.disable_auto_reply) {
    return { status: "Auto response is disabled." };
  }

  // Get settings
  const instagramSettings = await getSettings(instagramPage);

  // Handle DM reactions based on comment
  if (instagramSettings?.commentDmEnabled) {
    await handleCommentDM(instagramPage, chatbotId, from, from_name, text, isNew, instagramSettings);
  }

  // Handle comment reply
  const messages = getRecentMessages(conversation);

  // Ensure at least the current message is included
  const messagesForAI = messages.length === 0 ? [{ role: 'user', content: text }] : messages;

  // Get AI response
  const response_text = await getAIResponse(chatbotId, messagesForAI, text, instagramSettings?.prompt1);

  // Apply delay if configured
  const delay = instagramSettings?.delay1;
  if (delay && delay > 0) {
    await sleep(delay * 1000);
  }

  // Reply to the comment
  await replyToComment(comment_id, instagramPage.access_token, from_name, response_text);

  // Update conversation
  await addAssistantMessageToConversation(conversation, response_text);

  return { status: "Comment reply handled." };
}
