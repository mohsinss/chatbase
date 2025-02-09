import { NextResponse, NextRequest } from "next/server";
import axios from 'axios';
import connectMongo from "@/libs/mongoose";

export async function POST(req: NextRequest) {
    await connectMongo();

    const body = await req.json();
    const { appId, appSecret, code, wabaId, businessPortfolioId, systemToken } = body;

    if (!appId || !appSecret || !code) {
        return NextResponse.json({ error: "App ID, App Secret and Code are required" }, { status: 400 });
    }

    try {
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

        const businessToken = response.data

        // Step 2: Subscribe to webhooks on the customer's WABA
        const wabaResponse = await axios.post(`https://graph.facebook.com/v21.0/${wabaId}/subscribed_apps`, {}, {
            headers: {
                'Authorization': `Bearer ${businessToken}`
            }
        });

        if (wabaResponse.data.error) {
            console.error(wabaResponse.data.error);
            return NextResponse.json({ error: wabaResponse.data.error.message }, { status: 500 });
        }

        if (!wabaResponse.data.success) {
            console.error(wabaResponse.data.error);
            return NextResponse.json({ error: "subscribe app is failed" }, { status: 500 });
        }

        // Retrieve the credit line ID
        const creditLineResponse = await axios.get(`https://graph.facebook.com/v21.0/${businessPortfolioId}/extendedcredits`, {
            headers: {
                'Authorization': `Bearer ${process.env.FACEBOOK_BUSINESS_SYSTEM_TOKEN}`
            }
        });

        if (creditLineResponse.data.error) {
            console.error(creditLineResponse.data.error);
            return NextResponse.json({ error: creditLineResponse.data.error.message }, { status: 500 });
        }

        const extendedCreditLineId = creditLineResponse.data.data[0].id;

        // Step 3: Share your credit line with the customer
        const creditResponse = await axios.post(`https://graph.facebook.com/v21.0/${extendedCreditLineId}/whatsapp_credit_sharing_and_attach?waba_currency=USD&waba_id=${wabaId}`, {}, {
            headers: {
                'Authorization': `Bearer ${systemToken}`
            }
        });

        if (creditResponse.data.error) {
            console.error(creditResponse.data.error);
            return NextResponse.json({ error: creditResponse.data.error.message }, { status: 500 });
        }
        // Handle the response from Facebook API
        // For example, you might want to save the business token to your database
        // ...

        return NextResponse.json({ businessToken: response.data.access_token });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}