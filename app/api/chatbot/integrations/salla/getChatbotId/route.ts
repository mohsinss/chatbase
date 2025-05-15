import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import SallaIntegration from "@/models/SallaIntegration";

export async function GET(request: NextRequest) {
  try {
    const body = await request.json();
    const merchantId = body?.merchant;

    if (!merchantId) {
      return NextResponse.json(
        { success: false, errors: ["merchantId is missing or invalid"] },
        { status: 400 }
      );
    }

    await connectMongo();

    const integration = await SallaIntegration.findOne({ merchantId });

    if (integration && integration.chatbotId) {
      return NextResponse.json({ success: true, chatbotId: integration.settings.chatbotId });
    } else {
      return NextResponse.json({ success: false, errors: ["No chatbotId found for this merchant"] });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, errors: ["Internal server error"] },
      { status: 500 }
    );
  }
}
