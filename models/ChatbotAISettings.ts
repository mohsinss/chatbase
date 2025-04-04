import mongoose from "mongoose";

const ChatbotAISettingsSchema = new mongoose.Schema(
  {
    chatbotId: {
      type: String,
      required: true,
      unique: true,
    },
    model: {
      type: String,
      required: true,
      default: "gpt-3.5-turbo",
    },
    temperature: {
      type: Number,
      required: true,
      default: 0.7,
    },
    systemPrompt: {
      type: String,
      default: "",
    },
    chunkCount: {
      type: Number,
      default: 4,
      required: false,
    },
    knowledgeCutoff: {
      type: String,
      default: "",
    },
    maxTokens: {
      type: Number,
      default: 500,
    },
    contextWindow: {
      type: Number,
      default: 16000,
    },
    topP: {
      type: Number,
      default: 1,
    },
    frequencyPenalty: {
      type: Number,
      default: 0,
    },
    presencePenalty: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      required: true,
      // enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'pl', 'ru', 'ja', 'ko', 'zh', 'ar'],
      default: 'english'
    },
  },
  {
    timestamps: true,
    strict: true
  }
);


const ChatbotAISettingsModel = mongoose.models.ChatbotAISettings 
  || mongoose.model("ChatbotAISettings", ChatbotAISettingsSchema);

export default ChatbotAISettingsModel;