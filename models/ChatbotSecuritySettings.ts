import mongoose from "mongoose";

const ChatbotSecuritySettingsSchema = new mongoose.Schema(
  {
    chatbotId: {
      type: String,
      required: true,
      unique: true,
    },
    visibility: {
      type: String,
      enum: ['private', 'public'],
      default: 'public',
    },
    domainRestriction: {
      type: Boolean,
      default: false,
    },
    allowedDomains: {
      type: String,
      default: "",
    },
    messageLimit: {
      type: String,
      default: "20",
    },
    timeLimit: {
      type: String,
      default: "240",
    },
    limitMessage: {
      type: String,
      default: "Too many messages in a row",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ChatbotSecuritySettings || mongoose.model("ChatbotSecuritySettings", ChatbotSecuritySettingsSchema); 