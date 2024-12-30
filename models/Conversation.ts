import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  chatbotId: {
    type: String,
    required: true,
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

export default mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema); 