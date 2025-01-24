import connectMongo from '@/libs/mongoose';
import Team from '@/models/Team';
import { NextResponse } from "next/server";
import config from "@/config";

export async function GET() {
    // Connect to the database
    await connectMongo();

    // Get today's date at the start of the day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all renewalTeams where nextRenewalDate is today
    const renewalTeams = await Team.find({ nextRenewalDate: { $eq: today } });

    // For each team, update the nextRenewalDate to one month later
    for (const team of renewalTeams) {
        const nextRenewalDate = new Date(team.nextRenewalDate);
        nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 1);
        nextRenewalDate.setHours(0, 0, 0, 0);
        team.nextRenewalDate = nextRenewalDate;
        //@ts-ignore
        team.credits = 0;
        // team.credits = config.stripe.plans[team.plan].credits;

        // Save the updated team
        await team.save();
    }

    // Find all dueTeams where nextRenewalDate is today
    const dueTeams = await Team.find({ dueDate: { $eq: today } });

    // For each team, update the nextRenewalDate to one month later
    for (const team of dueTeams) {
        team.plan = 'Free';
        //@ts-ignore
        team.credits = 0;
        // team.credits = config.stripe.plans[team.plan].credits;

        // Save the updated team
        await team.save();
    }

    return NextResponse.json({today});
}