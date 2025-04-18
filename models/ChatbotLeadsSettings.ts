import mongoose from "mongoose";

const ChatbotLeadsSettingsSchema = new mongoose.Schema(
  {
    chatbotId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      default: "Let us know how to contact you",
    },
    enableLead: {
      type: String,
      default: "never",
    },
    nameEnabled: {
      type: Boolean,
      default: true,
    },
    emailEnabled: {
      type: Boolean,
      default: true,
    },
    phoneEnabled: {
      type: Boolean,
      default: true,
    },
    customQuestions: { // Add customQuestions field
      type: [String],
      default: [],
    },
    delay: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ChatbotLeadsSettings || mongoose.model("ChatbotLeadsSettings", ChatbotLeadsSettingsSchema); 