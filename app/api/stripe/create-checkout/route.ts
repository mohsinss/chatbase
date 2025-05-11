import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { createCheckout, createCustomerPortal } from "@/libs/stripe";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Team from "@/models/Team";

// This function is used to create a Stripe Checkout Session (one-time payment or subscription)
// It's called by the <ButtonCheckout /> component
// By default, it doesn't force users to be authenticated. But if they are, it will prefill the Checkout data with their email and/or credit card
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.priceId) {
    return NextResponse.json(
      { error: "Price ID is required" },
      { status: 400 }
    );
  } else if (!body.successUrl || !body.cancelUrl) {
    return NextResponse.json(
      { error: "Success and cancel URLs are required" },
      { status: 400 }
    );
  } else if (body.isYearly == undefined) {
    return NextResponse.json(
      { error: "isYearly is required", },
      { status: 400 }
    );
  } else if (!body.teamId) {
    return NextResponse.json(
      { error: "teamId is required", },
      { status: 400 }
    );
  } else if (!body.plan) {
    return NextResponse.json(
      { error: "plan is required", },
      { status: 400 }
    );
  }

  try {
    const session = await getServerSession(authOptions);

    const { priceId, mode, successUrl, cancelUrl, teamId, isYearly, plan, returnUrl } = body;

    await connectMongo();

    const user = await User.findById(session?.user?.id);
    const team = await Team.findOne({teamId});
    let returnUrl1;

    if(team?.customerId && team?.plan !== "Free") {
      returnUrl1 = await createCustomerPortal({ customerId: team.customerId, returnUrl})
    } else {
      returnUrl1 = await createCheckout({
        priceId,
        mode,
        successUrl,
        cancelUrl,
        // If user is logged in, it will pass the user ID to the Stripe Session so it can be retrieved in the webhook later
        // clientReferenceId: user?._id?.toString(),
        // If user is logged in, this will automatically prefill Checkout data like email and/or credit card for faster checkout
        user: {
          customerId: team?.customerId,
          email: user?.email
        },
        metadata: {
          teamId: team._id.toString(),
          isYearly,
          plan,
          priceId
        }
        // If you send coupons from the frontend, you can pass it here
        // couponId: body.couponId,
      });
    }
    console.log('returnUrl', returnUrl1)
    return NextResponse.json({ url: returnUrl1 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
