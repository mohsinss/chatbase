// models/ZapierHookUrl.ts
import mongoose from "mongoose";

const ZapierHookUrlSchema = new mongoose.Schema(
  {
    hookUrl: {
      type: String,
      required: true,
      unique: true,
    },
    chatbotId: {
      type: String,
      required: true,
      ref: "Chatbot",
    },
    eventType: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ZapierHookUrl || mongoose.model("ZapierHookUrl", ZapierHookUrlSchema);