import mongoose from "mongoose";

const ChatbotInterfaceSettingsSchema = new mongoose.Schema(
  {
    chatbotId: {
      type: String,
      required: true,
      unique: true,
    },
    initialMessage: {
      type: String,
      default: "Hi! What can I help you with?",
    },
    suggestedMessages: {
      type: String,
      default: "What is example.com?",
    },
    messagePlaceholder: {
      type: String,
      default: "Message...",
    },
    collectFeedback: {
      type: Boolean,
      default: true,
    },
    regenerateMessages: {
      type: Boolean,
      default: true,
    },
    userMessageColor: {
      type: String,
      default: "#4285f4",
    },
    chatBubbleColor: {
      type: String,
      default: "#000000",
    },
    syncColors: {
      type: Boolean,
      default: false,
    },
    bubbleAlignment: {
      type: String,
      enum: ['left', 'right'],
      default: 'right',
    },
    autoShowDelay: {
      type: Number,
      default: 3,
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
    displayName: {
      type: String,
      default: "Chatbot",
    },
    footerText: {
      type: String,
      default: "",
    },
    roundedHeaderCorners: {
      type: Boolean,
      default: false,
    },
    roundedChatCorners: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ChatbotInterfaceSettings || mongoose.model("ChatbotInterfaceSettings", ChatbotInterfaceSettingsSchema); 