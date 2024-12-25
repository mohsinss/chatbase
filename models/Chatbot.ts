import mongoose from "mongoose";

const ChatbotSchema = new mongoose.Schema(
  {
    chatbotId: {
      type: String,
      required: true,
      unique: true,
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
    name: {
      type: String,
      default: "New Chatbot",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Chatbot || mongoose.model("Chatbot", ChatbotSchema); 