import mongoose from "mongoose";

const ChatbotWebhookSettingsSchema = new mongoose.Schema(
  {
    chatbotId: {
      type: String,
      required: true,
      unique: true,
    },
    leadsSubmitted: {
      type: Boolean,
      default: false,
    },
    webhookUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ChatbotWebhookSettings || mongoose.model("ChatbotWebhookSettings", ChatbotWebhookSettingsSchema); 