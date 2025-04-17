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

    if (process.env.ENABLE_WEBHOOK_LOGGING_INSTAGRAM == "1") {
      // Send data to the specified URL for logging
      const response = await fetch('http://webhook.mrcoders.org/instagram.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    if (data?.entry?.length > 0) {
      // Handle direct messages
      if (data?.entry[0]?.messaging?.length > 0) {
        // Handle normal message
        if (data?.entry[0]?.messaging[0].message?.text?.length > 0) {
          await connectMongo();

          const page_id = data?.entry[0].id;
          const sender = data?.entry[0]?.messaging[0].sender.id;
          const recipient = data?.entry[0]?.messaging[0].recipient.id;
          const timestamp = data?.entry[0]?.messaging[0].timestamp;
          const text = data?.entry[0]?.messaging[0].message.text;
          const mid = data?.entry[0]?.messaging[0].message.mid;
          const currentTimestamp = (new Date().getTime()) / 1000;

          // Fetch the existing InstagramPage model
          const instagramPage = await InstagramPage.findOne({ pageId: recipient });
          if (!instagramPage) {
            // Respond with a 200 OK status
            return NextResponse.json({ status: "Instagram page doesn't registered to the site." }, { status: 200 });
          }

          if (page_id == sender) {
            return NextResponse.json({ status: "Skip for same source." }, { status: 200 });
          }

          const chatbotId = instagramPage.chatbotId;

          const chatbot = await Chatbot.findOne({ chatbotId });
          const updatedPrompt = chatbot.settings?.instagram?.prompt;
          const delay = chatbot.settings?.instagram?.delay;

          if (delay && delay > 0) {
            await sleep(delay * 1000); // delay is in seconds, converting to milliseconds
          }

          // Find existing conversation or create a new one
          let conversation = await ChatbotConversation.findOne({ chatbotId, platform: "instagram", "metadata.from": sender, "metadata.to": instagramPage.name });
          let triggerQF = false;

          const dataset = await Dataset.findOne({ chatbotId });
          const { questionFlow, questionFlowEnable, questionAIResponseEnable, restartQFTimeoutMins } = dataset;
          const isAiResponseEnabled = questionAIResponseEnable !== undefined ? questionAIResponseEnable : true;

          if (conversation) {
            // Update existing conversation
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
              platform: "instagram",
              disable_auto_reply: false,
              metadata: { from: sender, to: instagramPage.name },
              messages: [{ role: "user", content: text },]
            });

            triggerQF = true;
          }

          await conversation.save();

          if (conversation?.disable_auto_reply == true) {
            return NextResponse.json({ status: "Auto reponse is disabled." }, { status: 200 });
          }

          if (timestamp + 60 < currentTimestamp) {
            return NextResponse.json({ status: 'Delivery denied due to long delay' }, { status: 200 });
          }

          // send typing action
          const response1 = await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, {
            recipient: {
              id: sender
            },
            sender_action: "typing_on"
          }, {
            headers: { Authorization: `Bearer ${process.env.INSTAGRAM_USER_ACCESS_TOKEN}` }
          });

          if (questionFlowEnable && questionFlow && triggerQF) {
            const { nodes, edges } = questionFlow;

            //@ts-ignore
            const childNodeIds = new Set(edges.map(edge => edge.target));
            //@ts-ignore
            const topParentNode = nodes.find(node => !childNodeIds.has(node.id));
            const nodeMessage = topParentNode.data.message || '';
            const nodeOptions = topParentNode.data.options || [];
            const nodeQuestion = topParentNode.data.question || '';
            const nodeImage = topParentNode.data.image || '';

            if (nodeOptions.length > 0) {
              // Construct interactive button message payload
              const buttonsPayloadForLogging = {
                type: "interactive",
                interactive: {
                  type: "button",
                  body: {
                    text: nodeQuestion
                  },
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
              const buttonsPayload = {
                recipient: {
                  id: sender
                },
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
              };

              // send text msg to from number
              const response_msg = await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, {
                recipient: {
                  id: sender
                },
                message: {
                  text: nodeMessage
                },
                messaging_type: "RESPONSE",
              }, {
                headers: { Authorization: `Bearer ${process.env.INSTAGRAM_USER_ACCESS_TOKEN}` }
              });
              conversation.messages.push({ role: "assistant", content: nodeMessage });

              if (nodeImage) {
                // send typing action
                const response1 = await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, {
                  recipient: {
                    id: sender
                  },
                  sender_action: "typing_on"
                }, {
                  headers: { Authorization: `Bearer ${process.env.INSTAGRAM_USER_ACCESS_TOKEN}` }
                });

                // send image to from number
                const response_image = await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, {
                  recipient: {
                    id: sender
                  },
                  message: {
                    attachment: {
                      type: 'image',
                      payload: {
                        url: nodeImage,
                        is_reusable: true,
                      }
                    }
                  },
                }, {
                  headers: { Authorization: `Bearer ${process.env.INSTAGRAM_USER_ACCESS_TOKEN}` }
                });
                await sleep(2000)
                conversation.messages.push({
                  role: "assistant",
                  content: JSON.stringify({
                    type: "image",
                    image: nodeImage
                  })
                });
              }

              // send typing action
              const response1 = await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, {
                recipient: {
                  id: sender
                },
                sender_action: "typing_on"
              }, {
                headers: { Authorization: `Bearer ${process.env.INSTAGRAM_USER_ACCESS_TOKEN}` }
              });

              // Send interactive button message
              const response_question = await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`,
                buttonsPayload,
                {
                  headers: { Authorization: `Bearer ${process.env.INSTAGRAM_USER_ACCESS_TOKEN}` }
                });

              conversation.messages.push({ role: "assistant", content: JSON.stringify(buttonsPayloadForLogging) });
              await conversation.save();
            }
          } else {
            const oneHourAgo = Date.now() - (60 * 60 * 1000);
            //@ts-ignore
            let messages = conversation.messages.filter(msg => new Date(msg.timestamp).getTime() >= oneHourAgo);

            // Ensure at least the current message is included if no recent messages exist
            if (messages.length === 0) {
              messages = [{ role: 'user', content: text }];
            }

            const response_text = await getAIResponse(chatbotId, messages, text, updatedPrompt);

            // send text msg to page
            const response2 = await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, {
              message: {
                text: response_text
              },
              recipient: {
                id: sender
              },
              messaging_type: "RESPONSE",
            }, {
              headers: { Authorization: `Bearer ${process.env.INSTAGRAM_USER_ACCESS_TOKEN}` }
            });

            conversation.messages.push({ role: "assistant", content: response_text });

            await conversation.save();
          }
        }
        // handle postback (button reply)
        if (data.entry[0].messaging[0]?.postback) {
          await connectMongo();

          const page_id = data?.entry[0].id;
          const sender = data?.entry[0]?.messaging[0].sender.id;
          const recipient = data?.entry[0]?.messaging[0].recipient.id;
          const timestamp = data?.entry[0]?.messaging[0].timestamp;
          const text = data.entry[0].messaging[0]?.postback.title;
          const button_id = data.entry[0].messaging[0]?.postback.payload;

          const node_id = button_id.split('-')[0];
          const option_index = button_id.split('-').pop();

          if (page_id == sender) {
            return NextResponse.json({ status: "Skip for same source." }, { status: 200 });
          }

          let messages = [{ role: 'user', content: text }];

          // Fetch the existing InstagramPage model
          const instagramPage = await InstagramPage.findOne({ pageId: recipient });
          if (!instagramPage) {
            // Respond with a 200 OK status
            return NextResponse.json({ status: "Instagram page doesn't registered to the site." }, { status: 200 });
          }

          if (page_id == sender) {
            return NextResponse.json({ status: "Skip for same source." }, { status: 200 });
          }

          const chatbotId = instagramPage.chatbotId;

          const chatbot = await Chatbot.findOne({ chatbotId });
          const updatedPrompt = chatbot.settings?.instagram?.prompt;
          const delay = chatbot.settings?.instagram?.delay;

          if (delay && delay > 0) {
            await sleep(delay * 1000); // delay is in seconds, converting to milliseconds
          }

          // Find existing conversation or create a new one
          let conversation = await ChatbotConversation.findOne({ chatbotId, platform: "instagram", "metadata.from": sender, "metadata.to": instagramPage.name });

          const dataset = await Dataset.findOne({ chatbotId });
          const { questionFlow, questionFlowEnable, questionAIResponseEnable, restartQFTimeoutMins } = dataset;
          const isAiResponseEnabled = questionAIResponseEnable !== undefined ? questionAIResponseEnable : true;

          if (questionFlowEnable && questionFlow) {
            const { nodes, edges } = (questionFlow && questionFlow.nodes && questionFlow.edges) ? questionFlow : sampleFlow;

            //@ts-ignore
            const nextEdge = edges.find(edge => edge.source === node_id && edge.sourceHandle === option_index);
            //@ts-ignore
            const nextNode = nodes.find(node => node.id === nextEdge?.target);
            const nodeMessage = nextNode.data.message || '';
            const nodeQuestion = nextNode.data.question || '';
            const nodeOptions = nextNode.data.options || [];
            const nodeImage = nextNode.data.image || '';

            // send typing action
            const response1 = await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, {
              recipient: {
                id: sender
              },
              sender_action: "typing_on"
            }, {
              headers: { Authorization: `Bearer ${process.env.INSTAGRAM_USER_ACCESS_TOKEN}` }
            });

            // send text msg to from number
            const response_msg = await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, {
              recipient: {
                id: sender
              },
              message: {
                text: nodeMessage
              },
              messaging_type: "RESPONSE",
            }, {
              headers: { Authorization: `Bearer ${process.env.INSTAGRAM_USER_ACCESS_TOKEN}` }
            });
            conversation.messages.push({ role: "assistant", content: nodeMessage });

            if (nodeImage) {
              // send typing action
              const response1 = await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, {
                recipient: {
                  id: sender
                },
                sender_action: "typing_on"
              }, {
                headers: { Authorization: `Bearer ${process.env.INSTAGRAM_USER_ACCESS_TOKEN}` }
              });

              // send image to from number
              const response_image = await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, {
                recipient: {
                  id: sender
                },
                message: {
                  attachment: {
                    type: 'image',
                    payload: {
                      url: nodeImage,
                      is_reusable: true,
                    }
                  }
                },
              }, {
                headers: { Authorization: `Bearer ${process.env.INSTAGRAM_USER_ACCESS_TOKEN}` }
              });
              await sleep(2000)
              conversation.messages.push({
                role: "assistant",
                content: JSON.stringify({
                  type: "image",
                  image: nodeImage
                })
              });
            }

            if (nodeOptions.length > 0) {
              // Construct interactive button message payload
              const buttonsPayloadForLogging = {
                type: "interactive",
                interactive: {
                  type: "button",
                  body: {
                    text: nodeQuestion
                  },
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
              const buttonsPayload = {
                recipient: {
                  id: sender
                },
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
              };

              // send typing action
              const response1 = await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, {
                recipient: {
                  id: sender
                },
                sender_action: "typing_on"
              }, {
                headers: { Authorization: `Bearer ${process.env.INSTAGRAM_USER_ACCESS_TOKEN}` }
              });

              // Send interactive button message
              const response_question = await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`,
                buttonsPayload,
                {
                  headers: { Authorization: `Bearer ${process.env.INSTAGRAM_USER_ACCESS_TOKEN}` }
                });

              conversation.messages.push({ role: "assistant", content: JSON.stringify(buttonsPayloadForLogging) });
              await conversation.save();
            }
          }
        }
      }
      // Handle Instagram comments
      if (data?.entry[0]?.changes?.length > 0 && data?.entry[0]?.changes[0]?.field == "comments") {
        const page_id = data?.entry[0].id;
        const from = data?.entry[0]?.changes[0]?.value.from.id;
        const from_name = data?.entry[0]?.changes[0]?.value.from.username;
        const media_id = data?.entry[0]?.changes[0]?.value.media_id;
        const comment_id = data?.entry[0]?.changes[0]?.value.id;
        const parent_id = data?.entry[0]?.changes[0]?.value.parent_id;
        const text = data?.entry[0]?.changes[0]?.value.text;

        // Skip if comment is from the page itself
        if (page_id == from) {
          return NextResponse.json({ status: "Skip for same source." }, { status: 200 });
        }

        // Skip replies to comments
        if (parent_id) {
          return NextResponse.json({ status: "Skip for reply comments." }, { status: 200 });
        }

        await connectMongo();

        const instagramPage = await InstagramPage.findOne({ pageId: page_id });
        if (!instagramPage) {
          return NextResponse.json({ status: "Instagram page doesn't registered to the site." }, { status: 200 });
        }

        const chatbotId = instagramPage.chatbotId;

        const chatbot = await Chatbot.findOne({ chatbotId });
        const instagramSettings = chatbot.settings?.instagram;
        const updatedPrompt = instagramSettings?.prompt1;
        let delay = instagramSettings?.delay1;

        // Find existing conversation or create a new one
        let conversation = await ChatbotConversation.findOne({
          chatbotId,
          platform: "instagram-comment",
          "metadata.from": from,
          "metadata.to": media_id,
        });
        let isNewCustomer = false;

        if (conversation) {
          // Update existing conversation
          conversation.messages.push({ role: "user", content: text });
          conversation.metadata.comment_id = comment_id;
        } else {
          // Create new conversation
          conversation = new ChatbotConversation({
            chatbotId,
            platform: "instagram-comment",
            disable_auto_reply: false,
            metadata: { from: from, to: media_id, from_name, page_id, comment_id },
            messages: [{ role: "user", content: text },]
          });
          isNewCustomer = true;
        }

        await conversation.save();

        if (conversation?.disable_auto_reply == true) {
          return NextResponse.json({ status: "Auto reponse is disabled." }, { status: 200 });
        }

        // Handle DM reactions based on comment
        if (instagramSettings?.commentDmEnabled) {
          // Find or create direct message conversation
          let dmConversation = await ChatbotConversation.findOne({
            chatbotId,
            platform: "instagram",
            "metadata.from": from,
            "metadata.to": instagramPage.name,
          });

          if (!dmConversation) {
            dmConversation = new ChatbotConversation({
              chatbotId,
              platform: "instagram",
              disable_auto_reply: false,
              metadata: { from: from, to: instagramPage.name },
              messages: [],
            });
          }

          // Welcome DM for new customers
          if (isNewCustomer && instagramSettings?.welcomeDmEnabled) {
            const response_text = instagramSettings?.welcomeDmPrompt || "Welcome! Thanks for engaging with our page. How can I help you today?";
            const dmDelay = instagramSettings?.welcomeDmDelay || 0;

            if (dmDelay > 0) {
              await sleep(dmDelay * 1000);
            }

            // Send Direct Message (DM) to the user
            await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, {
              recipient: {
                id: from
              },
              message: {
                text: response_text
              },
              messaging_type: "RESPONSE",
            }, {
              headers: { Authorization: `Bearer ${process.env.INSTAGRAM_USER_ACCESS_TOKEN}` }
            });

            dmConversation.messages.push({ role: "assistant", content: response_text });
            await dmConversation.save();
          }
          
          let isKeywordTriggered = false;
          // Keyword-triggered DMs
          if (!isNewCustomer && instagramSettings?.keywordDmEnabled && instagramSettings?.keywordTriggers?.length > 0) {
            // Check if message contains any of the keywords
            for (const trigger of instagramSettings.keywordTriggers) {
              if (text.toLowerCase().includes(trigger.keyword.toLowerCase())) {
                const response_text = trigger.prompt || `You mentioned "${trigger.keyword}". How can I help you with that?`;
                const dmDelay = trigger.delay || 0;
                isKeywordTriggered = true;

                if (dmDelay > 0) {
                  await sleep(dmDelay * 1000);
                }

                // Send Direct Message (DM) to the user
                await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, {
                  recipient: {
                    id: from
                  },
                  message: {
                    text: response_text
                  },
                  messaging_type: "RESPONSE",
                }, {
                  headers: { Authorization: `Bearer ${process.env.INSTAGRAM_USER_ACCESS_TOKEN}` }
                });

                dmConversation.messages.push({ role: "assistant", content: response_text });
                await dmConversation.save();

                // Only trigger on the first matching keyword
                break;
              }
            }
          }
          
          // Reply DM for all comment authors
          if (!isNewCustomer && !isKeywordTriggered && instagramSettings?.replyDmEnabled) {
            const response_text = instagramSettings?.replyDmPrompt || "Thanks for your comment! I'd love to continue this conversation in DM. How can I assist you?";
            const dmDelay = instagramSettings?.replyDmDelay || 0;

            if (dmDelay > 0) {
              await sleep(dmDelay * 1000);
            }

            // Send Direct Message (DM) to the user
            await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, {
              recipient: {
                id: from
              },
              message: {
                text: response_text
              },
              messaging_type: "RESPONSE",
            }, {
              headers: { Authorization: `Bearer ${process.env.INSTAGRAM_USER_ACCESS_TOKEN}` }
            });

            dmConversation.messages.push({ role: "assistant", content: response_text });
            await dmConversation.save();
          }
        }

        // Handle comment reply
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        //@ts-ignore
        let messages = conversation.messages.filter(msg => new Date(msg.timestamp).getTime() >= oneHourAgo);

        // Ensure at least the current message is included if no recent messages exist
        if (messages.length === 0) {
          messages = [{ role: 'user', content: text }];
        }

        const response_text = await getAIResponse(chatbotId, messages, text, updatedPrompt);

        if (delay && delay > 0) {
          await sleep(delay * 1000); // delay is in seconds, converting to milliseconds
        }

        // Reply to the comment
        const response2 = await axios.post(`https://graph.facebook.com/v22.0/${comment_id}/replies?access_token=${instagramPage.access_token}`, {
          message: `@${from_name} ${response_text}`
        }, {
          headers: { Authorization: `Bearer ${process.env.INSTAGRAM_USER_ACCESS_TOKEN}` }
        });

        conversation.messages.push({ role: "assistant", content: response_text });
        await conversation.save();
      }
      
      // Handle Instagram post likes
      if (data?.entry[0]?.changes?.length > 0 && data?.entry[0]?.changes[0]?.field == "likes") {
        const page_id = data?.entry[0].id;
        const from = data?.entry[0]?.changes[0]?.value.user_id;
        const media_id = data?.entry[0]?.changes[0]?.value.media_id;

        await connectMongo();

        const instagramPage = await InstagramPage.findOne({ pageId: page_id });
        if (!instagramPage) {
          return NextResponse.json({ status: "Instagram page doesn't registered to the site." }, { status: 200 });
        }

        const chatbotId = instagramPage.chatbotId;
        const chatbot = await Chatbot.findOne({ chatbotId });
        const instagramSettings = chatbot.settings?.instagram;

        // Check if like DMs are enabled
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
              return NextResponse.json({ status: "Skip DM for existing user (first-like-only mode)." }, { status: 200 });
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
          let dmConversation = await ChatbotConversation.findOne({
            chatbotId,
            platform: "instagram",
            "metadata.from": from,
            "metadata.to": instagramPage.name,
          });

          if (!dmConversation) {
            dmConversation = new ChatbotConversation({
              chatbotId,
              platform: "instagram",
              disable_auto_reply: false,
              metadata: { from: from, to: instagramPage.name },
              messages: [],
            });
          }

          // Send Direct Message (DM) to the user
          await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, {
            recipient: {
              id: from
            },
            message: {
              text: promptText
            },
            messaging_type: "RESPONSE",
          }, {
            headers: { Authorization: `Bearer ${process.env.INSTAGRAM_USER_ACCESS_TOKEN}` }
          });

          dmConversation.messages.push({ role: "assistant", content: promptText });
          await dmConversation.save();

          return NextResponse.json({ status: "Like DM sent." }, { status: 200 });
        }
      }
    }

    // Respond with a 200 OK status
    return NextResponse.json({ status: 'OK' }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook event:', error);

    if (process.env.ENABLE_WEBHOOK_LOGGING_INSTAGRAM === "1") {
      const response = await fetch('http://webhook.mrcoders.org/instagram-error.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error),
      });
    }
    return NextResponse.json({ error: error }, { status: 200 });
  }
}
