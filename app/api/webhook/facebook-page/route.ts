// src/app/api/webhook/route.ts
import { NextResponse } from 'next/server';
import connectMongo from '@/libs/mongoose';
import ChatbotConversation from '@/models/ChatbotConversation';
import FacebookPage from '@/models/FacebookPage';
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

    if (process.env.ENABLE_WEBHOOK_LOGGING_FB_PAGE == "1") {
      // Send data to the specified URL
      const response = await fetch('http://webhook.mrcoders.org/facebook-page.php', {
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
      // this is for messenger
      if (data?.entry[0]?.messaging?.length > 0) {
        // handle normal message
        if (data?.entry[0]?.messaging[0].message?.text?.length > 0) {
          await connectMongo();

          const page_id = data?.entry[0].id;
          const sender = data?.entry[0]?.messaging[0].sender.id;
          const recipient = data?.entry[0]?.messaging[0].recipient.id;
          const timestamp = data?.entry[0]?.messaging[0].timestamp;
          const text = data?.entry[0]?.messaging[0].message.text;
          const mid = data?.entry[0]?.messaging[0].message.mid;
          const currentTimestamp = (new Date().getTime()) / 1000;

          // Fetch the existing FacebookPage model
          const facebookPage = await FacebookPage.findOne({ pageId: recipient });
          if (!facebookPage) {
            // Respond with a 200 OK status
            return NextResponse.json({ status: "FB page doesn't registered to the site." }, { status: 200 });
          }

          if (page_id == sender) {
            return NextResponse.json({ status: "Skip for same source." }, { status: 200 });
          }

          const chatbotId = facebookPage.chatbotId;

          const chatbot = await Chatbot.findOne({ chatbotId });
          const updatedPrompt = chatbot.settings?.facebook?.prompt;
          const delay = chatbot.settings?.facebook?.delay;

          if (delay && delay > 0) {
            await sleep(delay * 1000); // delay is in seconds, converting to milliseconds
          }

          // Find existing conversation or create a new one
          let conversation = await ChatbotConversation.findOne({ chatbotId, platform: "facebook", "metadata.from": sender, "metadata.to": facebookPage.name });
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
              platform: "facebook",
              disable_auto_reply: false,
              metadata: { from: sender, to: facebookPage.name },
              messages: [{ role: "user", content: text },]
            });

            triggerQF = true;
          }

          await conversation.save();

          if (conversation?.disable_auto_reply == true) {
            return NextResponse.json({ status: "Auto reponse is disabled." }, { status: 200 });
          }

          if (timestamp + 60 < currentTimestamp) {
            return NextResponse.json({ status: 'Delievery denied coz long delay' }, { status: 200 });
          }

          // send typing action
          const response1 = await axios.post(`https://graph.facebook.com/v22.0/${facebookPage.pageId}/messages?access_token=${facebookPage.access_token}`, {
            recipient: {
              id: sender
            },
            sender_action: "typing_on"
          }, {
            headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
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
              const response_msg = await axios.post(`https://graph.facebook.com/v22.0/${facebookPage.pageId}/messages?access_token=${facebookPage.access_token}`, {
                recipient: {
                  id: sender
                },
                message: {
                  text: nodeMessage
                },
                messaging_type: "RESPONSE",
              }, {
                headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
              });
              conversation.messages.push({ role: "assistant", content: nodeMessage });

              if (nodeImage) {
                // send typing action
                const response1 = await axios.post(`https://graph.facebook.com/v22.0/${facebookPage.pageId}/messages?access_token=${facebookPage.access_token}`, {
                  recipient: {
                    id: sender
                  },
                  sender_action: "typing_on"
                }, {
                  headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
                });

                // send iamge to from number
                const response_image = await axios.post(`https://graph.facebook.com/v22.0/${facebookPage.pageId}/messages?access_token=${facebookPage.access_token}`, {
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
                  headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
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
              const response1 = await axios.post(`https://graph.facebook.com/v22.0/${facebookPage.pageId}/messages?access_token=${facebookPage.access_token}`, {
                recipient: {
                  id: sender
                },
                sender_action: "typing_on"
              }, {
                headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
              });

              // Send interactive button message
              const response_question = await axios.post(`https://graph.facebook.com/v22.0/${facebookPage.pageId}/messages?access_token=${facebookPage.access_token}`,
                buttonsPayload,
                {
                  headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
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
            const response2 = await axios.post(`https://graph.facebook.com/v22.0/${facebookPage.pageId}/messages?access_token=${facebookPage.access_token}`, {
              message: {
                text: response_text
              },
              recipient: {
                id: sender
              },
              messaging_type: "RESPONSE",
            }, {
              headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
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

          // Fetch the existing FacebookPage model
          const facebookPage = await FacebookPage.findOne({ pageId: recipient });
          if (!facebookPage) {
            // Respond with a 200 OK status
            return NextResponse.json({ status: "FB page doesn't registered to the site." }, { status: 200 });
          }

          if (page_id == sender) {
            return NextResponse.json({ status: "Skip for same source." }, { status: 200 });
          }

          const chatbotId = facebookPage.chatbotId;

          const chatbot = await Chatbot.findOne({ chatbotId });
          const updatedPrompt = chatbot.settings?.facebook?.prompt;
          const delay = chatbot.settings?.facebook?.delay;

          if (delay && delay > 0) {
            await sleep(delay * 1000); // delay is in seconds, converting to milliseconds
          }

          // Find existing conversation or create a new one
          let conversation = await ChatbotConversation.findOne({ chatbotId, platform: "facebook", "metadata.from": sender, "metadata.to": facebookPage.name });

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
            const response1 = await axios.post(`https://graph.facebook.com/v22.0/${facebookPage.pageId}/messages?access_token=${facebookPage.access_token}`, {
              recipient: {
                id: sender
              },
              sender_action: "typing_on"
            }, {
              headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
            });

            // send text msg to from number
            const response_msg = await axios.post(`https://graph.facebook.com/v22.0/${facebookPage.pageId}/messages?access_token=${facebookPage.access_token}`, {
              recipient: {
                id: sender
              },
              message: {
                text: nodeMessage
              },
              messaging_type: "RESPONSE",
            }, {
              headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
            });
            conversation.messages.push({ role: "assistant", content: nodeMessage });

            if (nodeImage) {
              // send typing action
              const response1 = await axios.post(`https://graph.facebook.com/v22.0/${facebookPage.pageId}/messages?access_token=${facebookPage.access_token}`, {
                recipient: {
                  id: sender
                },
                sender_action: "typing_on"
              }, {
                headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
              });

              // send iamge to from number
              const response_image = await axios.post(`https://graph.facebook.com/v22.0/${facebookPage.pageId}/messages?access_token=${facebookPage.access_token}`, {
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
                headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
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
              const response1 = await axios.post(`https://graph.facebook.com/v22.0/${facebookPage.pageId}/messages?access_token=${facebookPage.access_token}`, {
                recipient: {
                  id: sender
                },
                sender_action: "typing_on"
              }, {
                headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
              });

              // Send interactive button message
              const response_question = await axios.post(`https://graph.facebook.com/v22.0/${facebookPage.pageId}/messages?access_token=${facebookPage.access_token}`,
                buttonsPayload,
                {
                  headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
                });

              conversation.messages.push({ role: "assistant", content: JSON.stringify(buttonsPayloadForLogging) });
              await conversation.save();
            }
          }
        }
      }
      // this is for post comments
      if (data?.entry[0]?.changes?.length > 0 && data?.entry[0]?.changes[0]?.field == "feed") {
        const page_id = data?.entry[0].id;
        const from = data?.entry[0]?.changes[0]?.value.from.id;
        const from_name = data?.entry[0]?.changes[0]?.value.from.name;
        const post_id = data?.entry[0]?.changes[0]?.value.post_id;
        const comment_id = data?.entry[0]?.changes[0]?.value.comment_id;
        const parent_id = data?.entry[0]?.changes[0]?.value.parent_id;
        const item = data?.entry[0]?.changes[0]?.value.item;

        if (item !== "comment") {
          return NextResponse.json({ status: `Skip for item ${item}.` }, { status: 200 });
        }

        if (page_id == from) {
          return NextResponse.json({ status: "Skip for same source." }, { status: 200 });
        }

        if (parent_id != post_id) {
          return NextResponse.json({ status: "Skip for reply comments." }, { status: 200 });
        }

        await connectMongo();

        const facebookPage = await FacebookPage.findOne({ pageId: page_id });

        const response = await axios.get(`https://graph.facebook.com/v22.0/${comment_id}?fields=id,message,from,created_time,comment_count&access_token=${facebookPage.access_token}`,
          {
            headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
          });

        // Extract data from response
        const { id, message, created_time, comment_count } = response.data;

        const chatbotId = facebookPage.chatbotId;

        const chatbot = await Chatbot.findOne({ chatbotId });
        const facebookSettings = chatbot.settings?.facebook;
        const updatedPrompt = facebookSettings?.prompt1;
        let delay = facebookSettings?.delay1;

        // Find existing conversation or create a new one
        let conversation = await ChatbotConversation.findOne({
          chatbotId,
          platform: "facebook-comment",
          "metadata.from": from,
          "metadata.to": post_id,
        });
        let isNewCustomer = false;

        if (conversation) {
          // Update existing conversation
          conversation.messages.push({ role: "user", content: message });
          conversation.metadata.comment_id = comment_id;
        } else {
          // Create new conversation
          conversation = new ChatbotConversation({
            chatbotId,
            platform: "facebook-comment",
            disable_auto_reply: false,
            metadata: { from: from, to: post_id, parent_id, from_name, page_id, comment_id },
            messages: [{ role: "user", content: message },]
          });
          isNewCustomer = true;
        }

        await conversation.save();

        if (conversation?.disable_auto_reply == true) {
          return NextResponse.json({ status: "Auto reponse is disabled." }, { status: 200 });
        }

        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        //@ts-ignore
        let messages = conversation.messages.filter(msg => new Date(msg.timestamp).getTime() >= oneHourAgo);

        // Ensure at least the current message is included if no recent messages exist
        if (messages.length === 0) {
          messages = [{ role: 'user', content: message }];
        }

        if (isNewCustomer && facebookSettings?.commentDmEnabled && facebookSettings?.welcomeDmEnabled) {
          const response_text = facebookSettings?.welcomeDmPrompt;
          delay = facebookSettings?.welcomeDmDelay;
        
          if (delay && delay > 0) {
            await sleep(delay * 1000); // delay is in seconds, converting to milliseconds
          }
        
          // Find existing Messenger conversation or create a new one
          let messengerConversation = await ChatbotConversation.findOne({
            chatbotId,
            platform: "facebook",
            "metadata.from": from,
            "metadata.to": facebookPage.name,
          });
        
          if (!messengerConversation) {
            messengerConversation = new ChatbotConversation({
              chatbotId,
              platform: "facebook",
              disable_auto_reply: false,
              metadata: { from: from, to: facebookPage.name },
              messages: [],
            });
          }
        
          // Send Direct Message (DM) to the user via Messenger
          await axios.post(`https://graph.facebook.com/v22.0/${facebookPage.pageId}/messages?access_token=${facebookPage.access_token}`, {
            recipient: {
              id: from // user's Facebook ID
            },
            message: {
              text: response_text
            },
            messaging_type: "RESPONSE",
          }, {
            headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
          });
        
          messengerConversation.messages.push({ role: "assistant", content: response_text });
          await messengerConversation.save();
        
          return NextResponse.json({ status: "Welcome DM sent." }, { status: 200 });
        } 
        
        const response_text = await getAIResponse(chatbotId, messages, message, updatedPrompt);

        if (delay && delay > 0) {
          await sleep(delay * 1000); // delay is in seconds, converting to milliseconds
        }

        // send msg
        const response2 = await axios.post(`https://graph.facebook.com/v22.0/${comment_id}/comments?access_token=${facebookPage.access_token}`, {
          message: `@[${from}] ${response_text}`
        }, {
          headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
        });

        conversation.messages.push({ role: "assistant", content: response_text });

        await conversation.save();
      }
    }

    // Respond with a 200 OK status
    return NextResponse.json({ status: 'OK' }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook event:', error);

    if (process.env.ENABLE_WEBHOOK_LOGGING_FB_PAGE == "1") {
      const response = await fetch('http://webhook.mrcoders.org/facebook-page-error.php', {
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