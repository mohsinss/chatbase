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
        return value.includes("cus_");
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
        type: {
          brand: { type: String },
          last4: { type: String },
          exp_month: { type: Number },
          exp_year: { type: Number },
        },
      }],
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

export default mongoose.models.Team || mongoose.model("Team", teamSchema); 