// models/WhatsAppVerification.ts
import mongoose, { Document } from 'mongoose';

interface IWhatsAppVerification extends Document {
    userId: string;
    phoneNumber: string;
    verificationCode: string;
    expiresAt: Date;
    isVerified: boolean;
    businessId: string;
    wabaId: string;
    accessToken: string;
}

const WhatsAppVerificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    verificationCode: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    isVerified: { type: Boolean, default: false },
    businessId: { type: String, required: true },
    wabaId: { type: String, required: true },
    accessToken: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.WhatsAppVerification ||
    mongoose.model<IWhatsAppVerification>('WhatsAppVerification', WhatsAppVerificationSchema);