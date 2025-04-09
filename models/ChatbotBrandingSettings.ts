import { z } from "zod";
import mongoose, { Model } from "mongoose";

// Zod schema for validation
export const ChatbotBrandingSettingsSchema = z.object({
  logoUrl: z.string().optional(),
  headerUrl: z.string().optional(),
  logoLink: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  textColor: z.string().optional(),
  backgroundColor: z.string().optional(),
});

export type ChatbotBrandingSettings = z.infer<typeof ChatbotBrandingSettingsSchema>;

export const defaultBrandingSettings: ChatbotBrandingSettings = {
  logoUrl: "",
  headerUrl: "",
  logoLink: "",
  primaryColor: "#4285f4",
  secondaryColor: "#34a853",
  accentColor: "#fbbc05",
  textColor: "#202124",
  backgroundColor: "#ffffff"
};

// Interface for the model
interface IBrandingSettings extends mongoose.Document {
  chatbotId: string;
  logoUrl: string;
  headerUrl: string;
  logoLink: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const brandingSettingsSchema = new mongoose.Schema({
  chatbotId: { type: String, required: true, unique: true },
  logoUrl: { type: String, default: "" },
  headerUrl: { type: String, default: "" },
  logoLink: { type: String, default: "" },
  primaryColor: { type: String, default: "#4285f4" },
  secondaryColor: { type: String, default: "#34a853" },
  accentColor: { type: String, default: "#fbbc05" },
  textColor: { type: String, default: "#202124" },
  backgroundColor: { type: String, default: "#ffffff" }
}, {
  timestamps: true
});

// Fix for Next.js hot reloading
let ChatbotBrandingSettingsModel: Model<IBrandingSettings>;

try {
  ChatbotBrandingSettingsModel = mongoose.model<IBrandingSettings>('ChatbotBrandingSettings');
} catch {
  ChatbotBrandingSettingsModel = mongoose.model<IBrandingSettings>('ChatbotBrandingSettings', brandingSettingsSchema);
}

export { ChatbotBrandingSettingsModel }; 