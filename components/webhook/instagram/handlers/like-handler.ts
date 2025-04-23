import { sleep } from '@/libs/utils';
import { getSettings, getInstagramPage } from '../models';
import { sendMessage } from '../messaging';
import { findOrCreateConversation, addAssistantMessageToConversation } from '../conversation';
import ChatbotConversation from '@/models/ChatbotConversation';

// Handle like events
export async function handleLikeEvent(data: any): Promise<any> {
  const instagram_business_account = data.entry[0].id;
  const from = data.entry[0].changes[0].value.user_id;
  const media_id = data.entry[0].changes[0].value.media_id;

  // Get Instagram page
  const instagramPage = await getInstagramPage(instagram_business_account);
  if (!instagramPage) {
    return { status: "Instagram page doesn't registered to the site." };
  }

  const chatbotId = instagramPage.chatbotId;
  const instagramSettings = await getSettings(instagramPage);

  // Only process if like DMs are enabled
  if (instagramSettings?.likeDmEnabled) {
    // Check if we should only send DM on first like
    if (instagramSettings?.likeDmFirstOnly) {
      // Check if we've already sent a DM to this user
      const existingConversation = await ChatbotConversation.findOne({
        chatbotId,
        platform: "instagram",
        "metadata.from": from,
        "metadata.to": instagramPage.name,
      });

      if (existingConversation) {
        return { status: "Skip DM for existing user (first-like-only mode)." };
      }
    }

    // Check if this is a specific post with custom settings
    let promptText = instagramSettings?.likeDmPrompt || "Thanks for liking our post! We're glad you enjoyed it. How can we help you today?";
    let dmDelay = instagramSettings?.likeDmDelay || 0;

    if (instagramSettings?.likeDmSpecificPosts?.length > 0) {
      const specificPost = instagramSettings.likeDmSpecificPosts.find(
        (post: { postUrl: string; prompt?: string; delay?: number }) => post.postUrl.includes(media_id)
      );

      if (specificPost) {
        if (specificPost.prompt) promptText = specificPost.prompt;
        if (specificPost.delay !== undefined) dmDelay = specificPost.delay;
      }
    }

    if (dmDelay > 0) {
      await sleep(dmDelay * 1000);
    }

    // Find or create direct message conversation
    const { conversation } = await findOrCreateConversation(
      chatbotId,
      "instagram",
      from,
      instagramPage.name
    );

    // Skip if auto-reply is disabled
    if (conversation?.disable_auto_reply) {
      return { status: "Auto response is disabled." };
    }

    // Send Direct Message (DM) to the user
    await sendMessage(instagramPage.pageId, instagramPage.access_token, from, promptText);

    // Update conversation
    await addAssistantMessageToConversation(conversation, promptText);

    return { status: "Like DM sent." };
  }

  return { status: "Like DM not enabled." };
}
