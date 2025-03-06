// src/app/api/webhook/route.ts
import { NextResponse } from 'next/server';
import connectMongo from '@/libs/mongoose';
import ChatbotConversation from '@/models/ChatbotConversation';
import FacebookPage from '@/models/FacebookPage';
import axios from 'axios';
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

    if (data?.entry?.length > 0) {
      // this is for messenger
      if (data?.entry[0]?.messaging?.length > 0) {
        if (data?.entry[0]?.messaging[0].message?.text?.length > 0) {

          await connectMongo();

          const sender = data?.entry[0]?.messaging[0].sender.id;
          const recipient = data?.entry[0]?.messaging[0].recipient.id;
          const timestamp = data?.entry[0]?.messaging[0].timestamp;
          const text = data?.entry[0]?.messaging[0].message.text;
          const mid = data?.entry[0]?.messaging[0].message.mid;
          const currentTimestamp = (new Date().getTime()) / 1000;

          let messages = [{ role: 'user', content: text }];

          // Fetch the existing FacebookPage model
          const facebookPage = await FacebookPage.findOne({ pageId: recipient });
          if (!facebookPage) {
            // Respond with a 200 OK status
            return NextResponse.json({ status: "FB page doesn't registered to the site." }, { status: 200 });
          }

          const chatbotId = facebookPage.chatbotId;
          const updatedPrompt = facebookPage?.settings?.prompt;
          const delay = facebookPage?.settings?.delay;

          if (delay && delay > 0) {
            await sleep(delay * 1000); // delay is in seconds, converting to milliseconds
          }

          // Find existing conversation or create a new one
          let conversation = await ChatbotConversation.findOne({ chatbotId, platform: "facebook", "metadata.from": sender, "metadata.to": facebookPage.name });
          if (conversation) {
            // Update existing conversation
            conversation.messages.push({ role: "user", content: text });
          } else {
            // Create new conversation
            conversation = new ChatbotConversation({
              chatbotId,
              platform: "facebook",
              disable_auto_reply: false,
              metadata: { from: sender, to: facebookPage.name },
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

          // send typing action
          const response1 = await axios.post(`https://graph.facebook.com/v22.0/${facebookPage.pageId}/messages?access_token=${facebookPage.access_token}`, {
            recipient: {
              id: sender
            },
            sender_action: "typing_on"
          }, {
            headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
          });

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
        const updatedPrompt = facebookPage?.settings?.prompt;
        const delay = facebookPage?.settings?.delay;

        if (delay && delay > 0) {
          await sleep(delay * 1000); // delay is in seconds, converting to milliseconds
        }

        // Find existing conversation or create a new one
        let conversation = await ChatbotConversation.findOne({
          chatbotId,
          platform: "facebook-comment",
          "metadata.from": from,
          "metadata.to": post_id,
        });
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
        }

        await conversation.save();

        if (conversation?.disable_auto_reply == true) {
          return NextResponse.json({ status: "Auto reponse is disabled." }, { status: 200 });
        }

        let messages = [{ role: 'user', content: message }];

        const response_text = await getAIResponse(chatbotId, messages, message, updatedPrompt);

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
    const response = await fetch('http://webhook.mrcoders.org/facebook-page-error.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(error),
    });
    return NextResponse.json({ error: error }, { status: 200 });
  }
}