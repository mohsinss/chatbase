import mongoose from "mongoose";

const ChatbotConversationSchema = new mongoose.Schema(
  {
    chatbotId: {
      type: String,
      required: true,
      index: true,
    },
    platform: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
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
      from: {
        type: String,
        default: "Bot"
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    disable_auto_reply: { 
      type: Boolean, 
      required: false, 
      default: false 
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ChatbotConversation || 
  mongoose.model("ChatbotConversation", ChatbotConversationSchema); 