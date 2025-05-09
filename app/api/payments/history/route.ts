import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import Invoice from "@/models/Invoice";
import Payment from "@/models/Payment";
import Subscription from "@/models/Subscription";
import { authOptions } from "@/libs/next-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to access payment history" },
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

    // Check if user is authorized to view team payment history
    const isMember = team.members.some(
      (member: any) => member.email === session.user.email && member.status === "Active"
    );
    const isAdmin = team.members.some(
      (member: any) => member.email === session.user.email && member.role === "Admin"
    );

    if (!isMember && !isAdmin) {
      return NextResponse.json(
        { error: "You are not authorized to view this team's payment history" },
        { status: 403 }
      );
    }

    // Get invoices for the team
    const invoices = await Invoice.find({ teamId }).sort({ createdAt: -1 });

    // Get payments for the team
    const payments = await Payment.find({ teamId }).sort({ createdAt: -1 });

    // Get subscription details
    const subscription = await Subscription.findOne({ 
      teamId, 
      status: { $in: ['active', 'trialing', 'past_due'] } 
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      team: {
        id: team._id,
        name: team.name,
        plan: team.plan,
        customerId: team.customerId,
        dueDate: team.dueDate,
        nextRenewalDate: team.nextRenewalDate,
        credits: team.credits,
        billingInfo: team.billingInfo,
      },
      subscription: subscription ? {
        id: subscription._id,
        status: subscription.status,
        plan: subscription.plan,
        isYearly: subscription.isYearly,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        startDate: subscription.startDate,
      } : null,
      invoices: invoices.map(invoice => ({
        id: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.amount,
        currency: invoice.currency,
        status: invoice.status,
        dueDate: invoice.dueDate,
        paidAt: invoice.paidAt,
        description: invoice.description,
        periodStart: invoice.periodStart,
        periodEnd: invoice.periodEnd,
        plan: invoice.plan,
        lineItems: invoice.lineItems,
        subtotal: invoice.subtotal,
        tax: invoice.tax,
        discount: invoice.discount,
        total: invoice.total,
        pdf: invoice.pdf,
        createdAt: invoice.createdAt,
      })),
      payments: payments.map(payment => ({
        id: payment._id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        refundedAmount: payment.refundedAmount,
        refundReason: payment.refundReason,
        createdAt: payment.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment history" },
      { status: 500 }
    );
  }
}
