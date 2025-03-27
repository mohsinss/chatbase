import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import WhatsAppNumber from "@/models/WhatsAppNumber";
import axios from "axios";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");

    await connectMongo();
    const whatsAppuNumber = await WhatsAppNumber.findById(_id);

    // Retrive profile from Phone Number Id.
    const profile_response = await axios.get(`https://graph.facebook.com/v22.0/${whatsAppuNumber.phoneNumberId}/whatsapp_business_profile?fields=about,address,description,email,profile_picture_url,websites,vertical`, {
        headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });

    const profile = profile_response.data.data[0];

    return NextResponse.json(
        {
            ...profile
        });
}

export async function POST(req: Request) {
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    const profile = await req.json();

    await connectMongo();

    const whatsAppuNumber = await WhatsAppNumber.findById(_id);
    console.log(whatsAppuNumber.phoneNumberId)

    // Retrive profile from Phone Number Id.
    const profile_response = await axios.post(`https://graph.facebook.com/v22.0/${whatsAppuNumber.phoneNumberId}/whatsapp_business_profile`,{
        ...profile
    }, {
        headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });

    if (profile_response.data.success){
        return NextResponse.json({ success: true, settings: profile });
    };
    
    return NextResponse.json({ success: true, settings: profile });
}