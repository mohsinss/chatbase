/**
 * Service for WhatsApp API interactions
 */
import axios from 'axios';
import { sleep } from '@/libs/utils';
import { applyMessageDelay } from '../handlers/interactive';

/**
 * Mark a message as read
 */
export async function markMessageAsRead(phoneNumberId: string, messageId: string): Promise<any> {
  return axios.post(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
    messaging_product: "whatsapp",
    status: "read",
    message_id: messageId
  }, {
    headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
  });
}

/**
 * Send a text message
 */
export async function sendTextMessage(phoneNumberId: string, to: string, text: string): Promise<any> {
  return axios.post(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
    messaging_product: "whatsapp",
    to: to,
    text: {
      body: text
    }
  }, {
    headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
  });
}

/**
 * Send an image message
 */
export async function sendImageMessage(phoneNumberId: string, to: string, imageUrl: string): Promise<any> {
  return axios.post(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
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
}

/**
 * Send a link message
 */
export async function sendUrlButtonMessage(
  phoneNumberId: string,
  to: string,
  bodyText: string,
  buttonTitle: string,
  url: string
): Promise<any> {
  return axios.post(
    `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
    {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      type: "interactive",
      to: to,
      interactive: {
        type: "cta_url",  // For URL buttons
        body: {
          text: bodyText
        },
        action: {
          name: "cta_url",
          parameters: {
            display_text: buttonTitle,
            url: url
          }
        }
      }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
}

/**
 * Send an interactive button message
 */
export async function sendButtonMessage(
  phoneNumberId: string, 
  to: string, 
  questionText: string, 
  options: string[], 
  nodeId: string
): Promise<any> {
  // Construct interactive button message payload
  const buttonsPayload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: to,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: questionText
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

  // Send interactive button message
  return axios.post(
    `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
    buttonsPayload, 
    {
      headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    }
  );
}

/**
 * Send a node's content (message, image, and buttons if applicable)
 */
export async function sendNodeContent(
  phoneNumberId: string,
  to: string,
  nodeId: string,
  nodeMessage: string,
  nodeQuestion: string = '',
  nodeOptions: string[] = [],
  nodeImage: string = ''
): Promise<any[]> {
  const responses = [];

  // Send text message
  if (nodeMessage) {
    const textResponse = await sendTextMessage(phoneNumberId, to, nodeMessage);
    responses.push({ type: 'text', response: textResponse });
  }

  // Send image if present
  if (nodeImage) {
    const imageResponse = await sendImageMessage(phoneNumberId, to, nodeImage);
    responses.push({ type: 'image', response: imageResponse });
    
    // Add a small delay after sending image
    await sleep(2000);
  }

  // Send buttons if options are present
  if (nodeOptions.length > 0 && nodeQuestion) {
    const buttonResponse = await sendButtonMessage(phoneNumberId, to, nodeQuestion, nodeOptions, nodeId);
    responses.push({ type: 'button', response: buttonResponse });
  }

  return responses;
}


/**
 * Parse the responseText and send messages accordingly.
 * This function is reusable for other handlers.
 */
export async function sendParsedResponseMessages(phoneNumberId: string, from: string, responseText: string): Promise<void> {
  try {
    const parsed = JSON.parse(responseText);

    switch (parsed.type) {
      case 'text':
        await applyMessageDelay();
        await sendTextMessage(phoneNumberId, from, parsed.text);
        break;
      case 'actions':
        for (const item of parsed.items) {
          await applyMessageDelay();
          if (item.type == "button") {
            // Send URL button message
            await sendUrlButtonMessage(
              phoneNumberId,
              from,
              item.description || "Click the button below:", // Body text
              item.text || "Open Link",       // Button text
              item.url                               // URL to open
            );
          } else {
            // Default text handling
            await sendTextMessage(phoneNumberId, from, JSON.stringify(item));
          }
        }
        break;
      case 'products':
        break;
      default:
        break;
    }
  } catch {
    await sendTextMessage(phoneNumberId, from, "sth went wrong, contact with support team, :)\n" + responseText);
  }
}