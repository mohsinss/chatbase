import { NextResponse } from "next/server";

// This prevents the route from being prerendered during build
export const dynamic = 'force-dynamic';
import connectMongo from "@/libs/mongoose";
import ChatbotConversation from "@/models/ChatbotConversation";
import InstagramPage from "@/models/InstagramPage";

interface Message {
    mid?: string
}

export async function GET() {
    try {
        await connectMongo();

        if (process.env.ENABLE_WEBHOOK_LOGGING_INSTAGRAM == "1") {
            // Send data to the specified URL
            const response = await fetch('http://webhook.mrcoders.org/detect-instagram-msg-deletion.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            // Check if the request was successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        const conversations = await ChatbotConversation.find({ platform: 'instagram' });

        for (const convo of conversations) {
            const from = convo.metadata?.from;
            const instagram_business_account = convo.metadata?.to;
            if (!from) continue;

            const instagramMessages = await fetchInstagramMessages(instagram_business_account, from);
            //@ts-ignore
            const instagramMessageIds = new Set(instagramMessages.map(msg => msg.id));

            // Get the mids of the last 50 messages from the conversation history
            const last50MessageMids = convo.messages
                .filter((msg: Message) => msg.mid)
                .slice(-50)
                .map((msg: Message) => msg.mid);

            // Identify messages among the last 50 that are missing from Instagram API response
            const messagesToMarkDeleted = last50MessageMids.filter((mid: string) => !instagramMessageIds.has(mid));

            if (messagesToMarkDeleted.length > 0) {
                await ChatbotConversation.updateOne(
                    { _id: convo._id },
                    { $set: { "messages.$[elem].deleted": true } },
                    { arrayFilters: [{ "elem.mid": { $in: messagesToMarkDeleted } }] }
                );
            }
        }

        return NextResponse.json({ success: true, message: "Deleted messages checked" });
    } catch (error) {
        console.error("Error detecting deleted messages:", error);

        if (process.env.ENABLE_WEBHOOK_LOGGING_INSTAGRAM == "1") {
            // Send data to the specified URL
            const response = await fetch('http://webhook.mrcoders.org/detect-instagram-msg-deletion-error.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({error}),
            });

            // Check if the request was successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

async function checkInstagramMessage(chatbotId: string, mid: string) {
    const instagramPage = await InstagramPage.findOne({ chatbotId });
    const access_token = instagramPage.access_token;

    try {
        const response = await fetch(`https://graph.facebook.com/v21.0/${mid}?access_token=${access_token}`);

        if (!response.ok) {
            return false; // Message is likely deleted
        }

        const data = await response.json();
        return !!data.id;
    } catch (error) {
        return false;
    }
}

async function fetchInstagramMessages(instagram_business_account: string, from: string) {
    const instagramPage = await InstagramPage.findOne({ instagram_business_account });
    if(!instagramPage){
        return []
    };
    
    const access_token = instagramPage.access_token;

    let conversationId = '';

    try {
        const response = await fetch(`https://graph.facebook.com/v21.0/${instagramPage.pageId}/conversations?platform=INSTAGRAM&access_token=${access_token}&user_id=${from}`);

        const data = await response.json();

        if (!response.ok) {
            console.error("Failed to fetch instagram conversationId:", data?.error);
            return [];
        }

        conversationId = data.data[0].id;
    } catch (error) {
        console.error("Error fetching Instagram conversationId:", error);
        return [];
    }

    try {
        if (conversationId) {
            const response = await fetch(`https://graph.facebook.com/v21.0/${conversationId}/messages?limit=50&access_token=${access_token}`);

            const data = await response.json();

            if (!response.ok) {
                console.error("Failed to fetch messages from Instagram:", await response.text());
                return [];
            }

            return data.data || [];
        }
    } catch (error) {
        console.error("Error fetching Instagram messages:", error);
        return [];
    }
}
