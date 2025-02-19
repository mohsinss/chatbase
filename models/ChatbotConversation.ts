import mongoose from "mongoose";

const ChatbotConversationSchema = new mongoose.Schema(
  {
    chatbotId: {
      type: String,
      required: true,
      index: true,
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId, // Change type to ObjectId
      ref: 'Lead', // Add reference to Lead model
      required: false,
      index: false,
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