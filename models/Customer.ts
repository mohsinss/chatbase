import mongoose, { Document, Schema } from 'mongoose';
import toJSON from "./plugins/toJSON";

export interface ICustomer extends Document {
  stripeCustomerId: string;
  teamId: mongoose.Types.ObjectId;
  email: string;
  name?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    stripeCustomerId: {
      type: String,
      required: true,
      unique: true,
      validate(value: string) {
        return value.includes("cus_");
      },
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
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

CustomerSchema.plugin(toJSON);

const Customer = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
