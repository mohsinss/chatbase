import { sleep } from '@/libs/utils';
import { getSettings, getDataset } from '../models';
import { sendTypingIndicator } from '../messaging';
import { findOrCreateConversation } from '../conversation';
import { handleQuestionFlow } from './question-flow';
import { handleAIResponse } from './ai-response';
import ChatbotConversation from '@/models/ChatbotConversation';

// Handle Messenger text messages
export async function handleMessengerMessage(
  instagramPage: any, 
  chatbotId: string, 
  sender: string, 
  messaging: any
): Promise<any> {
  const timestamp = messaging.timestamp;
  const text = messaging.message.text;
  const mid = messaging.message.mid;
  const currentTimestamp = (new Date().getTime()) / 1000;

  // Skip if message is too old
  if (timestamp + 60 < currentTimestamp) {
    return { status: 'Delivery denied due to long delay' };
  }

  // Get settings and dataset
  const instagramSettings = await getSettings(instagramPage);
  const dataset = await getDataset(chatbotId);

  // Apply delay if configured
  const delay = instagramSettings?.delay;
  if (delay && delay > 0) {
    await sleep(delay * 1000);
  }

  // Find or create conversation
  const { conversation, isNew } = await findOrCreateConversation(
    chatbotId,
    "instagram",
    sender,
    instagramPage.name,
    text,
    mid
  );

  // Skip if auto-reply is disabled
  if (conversation?.disable_auto_reply) {
    return { status: "Auto response is disabled." };
  }

  // Send typing indicator
  await sendTypingIndicator(instagramPage.pageId, instagramPage.access_token, sender);

  // Determine if we should use question flow
  let triggerQF = isNew;

  if (!isNew) {
    const { questionFlowEnable, questionAIResponseEnable, restartQFTimeoutMins } = dataset;
    const isAiResponseEnabled = questionAIResponseEnable !== undefined ? questionAIResponseEnable : true;

    // Check if last message was JSON (indicating a question flow)
    const lastMessageContent = conversation.messages[conversation.messages.length - 2]?.content;
    if (lastMessageContent) {
      try {
        JSON.parse(lastMessageContent);
        triggerQF = true;
      } catch (e) {
        // Not JSON, continue
      }
    }

    // Check if conversation is old enough to restart question flow
    const lastMessageTimestamp = conversation.updatedAt.getTime() / 1000;
    if (restartQFTimeoutMins && currentTimestamp - lastMessageTimestamp > restartQFTimeoutMins * 60) {
      triggerQF = true;
    }

    // Force question flow if AI responses are disabled
    if (!isAiResponseEnabled) {
      triggerQF = true;
    }
  }

  // Use question flow if enabled and triggered
  if (dataset.questionFlowEnable && dataset.questionFlow && triggerQF) {
    await handleQuestionFlow(instagramPage, sender, dataset.questionFlow, conversation);
    return { status: "Question flow handled." };
  } else {
    await handleAIResponse(instagramPage, chatbotId, sender, text, conversation, instagramSettings?.prompt);
    return { status: "AI response handled." };
  }
}

// Handle Messenger postbacks (button clicks)
export async function handleMessengerPostback(
  instagramPage: any, 
  chatbotId: string, 
  sender: string, 
  messaging: any
): Promise<any> {
  const text = messaging.postback.title;
  const mid = messaging.postback.mid;
  const button_id = messaging.postback.payload;

  // Parse node ID and option index from payload
  const node_id = button_id.split('-')[0];
  const option_index = button_id.split('-').pop();

  // Get settings and dataset
  const instagramSettings = await getSettings(instagramPage);
  const dataset = await getDataset(chatbotId);

  // Apply delay if configured
  const delay = instagramSettings?.delay;
  if (delay && delay > 0) {
    await sleep(delay * 1000);
  }

  // Find or create conversation
  const { conversation } = await findOrCreateConversation(
    chatbotId,
    "instagram",
    sender,
    instagramPage.name,
    text,
    mid
  );

  // Skip if auto-reply is disabled
  if (conversation?.disable_auto_reply) {
    return { status: "Auto response is disabled." };
  }

  // Process question flow if enabled
  if (dataset.questionFlowEnable && dataset.questionFlow) {
    await handleQuestionFlow(
      instagramPage, 
      sender, 
      dataset.questionFlow, 
      conversation,
      node_id,
      option_index
    );
    return { status: "Question flow handled for postback." };
  }

  return { status: "No question flow available for postback." };
}

// Handle message unsend/delete
export async function handleMessageUnsend(
  instagramPage: any,
  chatbotId: string,
  sender: string,
  messaging: any
): Promise<any> {
  const mid = messaging.message.mid;
  
  if (!mid) {
    return { status: "Missing message ID for unsend event." };
  }

  try {
    // Find the conversation
    const conversation = await ChatbotConversation.findOne({
      chatbotId,
      platform: "instagram",
      "metadata.from": sender,
      "metadata.to": instagramPage.name
    });

    if (!conversation) {
      return { status: "Conversation not found for unsend event." };
    }

    // Find the message with the matching mid and mark it as deleted
    let messageFound = false;
    for (const message of conversation.messages) {
      if (message.mid === mid) {
        message.deleted = true;
        messageFound = true;
        break;
      }
    }

    if (!messageFound) {
      return { status: "Message not found for unsend event." };
    }

    // Save the conversation
    await conversation.save();
    return { status: "Message marked as deleted." };
  } catch (error) {
    console.error('Error handling message unsend:', error);
    return { status: "Error handling message unsend.", error };
  }
}

// Handle Messenger events (messages and postbacks)
export async function handleMessengerEvent(data: any): Promise<any> {
  const messaging = data.entry[0].messaging[0];
  const instagram_business_account = data.entry[0].id;
  const sender = messaging.sender.id;
  const recipient = messaging.recipient.id;

  // Skip if sender is the page itself
  if (instagram_business_account == sender) {
    return { status: "Skip for same source." };
  }

  // Get Instagram page
  const instagramPage = await getInstagramPage(recipient);
  if (!instagramPage) {
    return { status: "Instagram page doesn't registered to the site." };
  }

  const chatbotId = instagramPage.chatbotId;

  // Handle text messages
  if (messaging.message?.text) {
    return await handleMessengerMessage(instagramPage, chatbotId, sender, messaging);
  }
  // Handle message unsend
  else if (messaging.message?.is_deleted) {
    return await handleMessageUnsend(instagramPage, chatbotId, sender, messaging);
  }
  // Handle postbacks (button clicks)
  else if (messaging.postback) {
    return await handleMessengerPostback(instagramPage, chatbotId, sender, messaging);
  }

  return { status: "No handler for this message type." };
}

// Import at the end to avoid circular dependencies
import { getInstagramPage } from '../models';
