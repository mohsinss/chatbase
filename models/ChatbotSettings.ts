import mongoose from "mongoose";

const ChatbotSettingsSchema = new mongoose.Schema(
  {
    chatbotId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
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