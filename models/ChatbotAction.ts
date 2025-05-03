// models/ChatbotAction.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IChatbotAction extends Document {
  chatbotId: string;
  type: string;
  enabled: boolean;
  metadata: {
    menuItems?: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      category: string;
      available: boolean;
      images: string[];
    }>;
    categories?: Array<{
      id: string;
      name: string;
    }>;
    tables?: Array<{
      id: string;
      tableNumber: string;
      qrCodeUrl: string;
    }>;
    googleSheetConfig?: {
      sheetId: string;
      sheetName: string;
      connected: boolean;
    };
    currency?: string;
    followUpSettings?: {
      enabled: boolean;
      timeWindow: number;
      messageTemplate: string;
    };
    translations?: Record<string, Record<string, string>>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const chatbotActionSchema = new Schema<IChatbotAction>(
  {
    chatbotId: { type: String, required: true },
    type: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.ChatbotAction || mongoose.model<IChatbotAction>('ChatbotAction', chatbotActionSchema);