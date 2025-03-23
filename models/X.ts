import mongoose from "mongoose";

interface IXIntegration extends Document {
  chatbotId: string;
  accessToken: string;
  accessSecret: string;
  createdAt: Date;
  updatedAt: Date;
}

const XIntegrationSchema = new mongoose.Schema<IXIntegration>({
  chatbotId: { type: String, required: true, index: true },
  accessToken: { type: String, required: true },
  accessSecret: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.X || mongoose.model<IXIntegration>('X', XIntegrationSchema);