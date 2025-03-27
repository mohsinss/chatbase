import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import WhatsAppNumber from "@/models/WhatsAppNumber";
import axios from "axios";

export async function GET(req: Request) {
    try {
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
    } catch (error) {
        return new NextResponse(error?.message || "Internal Server Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const _id = url.searchParams.get("_id");
        const formData = await req.formData();

        const about = formData.get("about") as string;
        const address = formData.get("address") as string;
        const description = formData.get("description") as string;
        const email = formData.get("email") as string;
        const websites = formData.get("websites");
        // const websites = JSON.parse(formData.get("websites") as string);

        const profile_picture_file = formData.get("profile_picture") as File | null;

        await connectMongo();
        const whatsAppuNumber = await WhatsAppNumber.findById(_id);

        let profile_picture_handle: string | undefined;

        if (profile_picture_file) {
            const fileBuffer = Buffer.from(await profile_picture_file.arrayBuffer());
            const fileLength = fileBuffer.length;
            const fileType = profile_picture_file.type;
            console.log(fileType, fileLength)

            // Step 1: Create upload session
            const sessionResponse = await axios.post(
                `https://graph.facebook.com/v22.0/app/uploads`,
                null,
                {
                    params: {
                        file_length: fileLength,
                        file_type: fileType,
                    },
                    headers: {
                        Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}`,
                    },
                }
            );

            const uploadId = sessionResponse.data.id;

            // Step 2: Upload file data
            const uploadResponse = await axios.post(
                `https://graph.facebook.com/v22.0/${uploadId}`,
                fileBuffer,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}`,
                        "Content-Type": fileType,
                        "file_offset": 0,
                    },
                }
            );

            profile_picture_handle = uploadResponse.data.h;
            console.log(profile_picture_handle)
        }

        const profilePayload: any = {
            messaging_product: "whatsapp",
            about,
            address,
            description,
            email,
            websites,
        };

        if (profile_picture_handle) {
            profilePayload.profile_picture_handle = profile_picture_handle;

            // Wait for 3 seconds to ensure WhatsApp processes the uploaded image
            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        // Retrive profile from Phone Number Id.
        const profile_response = await axios.post(`https://graph.facebook.com/v22.0/${whatsAppuNumber.phoneNumberId}/whatsapp_business_profile`, {
            ...profilePayload,
        }, {
            headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
        });

        if (profile_response.data.success) {
            return NextResponse.json({ success: true });
        };

        return NextResponse.json({ success: false });
    } catch (error) {
        // console.log(error)
        return new NextResponse(error?.message || "Internal Server Error", { status: 500 });
    }
}