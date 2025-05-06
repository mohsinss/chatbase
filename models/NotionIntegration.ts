import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotionIntegration extends Document {
  chatbotId: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiry?: Date;
  notionUserId?: string;
  lastSyncTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotionIntegrationSchema: Schema<INotionIntegration> = new Schema(
  {
    chatbotId: { type: String, required: true, unique: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String },
    tokenExpiry: { type: Date },
    notionUserId: { type: String },
    lastSyncTime: { type: Date },
  },
  { timestamps: true }
);

const NotionIntegration: Model<INotionIntegration> =
  mongoose.models.NotionIntegration || mongoose.model<INotionIntegration>('NotionIntegration', NotionIntegrationSchema);

export default NotionIntegration;
