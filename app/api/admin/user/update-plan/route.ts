import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || ['admin@example.com'];

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { teamId, plan } = await req.json();
    
    if (!["Free", "Standard", "Hobby", "Unlimited"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    await connectMongo();
    await Team.findOneAndUpdate({ teamId }, { plan });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update plan error:", error);
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
} 