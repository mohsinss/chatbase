import mongoose, { Schema, Document } from 'mongoose';

export interface ISallaIntegration extends Document {
  chatbotId: string;
  teamId: string;
  merchantId: number;
  appId: number;
  appName: string;
  appDescription: string;
  appType: string;
  accessToken?: string;
  refreshToken?: string;
  expires?: number;
  scope?: string;
  tokenType?: string;
  installationDate?: string;
  uninstallationDate?: string;
  refunded?: boolean;
  storeType?: string;
  settings?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const SallaIntegrationSchema: Schema = new Schema(
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
    merchantId: {
      type: Number,
      required: true,
      index: true,
    },
    appId: {
      type: Number,
      required: true,
    },
    appName: {
      type: String,
      required: true,
    },
    appDescription: {
      type: String,
    },
    appType: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    expires: {
      type: Number,
    },
    scope: {
      type: String,
    },
    tokenType: {
      type: String,
    },
    installationDate: {
      type: String,
    },
    uninstallationDate: {
      type: String,
    },
    refunded: {
      type: Boolean,
    },
    storeType: {
      type: String,
    },
    settings: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for chatbotId and teamId
SallaIntegrationSchema.index({ chatbotId: 1, teamId: 1 });

export default mongoose.models.SallaIntegration || mongoose.model<ISallaIntegration>('SallaIntegration', SallaIntegrationSchema);
