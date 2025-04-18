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
  datasets: new Map<string, CacheEntry<any>>(),
  whatsappNumbers: new Map<string, CacheEntry<any>>(),
  lastCleanup: Date.now()
};

// Clean up expired cache entries
function cleanupCache(): void {
  const now = Date.now();
  if (now - cache.lastCleanup > CACHE_TTL) {
    // Use Array.from to avoid iterator issues
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

// Helper function to get WhatsApp number with caching
async function getWhatsAppNumber(phoneNumberId: string): Promise<any> {
  return getCachedOrFetch(
    cache.whatsappNumbers,
    phoneNumberId,
    async () => await WhatsAppNumber.findOne({ phoneNumberId })
  );
}

// Helper function to get dataset with caching
async function getDataset(chatbotId: string): Promise<any> {
  return getCachedOrFetch(
    cache.datasets,
    chatbotId,
    async () => await Dataset.findOne({ chatbotId })
  );
}

// Helper function to get settings from WhatsAppNumber model
function getSettings(whatsappNumber: any): any {
  return whatsappNumber.settings || {};
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
async function sendButtonMessage(phone_number_id: string, to: string, question: string, options: string[], nodeId: string): Promise<any> {
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

    const response = await axios.post(`https://graph.facebook.com/v22.0/${phone_number_id}/messages`,
      buttonsPayload, {
      headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });
    
    return { response, buttonsPayload };
  } catch (error) {
    console.error('Error sending button message:', error);
    return { error };
  }
}

// Helper function to log webhook data
async function logWebhookData(data: any, endpoint: string): Promise<void> {
  if (process.env.ENABLE_WEBHOOK_LOGGING_WHATSAPP == "1") {
    try {
      const response = await fetch(endpoint, {
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
    await logWebhookData(data, 'http://webhook.mrcoders.org/whatsapp.php');

    if (!data?.entry?.length || !data?.entry[0]?.changes?.length) {
      return NextResponse.json({ status: 'No valid entries found' }, { status: 200 });
    }

    const entry = data.entry[0];
    const change = entry.changes[0];
    
    if (!change.value?.messages?.length) {
      return NextResponse.json({ status: 'No messages found' }, { status: 200 });
    }

    await connectMongo();
    
    const message = change.value.messages[0];
    const messageType = message.type;

    // Handle text messages
    if (messageType === "text") {
      await handleTextMessage(message, change.value.metadata);
    } 
    // Handle interactive messages (button replies)
    else if (messageType === "interactive" && message.interactive.type === "button_reply") {
      await handleButtonReply(message, change.value.metadata);
    }

    // Respond with a 200 OK status
    return NextResponse.json({ status: 'OK' }, { status: 200 });
  } catch (error: any) {
    console.error('Error processing webhook event:', error);

    // Log error to external service if configured
    await logWebhookData(error, 'http://webhook.mrcoders.org/whatsapp-error.php');
    
    // Always return 200 to acknowledge receipt to WhatsApp platform
    return NextResponse.json({ error: 'An error occurred processing the webhook' }, { status: 200 });
  }
}

// Handle text messages
async function handleTextMessage(message: any, metadata: any): Promise<any> {
  const from = message.from;
  const phone_number_id = metadata.phone_number_id;
  const message_id = message.id;
  const timestamp = message.timestamp;
  const currentTimestamp = (new Date().getTime()) / 1000;
  const text = message.text.body;

  // Skip if message is too old
  if (timestamp + 60 < currentTimestamp) {
    return { status: 'Delivery denied due to long delay' };
  }

  // Fetch the existing WhatsAppNumber model with caching
  const whatsappNumber = await getWhatsAppNumber(phone_number_id);
  if (!whatsappNumber) {
    return { status: "WhatsApp Number doesn't registered to the site." };
  }

  const chatbotId = whatsappNumber.chatbotId;

  // Get WhatsApp settings from WhatsAppNumber model
  const whatsappSettings = getSettings(whatsappNumber);
  const { prompt: updatedPrompt, delay } = whatsappSettings;

  // Apply delay if configured
  if (delay && delay > 0) {
    await sleep(delay * 1000);
  }

  // Find existing conversation or create a new one
  let conversation = await ChatbotConversation.findOne({ 
    chatbotId, 
    platform: "whatsapp", 
    "metadata.from": from, 
    "metadata.to": whatsappNumber.display_phone_number 
  });
  
  let triggerQF = false;

  // Get dataset with caching
  const dataset = await getDataset(chatbotId);
  const { questionFlow, questionFlowEnable, questionAIResponseEnable, restartQFTimeoutMins } = dataset;
  const isAiResponseEnabled = questionAIResponseEnable !== undefined ? questionAIResponseEnable : true;

  if (conversation) {
    const lastMessageContent = conversation.messages[conversation.messages.length - 1].content;
    try {
      JSON.parse(lastMessageContent);
      triggerQF = true; // Set triggerQF to true if parsing succeeds (content is JSON)
    } catch (e) {
      // Content is not JSON, do nothing
    }

    // Update existing conversation
    conversation.messages.push({ role: "user", content: text });
    const lastMessageTimestamp = conversation.updatedAt.getTime() / 1000;
    if (currentTimestamp - lastMessageTimestamp > restartQFTimeoutMins * 60) {
      triggerQF = true;
    }
    if (!isAiResponseEnabled) {
      triggerQF = true;
    }
  } else {
    // Create new conversation
    conversation = new ChatbotConversation({
      chatbotId,
      platform: "whatsapp",
      disable_auto_reply: false,
      metadata: { from, to: whatsappNumber.display_phone_number },
      messages: [{ role: "user", content: text }]
    });

    triggerQF = true;
  }

  await conversation.save();

  // Skip if auto-reply is disabled
  if (conversation?.disable_auto_reply === true) {
    return { status: "Auto response is disabled." };
  }

  // Mark message as read
  await markMessageAsRead(phone_number_id, message_id);

  // Handle question flow or AI response
  if (questionFlowEnable && questionFlow && triggerQF) {
    await handleQuestionFlow(phone_number_id, from, questionFlow, conversation);
  } else {
    await handleAIResponse(phone_number_id, from, chatbotId, text, conversation, updatedPrompt);
  }

  return { status: 'Message processed successfully' };
}

// Handle question flow
async function handleQuestionFlow(phone_number_id: string, from: string, questionFlow: any, conversation: any): Promise<void> {
  const { nodes, edges } = questionFlow;
  
  // Find the top parent node (node with no incoming edges)
  const childNodeIds = new Set(edges.map((edge: any) => edge.target));
  const topParentNode = nodes.find((node: any) => !childNodeIds.has(node.id));
  
  const nodeMessage = topParentNode.data.message || '';
  const nodeOptions = topParentNode.data.options || [];
  const nodeQuestion = topParentNode.data.question || '';
  const nodeImage = topParentNode.data.image || '';
  
  // Send initial message
  if (nodeMessage) {
    await sendTextMessage(phone_number_id, from, nodeMessage);
    conversation.messages.push({ role: "assistant", content: nodeMessage });
  }
  
  // Send image if available
  if (nodeImage) {
    await sendImageMessage(phone_number_id, from, nodeImage);
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
    const { buttonsPayload } = await sendButtonMessage(
      phone_number_id, 
      from, 
      nodeQuestion, 
      nodeOptions, 
      topParentNode.id
    );
    
    conversation.messages.push({ role: "assistant", content: JSON.stringify(buttonsPayload) });
  }
  
  await conversation.save();
}

// Handle AI response
async function handleAIResponse(
  phone_number_id: string,
  from: string,
  chatbotId: string, 
  text: string, 
  conversation: any, 
  prompt: string
): Promise<void> {
  // Get recent messages (last hour)
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  let messages = conversation.messages.filter((msg: any) => 
    new Date(msg.timestamp).getTime() >= oneHourAgo
  );
  
  // Ensure at least the current message is included
  if (messages.length === 0) {
    messages = [{ role: 'user', content: text }];
  }
  
  // Get AI response
  const response_text = await getAIResponse(chatbotId, messages, text, prompt);
  
  // Send response
  await sendTextMessage(phone_number_id, from, response_text);
  
  // Update conversation
  conversation.messages.push({ role: "assistant", content: response_text });
  await conversation.save();
}

// Handle button replies
async function handleButtonReply(message: any, metadata: any): Promise<any> {
  const from = message.from;
  const phone_number_id = metadata.phone_number_id;
  const message_id = message.id;
  
  const button_reply = message.interactive.button_reply;
  const button_id = button_reply.id;
  const button_title = button_reply.title;
  const node_id = button_id.split('-')[0];
  const option_index = button_id.split('-').pop();
  
  // Fetch the existing WhatsAppNumber model with caching
  const whatsappNumber = await getWhatsAppNumber(phone_number_id);
  if (!whatsappNumber) {
    return { status: "WhatsApp Number doesn't registered to the site." };
  }
  
  const chatbotId = whatsappNumber.chatbotId;
  
  // Get WhatsApp settings from WhatsAppNumber model
  const whatsappSettings = getSettings(whatsappNumber);
  const { delay } = whatsappSettings;
  
  // Apply delay if configured
  if (delay && delay > 0) {
    await sleep(delay * 1000);
  }
  
  // Find existing conversation
  const conversation = await ChatbotConversation.findOne({ 
    chatbotId, 
    platform: "whatsapp", 
    "metadata.from": from, 
    "metadata.to": whatsappNumber.display_phone_number 
  });
  
  if (!conversation) {
    return { status: "Can't find conversation for this button reply, something went wrong." };
  }
  
  // Update conversation with user's button selection
  conversation.messages.push({ role: "user", content: button_title });
  await conversation.save();
  
  // Mark message as read
  await markMessageAsRead(phone_number_id, message_id);
  
  // Get dataset with caching
  const dataset = await getDataset(chatbotId);
  const { questionFlow, questionFlowEnable } = dataset;
  
  // Process question flow if enabled
  if (questionFlowEnable && questionFlow) {
    const { nodes, edges } = (questionFlow && questionFlow.nodes && questionFlow.edges) 
      ? questionFlow 
      : sampleFlow;
    
    // Find the next node based on the selected option
    const nextEdge = edges.find((edge: any) => 
      edge.source === node_id && edge.sourceHandle === option_index
    );
    
    const nextNode = nodes.find((node: any) => node.id === nextEdge?.target);
    
    if (nextNode) {
      const nodeMessage = nextNode.data.message || '';
      const nodeQuestion = nextNode.data.question || '';
      const nodeOptions = nextNode.data.options || [];
      const nodeImage = nextNode.data.image || '';
      
      // Send message
      if (nodeMessage) {
        await sendTextMessage(phone_number_id, from, nodeMessage);
        conversation.messages.push({ role: "assistant", content: nodeMessage });
      }
      
      // Send image if available
      if (nodeImage) {
        await sendImageMessage(phone_number_id, from, nodeImage);
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
        const { buttonsPayload } = await sendButtonMessage(
          phone_number_id, 
          from, 
          nodeQuestion, 
          nodeOptions, 
          nextNode.id
        );
        
        conversation.messages.push({ role: "assistant", content: JSON.stringify(buttonsPayload) });
      }
      
      await conversation.save();
    }
  }
  
  return { status: 'Button reply processed successfully' };
}
