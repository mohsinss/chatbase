import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { getTeams } from "@/libs/teams";
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teams = await getTeams(session.user.id);
    
    return NextResponse.json({ teams });

  } catch (error: any) {
    console.error("Team list error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to list teams" },
      { status: 500 }
    );
  }
} 