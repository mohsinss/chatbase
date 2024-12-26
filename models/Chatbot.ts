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
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Chatbot || mongoose.model("Chatbot", ChatbotSchema); 