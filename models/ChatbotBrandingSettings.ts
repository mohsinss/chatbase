import { z } from "zod";
import mongoose, { Model } from "mongoose";

// Zod schema for validation
export const ChatbotBrandingSettingsSchema = z.object({
  logoUrl: z.string().optional(),
  headerUrl: z.string().optional(),
  headerText: z.string().optional(),
  headerTextColor: z.string().optional(),
  headerFontSize: z.string().optional(),
  headerFontFamily: z.string().optional(),
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
  headerText: "",
  headerTextColor: "#ffffff",
  headerFontSize: "3rem",
  headerFontFamily: "Inter, sans-serif",
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
  headerText: string;
  headerTextColor: string;
  headerFontSize: string;
  headerFontFamily: string;
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
  headerText: { type: String, default: "", required: false },
  headerTextColor: { type: String, default: "#ffffff" },
  headerFontSize: { type: String, default: "3rem" },
  headerFontFamily: { type: String, default: "Inter, sans-serif" },
  logoLink: { type: String, default: "" },
  primaryColor: { type: String, default: "#4285f4" },
  secondaryColor: { type: String, default: "#34a853" },
  accentColor: { type: String, default: "#fbbc05" },
  textColor: { type: String, default: "#202124" },
  backgroundColor: { type: String, default: "#ffffff" }
}, {
  timestamps: true,
  strict: false
});

// Pre-save hook to ensure header fields are never undefined or null
brandingSettingsSchema.pre('save', function(next) {
  if (this.headerText === undefined || this.headerText === null) {
    this.headerText = "";
  }
  
  if (this.headerTextColor === undefined || this.headerTextColor === null) {
    this.headerTextColor = "#ffffff";
  }
  
  if (this.headerFontSize === undefined || this.headerFontSize === null) {
    this.headerFontSize = "3rem";
  }
  
  if (this.headerFontFamily === undefined || this.headerFontFamily === null) {
    this.headerFontFamily = "Inter, sans-serif";
  }
  
  next();
});

// Fix for Next.js hot reloading
let ChatbotBrandingSettingsModel: Model<IBrandingSettings>;

try {
  ChatbotBrandingSettingsModel = mongoose.model<IBrandingSettings>('ChatbotBrandingSettings');
} catch {
  ChatbotBrandingSettingsModel = mongoose.model<IBrandingSettings>('ChatbotBrandingSettings', brandingSettingsSchema);
}

export { ChatbotBrandingSettingsModel }; 