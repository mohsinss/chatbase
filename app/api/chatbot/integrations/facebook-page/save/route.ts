import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import FacebookPage from "@/models/FacebookPage";
import Chatbot from "@/models/Chatbot";
import axios from "axios";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { code, chatbotId } = await req.json();

        // Check if chatbotId is provided
        if (!chatbotId) {
            return new NextResponse("chatbotId is missing.", { status: 400 });
        }

        if (!code) {
            return NextResponse.json({ error: "Code is required" }, { status: 400 });
        }

        // Step 1: Exchange the code for a business token
        const response = await axios.get('https://graph.facebook.com/v21.0/oauth/access_token', {
            params: {
                client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
                client_secret: process.env.FACEBOOK_APP_SECRET,
                code: code
            }
        });

        if (response.data.error) {
            console.error(response.data.error);
            return NextResponse.json({ error: response.data.error.message }, { status: 500 });
        }

        const user_access_token = response.data.access_token;

        await connectMongo();

        // Retrive Pages from user_access_token and subscribe/save.
        const response1 = await axios.get(`https://graph.facebook.com/v22.0/me/accounts?fields=name,access_token,tasks&access_token=${user_access_token}`, {
            headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
        });
        const data = response1.data;
        console.log(data.data)

        for (let i = 0; i < data.data.length; i++) {
            let page = data.data[i];
            let pageId = page.id;

            // Subscribe Page to webhook
            const response2 = await axios.post(`https://graph.facebook.com/v22.0/${pageId}/subscribed_apps?subscribed_fields=messages,mention,feed,messaging_postbacks&access_token=${page.access_token}`, {}, {
                headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
            });
            if (!response2.data.success) {
                return NextResponse.json({ success: false, message: response2.data.error?.message || 'Page Subscription failed.' });
            }
            
            const existingFBPage = await FacebookPage.findOne({ pageId });
            let existingChatbotId = null;

            if (existingFBPage) {
                existingChatbotId = existingFBPage.chatbotId;
            }

            // Find FacebookPage with pageId and update it
            const facebookPage = await FacebookPage.findOneAndUpdate(
                { pageId }, // find a document with phoneNumberId
                {
                    // update these fields
                    chatbotId,
                    name: page.name,
                    access_token: page.access_token,
                },
                {
                    new: true, // return the new FacebookPage instead of the old one
                    upsert: true, // make this update into an upsert
                }
            );

            if (existingChatbotId) {
                const remainingPages = await FacebookPage.find({ chatbotId: existingChatbotId });
                if (remainingPages.length === 0) {
                    // Find the Chatbot with chatbotId and update integrations.whatsapp to false
                    const chatbot = await Chatbot.findOneAndUpdate(
                        { chatbotId: existingChatbotId }, // find a document with chatbotId
                        {
                            // update the integrations field
                            $set: { "integrations.messenger": false }
                        },
                        {
                            new: true, // return the new Chatbot instead of the old one
                        }
                    );
                }
            }
        }

        if (data.data.length > 0) {
            // Find the Chatbot with chatbotId and update it
            const chatbot = await Chatbot.findOneAndUpdate(
                { chatbotId }, // find a document with chatbotId
                {
                    // update the integrations field
                    $set: { "integrations.messenger": true }
                },
                {
                    new: true, // return the new Chatbot instead of the old one
                }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error saving FB page credentials:");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
} 