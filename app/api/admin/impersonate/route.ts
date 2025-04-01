import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || ['admin@example.com']; 

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Verify the user is an admin
    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get the teamId and chatbotId from the request
    const { teamId, chatbotId } = await req.json();
    
    if (!teamId || !chatbotId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Create an admin session for the specified resource
    // This could involve setting cookies or session data that grants access
    
    // Here we're just returning success, but in a real implementation
    // you'd likely set some session data or cookies
    
    return NextResponse.json({ 
      success: true,
      message: "Admin access granted",
      adminAccess: {
        teamId,
        chatbotId,
        grantedBy: session.user.email,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error("Admin impersonation error:", error);
    return NextResponse.json({ error: "Failed to create admin access" }, { status: 500 });
  }
} 