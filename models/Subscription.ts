import mongoose, { Document, Schema } from 'mongoose';
import toJSON from "./plugins/toJSON";

export interface ISubscription extends Document {
  teamId: mongoose.Types.ObjectId;
  stripeSubscriptionId: string;
  status: 'active' | 'past_due' | 'canceled' | 'unpaid' | 'trialing' | 'incomplete' | 'incomplete_expired';
  plan: string;
  isYearly: boolean;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  startDate: Date;
  endedAt?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  priceId: string;
  quantity: number;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    stripeSubscriptionId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['active', 'past_due', 'canceled', 'unpaid', 'trialing', 'incomplete', 'incomplete_expired'],
      default: 'active',
      required: true,
    },
    plan: {
      type: String,
      enum: ["Free", "Standard", "Hobby", "Unlimited"],
      required: true,
    },
    isYearly: {
      type: Boolean,
      default: false,
    },
    currentPeriodStart: {
      type: Date,
      required: true,
    },
    currentPeriodEnd: {
      type: Date,
      required: true,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    canceledAt: {
      type: Date,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endedAt: {
      type: Date,
    },
    trialStart: {
      type: Date,
    },
    trialEnd: {
      type: Date,
    },
    priceId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      required: true,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

SubscriptionSchema.plugin(toJSON);

const Subscription = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;
