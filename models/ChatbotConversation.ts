import mongoose from "mongoose";

const ChatbotConversationSchema = new mongoose.Schema(
  {
    chatbotId: {
      type: String,
      required: true,
      index: true,
    },
    messages: [{
      role: {
        type: String,
        enum: ['user', 'assistant', 'system'],
        required: true
      },
      content: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ChatbotConversation || 
  mongoose.model("ChatbotConversation", ChatbotConversationSchema); 