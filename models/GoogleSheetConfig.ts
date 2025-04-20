import mongoose, { Schema, Document } from 'mongoose';

export interface IGoogleSheetConfig extends Document {
  chatbotId: string;
  teamId: string;
  sheetId: string;
  sheetName: string;
  autoSync: boolean;
  syncFrequency: string;
  lastSyncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GoogleSheetConfigSchema: Schema = new Schema(
  {
    chatbotId: {
      type: String,
      required: true,
      index: true,
    },
    teamId: {
      type: String,
      required: true,
    },
    sheetId: {
      type: String,
      required: true,
    },
    sheetName: {
      type: String,
      required: true,
      default: 'Orders',
    },
    autoSync: {
      type: Boolean,
      default: true,
    },
    syncFrequency: {
      type: String,
      enum: ['realtime', 'hourly', 'daily'],
      default: 'realtime',
    },
    lastSyncedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.GoogleSheetConfig || mongoose.model<IGoogleSheetConfig>('GoogleSheetConfig', GoogleSheetConfigSchema);
