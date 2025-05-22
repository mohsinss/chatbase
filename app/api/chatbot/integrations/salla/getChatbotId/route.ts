import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import SallaIntegration from "@/models/SallaIntegration";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const merchantId = url.searchParams.get("merchant");

    if (!merchantId) {
      return NextResponse.json(
        { success: false, errors: ["merchantId is missing or invalid"] },
        { status: 400 }
      );
    }

    await connectMongo();

    const integration = await SallaIntegration.findOne({ merchantId });

    if (integration && integration.settings.chatbotId) {
      return NextResponse.json({ success: true, chatbotId: integration.settings.chatbotId, settings: integration.settings });
    } else {
      return NextResponse.json({ success: false, errors: ["No chatbotId found for this merchant"] });
    }
  } catch (error) {
    console.error("Error in getChatbotId:", error);
    return NextResponse.json(
      { success: false, errors: ["Internal server error"] },
      { status: 500 }
    );
  }
}
