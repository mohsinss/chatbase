import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import WhatsAppNumber from "@/models/WhatsAppNumber";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const to = url.searchParams.get("to");

    await connectMongo();
    const whatsAppNumber = await WhatsAppNumber.findOne({ display_phone_number: to });

    if (!whatsAppNumber) {
        return NextResponse.json({ error: "WhatsApp number not found" }, { status: 404 });
    }

    return NextResponse.json(whatsAppNumber);
}

export async function POST(req: Request) {
    const { to, disable_auto_reply } = await req.json();

    if (typeof disable_auto_reply !== 'boolean') {
        return NextResponse.json({ error: "Invalid value for disable_auto_reply" }, { status: 400 });
    }

    await connectMongo();
    const whatsAppNumber = await WhatsAppNumber.findOneAndUpdate(
        { display_phone_number: to },
        { disable_auto_reply },
        { new: true }
    );

    if (!whatsAppNumber) {
        return NextResponse.json({ error: "WhatsApp number not found" }, { status: 404 });
    }

    return NextResponse.json(whatsAppNumber);
}