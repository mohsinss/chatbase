import mongoose from "mongoose";

const ChatbotInterfaceSettingsSchema = new mongoose.Schema(
  {
    chatbotId: {
      type: String,
      required: true,
      unique: true,
    },
    initialMessage: {
      type: String,
      default: "Hi! What can I help you with?",
    },
    suggestedMessages: {
      type: String,
      default: "What is example.com?",
    },
    messagePlaceholder: {
      type: String,
      default: "Message...",
    },
    collectFeedback: {
      type: Boolean,
      default: true,
    },
    regenerateMessages: {
      type: Boolean,
      default: true,
    },
    userMessageColor: {
      type: String,
      default: "#4285f4",
    },
    chatBubbleColor: {
      type: String,
      default: "#000000",
    },
    syncColors: {
      type: Boolean,
      default: false,
    },
    bubbleAlignment: {
      type: String,
      enum: ['left', 'right'],
      default: 'right',
    },
    autoShowDelay: {
      type: Number,
      default: 3,
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
    displayName: {
      type: String,
      default: "Chatbot",
    },
    footerText: {
      type: String,
      default: "",
    },
    roundedHeaderCorners: {
      type: Boolean,
      default: false,
    },
    roundedChatCorners: {
      type: Boolean,
      default: false,
    },
    profilePictureUrl: {
      type: String,
      default: "",
      validate: {
        validator: function(v: string) {
          return v === "" || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
        },
        message: 'Please enter a valid URL'
      }
    },
    chatIconUrl: {
      type: String,
      default: "",
      validate: {
        validator: function(v: string) {
          return v === "" || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
        },
        message: 'Please enter a valid URL'
      }
    },
    chatBackgroundUrl: {
      type: String,
      default: "",
      validate: {
        validator: function(v: string) {
          return v === "" || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
        },
        message: 'Please enter a valid URL'
      }
    },
    chatBackgroundOpacity: {
      type: Number,
      default: 0.9
    },
    chatWidth: {
      type: Number,
      default: 448,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ChatbotInterfaceSettings || mongoose.model("ChatbotInterfaceSettings", ChatbotInterfaceSettingsSchema); 