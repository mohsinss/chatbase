import mongoose from "mongoose";

const ChatbotSchema = new mongoose.Schema(
  {
    chatbotId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      default: () => `Chatbot ${new Date().toLocaleString()}`,
    },
    teamId: {
      type: String,
      required: true,
    },
    zapierKey: {
      type: String,
      required: false,
    },
    createdBy: {
      type: String,
      required: true,
    },
    sourcesCount: {
      type: Number,
      required: true,
      default: 0,
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
    lastTrained: {
      type: mongoose.Schema.Types.Date,
      default: Date.now
    },
    integrations: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Chatbot || mongoose.model("Chatbot", ChatbotSchema); 