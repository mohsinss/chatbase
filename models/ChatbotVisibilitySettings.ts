import mongoose from "mongoose";

const ChatbotVisibilitySettingsSchema = new mongoose.Schema(
  {
    chatbotId: {
      type: String,
      required: true,
      unique: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ChatbotVisibilitySettings || 
  mongoose.model("ChatbotVisibilitySettings", ChatbotVisibilitySettingsSchema); 