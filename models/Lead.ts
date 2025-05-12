import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const leadSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
    },
    name: { // Add name field
      type: String,
      trim: true,
    },
    phone: { // Add phone field
      type: String,
      trim: true,
    },
    chatbotId: { // Add chatbotId field
      type: String,
      trim: true,
      required: true,
    },
    customAnswers: { // Add customAnswers field
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// add plugin that converts mongoose to json
leadSchema.plugin(toJSON);

export default mongoose.models.Lead || mongoose.model("Lead", leadSchema);
