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

    if (process.env.ENABLE_WEBHOOK_LOGGING_WHATSAPP == "1") {
      // Send data to the specified URL
      const response = await fetch('http://webhook.mrcoders.org/whatsapp.php', {
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
      if (data?.entry[0]?.changes?.length > 0) {
        if (data?.entry[0]?.changes[0].value?.messages?.length > 0) {
          //handle normal text
          if (data?.entry[0]?.changes[0]?.value?.messages[0]?.type == "text") {
            await connectMongo();

            const from = data?.entry[0]?.changes[0]?.value?.messages[0]?.from;
            const phone_number_id = data?.entry[0]?.changes[0]?.value?.metadata.phone_number_id;
            const message_id = data?.entry[0]?.changes[0]?.value?.messages[0]?.id;
            const timestamp = data?.entry[0]?.changes[0]?.value?.messages[0]?.timestamp;
            const currentTimestamp = (new Date().getTime()) / 1000;
            const text = data?.entry[0]?.changes[0]?.value?.messages[0]?.text?.body;

            let messages = [{ role: 'user', content: text }];

            // Fetch the existing WhatsAppNumber model
            const whatsappNumber = await WhatsAppNumber.findOne({ phoneNumberId: phone_number_id });
            if (!whatsappNumber) {
              // Respond with a 200 OK status
              return NextResponse.json({ status: "Whatsapp Number doesn't registered to the site." }, { status: 200 });
            }

            const chatbotId = whatsappNumber.chatbotId;
            const updatedPrompt = whatsappNumber.settings?.prompt;
            const delay = whatsappNumber.settings?.delay;

            if (delay && delay > 0) {
              await sleep(delay * 1000); // delay is in seconds, converting to milliseconds
            }

            // Find existing conversation or create a new one
            let conversation = await ChatbotConversation.findOne({ chatbotId, platform: "whatsapp", "metadata.from": from, "metadata.to": whatsappNumber.display_phone_number });
            let triggerQF = false;

            const dataset = await Dataset.findOne({ chatbotId });
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
                messages: [{ role: "user", content: text },]
              });

              triggerQF = true;
            }

            await conversation.save();

            let nextNode = null;

            if (conversation?.disable_auto_reply == true) {
              return NextResponse.json({ status: "Auto reponse is disabled." }, { status: 200 });
            }

            if (timestamp + 60 < currentTimestamp) {
              return NextResponse.json({ status: 'Delievery denied coz long delay' }, { status: 200 });
            }

            // mark message as read
            const response_read = await axios.post(`https://graph.facebook.com/v22.0/${phone_number_id}/messages`, {
              messaging_product: "whatsapp",
              status: "read",
              message_id
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
                const buttonsPayload = {
                  messaging_product: "whatsapp",
                  recipient_type: "individual",
                  to: from,
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

                // send text msg to from number
                const response_msg = await axios.post(`https://graph.facebook.com/v22.0/${phone_number_id}/messages`, {
                  messaging_product: "whatsapp",
                  to: from,
                  text: {
                    body: nodeMessage
                  }
                }, {
                  headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
                });
                conversation.messages.push({ role: "assistant", content: nodeMessage });

                if (nodeImage) {
                  // send text msg to from number
                  const response_image = await axios.post(`https://graph.facebook.com/v22.0/${phone_number_id}/messages`, {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    type: "image",
                    to: from,
                    image: {
                      link: nodeImage
                    }
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

                // Send interactive button message
                const response_question = await axios.post(`https://graph.facebook.com/v22.0/${phone_number_id}/messages`,
                  buttonsPayload, {
                  headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
                });

                conversation.messages.push({ role: "assistant", content: JSON.stringify(buttonsPayload) });
                await conversation.save();
              }
            } else {
              const response_text = await getAIResponse(chatbotId, messages, text, updatedPrompt);

              // send text msg to from number
              const response_msg = await axios.post(`https://graph.facebook.com/v22.0/${phone_number_id}/messages`, {
                messaging_product: "whatsapp",
                to: from,
                text: {
                  body: response_text
                }
              }, {
                headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
              });

              conversation.messages.push({ role: "assistant", content: response_text });

              await conversation.save();
            }
          }
          //handle interactive
          if (data?.entry[0]?.changes[0]?.value?.messages[0]?.type == "interactive") {
            //handle buttong reply
            if (data.entry[0].changes[0].value.messages[0].interactive.type == "button_reply") {
              await connectMongo();
              
              const from = data?.entry[0]?.changes[0]?.value?.messages[0]?.from;
              const phone_number_id = data?.entry[0]?.changes[0]?.value?.metadata.phone_number_id;
              const message_id = data?.entry[0]?.changes[0]?.value?.messages[0]?.id;

              const button_id = data.entry[0].changes[0].value.messages[0].interactive.button_reply.id;
              const button_title = data.entry[0].changes[0].value.messages[0].interactive.button_reply.title;
              const node_id = button_id.split('-')[0];
              const option_index = button_id.split('-').pop();

              let messages = [{ role: 'user', content: button_title }];

              // Fetch the existing WhatsAppNumber model
              const whatsappNumber = await WhatsAppNumber.findOne({ phoneNumberId: phone_number_id });
              if (!whatsappNumber) {
                // Respond with a 200 OK status
                return NextResponse.json({ status: "Whatsapp Number doesn't registered to the site." }, { status: 200 });
              }

              const chatbotId = whatsappNumber.chatbotId;
              const updatedPrompt = whatsappNumber.settings?.prompt;
              const delay = whatsappNumber.settings?.delay;

              if (delay && delay > 0) {
                await sleep(delay * 1000); // delay is in seconds, converting to milliseconds
              }

              const chatbot = await Chatbot.findOne({ chatbotId });
              const dataset = await Dataset.findOne({ chatbotId });

              // Find existing conversation or create a new one
              let conversation = await ChatbotConversation.findOne({ chatbotId, platform: "whatsapp", "metadata.from": from, "metadata.to": whatsappNumber.display_phone_number });
              let triggerQF = false;

              if (conversation) {
                // Update existing conversation
                conversation.messages.push({ role: "user", content: button_title });
                const lastMessageTimestamp = conversation.updatedAt.getTime() / 1000;
              } else {
                return NextResponse.json({ status: "Can't find conversation for this buttong reply, sth went wrong." }, { status: 200 });
              }

              const { questionFlow, questionFlowEnable } = dataset;

              // mark message as read
              const response_read = await axios.post(`https://graph.facebook.com/v22.0/${phone_number_id}/messages`, {
                messaging_product: "whatsapp",
                status: "read",
                message_id
              }, {
                headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
              });

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

                // send text msg to from number
                const response_msg = await axios.post(`https://graph.facebook.com/v22.0/${phone_number_id}/messages`, {
                  messaging_product: "whatsapp",
                  to: from,
                  text: {
                    body: nodeMessage
                  }
                }, {
                  headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
                });
                conversation.messages.push({ role: "assistant", content: nodeMessage });

                if (nodeImage) {
                  // send text msg to from number
                  const response_image = await axios.post(`https://graph.facebook.com/v22.0/${phone_number_id}/messages`, {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    type: "image",
                    to: from,
                    image: {
                      link: nodeImage
                    }
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
                  const buttonsPayload = {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: from,
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

                  // Send interactive button message
                  const response_question = await axios.post(`https://graph.facebook.com/v22.0/${phone_number_id}/messages`,
                    buttonsPayload, {
                    headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
                  });

                  conversation.messages.push({ role: "assistant", content: JSON.stringify(buttonsPayload) });
                }

                await conversation.save();
              }
            }
          }
        }
      }
    }

    // Respond with a 200 OK status
    return NextResponse.json({ status: 'OK' }, { status: 200 });
  } catch (error) {
    try {
      // Send data to the specified URL
      const response = await fetch('http://webhook.mrcoders.org/whatsapp-error.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error),
      });
    } catch (error) {
      console.log('error while saving errors.')
    }
    return NextResponse.json({ error: error }, { status: 200 });
  }
}