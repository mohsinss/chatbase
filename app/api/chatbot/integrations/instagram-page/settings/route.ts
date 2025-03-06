import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import InstagramPage from "@/models/InstagramPage";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");

    await connectMongo();
    const instagramPage = await InstagramPage.findById(_id);
    return NextResponse.json(instagramPage?.settings ?? {});
}

export async function POST(req: Request) {
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    const settings = await req.json();

    await connectMongo();

    const updatedInstagramPage = await InstagramPage.findByIdAndUpdate(
        _id,
        { settings },
        { new: true, upsert: true }
    );

    if (!updatedInstagramPage) {
        return NextResponse.json({ success: false, message: "Update failed: Document not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, settings: updatedInstagramPage.settings });
}