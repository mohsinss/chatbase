import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import WhatsAppNumber from "@/models/WhatsAppNumber";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");

    await connectMongo();
    const whatsAppuNumber = await WhatsAppNumber.findById(_id);
    console.log(whatsAppuNumber.phoneNumberId)
    return NextResponse.json({});
}

export async function POST(req: Request) {
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    const profile = await req.json();

    await connectMongo();

    const whatsAppuNumber = await WhatsAppNumber.findById(_id);
    console.log(whatsAppuNumber.phoneNumberId)

    return NextResponse.json({ success: true, settings: profile });
}