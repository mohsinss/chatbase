// models/ChatbotAction.ts
import mongoose, { Document, Schema } from 'mongoose';
import { IOrderMetadata } from './OrderMetadata';

export interface IChatbotAction extends Document {
  chatbotId: string;
  name: string;
  type: string;
  url: string;
  instructions: string;
  enabled: boolean;
  metadata: IOrderMetadata | Object;
  createdAt: Date;
  updatedAt: Date;
}

const ChatbotActionSchema = new Schema<IChatbotAction>({
  chatbotId: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  url: { type: String, required: false },
  instructions: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
}, { timestamps: true });

export default mongoose.models.ChatbotAction || mongoose.model<IChatbotAction>('ChatbotAction', ChatbotActionSchema);