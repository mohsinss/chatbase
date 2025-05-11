import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-08-16",
    typescript: true,
});

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const teamId = searchParams.get("teamId");

        if (!teamId) {
            return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
        }

        await connectMongo();

        const team = await Team.findOne({ teamId });
        if (!team) {
            return NextResponse.json({ error: "Team not found" }, { status: 404 });
        }

        if (!team.customerId) {
            return NextResponse.json({ error: "Team does not have a Stripe customer ID" }, { status: 404 });
        }

        // Fetch payment intents for the customer from Stripe
        // Instead, fetch all payment methods for the customer
        const paymentMethods = await stripe.paymentMethods.list({
          customer: team.customerId,
          // type: 'card',
          limit: 20,
        });

        // Map payment methods to a simpler format
        const payments = paymentMethods.data.map(pm => ({
          id: pm.id,
          brand: pm.card?.brand,
          last4: pm.card?.last4,
          exp_month: pm.card?.exp_month,
          exp_year: pm.card?.exp_year,
          type: pm.type,
          createdAt: pm.created ? new Date(pm.created * 1000).toISOString() : undefined,
        }));

        return NextResponse.json({ paymentMethods });
    } catch (error: any) {
        console.error("Error fetching Stripe customer payments:", error);
        return NextResponse.json({ error: "Failed to fetch payments from Stripe" }, { status: 500 });
    }
}
