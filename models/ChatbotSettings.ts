import mongoose from "mongoose";

export interface IChatbotSettings {
  chatbotId: string;
  characterCount: number;
  creditLimitEnabled: boolean;
  creditLimit: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const ChatbotSettingsSchema = new mongoose.Schema(
  {
    chatbotId: {
      type: String,
      required: true,
      unique: true,
    },
    characterCount: {
      type: Number,
      required: true,
      default: 0,
    },
    creditLimitEnabled: {
      type: Boolean,
      default: false,
    },
    creditLimit: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ChatbotSettings || mongoose.model("ChatbotSettings", ChatbotSettingsSchema); 