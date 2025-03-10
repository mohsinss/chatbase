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
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ZapierHookUrl || mongoose.model("ZapierHookUrl", ZapierHookUrlSchema);