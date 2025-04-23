import { sleep } from '@/libs/utils';
import { getAIResponse } from '@/libs/utils-ai';
import { sendMessage } from '../messaging';
import { findOrCreateConversation, addAssistantMessageToConversation } from '../conversation';

// Handle DM reactions to comments
export async function handleCommentDM(
  instagramPage: any,
  chatbotId: string,
  from: string,
  from_name: string,
  message: string,
  isNewCustomer: boolean,
  instagramSettings: any
): Promise<void> {
  // Find or create messenger conversation
  const { conversation } = await findOrCreateConversation(
    chatbotId,
    "instagram",
    from,
    instagramPage.name
  );

  // Skip if auto-reply is disabled
  if (conversation?.disable_auto_reply) {
    return;
  }

  let isKeywordTriggered = false;
  let response_text = "";

  // Welcome DM for new customers
  if (isNewCustomer && instagramSettings?.welcomeDmEnabled) {
    if (instagramSettings?.welcomeDmResponseType === "template") {
      // Use template response
      response_text = instagramSettings?.welcomeDmTemplate || "Welcome to our page! How can I help you today?";
    } else {
      // Use AI prompt
      const promptText = instagramSettings?.welcomeDmPrompt || "Welcome! Thanks for engaging with our page. How can I help you today?";
      const messages = [{ role: "user", content: "New user has engaged with our page" }];
      response_text = await getAIResponse(chatbotId, messages, "New user has engaged with our page", promptText);
    }

    const dmDelay = instagramSettings?.welcomeDmDelay || 0;
    if (dmDelay > 0) {
      await sleep(dmDelay * 1000);
    }

    // Send DM
    await sendMessage(instagramPage.pageId, instagramPage.access_token, from, response_text);
    await addAssistantMessageToConversation(conversation, response_text);
  }
  
  // Keyword-triggered DMs
  if (!isNewCustomer && instagramSettings?.keywordDmEnabled && instagramSettings?.keywordTriggers?.length > 0) {
    // Check for keywords
    for (const trigger of instagramSettings.keywordTriggers) {
      if (message.toLowerCase().includes(trigger.keyword.trim().toLowerCase())) {
        if (trigger.responseType === "template") {
          // Use template response
          response_text = trigger.template || `You mentioned "${trigger.keyword}". How can I help you with that?`;
        } else {
          // Use AI prompt
          const promptText = trigger.prompt || `You mentioned "${trigger.keyword}". How can I help you with that?`;
          const messages = [{ role: "user", content: message }];

          // Replace variables in prompt
          const processedPrompt = promptText
            .replace(/{user}/g, from_name)
            .replace(/{comment}/g, message)
            .replace(/{keyword}/g, trigger.keyword);

          response_text = await getAIResponse(chatbotId, messages, message, processedPrompt);
        }

        const dmDelay = trigger.delay || 0;
        isKeywordTriggered = true;

        if (dmDelay > 0) {
          await sleep(dmDelay * 1000);
        }

        // Send DM
        await sendMessage(instagramPage.pageId, instagramPage.access_token, from, response_text);
        await addAssistantMessageToConversation(conversation, response_text);

        // Only trigger on first matching keyword
        break;
      }
    }
  }
  
  // Reply DM for all comment authors
  if (!isNewCustomer && !isKeywordTriggered && instagramSettings?.replyDmEnabled) {
    if (instagramSettings?.replyDmResponseType === "template") {
      // Use template response
      response_text = instagramSettings?.replyDmTemplate || "Thanks for your comment! How can I help you today?";
    } else {
      // Use AI prompt
      const promptText = instagramSettings?.replyDmPrompt || "Thanks for your comment! I'd love to continue this conversation in DM. How can I assist you?";
      const messages = [{ role: "user", content: message }];

      // Replace variables in prompt
      const processedPrompt = promptText
        .replace(/{user}/g, from_name)
        .replace(/{comment}/g, message);

      response_text = await getAIResponse(chatbotId, messages, message, processedPrompt);
    }

    const dmDelay = instagramSettings?.replyDmDelay || 0;
    if (dmDelay > 0) {
      await sleep(dmDelay * 1000);
    }

    // Send DM
    await sendMessage(instagramPage.pageId, instagramPage.access_token, from, response_text);
    await addAssistantMessageToConversation(conversation, response_text);
  }
}
