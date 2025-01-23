import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { teamId, email } = await req.json();

    if (!teamId || !email) {
      return NextResponse.json({ error: "teamId and email are required" }, { status: 400 });
    }

    const team = await Team.findOne({ teamId });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    //@ts-ignore
    const memberIndex = team.members.findIndex(member => member.email === email);

    if (memberIndex === -1) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    team.members.splice(memberIndex, 1);

    await team.save();

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Failed to remove member:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to remove member" },
      { status: 500 }
    );
  }
}