// src/app/api/webhook/whatsapp/route.ts
import axios from 'axios';
import WhatsAppNumber from '@/models/WhatsAppNumber';
import connectMongo from "@/libs/mongoose";
import { NextRequest, NextResponse } from 'next/server';
import ChatbotConversation from '@/models/ChatbotConversation';
import { getAIResponse } from '@/libs/utils-ai';
import Dataset from '@/models/Dataset';
import { sleep } from '@/libs/utils';
import Chatbot from '@/models/Chatbot';
import { sampleFlow } from '@/types';

// Types for better type safety
type CacheEntry<T> = { data: T; timestamp: number };
type CacheMap<T> = Map<string, CacheEntry<T>>;

// Cache for frequently accessed data
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const cache = {
  chatbots: new Map<string, CacheEntry<any>>(),
  datasets: new Map<string, CacheEntry<any>>(),
  whatsappNumbers: new Map<string, CacheEntry<any>>(),
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
    
    Array.from(cache.whatsappNumbers.entries()).forEach(([key, { timestamp }]) => {
      if (now - timestamp > CACHE_TTL) cache.whatsappNumbers.delete(key);
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

// Helper function to get WhatsApp number
async function getWhatsAppNumber(phoneNumberId: string): Promise<any> {
  return getCachedOrFetch(
    cache.whatsappNumbers,
    phoneNumberId,
    async () => await WhatsAppNumber.findOne({ phoneNumberId })
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

// Helper function to get settings from WhatsAppNumber model
async function getSettings(whatsappNumber: any): Promise<any> {
  return whatsappNumber.settings || {};
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

// Helper function to mark message as read
async function markMessageAsRead(phone_number_id: string, message_id: string): Promise<void> {
  try {
    await axios.post(`https://graph.facebook.com/v22.0/${phone_number_id}/messages`, {
      messaging_product: "whatsapp",
      status: "read",
      message_id
    }, {
      headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    // Continue execution even if marking as read fails
  }
}

// Helper function to send text message
async function sendTextMessage(phone_number_id: string, to: string, text: string): Promise<boolean> {
  try {
    await axios.post(`https://graph.facebook.com/v22.0/${phone_number_id}/messages`, {
      messaging_product: "whatsapp",
      to: to,
      text: {
        body: text
      }
    }, {
      headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });
    return true;
  } catch (error) {
    console.error('Error sending text message:', error);
    return false;
  }
}

// Helper function to send image message
async function sendImageMessage(phone_number_id: string, to: string, imageUrl: string): Promise<boolean> {
  try {
    await axios.post(`https://graph.facebook.com/v22.0/${phone_number_id}/messages`, {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      type: "image",
      to: to,
      image: {
        link: imageUrl
      }
    }, {
      headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });
    return true;
  } catch (error) {
    console.error('Error sending image message:', error);
    return false;
  }
}

// Helper function to send interactive button message
async function sendButtonMessage(phone_number_id: string, to: string, question: string, options: string[], nodeId: string): Promise<boolean> {
  try {
    const buttonsPayload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: question
        },
        action: {
          buttons: options.slice(0, 3).map((option: string, index: number) => ({
            type: "reply",
            reply: {
              id: `${nodeId}-option-${index}`,
              title: option
            }
          }))
        }
      }
    };

    await axios.post(`https://graph.facebook.com/v22.0/${phone_number_id}/messages`,
      buttonsPayload, {
      headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });
    return true;
  } catch (error) {
    console.error('Error sending button message:', error);
    return false;
  }
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
    if (process.env.ENABLE_WEBHOOK_LOGGING_WHATSAPP == "1") {
      try {
        const response = await fetch('http://webhook.mrcoders.org/whatsapp.php', {
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

    // Handle text messages
    if (data.entry[0]?.changes?.length > 0 && 
        data.entry[0]?.changes[0].value?.messages?.length > 0) {
      
      // Handle text messages
      if (data.entry[0].changes[0].value.messages[0].type === "text") {
        await handleTextMessage(data);
      }
      // Handle interactive messages (button replies)
      else if (data.entry[0].changes[0].value.messages[0].type === "interactive") {
        if (data.entry[0].changes[0].value.messages[0].interactive.type === "button_reply") {
          await handleButtonReply(data);
        }
      }
    }

    // Respond with a 200 OK status
    return NextResponse.json({ status: 'OK' }, { status: 200 });
  } catch (error: any) {
    console.error('Error processing webhook event:', error);

    if (process.env.ENABLE_WEBHOOK_LOGGING_WHATSAPP == "1") {
      try {
        await fetch('http://webhook.mrcoders.org/whatsapp-error.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(error),
        });
      } catch (logError) {
        console.error('Error logging webhook error:', logError);
      }
    }
    
    // Always return 200 to WhatsApp to prevent retries
    return NextResponse.json({ error: error.message }, { status: 200 });
  }
}

// Handle text messages
async function handleTextMessage(data: any): Promise<any> {
  const from = data.entry[0].changes[0].value.messages[0].from;
  const phone_number_id = data.entry[0].changes[0].value.metadata.phone_number_id;
  const message_id = data.entry[0].changes[0].value.messages[0].id;
  const timestamp = data.entry[0].changes[0].value.messages[0].timestamp;
  const currentTimestamp = (new Date().getTime()) / 1000;
  const text = data.entry[0].changes[0].value.messages[0].text.body;

  // Skip if message is too old
  if (timestamp + 60 < currentTimestamp) {
    return { status: 'Delivery denied due to long delay' };
  }

  // Fetch the existing WhatsAppNumber model
  const whatsappNumber = await getWhatsAppNumber(phone_number_id);
  if (!whatsappNumber) {
    return { status: "WhatsApp Number doesn't registered to the site." };
  }

  const chatbotId = whatsappNumber.chatbotId;

  // Get WhatsApp settings from WhatsAppNumber model
  const whatsappSettings = await getSettings(whatsappNumber);
  const { prompt: updatedPrompt, delay } = whatsappSettings;

  // Apply delay if configured
  if (delay && delay > 0) {
    await sleep(delay * 1000);
  }

  // Find or create conversation
  const { conversation, isNew } = await findOrCreateConversation(
    chatbotId, 
    "whatsapp", 
    from, 
    whatsappNumber.display_phone_number, 
    text
  );

  // Skip if auto-reply is disabled
  if (conversation?.disable_auto_reply) {
    return { status: "Auto response is disabled." };
  }

  // Mark message as read
  await markMessageAsRead(phone_number_id, message_id);

  // Get dataset
  const dataset = await getDataset(chatbotId);
  const { questionFlow, questionFlowEnable, questionAIResponseEnable, restartQFTimeoutMins } = dataset;
  const isAiResponseEnabled = questionAIResponseEnable !== undefined ? questionAIResponseEnable : true;

  // Determine if we should use question flow
  let triggerQF = isNew;
  
  if (!isNew) {
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
  if (questionFlowEnable && questionFlow && triggerQF) {
    await handleQuestionFlow(whatsappNumber, from, questionFlow, conversation);
  } else {
    await handleAIResponse(whatsappNumber, chatbotId, from, text, conversation, updatedPrompt);
  }
}

// Handle question flow
async function handleQuestionFlow(whatsappNumber: any, from: string, questionFlow: any, conversation: any): Promise<void> {
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
    await sendTextMessage(whatsappNumber.phoneNumberId, from, nodeMessage);
    conversation.messages.push({ role: "assistant", content: nodeMessage });
  }
  
  // Send image if available
  if (nodeImage) {
    await sendImageMessage(whatsappNumber.phoneNumberId, from, nodeImage);
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
    
    // Send buttons
    await sendButtonMessage(whatsappNumber.phoneNumberId, from, nodeQuestion, nodeOptions, topParentNode.id);
    
    conversation.messages.push({ role: "assistant", content: JSON.stringify(buttonsPayloadForLogging) });
  }
  
  await conversation.save();
}

// Handle AI response
async function handleAIResponse(
  whatsappNumber: any, 
  chatbotId: string, 
  from: string, 
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
  await sendTextMessage(whatsappNumber.phoneNumberId, from, response_text);
  
  // Update conversation
  conversation.messages.push({ role: "assistant", content: response_text });
  await conversation.save();
}

// Handle button replies
async function handleButtonReply(data: any): Promise<any> {
  const from = data.entry[0].changes[0].value.messages[0].from;
  const phone_number_id = data.entry[0].changes[0].value.metadata.phone_number_id;
  const message_id = data.entry[0].changes[0].value.messages[0].id;
  
  const button_id = data.entry[0].changes[0].value.messages[0].interactive.button_reply.id;
  const button_title = data.entry[0].changes[0].value.messages[0].interactive.button_reply.title;
  const node_id = button_id.split('-')[0];
  const option_index = button_id.split('-').pop();
  
  // Fetch the existing WhatsAppNumber model
  const whatsappNumber = await getWhatsAppNumber(phone_number_id);
  if (!whatsappNumber) {
    return { status: "WhatsApp Number doesn't registered to the site." };
  }
  
  const chatbotId = whatsappNumber.chatbotId;
  
  // Get WhatsApp settings from WhatsAppNumber model
  const whatsappSettings = await getSettings(whatsappNumber);
  const { delay } = whatsappSettings;
  
  // Apply delay if configured
  if (delay && delay > 0) {
    await sleep(delay * 1000);
  }
  
  // Find existing conversation
  const { conversation } = await findOrCreateConversation(
    chatbotId, 
    "whatsapp", 
    from, 
    whatsappNumber.display_phone_number, 
    button_title
  );
  
  if (!conversation) {
    return { status: "Can't find conversation for this button reply, something went wrong." };
  }
  
  // Mark message as read
  await markMessageAsRead(phone_number_id, message_id);
  
  // Get dataset
  const dataset = await getDataset(chatbotId);
  const { questionFlow, questionFlowEnable } = dataset;
  
  // Process question flow if enabled
  if (questionFlowEnable && questionFlow) {
    const { nodes, edges } = (questionFlow && questionFlow.nodes && questionFlow.edges) 
      ? questionFlow 
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
      
      // Send message
      if (nodeMessage) {
        await sendTextMessage(whatsappNumber.phoneNumberId, from, nodeMessage);
        conversation.messages.push({ role: "assistant", content: nodeMessage });
      }
      
      // Send image if available
      if (nodeImage) {
        await sendImageMessage(whatsappNumber.phoneNumberId, from, nodeImage);
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
        
        // Send buttons
        await sendButtonMessage(whatsappNumber.phoneNumberId, from, nodeQuestion, nodeOptions, nextNode.id);
        
        conversation.messages.push({ role: "assistant", content: JSON.stringify(buttonsPayloadForLogging) });
      }
      
      await conversation.save();
    }
  }
}
