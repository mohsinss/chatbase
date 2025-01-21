import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import connectMongo from "@/libs/mongoose";
import configFile from "@/config";
import User from "@/models/User";
import Team from "@/models/Team";
import { findCheckoutSession } from "@/libs/stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
  typescript: true,
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// This is where we receive Stripe webhook events
// Used to update user data when they subscribe to chatbot plans
// By default, it'll store the user in the database
// See more: https://chatsa.co/docs/features/payments
export async function POST(req: NextRequest) {
  await connectMongo();

  const body = await req.text();

  const signature = headers().get("stripe-signature");

  let eventType;
  let event;

  // verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }


  eventType = event.type;

  console.log("eventType :", eventType)

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        // First payment is successful and a subscription is created
        // ✅ Grant access to chatbot features
        const stripeObject: Stripe.Checkout.Session = event.data
          .object as Stripe.Checkout.Session;

        const sessionId = stripeObject.id;
        const customerId = stripeObject?.customer;
        const metadata = stripeObject?.metadata;
        const plan = metadata.plan;
        const teamId = metadata.teamId;
        const isYearly = metadata.isYearly;
        const paymentIntendId = stripeObject.payment_intent

        // const paymetIntend = stripe.paymentIntents.retrieve(paymentIntendId as string, {expand:['latest_charge']})
        // console.log(stripeObject)

        if (!plan) break;

        const customer = (await stripe.customers.retrieve(
          customerId as string
        )) as Stripe.Customer;

        let team;

        // Get or create the user. userId is normally pass in the checkout session (clientReferenceID) to identify the user when we get the webhook event
        if (teamId) {
          team = await Team.findById(teamId);
          team.plan = plan;
          team.customerId = customerId;
          team.dueDate = isYearly ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)) : new Date(new Date().setMonth(new Date().getMonth() + 1));
          team.billingInfo = {...team.billingInfo, ...stripeObject?.customer_details};

          await team.save();
        }

        // Extra: send email with user link, product page, etc...
        // try {
        //   await sendEmail(...);
        // } catch (e) {
        //   console.error("Email issue:" + e?.message);
        // }

        break;
      }

      case "checkout.session.expired": {
        // User didn't complete the transaction
        // You don't need to do anything here, by you can send an email to the user to remind him to complete the transaction, for instance
        break;
      }

      case "customer.subscription.updated": {
        // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
        // You don't need to do anything here, because Stripe will let us know when the subscription is canceled for good (at the end of the billing cycle) in the "customer.subscription.deleted" event
        // You can update the user data to show a "Cancel soon" badge for instance
        break;
      }

      case "customer.subscription.deleted": {
        // The customer subscription stopped
        // ❌ Revoke access to chatbot features
        const stripeObject: Stripe.Subscription = event.data
          .object as Stripe.Subscription;

        const subscription = await stripe.subscriptions.retrieve(
          stripeObject.id
        );

        break;
      }

      case "invoice.paid": {
        // Customer just paid an invoice (for instance, a recurring payment for a subscription)
        // ✅ Grant access to the product

        const stripeObject: Stripe.Invoice = event.data
          .object as Stripe.Invoice;
        break;
      }

      case "invoice.payment_failed":
        // A payment failed (for instance the customer does not have a valid payment method)
        // ❌ Revoke access to the product
        // ⏳ OR wait for the customer to pay (more friendly):
        //      - Stripe will automatically email the customer (Smart Retries)
        //      - We will receive a "customer.subscription.deleted" when all retries were made and the subscription has expired

        break;

      case 'payment_method.attached': {
        const paymentMethod: Stripe.PaymentMethod = event.data.object as Stripe.PaymentMethod;

        // Extract the necessary information from the paymentMethod object
        // const paymentMethodId = paymentMethod.id;
        const customerId = paymentMethod.customer;
        const card = paymentMethod.card;
        // const billingDetails = paymentMethod.billing_details;

        // Find the team associated with this customer
        const team = await Team.findOne({ customerId: customerId as string });

        if (team) {
          // Update the paymentMethods field with the new card and billing details
          team.billingInfo.paymentMethod.push({
            brand: card.brand,
            last4: card.last4,
            exp_month: card.exp_month,
            exp_year: card.exp_year,
          });

          // Save the updated team
          await team.save();
        }

        break;
      }

      default:
      // Unhandled event type
    }
  } catch (e) {
    console.error("stripe error: ", e.message);
  }

  return NextResponse.json({});
}
