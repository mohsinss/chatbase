import mongoose from "mongoose";

interface IXIntegration extends Document {
  chatbotId: string;
  accessToken: string;
  accessSecret: string;
  userId: string;
  username: string;
  name: string;
  profileImageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const XIntegrationSchema = new mongoose.Schema<IXIntegration>({
  chatbotId: { type: String, required: true, index: true },
  accessToken: { type: String, required: true },
  accessSecret: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  name: { type: String, required: true },
  profileImageUrl: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.X || mongoose.model<IXIntegration>('X', XIntegrationSchema);