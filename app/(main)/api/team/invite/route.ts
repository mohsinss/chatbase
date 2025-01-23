import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { getTeams } from "@/libs/teams";
import Team from "@/models/Team";
import config from "@/config";
import User from "@/models/User";
import connectMongo from "@/libs/mongoose";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        if (!body.members || !body.teamId) {
            return NextResponse.json({ error: "Missing members or teamId" }, { status: 400 });
        }

        await connectMongo();

        for (const member of body.members) {
            const user = await User.findOne({ email: member.email });
            if (!user) {
                return NextResponse.json({ error: `User with email ${member.email} does not exist` }, { status: 400 });
            }
            member.user = user._id.toString();
            member.memberSince = Date.now();
        }

        const team = await Team.findOne({teamId: body.teamId}); // find the team using teamId

        if (!team) {
            return NextResponse.json({ error: "Team not found" }, { status: 404 });
        }

        if (!team.members) {
            team.members = [];
        }

        const newMembersCount = body.members.length;
        const totalMembersCount = team.members.length || 0 + newMembersCount;
        //@ts-ignore
        const memberLimit = config.stripe.plans[team.plan].teamMemberLimit;

        if (totalMembersCount > memberLimit) {
            return NextResponse.json({ error: "Member limit exceeded" }, { status: 400 });
        }

        console.log(body.members);
        team.members.push(...body.members); // update the members field in the Team model
        await team.save(); // save the updated team

        return NextResponse.json({ message: "Team updated successfully", success: true });
    } catch (error: any) {
        console.error("invite team members error:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to invite members" },
            { status: 500 }
        );
    }
} 