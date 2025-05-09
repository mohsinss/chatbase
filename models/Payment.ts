import mongoose, { Document, Schema } from 'mongoose';
import toJSON from "./plugins/toJSON";

export interface IPayment extends Document {
  teamId: mongoose.Types.ObjectId;
  stripePaymentId: string;
  invoiceId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  paymentMethod: {
    type: string;
    brand?: string;
    last4?: string;
    exp_month?: number;
    exp_year?: number;
  };
  metadata: Record<string, any>;
  refundedAmount?: number;
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    stripePaymentId: {
      type: String,
      required: true,
      unique: true,
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'usd',
    },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'refunded'],
      default: 'pending',
      required: true,
    },
    paymentMethod: {
      type: {
        type: String,
        required: true,
      },
      brand: String,
      last4: String,
      exp_month: Number,
      exp_year: Number,
    },
    metadata: {
      type: Object,
      default: {},
    },
    refundedAmount: {
      type: Number,
    },
    refundReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

PaymentSchema.plugin(toJSON);

const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
