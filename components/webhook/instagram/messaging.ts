import axios from 'axios';
import { sleep } from '@/libs/utils';

// Helper function to send typing indicator
export async function sendTypingIndicator(pageId: string, accessToken: string, recipientId: string): Promise<void> {
  try {
    return;
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
export async function sendMessage(pageId: string, accessToken: string, recipientId: string, text: string): Promise<boolean> {
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
export async function sendImage(pageId: string, accessToken: string, recipientId: string, imageUrl: string): Promise<boolean> {
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

// Helper function to send buttons
export async function sendButtons(pageId: string, accessToken: string, recipientId: string, text: string, options: string[], nodeId: string): Promise<boolean> {
  try {
    await axios.post(`https://graph.facebook.com/v22.0/${pageId}/messages?access_token=${accessToken}`, {
      recipient: { id: recipientId },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: 'button',
            text: text,
            buttons: options.slice(0, 3).map((option: string, index: number) => ({
              type: "postback",
              title: option,
              payload: `${nodeId}-option-${index}`,
            }))
          },
        }
      }
    }, {
      headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });
    return true;
  } catch (error) {
    console.error('Error sending buttons:', error);
    return false;
  }
}

// Helper function to reply to a comment
export async function replyToComment(commentId: string, accessToken: string, username: string, text: string): Promise<boolean> {
  try {
    await axios.post(`https://graph.facebook.com/v22.0/${commentId}/replies?access_token=${accessToken}`, {
      message: `@${username} ${text}`
    }, {
      headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });
    return true;
  } catch (error) {
    console.error('Error replying to comment:', error);
    return false;
  }
}

// Helper function to create button payload for logging
export function createButtonPayloadForLogging(nodeId: string, question: string, options: string[]): any {
  return {
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: question },
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
}
