// src/app/api/webhook/route.ts
import { NextResponse } from 'next/server';
import connectMongo from '@/libs/mongoose';
import ChatbotConversation from '@/models/ChatbotConversation';
import InstagramPage from '@/models/InstagramPage';
import axios from 'axios';
import { getAIResponse } from '@/libs/utils-ai';
import { sleep } from '@/libs/utils';
import Dataset from '@/models/Dataset';
export const dynamic = 'force-dynamic';

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

    if (process.env.ENABLE_WEBHOOK_LOGGING_INSTAGRAM == '1') {
      // Send data to the specified URL
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
      // this is for messenger
      if (data?.entry[0]?.messaging?.length > 0) {
        const messagingEvent = data.entry[0].messaging[0];
        // Handle normal text messages
        if (messagingEvent.message?.text?.length > 0) {
          await connectMongo();

          const instagram_account_id = data?.entry[0].id;
          const sender = data?.entry[0]?.messaging[0].sender.id;
          const recipient = data?.entry[0]?.messaging[0].recipient.id;
          const timestamp = data?.entry[0]?.messaging[0].timestamp;
          const text = data?.entry[0]?.messaging[0].message.text;
          const mid = data?.entry[0]?.messaging[0].message.mid;
          const currentTimestamp = (new Date().getTime()) / 1000;

          let messages = [{ role: 'user', content: text }];

          // Fetch the existing InstagramPage model
          const instagramPage = await InstagramPage.findOne({ instagram_business_account: instagram_account_id });
          if (!instagramPage) {
            console.log("Instagram account doesn't registered to the site.");
            // Respond with a 200 OK status
            return NextResponse.json({ status: "Instagram account doesn't registered to the site." }, { status: 200 });
          }

          if (instagram_account_id == sender) {
            return NextResponse.json({ status: "Skip for same source." }, { status: 200 });
          }

          const chatbotId = instagramPage.chatbotId;
          const updatedPrompt = instagramPage?.settings?.prompt;
          const delay = instagramPage?.settings?.delay;

          if (delay && delay > 0) {
            await sleep(delay * 1000); // delay is in seconds, converting to milliseconds
          }

          // Find existing conversation or create a new one
          let conversation = await ChatbotConversation.findOne({ chatbotId, platform: "instagram", "metadata.from": sender, "metadata.to": instagramPage.name });

          const dataset = await Dataset.findOne({ chatbotId });
          const { questionFlow, questionFlowEnable, questionAIResponseEnable, restartQFTimeoutMins } = dataset;
          const isAiResponseEnabled = questionAIResponseEnable !== undefined ? questionAIResponseEnable : true;

          let triggerQF = false;

          if (conversation) {
            const lastMessageContent = conversation.messages[conversation.messages.length - 1].content;
            try {
              JSON.parse(lastMessageContent);
              triggerQF = true;
            } catch (e) {
              // Content is not JSON, do nothing
            }

            const lastMessageTimestamp = conversation.updatedAt.getTime() / 1000;
            if (currentTimestamp - lastMessageTimestamp > restartQFTimeoutMins * 60) {
              triggerQF = true;
            }
            if (!isAiResponseEnabled) {
              triggerQF = true;
            }
            conversation.messages.push({ role: "user", content: text });
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
            console.log("Auto reponse is disabled.");
            return NextResponse.json({ status: "Auto reponse is disabled." }, { status: 200 });
          }

          if (timestamp + 60 < currentTimestamp) {
            console.log('Delievery denied coz long delay.');
            return NextResponse.json({ status: 'Delievery denied coz long delay.' }, { status: 200 });
          }

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

              // send text msg to to sender
              const response_msg = await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, {
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
                const image_payload = {
                  recipient: {
                    id: sender
                  },
                  message: {
                    attachment: {
                      type: 'image',
                      payload: {
                        url: nodeImage,
                        // is_reusable: true
                      }
                    }
                  },
                }
                console.log(nodeImage)

                await sleep(2000)
                // send iamge to to sender
                const response_image = await fetch(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}`,
                    "Content-Type": 'application/json'
                  },
                  body: JSON.stringify(image_payload),
                });
                const response_image_data = await response_image.json();
                console.log(response_image_data)
                await sleep(2000)
                conversation.messages.push({
                  role: "assistant",
                  content: JSON.stringify({
                    type: "image",
                    image: nodeImage
                  })
                });
              }

              await sleep(2000)
              // Send message with options
              await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`,
                buttonsPayload, {
                headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
              });

              conversation.messages.push({ role: "assistant", content: JSON.stringify(buttonsPayloadForLogging) });
              await conversation.save();
            }
          } else {
            const response_text = await getAIResponse(chatbotId, messages, text, updatedPrompt);

            await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, {
              message: { text: response_text },
              recipient: { id: sender },
              messaging_type: "RESPONSE",
            }, {
              headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
            });

            conversation.messages.push({ role: "assistant", content: response_text });
            await conversation.save();
          }
        }
        // Handle postback (button reply)
        if (messagingEvent.postback) {
          await connectMongo();

          const instagram_account_id = data?.entry[0].id;
          const sender = messagingEvent.sender.id;
          const recipient = messagingEvent.recipient.id;
          const button_id = messagingEvent.postback.payload;
          const text = messagingEvent.postback.title;

          const node_id = button_id.split('-')[0];
          const option_index = button_id.split('-').pop();

          const instagramPage = await InstagramPage.findOne({ instagram_business_account: instagram_account_id });
          if (!instagramPage) {
            return NextResponse.json({ status: "Instagram account doesn't registered to the site." }, { status: 200 });
          }

          const chatbotId = instagramPage.chatbotId;
          const delay = instagramPage?.settings?.delay;
          const dataset = await Dataset.findOne({ chatbotId });
          const { questionFlow, questionFlowEnable } = dataset;

          if (delay && delay > 0) {
            await sleep(delay * 1000); // delay is in seconds, converting to milliseconds
          }

          let conversation = await ChatbotConversation.findOne({ chatbotId, platform: "instagram", "metadata.from": sender, "metadata.to": instagramPage.name });

          if (questionFlowEnable && questionFlow) {
            const { nodes, edges } = questionFlow;

            //@ts-ignore
            const nextEdge = edges.find(edge => edge.source === node_id && edge.sourceHandle === option_index);
            //@ts-ignore
            const nextNode = nodes.find(node => node.id === nextEdge?.target);
            const nodeMessage = nextNode.data.message || '';
            const nodeQuestion = nextNode.data.question || '';
            const nodeOptions = nextNode.data.options || [];
            const nodeImage = nextNode.data.image || '';

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
              headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
            });
            conversation.messages.push({ role: "assistant", content: nodeMessage });

            if (nodeImage) {
              const image_payload = {
                recipient: {
                  id: sender
                },
                message: {
                  attachment: {
                    type: 'image',
                    payload: {
                      url: nodeImage,
                    }
                  }
                },
              }
              // send iamge to from number
              const response_image = await fetch(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}`,
                  "Content-Type": 'application/json'
                },
                body: JSON.stringify(image_payload),
              });
              const response_image_data = await response_image.json();
              console.log(response_image_data)
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

              await axios.post(`https://graph.facebook.com/v22.0/${instagramPage.pageId}/messages?access_token=${instagramPage.access_token}`, buttonsPayload, {
                headers: {
                  Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}`,
                  "Content-Type": 'application/json'
                }
              });

              conversation.messages.push({ role: "user", content: text });
              conversation.messages.push({ role: "assistant", content: JSON.stringify(buttonsPayloadForLogging) });
              await conversation.save();
            }
          }
        }
      }
      // this is for post comments
      if (data?.entry[0]?.changes?.length > 0 && data?.entry[0]?.changes[0]?.field == "comments") {
        const instagram_business_account = data?.entry[0].id;
        const from = data?.entry[0]?.changes[0]?.value.from.id;
        const from_name = data?.entry[0]?.changes[0]?.value.from.username;
        const comment_id = data?.entry[0]?.changes[0]?.value.id;
        const parent_id = data?.entry[0]?.changes[0]?.value?.parent_id;
        const message = data?.entry[0]?.changes[0]?.value.text;

        if (instagram_business_account == from) {
          return NextResponse.json({ status: "Skip for same source." }, { status: 200 });
        }
        await connectMongo();

        const instagramPage = await InstagramPage.findOne({ instagram_business_account });

        const chatbotId = instagramPage.chatbotId;
        const updatedPrompt = instagramPage?.settings?.prompt1;
        const delay = instagramPage?.settings?.delay1;

        if (delay && delay > 0) {
          await sleep(delay * 1000); // delay is in seconds, converting to milliseconds
        }

        // Find existing conversation or create a new one
        let conversation = await ChatbotConversation.findOne({
          chatbotId,
          platform: "instagram-comment",
          "metadata.from": from,
          "metadata.to": instagram_business_account,
        });
        if (conversation) {
          // Update existing conversation
          conversation.messages.push({ role: "user", content: message });
          conversation.metadata.comment_id = comment_id;
        } else {
          // Create new conversation
          conversation = new ChatbotConversation({
            chatbotId,
            platform: "instagram-comment",
            disable_auto_reply: false,
            metadata: { from: from, 
              to: instagram_business_account, 
              parent_id, 
              from_name, 
              comment_id, 
              to_name: instagramPage.instagram_business_account_name
             },
            messages: [{ role: "user", content: message },]
          });
        }

        await conversation.save();

        if (conversation?.disable_auto_reply == true) {
          return NextResponse.json({ status: "Auto reponse is disabled." }, { status: 200 });
        }

        let messages = [{ role: 'user', content: message }];

        const response_text = await getAIResponse(chatbotId, messages, message, updatedPrompt);

        // send msg
        const response2 = await axios.post(`https://graph.facebook.com/v22.0/${parent_id ?? comment_id}/replies?message=${response_text}&access_token=${instagramPage.access_token}`, {
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
    // console.error('Error processing webhook event:', error);

    if (process.env.ENABLE_WEBHOOK_LOGGING_INSTAGRAM) {
      const response = await fetch('http://webhook.mrcoders.org/instagram-page-error.php', {
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