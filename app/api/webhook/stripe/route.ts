import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import Payment from "@/models/Payment";
import Invoice from "@/models/Invoice";
import Subscription from "@/models/Subscription";
import Customer from "@/models/Customer";
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

  // Log webhook data if enabled
  if (process.env.ENABLE_WEBHOOK_LOGGING_STRIPE == "1") {
    try {
      const response = await fetch(process.env.ENDPOINT_LOGGING_STRIPE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        console.error(`Webhook logging error: ${response.status}`);
      }
    } catch (error) {
      console.error('Webhook logging error:', JSON.stringify(event));
      // Continue execution even if logging fails
    }
  }

  eventType = event.type;
  console.log('eventType', eventType)
  
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
        const paymentIntendId = stripeObject.payment_intent;
        const subscriptionId = stripeObject.subscription;

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

            // Create a payment record
            if (paymentIntent.amount > 0) {
              // Create an invoice first
              const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
              const invoice = new Invoice({
                teamId: team._id,
                stripeInvoiceId: `manual_${sessionId}`, // Since this is from checkout, not a regular invoice
                invoiceNumber,
                amount: paymentIntent.amount / 100, // Convert from cents
                currency: paymentIntent.currency,
                status: 'paid',
                dueDate: new Date(),
                paidAt: new Date(),
                billingReason: 'subscription_create',
                description: `Subscription to ${plan} plan`,
                periodStart: new Date(),
                periodEnd: team.dueDate,
                subscriptionId: subscriptionId,
                plan: plan,
                lineItems: [{
                  description: `${plan} plan ${isYearly ? 'yearly' : 'monthly'} subscription`,
                  amount: paymentIntent.amount / 100,
                  quantity: 1,
                  priceId: metadata.priceId,
                }],
                subtotal: paymentIntent.amount / 100,
                total: paymentIntent.amount / 100,
                billingDetails: {
                  email: billingDetails.email,
                  address: {
                    line1: billingDetails.address?.line1 || '',
                    line2: billingDetails.address?.line2 || '',
                    city: billingDetails.address?.city || '',
                    state: billingDetails.address?.state || '',
                    postal_code: billingDetails.address?.postal_code || '',
                    country: billingDetails.address?.country || '',
                  },
                },
              });
              
              await invoice.save();

              // Create payment record
              const payment = new Payment({
                teamId: team._id,
                stripePaymentId: paymentIntent.id,
                invoiceId: invoice._id,
                amount: paymentIntent.amount / 100, // Convert from cents
                currency: paymentIntent.currency,
                status: 'succeeded',
                paymentMethod: {
                  type: 'card',
                  brand: card?.brand,
                  last4: card?.last4,
                  exp_month: card?.exp_month,
                  exp_year: card?.exp_year,
                },
                metadata: paymentIntent.metadata,
              });
              
              await payment.save();
            }
          }
        }

        // If this is a subscription, create a subscription record
        if (subscriptionId) {
          const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId as string);
          
          const subscription = new Subscription({
            teamId: team._id,
            stripeSubscriptionId: subscriptionId,
            status: stripeSubscription.status,
            plan: plan,
            isYearly: isYearly === 'true',
            currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
            startDate: new Date(stripeSubscription.start_date * 1000),
            priceId: metadata.priceId,
            quantity: stripeSubscription.items.data[0].quantity,
            metadata: stripeSubscription.metadata,
          });
          
          await subscription.save();
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
        const stripeSubscription = event.data.object as Stripe.Subscription;
        //@ts-ignore
        const { plan, isYearly } = getPlanAndYearlyFromPriceId(stripeSubscription.plan.id);
        //@ts-ignore
        const customerId = stripeSubscription.customer;
        const subscriptionId = stripeSubscription.id;
        
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

          // Update or create subscription record
          const subscription = await Subscription.findOne({ stripeSubscriptionId: subscriptionId });
          
          if (subscription) {
            subscription.status = stripeSubscription.status;
            subscription.plan = plan;
            subscription.isYearly = isYearly;
            subscription.currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
            subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
            subscription.cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end;
            if (stripeSubscription.canceled_at) {
              subscription.canceledAt = new Date(stripeSubscription.canceled_at * 1000);
            }
            //@ts-ignore
            subscription.priceId = stripeSubscription.plan.id;
            subscription.quantity = stripeSubscription.items.data[0].quantity;
            subscription.metadata = stripeSubscription.metadata;
            
            await subscription.save();
          } else {
            // Create new subscription record if it doesn't exist
            const newSubscription = new Subscription({
              teamId: team._id,
              stripeSubscriptionId: subscriptionId,
              status: stripeSubscription.status,
              plan: plan,
              isYearly: isYearly,
              currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
              currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
              cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
              startDate: new Date(stripeSubscription.start_date * 1000),
              //@ts-ignore
              priceId: stripeSubscription.plan.id,
              quantity: stripeSubscription.items.data[0].quantity,
              metadata: stripeSubscription.metadata,
            });
            
            await newSubscription.save();
          }

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
        const subscriptionId = stripeObject.id;

        // Try to find the team directly
        let team = await Team.findOne({ customerId });
        
        // If team not found directly, try to find via Customer model
        if (!team) {
          const customerRecord = await Customer.findOne({ stripeCustomerId: customerId });
          
          if (customerRecord) {
            team = await Team.findById(customerRecord.teamId);
          }
        }

        if (team) {
          // Downgrade the team to the free plan
          team.plan = "Free";

          // Reset credits to free plan limit
          //@ts-ignore
          team.credits = config.stripe.plans.Free.credits;

          // Update subscription record
          const subscription = await Subscription.findOne({ stripeSubscriptionId: subscriptionId });
          
          if (subscription) {
            subscription.status = 'canceled';
            subscription.endedAt = new Date();
            
            await subscription.save();
          }

          // Save the updated team
          await team.save();
        } else {
          console.error(`Team not found for customer ${customerId}. Consider manual intervention.`);
        }

        break;
      }

      case "invoice.paid": {
        // Customer just paid an invoice (for instance, a recurring payment for a subscription)
        // ✅ Grant access to the product
        const stripeInvoice: Stripe.Invoice = event.data.object as Stripe.Invoice;

        // Get the customer ID from the invoice
        const customerId = stripeInvoice.customer as string;

        // Get the subscription ID from the invoice
        const subscriptionId = stripeInvoice.subscription as string;

        if (subscriptionId) {
          try {
            // Retrieve the subscription to get the plan details
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);

            // Get the plan ID from the subscription
            const priceId = subscription.items.data[0].price.id;

            // Get the plan and yearly status from the price ID
            //@ts-ignore
            const { plan, isYearly } = getPlanAndYearlyFromPriceId(priceId);

        // Try to find the team directly
        let team = await Team.findOne({ customerId });
        
        // If team not found directly, try to find via Customer model
        if (!team) {
          const customerRecord = await Customer.findOne({ stripeCustomerId: customerId });
          
          if (customerRecord) {
            team = await Team.findById(customerRecord.teamId);
          } else {
            // Try to get customer details from Stripe
            try {
              const stripeCustomer = await stripe.customers.retrieve(customerId as string) as Stripe.Customer;
              
              if (stripeCustomer && !('deleted' in stripeCustomer)) {
                // Look for a team with a matching email
                const email = stripeCustomer.email;
                if (email) {
                  // Try to find a team where any member has this email
                  const teamByEmail = await Team.findOne({ "members.email": email });
                  
                  if (teamByEmail) {
                    team = teamByEmail;
                    
                    // Update the team with the customer ID
                    team.customerId = customerId;
                    
                    // Create a Customer record for future lookups
                    const newCustomer = new Customer({
                      stripeCustomerId: customerId,
                      teamId: team._id,
                      email: email,
                      name: stripeCustomer.name || '',
                      metadata: stripeCustomer.metadata || {},
                    });
                    
                    await newCustomer.save();
                    console.log(`Created new Customer record for ${customerId} linked to team ${team._id}`);
                  }
                }
              }
            } catch (error) {
              console.error(`Error retrieving customer from Stripe: ${error.message}`);
            }
          }
        }

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

          // Create or update invoice record
          const existingInvoice = await Invoice.findOne({ stripeInvoiceId: stripeInvoice.id });
          
          if (!existingInvoice) {
            // Create new invoice record
            const invoice = new Invoice({
              teamId: team._id,
              stripeInvoiceId: stripeInvoice.id,
              invoiceNumber: stripeInvoice.number,
              amount: stripeInvoice.amount_paid / 100, // Convert from cents
              currency: stripeInvoice.currency,
              status: 'paid',
              dueDate: new Date(stripeInvoice.due_date * 1000),
              paidAt: new Date(),
              billingReason: stripeInvoice.billing_reason,
              description: stripeInvoice.description,
              periodStart: new Date(stripeInvoice.period_start * 1000),
              periodEnd: new Date(stripeInvoice.period_end * 1000),
              subscriptionId: subscriptionId,
              plan: plan,
              lineItems: stripeInvoice.lines.data.map(item => ({
                description: item.description,
                amount: item.amount / 100,
                quantity: item.quantity,
                priceId: item.price?.id,
              })),
              subtotal: stripeInvoice.subtotal / 100,
              tax: stripeInvoice.tax ? stripeInvoice.tax / 100 : undefined,
              discount: stripeInvoice.discount ? (stripeInvoice.discount as any).amount_off / 100 : undefined,
              total: stripeInvoice.total / 100,
              billingDetails: {
                email: team.billingInfo?.email || '',
                address: team.billingInfo?.address || {},
              },
              pdf: stripeInvoice.invoice_pdf,
            });
            
            await invoice.save();

            // Create payment record if there's a charge
            if (stripeInvoice.charge) {
              const charge = await stripe.charges.retrieve(stripeInvoice.charge as string);
              
              const payment = new Payment({
                teamId: team._id,
                stripePaymentId: charge.id,
                invoiceId: invoice._id,
                amount: charge.amount / 100,
                currency: charge.currency,
                status: charge.status,
                paymentMethod: {
                  type: charge.payment_method_details?.type,
                  brand: charge.payment_method_details?.card?.brand,
                  last4: charge.payment_method_details?.card?.last4,
                  exp_month: charge.payment_method_details?.card?.exp_month,
                  exp_year: charge.payment_method_details?.card?.exp_year,
                },
                metadata: charge.metadata,
              });
              
              await payment.save();
            }
          }

          // Update subscription record
          const subscriptionRecord = await Subscription.findOne({ stripeSubscriptionId: subscriptionId });
          
          if (subscriptionRecord) {
            subscriptionRecord.status = subscription.status;
            subscriptionRecord.currentPeriodStart = new Date(subscription.current_period_start * 1000);
            subscriptionRecord.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
            
            await subscriptionRecord.save();
          }

          // Save the updated team
          await team.save();
        } else {
          console.error(`Team not found for customer ${customerId}. Consider manual intervention.`);
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
        const stripeInvoice: Stripe.Invoice = event.data.object as Stripe.Invoice;

        // Get the customer ID from the invoice
        const customerId = stripeInvoice.customer as string;

        // Try to find the team directly
        let team = await Team.findOne({ customerId });
        
        // If team not found directly, try to find via Customer model
        if (!team) {
          const customerRecord = await Customer.findOne({ stripeCustomerId: customerId });
          
          if (customerRecord) {
            team = await Team.findById(customerRecord.teamId);
          }
        }

        if (team) {
          // Add a flag to indicate payment failure
          team.billingInfo = {
            ...team.billingInfo,
            paymentFailed: true,
            lastPaymentFailure: new Date()
          };

          // Create or update invoice record
          const existingInvoice = await Invoice.findOne({ stripeInvoiceId: stripeInvoice.id });
          
          if (existingInvoice) {
            existingInvoice.status = 'uncollectible';
            await existingInvoice.save();
          } else {
            // Create new invoice record
            const invoice = new Invoice({
              teamId: team._id,
              stripeInvoiceId: stripeInvoice.id,
              invoiceNumber: stripeInvoice.number,
              amount: stripeInvoice.amount_due / 100,
              currency: stripeInvoice.currency,
              status: 'uncollectible',
              dueDate: new Date(stripeInvoice.due_date * 1000),
              billingReason: stripeInvoice.billing_reason,
              description: stripeInvoice.description,
              periodStart: new Date(stripeInvoice.period_start * 1000),
              periodEnd: new Date(stripeInvoice.period_end * 1000),
              subscriptionId: stripeInvoice.subscription,
              lineItems: stripeInvoice.lines.data.map(item => ({
                description: item.description,
                amount: item.amount / 100,
                quantity: item.quantity,
                priceId: item.price?.id,
              })),
              subtotal: stripeInvoice.subtotal / 100,
              tax: stripeInvoice.tax ? stripeInvoice.tax / 100 : undefined,
              discount: stripeInvoice.discount ? (stripeInvoice.discount as any).amount_off / 100 : undefined,
              total: stripeInvoice.total / 100,
              billingDetails: {
                email: team.billingInfo?.email || '',
                address: team.billingInfo?.address || {},
              },
              pdf: stripeInvoice.invoice_pdf,
            });
            
            await invoice.save();
          }

          // Update subscription status if applicable
          if (stripeInvoice.subscription) {
            const subscription = await Subscription.findOne({ 
              stripeSubscriptionId: stripeInvoice.subscription 
            });
            
            if (subscription) {
              subscription.status = 'past_due';
              await subscription.save();
            }
          }

          // Save the updated team
          await team.save();

          // Here you could also send a custom email notification to the team admin
          // Or implement a notification system in your app
        } else {
          console.error(`Team not found for customer ${customerId}. Consider manual intervention.`);
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

        // Try to find the team directly
        let team = await Team.findOne({ customerId: customerId as string });
        
        // If team not found directly, try to find via Customer model
        if (!team) {
          const customerRecord = await Customer.findOne({ stripeCustomerId: customerId as string });
          
          if (customerRecord) {
            team = await Team.findById(customerRecord.teamId);
          }
        }

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
        } else {
          console.error(`Team not found for customer ${customerId}. Consider manual intervention.`);
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
