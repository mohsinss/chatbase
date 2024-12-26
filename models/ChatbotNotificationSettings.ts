import mongoose from "mongoose";

const ChatbotNotificationSettingsSchema = new mongoose.Schema(
  {
    chatbotId: {
      type: String,
      required: true,
      unique: true,
    },
    dailyLeads: {
      type: Boolean,
      default: false,
    },
    dailyConversations: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ChatbotNotificationSettings || mongoose.model("ChatbotNotificationSettings", ChatbotNotificationSettingsSchema); 