import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import crypto from "crypto";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Generate unique team ID
    const teamId = `team-${crypto.randomBytes(4).toString('hex')}`;

    const team = await Team.create({
      teamId,
      createdBy: session.user.id
    });

    // Return just the teamId directly
    return NextResponse.json({ teamId: team.teamId });

  } catch (error: any) {
    console.error("Team creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create team" },
      { status: 500 }
    );
  }
} 