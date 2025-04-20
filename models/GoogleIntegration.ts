import mongoose, { Schema, Document } from 'mongoose';

export interface IGoogleIntegration extends Document {
  chatbotId: string;
  teamId: string;
  accessToken: string;
  refreshToken: string;
  expiryDate: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const GoogleIntegrationSchema: Schema = new Schema(
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
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index for chatbotId and teamId
GoogleIntegrationSchema.index({ chatbotId: 1, teamId: 1 });

export default mongoose.models.GoogleIntegration || mongoose.model<IGoogleIntegration>('GoogleIntegration', GoogleIntegrationSchema);
