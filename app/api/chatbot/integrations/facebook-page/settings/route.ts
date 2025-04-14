import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import FacebookPage from "@/models/FacebookPage";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");

    await connectMongo();
    const facebookPage = await FacebookPage.findById(_id);
    return NextResponse.json(facebookPage?.settings ?? {});
}

export async function POST(req: Request) {
    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    const settings = await req.json();

    await connectMongo();

    const updatedFacebookPage = await FacebookPage.findByIdAndUpdate(
        _id,
        { settings },
        { new: true, upsert: true }
    );

    if (!updatedFacebookPage) {
        return NextResponse.json({ success: false, message: "Update failed: FB page not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, settings: updatedFacebookPage.settings });
}