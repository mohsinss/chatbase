import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Stripe from "stripe";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import Subscription from "@/models/Subscription";
import { authOptions } from "@/libs/next-auth";
import config from "@/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
  typescript: true,
});

// Get subscription details
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to access subscription details" },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const teamId = searchParams.get("teamId");
    
    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is required" },
        { status: 400 }
      );
    }

    await connectMongo();

    // Check if user is a member of the team
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to view team subscription
    const isAdmin = team.members.some(
      (member: any) => member.email === session.user.email && member.role === "Admin"
    );

    if (!isAdmin) {
      return NextResponse.json(
        { error: "You are not authorized to view this team's subscription" },
        { status: 403 }
      );
    }

    // Get subscription details
    const subscription = await Subscription.findOne({ 
      teamId,
      status: { $in: ['active', 'trialing', 'past_due'] }
    }).sort({ createdAt: -1 });

    if (!subscription) {
      return NextResponse.json(
        { error: "No active subscription found for this team" },
        { status: 404 }
      );
    }

    // Get more details from Stripe if needed
    let stripeSubscription;
    if (subscription.stripeSubscriptionId) {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
      } catch (error) {
        console.error("Error retrieving Stripe subscription:", error);
      }
    }

    return NextResponse.json({
      subscription: {
        id: subscription._id,
        status: subscription.status,
        plan: subscription.plan,
        isYearly: subscription.isYearly,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        startDate: subscription.startDate,
        endedAt: subscription.endedAt,
        stripeDetails: stripeSubscription ? {
          cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
          currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
          cancelAt: stripeSubscription.cancel_at ? new Date(stripeSubscription.cancel_at * 1000) : null,
        } : null,
      },
      team: {
        id: team._id,
        name: team.name,
        plan: team.plan,
        dueDate: team.dueDate,
        nextRenewalDate: team.nextRenewalDate,
        credits: team.credits,
      },
    });
  } catch (error) {
    console.error("Error fetching subscription details:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription details" },
      { status: 500 }
    );
  }
}

// Update subscription (cancel, change plan, etc.)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to manage subscriptions" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { teamId, action, priceId } = body;
    
    if (!teamId || !action) {
      return NextResponse.json(
        { error: "Team ID and action are required" },
        { status: 400 }
      );
    }

    await connectMongo();

    // Check if user is a member of the team
    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to manage team subscription
    const isAdmin = team.members.some(
      (member: any) => member.email === session.user.email && member.role === "Admin"
    );

    if (!isAdmin) {
      return NextResponse.json(
        { error: "You are not authorized to manage this team's subscription" },
        { status: 403 }
      );
    }

    // Get subscription details
    const subscription = await Subscription.findOne({ 
      teamId,
      status: { $in: ['active', 'trialing', 'past_due'] }
    }).sort({ createdAt: -1 });

    if (!subscription) {
      return NextResponse.json(
        { error: "No active subscription found for this team" },
        { status: 404 }
      );
    }

    // Handle different actions
    switch (action) {
      case "cancel": {
        // Cancel subscription at period end
        const stripeSubscription = await stripe.subscriptions.update(
          subscription.stripeSubscriptionId,
          { cancel_at_period_end: true }
        );

        // Update local subscription record
        subscription.cancelAtPeriodEnd = true;
        await subscription.save();

        return NextResponse.json({
          success: true,
          message: "Subscription will be canceled at the end of the current billing period",
          subscription: {
            id: subscription._id,
            status: subscription.status,
            cancelAtPeriodEnd: true,
            currentPeriodEnd: subscription.currentPeriodEnd,
          },
        });
      }

      case "reactivate": {
        // Reactivate a subscription that was set to cancel
        const stripeSubscription = await stripe.subscriptions.update(
          subscription.stripeSubscriptionId,
          { cancel_at_period_end: false }
        );

        // Update local subscription record
        subscription.cancelAtPeriodEnd = false;
        await subscription.save();

        return NextResponse.json({
          success: true,
          message: "Subscription has been reactivated",
          subscription: {
            id: subscription._id,
            status: subscription.status,
            cancelAtPeriodEnd: false,
            currentPeriodEnd: subscription.currentPeriodEnd,
          },
        });
      }

      case "update_plan": {
        // Validate priceId is provided for plan update
        if (!priceId) {
          return NextResponse.json(
            { error: "Price ID is required to update plan" },
            { status: 400 }
          );
        }

        // Update subscription plan
        const stripeSubscription = await stripe.subscriptions.update(
          subscription.stripeSubscriptionId,
          {
            items: [
              {
                id: (await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId)).items.data[0].id,
                price: priceId,
              },
            ],
            proration_behavior: 'create_prorations',
          }
        );

        // The webhook will handle updating the local subscription record
        // We just return success here

        return NextResponse.json({
          success: true,
          message: "Subscription plan update initiated",
          subscription: {
            id: subscription._id,
            status: 'updating',
          },
        });
      }

      case "cancel_immediately": {
        // Only allow this for admins
        if (!isAdmin) {
          return NextResponse.json(
            { error: "Only admins can cancel subscriptions immediately" },
            { status: 403 }
          );
        }

        // Cancel subscription immediately
        const stripeSubscription = await stripe.subscriptions.cancel(
          subscription.stripeSubscriptionId
        );

        // Update local subscription record
        subscription.status = 'canceled';
        subscription.endedAt = new Date();
        await subscription.save();

        // Update team to free plan
        team.plan = "Free";
        //@ts-ignore
        team.credits = config.stripe.plans.Free.credits;
        await team.save();

        return NextResponse.json({
          success: true,
          message: "Subscription has been canceled immediately",
          subscription: {
            id: subscription._id,
            status: 'canceled',
            endedAt: subscription.endedAt,
          },
        });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error managing subscription:", error);
    return NextResponse.json(
      { error: "Failed to manage subscription" },
      { status: 500 }
    );
  }
}
