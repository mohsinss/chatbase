import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import GoogleIntegration from "@/models/GoogleIntegration";
import GoogleSheetConfig from "@/models/GoogleSheetConfig";

// This prevents the route from being prerendered during build
export const dynamic = 'force-dynamic';

export async function DELETE(request: Request) {
  try {
    await connectMongo();
    
    // Parse request body
    const body = await request.json();
    const { chatbotId } = body;
    
    if (!chatbotId) {
      return NextResponse.json({ error: "Missing required parameter: chatbotId" }, { status: 400 });
    }
    
    // Delete Google integration
    const deleteResult = await GoogleIntegration.deleteOne({ chatbotId });
    
    // Also delete any Google Sheet configurations
    await GoogleSheetConfig.deleteMany({ chatbotId });
    
    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ message: "No Google integration found to remove" });
    }
    
    return NextResponse.json({ message: "Google authorization removed successfully" });
  } catch (error) {
    console.error("Error removing Google authorization:", error);
    return NextResponse.json({ error: "Failed to remove Google authorization" }, { status: 500 });
  }
}
