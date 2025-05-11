import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Stripe from "stripe";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import { authOptions } from "@/libs/next-auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
  typescript: true,
});

// Create a Stripe Customer Portal session
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to access the customer portal" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { teamId, returnUrl } = body;

    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is required" },
        { status: 400 }
      );
    }

    await connectMongo();

    // Check if user is a member of the team
    const team = await Team.findOne({ teamId });
    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to access team's customer portal
    const isAdmin = team.members.some(
      (member: any) => member.email === session.user.email && member.role === "Admin"
    );

    // if (!isAdmin) {
    //   return NextResponse.json(
    //     { error: "You are not authorized to access this team's customer portal" },
    //     { status: 403 }
    //   );
    // }

    // Check if team has a Stripe customer ID
    if (!team.customerId) {
      return NextResponse.json(
        { error: "This team does not have a Stripe customer ID" },
        { status: 404 }
      );
    }

    // Create a customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: team.customerId,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_DOMAIN || process.env.LIVE_DOMAIN}/dashboard`,
      flow_data: {
        type: 'payment_method_update',
      },
    });

    return NextResponse.json({
      url: portalSession.url,
    });
  } catch (error) {
    console.error("Error creating customer portal session:", error);
    return NextResponse.json(
      { error: "Failed to create customer portal session" },
      { status: 500 }
    );
  }
}
