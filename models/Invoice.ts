import mongoose, { Document, Schema } from 'mongoose';
import toJSON from "./plugins/toJSON";

export interface IInvoice extends Document {
  teamId: mongoose.Types.ObjectId;
  stripeInvoiceId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  dueDate: Date;
  paidAt?: Date;
  billingReason: 'subscription_create' | 'subscription_update' | 'subscription_cycle' | 'subscription' | 'manual';
  description: string;
  periodStart: Date;
  periodEnd: Date;
  subscriptionId?: string;
  plan?: string;
  lineItems: Array<{
    description: string;
    amount: number;
    quantity: number;
    priceId?: string;
  }>;
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  billingDetails: {
    name?: string;
    email: string;
    address: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  };
  metadata: Record<string, any>;
  pdf?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    stripeInvoiceId: {
      type: String,
      required: true,
      unique: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
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
      enum: ['draft', 'open', 'paid', 'uncollectible', 'void'],
      default: 'draft',
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paidAt: {
      type: Date,
    },
    billingReason: {
      type: String,
      enum: ['subscription_create', 'subscription_update', 'subscription_cycle', 'subscription', 'manual'],
      required: true,
    },
    description: {
      type: String,
    },
    periodStart: {
      type: Date,
      required: true,
    },
    periodEnd: {
      type: Date,
      required: true,
    },
    subscriptionId: {
      type: String,
    },
    plan: {
      type: String,
      enum: ["Free", "Standard", "Hobby", "Unlimited"],
    },
    lineItems: [{
      description: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      priceId: {
        type: String,
      },
    }],
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    total: {
      type: Number,
      required: true,
    },
    billingDetails: {
      name: {
        type: String,
      },
      email: {
        type: String,
        required: true,
      },
      address: {
        line1: { type: String },
        line2: { type: String },
        city: { type: String },
        state: { type: String },
        postal_code: { type: String },
        country: { type: String },
      },
    },
    metadata: {
      type: Object,
      default: {},
    },
    pdf: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

InvoiceSchema.plugin(toJSON);

const Invoice = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);

export default Invoice;
