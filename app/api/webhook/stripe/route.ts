import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import { findCheckoutSession, getPlanAndYearlyFromPriceId } from "@/libs/stripe";
import config from "@/config";

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
  const body = await req.text();

  const signature = headers().get("stripe-signature");

  let eventType;
  let event;

  // verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook construction failed. ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }


  eventType = event.type;

  console.log("eventType :", eventType)
  console.log("event :", event)

  await connectMongo();

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

        if (!plan) break;

        let team: any;

        // Get or create the user. userId is normally pass in the checkout session (clientReferenceID) to identify the user when we get the webhook event
        if (teamId) {
          team = await Team.findById(teamId);
          team.plan = plan;
          team.customerId = customerId;
          let dueDate = isYearly ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)) : new Date(new Date().setMonth(new Date().getMonth() + 1));
          dueDate.setHours(0, 0, 0, 0);
          let nextRenewalDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
          nextRenewalDate.setHours(0, 0, 0, 0);
          team.dueDate = dueDate;
          team.nextRenewalDate = nextRenewalDate;
          team.billingInfo = { ...team.billingInfo, ...stripeObject?.customer_details };
          //@ts-ignore
          team.credits = config.stripe.plans[team.plan].credits;
        }

        if (paymentIntendId) {
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntendId as string, {
            expand: ['latest_charge'],
          });

          const charge = paymentIntent.latest_charge as Stripe.Charge;

          if (team && charge) {
            const billingDetails = charge.billing_details;
            const card = charge.payment_method_details?.card;

            team.billingInfo = {
              email: billingDetails.email,
              address: {
                line1: billingDetails.address?.line1 || '',
                line2: billingDetails.address?.line2 || '',
                city: billingDetails.address?.city || '',
                state: billingDetails.address?.state || '',
                postal_code: billingDetails.address?.postal_code || '',
                country: billingDetails.address?.country || '',
              },
              paymentMethod: card
                ? [{
                  brand: card.brand,
                  last4: card.last4,
                  exp_month: card.exp_month,
                  exp_year: card.exp_year,
                }]
                : [],
            };

          }
        }

        await team.save();
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
        //@ts-ignore
        const { plan, isYearly } = getPlanAndYearlyFromPriceId(event.data.object.plan.id);
        //@ts-ignore
        const customerId = event.data.object.customer;
        console.log(plan, isYearly, customerId)
        let team = await Team.findOne({ customerId });
        if (team) {
          team.plan = plan;
          team.customerId = customerId;
          let dueDate = isYearly ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)) : new Date(new Date().setMonth(new Date().getMonth() + 1));
          dueDate.setHours(0, 0, 0, 0);
          let nextRenewalDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
          nextRenewalDate.setHours(0, 0, 0, 0);
          team.dueDate = dueDate;
          team.nextRenewalDate = nextRenewalDate;
          //@ts-ignore
          team.credits = config.stripe.plans[team.plan].credits;

          await team.save();
        }
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

        const customerId = stripeObject.customer as string;

        // Find the team associated with this customer
        const team = await Team.findOne({ customerId });

        if (team) {
          // Downgrade the team to the free plan
          team.plan = "Free";

          // Reset credits to free plan limit
          //@ts-ignore
          team.credits = config.stripe.plans.Free.credits;

          // Save the updated team
          await team.save();
          console.log(`Subscription canceled for team ${team.teamId}, downgraded to Free plan`);
        } else {
          console.error(`Team not found for customer ${customerId}`);
        }

        break;
      }

      case "invoice.paid": {
        // Customer just paid an invoice (for instance, a recurring payment for a subscription)
        // ✅ Grant access to the product
        const stripeObject: Stripe.Invoice = event.data.object as Stripe.Invoice;

        // Get the customer ID from the invoice
        const customerId = stripeObject.customer as string;

        // Get the subscription ID from the invoice
        const subscriptionId = stripeObject.subscription as string;

        if (subscriptionId) {
          try {
            // Retrieve the subscription to get the plan details
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);

            // Get the plan ID from the subscription
            const priceId = subscription.items.data[0].price.id;

            // Get the plan and yearly status from the price ID
            //@ts-ignore
            const { plan, isYearly } = getPlanAndYearlyFromPriceId(priceId);

            // Find the team associated with this customer
            const team = await Team.findOne({ customerId });

            if (team) {
              // Update the team's plan
              team.plan = plan;

              // Calculate new due date based on whether it's yearly or monthly
              let dueDate = isYearly
                ? new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                : new Date(new Date().setMonth(new Date().getMonth() + 1));
              dueDate.setHours(0, 0, 0, 0);

              // Calculate next renewal date (always one month ahead for billing purposes)
              let nextRenewalDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
              nextRenewalDate.setHours(0, 0, 0, 0);

              // Update team with new dates
              team.dueDate = dueDate;
              team.nextRenewalDate = nextRenewalDate;

              // Reset credits to plan limit
              //@ts-ignore
              team.credits = config.stripe.plans[team.plan].credits;

              // Save the updated team
              await team.save();
              console.log(`Invoice paid for team ${team.teamId}, plan: ${plan}, credits reset to ${team.credits}`);
            } else {
              console.error(`Team not found for customer ${customerId}`);
            }
          } catch (error) {
            console.error(`Error processing invoice payment: ${error.message}`);
          }
        }

        break;
      }

      case "invoice.payment_failed": {
        // A payment failed (for instance the customer does not have a valid payment method)
        // We'll log the failure but not immediately revoke access
        // Stripe will automatically email the customer (Smart Retries)
        // We will receive a "customer.subscription.deleted" when all retries were made and the subscription has expired
        const stripeObject: Stripe.Invoice = event.data.object as Stripe.Invoice;

        // Get the customer ID from the invoice
        const customerId = stripeObject.customer as string;

        // Find the team associated with this customer
        const team = await Team.findOne({ customerId });

        if (team) {
          // Add a flag to indicate payment failure
          team.billingInfo = {
            ...team.billingInfo,
            paymentFailed: true,
            lastPaymentFailure: new Date()
          };

          // Save the updated team
          await team.save();
          console.log(`Payment failed for team ${team.teamId}, flagged in database`);

          // Here you could also send a custom email notification to the team admin
          // Or implement a notification system in your app
        } else {
          console.error(`Team not found for customer ${customerId}`);
        }

        break;
      }

      case 'payment_method.attached': {
        const paymentMethod: Stripe.PaymentMethod = event.data.object as Stripe.PaymentMethod;

        // Extract the necessary information from the paymentMethod object
        const paymentMethodId = paymentMethod.id;
        const customerId = paymentMethod.customer;
        const card = paymentMethod.card;
        const billingDetails = paymentMethod.billing_details;

        // Find the team associated with this customer
        const team = await Team.findOne({ customerId: customerId as string });

        if (team) {
          // Initialize paymentMethod array if it doesn't exist
          if (!team.billingInfo) {
            team.billingInfo = {
              email: billingDetails?.email || '',
              address: {
                line1: billingDetails?.address?.line1 || '',
                country: billingDetails?.address?.country || ''
              },
              paymentMethod: []
            };
          } else if (!team.billingInfo.paymentMethod) {
            team.billingInfo.paymentMethod = [];
          }

          // Update the paymentMethods field with the new card and billing details
          team.billingInfo.paymentMethod.push({
            brand: card.brand,
            last4: card.last4,
            exp_month: card.exp_month,
            exp_year: card.exp_year,
          });

          // Update billing details if available
          if (billingDetails) {
            if (billingDetails.email) {
              team.billingInfo.email = billingDetails.email;
            }

            if (billingDetails.address) {
              team.billingInfo.address = {
                ...team.billingInfo.address,
                line1: billingDetails.address.line1 || team.billingInfo.address.line1,
                country: billingDetails.address.country || team.billingInfo.address.country
              };
            }
          }

          // Save the updated team
          await team.save();
          console.log(`Payment method ${paymentMethodId} attached to team ${team.teamId}`);
        } else {
          console.error(`Team not found for customer ${customerId}`);
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
