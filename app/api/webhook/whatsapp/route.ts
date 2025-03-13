import axios from 'axios';
import WhatsAppNumber from '@/models/WhatsAppNumber';
import connectMongo from "@/libs/mongoose";
import { NextRequest, NextResponse } from 'next/server';
import ChatbotConversation from '@/models/ChatbotConversation';
import { getAIResponse } from '@/libs/utils-ai';
import { sleep } from '@/libs/utils';

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
    if (data?.entry?.length > 0) {
      if (data?.entry[0]?.changes?.length > 0) {
        if (data?.entry[0]?.changes[0].value?.messages?.length > 0) {
          if (data?.entry[0]?.changes[0]?.value?.messages[0]?.type == "text") {

            if (process.env.ENABLE_WEBHOOK_LOGGING) {
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

            await connectMongo();

            const from = data?.entry[0]?.changes[0]?.value?.messages[0]?.from;
            const timestamp = data?.entry[0]?.changes[0]?.value?.messages[0]?.timestamp;
            const currentTimestamp = (new Date().getTime()) / 1000;
            const phone_number_id = data?.entry[0]?.changes[0]?.value?.metadata.phone_number_id;
            const text = data?.entry[0]?.changes[0]?.value?.messages[0]?.text?.body;
            const message_id = data?.entry[0]?.changes[0]?.value?.messages[0]?.id;

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
            if (conversation) {
              // Update existing conversation
              conversation.messages.push({ role: "user", content: text });
            } else {
              // Create new conversation
              conversation = new ChatbotConversation({
                chatbotId,
                platform: "whatsapp",
                disable_auto_reply: false,
                metadata: { from, to: whatsappNumber.display_phone_number },
                messages: [{ role: "user", content: text },]
              });
            }

            await conversation.save();

            if (conversation?.disable_auto_reply == true) {
              return NextResponse.json({ status: "Auto reponse is disabled." }, { status: 200 });
            }

            if (timestamp + 60 < currentTimestamp) {
              return NextResponse.json({ status: 'Delievery denied coz long delay' }, { status: 200 });
            }

            const response_text = await getAIResponse(chatbotId, messages, text, updatedPrompt);

            // mark message as read
            const response1 = await axios.post(`https://graph.facebook.com/v22.0/${phone_number_id}/messages`, {
              messaging_product: "whatsapp",
              status: "read",
              message_id
            }, {
              headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
            });

            // send text msg to from number
            const response2 = await axios.post(`https://graph.facebook.com/v22.0/${phone_number_id}/messages`, {
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
      }
    }

    // Respond with a 200 OK status
    return NextResponse.json({ status: 'OK' }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook event:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}