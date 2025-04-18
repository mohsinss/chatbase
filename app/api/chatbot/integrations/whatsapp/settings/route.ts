import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import WhatsAppNumber from "@/models/WhatsAppNumber";

/**
 * GET handler for retrieving settings for a specific WhatsApp number
 * @param req Request object
 * @returns JSON response with WhatsApp number settings or empty object
 */
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const _id = url.searchParams.get("_id");

        if (!_id) {
            return NextResponse.json(
                { success: false, message: "Missing required parameter: _id" },
                { status: 400 }
            );
        }

        await connectMongo();
        const whatsAppNumber = await WhatsAppNumber.findById(_id);
        
        if (!whatsAppNumber) {
            return NextResponse.json(
                { success: false, message: "WhatsApp number not found" },
                { status: 404 }
            );
        }

        // Return settings or empty object if not set
        return NextResponse.json({
            ...whatsAppNumber?.settings ?? {}
        });
    } catch (error) {
        console.error("Error retrieving WhatsApp number settings:", error);
        return NextResponse.json(
            { success: false, message: "Failed to retrieve WhatsApp number settings" },
            { status: 500 }
        );
    }
}

/**
 * POST handler for updating settings for a specific WhatsApp number
 * @param req Request object with settings in body
 * @returns JSON response with updated settings
 */
export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const _id = url.searchParams.get("_id");

        if (!_id) {
            return NextResponse.json(
                { success: false, message: "Missing required parameter: _id" },
                { status: 400 }
            );
        }

        const settings = await req.json();

        await connectMongo();

        const updatedWhatsAppNumber = await WhatsAppNumber.findByIdAndUpdate(
            _id,
            { settings },
            { new: true }
        );

        if (!updatedWhatsAppNumber) {
            return NextResponse.json(
                { success: false, message: "Update failed: WhatsApp number not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            settings: updatedWhatsAppNumber.settings
        });
    } catch (error) {
        console.error("Error updating WhatsApp number settings:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update WhatsApp number settings" },
            { status: 500 }
        );
    }
}
