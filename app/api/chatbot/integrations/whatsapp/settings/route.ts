import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import WhatsAppNumber from "@/models/WhatsAppNumber";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");

    await connectMongo();
    const whatsAppuNumber = await WhatsAppNumber.findById(_id);
    return NextResponse.json(whatsAppuNumber?.settings ?? {});
}

export async function POST(req: Request) {
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    const settings = await req.json();

    await connectMongo();

    const updatedWhatsAppNumber = await WhatsAppNumber.findByIdAndUpdate(
        _id,
        { settings },
        { new: true, upsert: true }
    );

    if (!updatedWhatsAppNumber) {
        return NextResponse.json({ success: false, message: "Update failed: Document not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, settings: updatedWhatsAppNumber.settings });
}