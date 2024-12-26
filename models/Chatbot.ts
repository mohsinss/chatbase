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
    createdBy: {
      type: String,
      required: true,
    },
    sources: {
      type: Array,
      default: [],
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
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Chatbot || mongoose.model("Chatbot", ChatbotSchema); 