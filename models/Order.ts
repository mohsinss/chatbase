import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  chatbotId: string;
  orderId: string;
  table: string;
  items: Array<{
    item_id: string;
    name: string;
    qty: number;
    price: number;
  }>;
  subtotal: number;
  status: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  chatbotId: { type: String, required: true },
  orderId: { type: String, required: true },
  table: { type: String, required: false },
  items: [{
    item_id: { type: String, required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['received', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'received'
  },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
