// src/app/api/webhook/instagram/route.ts
import { NextResponse } from 'next/server';
import connectMongo from '@/libs/mongoose';
import ChatbotConversation from '@/models/ChatbotConversation';
import InstagramPage from '@/models/InstagramPage';
import axios from 'axios';
import { getAIResponse } from '@/libs/utils-ai';
import { sleep } from '@/libs/utils';
import Dataset from '@/models/Dataset';
import { sampleFlow } from '@/types';
import Chatbot from '@/models/Chatbot';

// Types for better type safety
type CacheEntry<T> = { data: T; timestamp: number };
type CacheMap<T> = Map<string, CacheEntry<T>>;

// Cache for frequently accessed data
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const cache = {
  chatbots: new Map<string, CacheEntry<any>>(),
  datasets: new Map<string, CacheEntry<any>>(),
  instagramPages: new Map<string, CacheEntry<any>>(),
  lastCleanup: Date.now()
};

// Clean up expired cache entries
function cleanupCache(): void {
  const now = Date.now();
  if (now - cache.lastCleanup > CACHE_TTL) {
    // Use Array.from to avoid iterator issues
    Array.from(cache.chatbots.entries()).forEach(([key, { timestamp }]) => {
      if (now - timestamp > CACHE_TTL) cache.chatbots.delete(key);
    });
    
    Array.from(cache.datasets.entries()).forEach(([key, { timestamp }]) => {
      if (now - timestamp > CACHE_TTL) cache.datasets.delete(key);
    });
    
    Array.from(cache.instagramPages.entries()).forEach(([key, { timestamp }]) => {
      if (now - timestamp > CACHE_TTL) cache.instagramPages.delete(key);
    });
    
    cache.lastCleanup = now;
  }
}

// Helper function to get cached or fetch data
async function getCachedOrFetch<T>(cacheMap: CacheMap<T>, key: string, fetchFn: () => Promise<T>): Promise<T> {
  cleanupCache();
  
  if (cacheMap.has(key)) {
    const entry = cacheMap.get(key);
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
      return entry.data;
    }
  }
  
  const data = await fetchFn();
  cacheMap.set(key, { data, timestamp: Date.now() });
  return data;
}

// Helper function to get Instagram page
async function getInstagramPage(pageId: string): Promise<any> {
  return getCachedOrFetch(
    cache.instagramPages,
    pageId,
    async () => await InstagramPage.findOne({ pageId })
  );
}

// Helper function to get chatbot
async function getChatbot(chatbotId: string): Promise<any> {
  return getCachedOrFetch(
    cache.chatbots,
    chatbotId,
    async () => await Chatbot.findOne({ chatbotId })
  );
}

// Helper function to get dataset
async function getDataset(chatbotId: string): Promise<any> {
  return getCachedOrFetch(
    cache.datasets,
    chatbotId,
    async () => await Dataset.findOne({ chatbotId })
  );
}

// Helper function to get settings from InstagramPage model
async function getSettings(instagramPage: any): Promise<any> {
  return instagramPage.settings || {};
}

// Helper function to send typing indicator
async function sendTypingIndicator(pageId: string, accessToken: string, recipientId: string): Promise<void> {
  try {
    await axios.post(`https://graph.facebook.com/v22.0/${pageId}/messages?access_token=${accessToken}`, {
      recipient: { id: recipientId },
      sender_action: "typing_on"
    }, {
      headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });
  } catch (error) {
    console.error('Error sending typing indicator:', error);
    // Continue execution even if typing indicator fails
  }
}

// Helper function to send message
async function sendMessage(pageId: string, accessToken: string, recipientId: string, text: string): Promise<boolean> {
  try {
    await axios.post(`https://graph.facebook.com/v22.0/${pageId}/messages?access_token=${accessToken}`, {
      recipient: { id: recipientId },
      message: { text },
      messaging_type: "RESPONSE",
    }, {
      headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
}

// Helper function to send image
async function sendImage(pageId: string, accessToken: string, recipientId: string, imageUrl: string): Promise<boolean> {
  try {
    await axios.post(`https://graph.facebook.com/v22.0/${pageId}/messages?access_token=${accessToken}`, {
      recipient: { id: recipientId },
      message: {
        attachment: {
          type: 'image',
          payload: {
            url: imageUrl,
            is_reusable: true,
          }
        }
      },
    }, {
      headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });
    return true;
  } catch (error) {
    console.error('Error sending image:', error);
    return false;
  }
}

// Helper function to find or create conversation
async function findOrCreateConversation(
  chatbotId: string, 
  platform: string, 
  from: string, 
  to: string, 
  initialMessage: string | null = null, 
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
      messages: initialMessage ? [{ role: "user", content: initialMessage }] : []
    });
  } else if (initialMessage) {
    conversation.messages.push({ role: "user", content: initialMessage });
  }
  
  await conversation.save();
  return { conversation, isNew };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === 'your_verify_token') {
    return NextResponse.json(Number(challenge), { status: 200 });
  } else {
    return new NextResponse(null, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    // Parse the incoming request body
    const data = await request.json();

    // Log webhook data if enabled
    if (process.env.ENABLE_WEBHOOK_LOGGING_INSTAGRAM == "1") {
      try {
        const response = await fetch('http://webhook.mrcoders.org/instagram.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          console.error(`Webhook logging error: ${response.status}`);
        }
      } catch (error) {
        console.error('Webhook logging error:', error);
        // Continue execution even if logging fails
      }
    }

    if (!data?.entry?.length) {
      return NextResponse.json({ status: 'No entries found' }, { status: 200 });
    }

    await connectMongo();

    // Handle direct messages
    if (data.entry[0]?.messaging?.length > 0) {
      await handleMessengerEvent(data);
    }
    
    // Handle comments
    else if (data.entry[0]?.changes?.length > 0 && data.entry[0]?.changes[0]?.field == "comments") {
      await handleCommentEvent(data);
    }
    
    // Handle likes
    else if (data.entry[0]?.changes?.length > 0 && data.entry[0]?.changes[0]?.field == "likes") {
      await handleLikeEvent(data);
    }

    // Respond with a 200 OK status
    return NextResponse.json({ status: 'OK' }, { status: 200 });
  } catch (error: any) {
    console.error('Error processing webhook event:', error);

    if (process.env.ENABLE_WEBHOOK_LOGGING_INSTAGRAM == "1") {
      try {
        await fetch('http://webhook.mrcoders.org/instagram-error.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(error),
        });
      } catch (logError) {
        console.error('Error logging webhook error:', logError);
      }
    }
    
    // Always return 200 to Instagram to prevent retries
    return NextResponse.json({ error: error.message }, { status: 200 });
  }
}

// Handle Messenger events (messages and postbacks)
async function handleMessengerEvent(data: any): Promise<any> {
  const messaging = data.entry[0].messaging[0];
  const page_id = data.entry[0].id;
  const sender = messaging.sender.id;
  const recipient = messaging.recipient.id;
  
  // Skip if sender is the page itself
  if (page_id == sender) {
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
    await handleMessengerMessage(instagramPage, chatbotId, sender, messaging);
  }
  // Handle postbacks (button clicks)
  else if (messaging.postback) {
    await handleMessengerPostback(instagramPage, chatbotId, sender, messaging);
  }
}

// Handle Messenger text messages
async function handleMessengerMessage(instagramPage: any, chatbotId: string, sender: string, messaging: any): Promise<any> {
  const timestamp = messaging.timestamp;
  const text = messaging.message.text;
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
    text
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
    if (currentTimestamp - lastMessageTimestamp > restartQFTimeoutMins * 60) {
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
  } else {
    await handleAIResponse(instagramPage, chatbotId, sender, text, conversation, instagramSettings?.prompt);
  }
}

// Handle question flow for Messenger
async function handleQuestionFlow(instagramPage: any, sender: string, questionFlow: any, conversation: any): Promise<void> {
  const { nodes, edges } = questionFlow;
  
  // Find the top parent node (node with no incoming edges)
  //@ts-ignore
  const childNodeIds = new Set(edges.map(edge => edge.target));
  //@ts-ignore
  const topParentNode = nodes.find(node => !childNodeIds.has(node.id));
  
  const nodeMessage = topParentNode.data.message || '';
  const nodeOptions = topParentNode.data.options || [];
  const nodeQuestion = topParentNode.data.question || '';
  const nodeImage = topParentNode.data.image || '';
  
  // Send initial message
  if (nodeMessage) {
    await sendMessage(instagramPage.pageId, instagramPage.access_token, sender, nodeMessage);
    conversation.messages.push({ role: "assistant", content: nodeMessage });
  }
  
  // Send image if available
  if (nodeImage) {
    await sendTypingIndicator(instagramPage.pageId, instagramPage.access_token, sender);
    await sendImage(instagramPage.pageId, instagramPage.access_token, sender, nodeImage);
    await sleep(2000);
    
    conversation.messages.push({
      role: "assistant",
      content: JSON.stringify({
        type: "image",
        image: nodeImage
      })
    });
  }
  
  // Send buttons if available
  if (nodeOptions.length > 0) {
    await sendTypingIndicator(instagramPage.pageId, instagramPage.access_token, sender);
    
    // Create button payload for logging
    const buttonsPayloadForLogging = {
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: nodeQuestion },
        action: {
          buttons: nodeOptions.slice(0, 3).map((option: string, index: number) => ({
            type: "reply",
            reply: {
              id: `${topParentNode.id}-option-${index}`,
              title: option
            }
          }))
        }
      }
    };
    
    // Send buttons to Instagram
    await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, {
      recipient: { id: sender },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: 'button',
            text: nodeQuestion,
            buttons: nodeOptions.slice(0, 3).map((option: string, index: number) => ({
              type: "postback",
              title: option,
              payload: `${topParentNode.id}-option-${index}`,
            }))
          },
        }
      }
    }, {
      headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });
    
    conversation.messages.push({ role: "assistant", content: JSON.stringify(buttonsPayloadForLogging) });
  }
  
  await conversation.save();
}

// Handle AI response for Messenger
async function handleAIResponse(
  instagramPage: any, 
  chatbotId: string, 
  sender: string, 
  text: string, 
  conversation: any, 
  prompt: string
): Promise<void> {
  // Get recent messages (last hour)
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  //@ts-ignore
  let messages = conversation.messages.filter(msg => new Date(msg.timestamp).getTime() >= oneHourAgo);
  
  // Ensure at least the current message is included
  if (messages.length === 0) {
    messages = [{ role: 'user', content: text }];
  }
  
  // Get AI response
  const response_text = await getAIResponse(chatbotId, messages, text, prompt);
  
  // Send response
  await sendMessage(instagramPage.pageId, instagramPage.access_token, sender, response_text);
  
  // Update conversation
  conversation.messages.push({ role: "assistant", content: response_text });
  await conversation.save();
}

// Handle Messenger postbacks (button clicks)
async function handleMessengerPostback(instagramPage: any, chatbotId: string, sender: string, messaging: any): Promise<void> {
  const text = messaging.postback.title;
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
    text
  );
  
  // Process question flow if enabled
  if (dataset.questionFlowEnable && dataset.questionFlow) {
    const { nodes, edges } = (dataset.questionFlow && dataset.questionFlow.nodes && dataset.questionFlow.edges) 
      ? dataset.questionFlow 
      : sampleFlow;
    
    // Find the next node based on the selected option
    //@ts-ignore
    const nextEdge = edges.find(edge => edge.source === node_id && edge.sourceHandle === option_index);
    //@ts-ignore
    const nextNode = nodes.find(node => node.id === nextEdge?.target);
    
    if (nextNode) {
      const nodeMessage = nextNode.data.message || '';
      const nodeQuestion = nextNode.data.question || '';
      const nodeOptions = nextNode.data.options || [];
      const nodeImage = nextNode.data.image || '';
      
      // Send typing indicator
      await sendTypingIndicator(instagramPage.pageId, instagramPage.access_token, sender);
      
      // Send message
      if (nodeMessage) {
        await sendMessage(instagramPage.pageId, instagramPage.access_token, sender, nodeMessage);
        conversation.messages.push({ role: "assistant", content: nodeMessage });
      }
      
      // Send image if available
      if (nodeImage) {
        await sendTypingIndicator(instagramPage.pageId, instagramPage.access_token, sender);
        await sendImage(instagramPage.pageId, instagramPage.access_token, sender, nodeImage);
        await sleep(2000);
        
        conversation.messages.push({
          role: "assistant",
          content: JSON.stringify({
            type: "image",
            image: nodeImage
          })
        });
      }
      
      // Send buttons if available
      if (nodeOptions.length > 0) {
        await sendTypingIndicator(instagramPage.pageId, instagramPage.access_token, sender);
        
        // Create button payload for logging
        const buttonsPayloadForLogging = {
          type: "interactive",
          interactive: {
            type: "button",
            body: { text: nodeQuestion },
            action: {
              buttons: nodeOptions.slice(0, 3).map((option: string, index: number) => ({
                type: "reply",
                reply: {
                  id: `${nextNode.id}-option-${index}`,
                  title: option
                }
              }))
            }
          }
        };
        
        // Send buttons to Instagram
        await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, {
          recipient: { id: sender },
          message: {
            attachment: {
              type: "template",
              payload: {
                template_type: 'button',
                text: nodeQuestion,
                buttons: nodeOptions.slice(0, 3).map((option: string, index: number) => ({
                  type: "postback",
                  title: option,
                  payload: `${nextNode.id}-option-${index}`,
                }))
              },
            }
          }
        }, {
          headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
        });
        
        conversation.messages.push({ role: "assistant", content: JSON.stringify(buttonsPayloadForLogging) });
      }
      
      await conversation.save();
    }
  }
}

// Handle comment events
async function handleCommentEvent(data: any): Promise<any> {
  const page_id = data.entry[0].id;
  const from = data.entry[0].changes[0].value.from.id;
  const from_name = data.entry[0].changes[0].value.from.username;
  const media_id = data.entry[0].changes[0].value.media_id;
  const comment_id = data.entry[0].changes[0].value.id;
  const parent_id = data.entry[0].changes[0].value.parent_id;
  const text = data.entry[0].changes[0].value.text;
  
  // Skip if comment is from the page itself
  if (page_id == from) {
    return { status: "Skip for same source." };
  }
  
  // Skip replies to comments
  if (parent_id) {
    return { status: "Skip for reply comments." };
  }
  
  // Get Instagram page
  const instagramPage = await getInstagramPage(page_id);
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
    { from_name, page_id, comment_id }
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
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  //@ts-ignore
  let messages = conversation.messages.filter(msg => new Date(msg.timestamp).getTime() >= oneHourAgo);
  
  // Ensure at least the current message is included
  if (messages.length === 0) {
    messages = [{ role: 'user', content: text }];
  }
  
  // Get AI response
  const response_text = await getAIResponse(chatbotId, messages, text, instagramSettings?.prompt1);
  
  // Apply delay if configured
  const delay = instagramSettings?.delay1;
  if (delay && delay > 0) {
    await sleep(delay * 1000);
  }
  
  // Reply to the comment
  await axios.post(`https://graph.facebook.com/v22.0/${comment_id}/replies?access_token=${instagramPage.access_token}`, {
    message: `@${from_name} ${response_text}`
  }, {
    headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
  });
  
  // Update conversation
  conversation.messages.push({ role: "assistant", content: response_text });
  await conversation.save();
}

// Handle DM reactions to comments
async function handleCommentDM(
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
    conversation.messages.push({ role: "assistant", content: response_text });
    await conversation.save();
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
        conversation.messages.push({ role: "assistant", content: response_text });
        await conversation.save();
        
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
    conversation.messages.push({ role: "assistant", content: response_text });
    await conversation.save();
  }
}

// Handle like events
async function handleLikeEvent(data: any): Promise<any> {
  const page_id = data.entry[0].id;
  const from = data.entry[0].changes[0].value.user_id;
  const media_id = data.entry[0].changes[0].value.media_id;
  
  // Get Instagram page
  const instagramPage = await getInstagramPage(page_id);
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
    conversation.messages.push({ role: "assistant", content: promptText });
    await conversation.save();

    return { status: "Like DM sent." };
  }
  
  return { status: "Like DM not enabled." };
}
