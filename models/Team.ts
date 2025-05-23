import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const teamSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      enum: ["Free", "Standard", "Hobby", "Unlimited"], // Add enum property
      default: "Free", // Set default to "Free"
    },
    dueDate: {
      type: mongoose.Schema.Types.Date,
    },
    members: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ['Admin', 'Member'], // Define the possible roles
        default: 'Member', // Set default role to 'member'
      },
      status: { // Add status field
        type: String,
        enum: ['Pending', 'Active'], // Define the possible statuses
        default: 'Pending', // Set default status to 'Pending'
      },
      memberSince: { // Add memberSince field
        type: mongoose.Schema.Types.Date,
        default: Date.now, // Set default to current date
      },
    }],
    nextRenewalDate: {
      type: mongoose.Schema.Types.Date,
      default: () => { // Add a function that returns the date one month from now
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        date.setHours(0, 0, 0, 0);
        return date;
      },
    },
    credits: {
      type: mongoose.Schema.Types.Number,
      default: 0,
    },
    // Used in the Stripe webhook to identify the user in Stripe and later create Customer Portal or prefill user credit card details
    customerId: {
      type: String,
      validate(value: string) {
        return !value || value.includes("cus_");
      },
    },
    billingInfo: {
      email: {
        type: String,
      },
      address: {
        line1: { type: String },
        line2: { type: String },
        city: { type: String },
        state: { type: String },
        postal_code: { type: String },
        country: { type: String },
      },
      paymentMethod: [{
        brand: { type: String },
        last4: { type: String },
        exp_month: { type: Number },
        exp_year: { type: Number },
      }],
      taxId: {
        type: String,
      },
      taxType: {
        type: String,
        enum: ["None", "EIN", "SSN", "VAT", "GST", "ABN", "ITIN", "TIN", "EORI"],
        default: "None",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

teamSchema.plugin(toJSON);

teamSchema.methods.toJSON = function () {
  const team = this.toObject();
  //@ts-ignore
  team.members = team.members.map(member => ({
    ...member,
    user: member.user.toString(),
    _id: null
  }));
  return team;
};

export default mongoose.models.Team || mongoose.model("Team", teamSchema); 