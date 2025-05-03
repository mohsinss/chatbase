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
  portal: string;
  subtotal: number;
  status: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata: Object;
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
  portal: {
    type: String,
    required: false,
    enum: ['web', 'whatsapp'],
    default: 'web',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  subtotal: { type: Number, required: false },
  status: {
    type: String,
    required: true,
    enum: ['received', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'received'
  },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export interface IOrderMetadata extends Document {
  menuItems: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    available: boolean;
    images: string[];
  }>;
  categories: Array<{
    id: string;
    name: string;
  }>;
  tables: Array<{
    id: string;
    tableNumber: string;
    qrCodeUrl: string;
  }>;
  googleSheetConfig: {
    sheetId: string;
    sheetName: string;
    connected: boolean;
  };
  messageTemplate?: string;
  phoneNumber?: string;
  followUpSettings?: {
    enabled: boolean;
    messageTemplate: string;
    timeWindow: number;
    suggestItems: boolean;
  };
  language: string;
  currency: string;
  translations: {
    [language: string]: {
      categories?: { [id: string]: string };
      messages?: {
        orderTemplate?: string;
        followUpTemplate?: string;
      };
      menuItems?: {
        [id: string]: {
          name?: string;
          description?: string;
        };
      };
    };
  };
}

const OrderMetadataSchema = new Schema<IOrderMetadata>({
  menuItems: [{
    id: String,
    name: String,
    description: String,
    price: Number,
    category: String,
    available: Boolean,
    images: [String]
  }],
  categories: [{
    id: String,
    name: String
  }],
  tables: [{
    id: String,
    tableNumber: String,
    qrCodeUrl: String
  }],
  googleSheetConfig: {
    sheetId: String,
    sheetName: String,
    connected: Boolean
  },
  messageTemplate: String,
  phoneNumber: String,
  followUpSettings: {
    enabled: Boolean,
    messageTemplate: String,
    timeWindow: Number,
    suggestItems: Boolean
  },
  language: String,
  currency: String,
  translations: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
const OrderMetadata = mongoose.models.OrderMetadata || mongoose.model<IOrderMetadata>('OrderMetadata', OrderMetadataSchema);

export { Order, OrderMetadata };
