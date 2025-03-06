// models/WhatsAppVerification.ts
import mongoose, { Document } from 'mongoose';

interface IInstagramPage extends Document {
    chatbotId: string;
    pageId: string;
    name: string;
    access_token: Date;
    settings: Object;
}

const InstagramPageSchema = new mongoose.Schema({
    chatbotId: { type: String, required: true },
    pageId: { type: String, required: true },
    name: { type: String, required: true },
    access_token: { type: String, required: true },
    instagram_business_account: { type: String, required: true },
    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
}, { timestamps: true });

export default mongoose.models.InstagramPage || mongoose.model<IInstagramPage>('InstagramPage', InstagramPageSchema);