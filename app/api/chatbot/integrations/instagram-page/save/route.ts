import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Chatbot from "@/models/Chatbot";
import axios from "axios";
import InstagramPage from "@/models/InstagramPage";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { user_access_token, chatbotId } = await req.json();

        // Check if chatbotId is provided
        if (!chatbotId) {
            return new NextResponse("chatbotId is missing.", { status: 400 });
        }

        if (!user_access_token) {
            return NextResponse.json({ error: "user_access_token is required" }, { status: 400 });
        }

        await connectMongo();

        // Step 1: Exchange the code for a business token
        const response = await axios.get('https://graph.facebook.com/v21.0/oauth/access_token', {
            params: {
                client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
                client_secret: process.env.FACEBOOK_APP_SECRET,
                fb_exchange_token: user_access_token,
                grant_type: 'fb_exchange_token',
            }
        });

        if (response.data.error) {
            console.error(response.data.error);
            return NextResponse.json({ error: response.data.error.message }, { status: 500 });
        }

        const long_user_access_token = response.data.access_token;

        // Retrive Pages from long_user_access_token and subscribe/save.
        const response1 = await axios.get(`https://graph.facebook.com/v22.0/me/accounts?fields=name,access_token,tasks,instagram_business_account&access_token=${long_user_access_token}`, {
            headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
        });
        const data = response1.data;

        for (let i = 0; i < data.data.length; i++) {
            let page = data.data[i];
            let pageId = page.id;
            let instagram_business_account = page?.instagram_business_account?.id;

            if (instagram_business_account) {
                // Retrive instagram user.
                const response3 = await axios.get(`https://graph.facebook.com/v22.0/${instagram_business_account}?fields=username&access_token=${long_user_access_token}`, {
                    headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
                });
                const igUserData = response3.data;
                console.log(igUserData)

                // Subscribe Page to webhook
                const response2 = await axios.post(`https://graph.facebook.com/v22.0/${pageId}/subscribed_apps?subscribed_fields=messages,messaging_postbacks,messages,conversations,feed,message_mention,group_feed&access_token=${page.access_token}`, {}, {
                    headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
                });
                if (!response2.data.success) {
                    return NextResponse.json({ success: false, message: response2.data.error?.message || 'Page Subscription failed.' });
                }

                // Find FacebookPage with pageId and update it
                const instagramPage = await InstagramPage.findOneAndUpdate(
                    { pageId }, // find a document with phoneNumberId
                    {
                        // update these fields
                        chatbotId,
                        name: page.name,
                        access_token: page.access_token,
                        instagram_business_account,
                        instagram_business_account_name: igUserData.username
                    },
                    {
                        new: true, // return the new FacebookPage instead of the old one
                        upsert: true, // make this update into an upsert
                    }
                );
            }
        }

        if (data.data.length > 0) {
            // Find the Chatbot with chatbotId and update it
            const chatbot = await Chatbot.findOneAndUpdate(
                { chatbotId }, // find a document with chatbotId
                {
                    // update the integrations field
                    $set: { "integrations.instagram": true }
                },
                {
                    new: true, // return the new Chatbot instead of the old one
                }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error.message || "Error saving Instagram credentials:");
        return new NextResponse(error.message || "Internal Server Error", { status: 500 });
    }
} 