// models/WhatsAppVerification.ts
import mongoose, { Document } from 'mongoose';

interface IWhatsAppNumber extends Document {
    chatbotId: string;
    wabaId: string;
    phoneNumberId: string;
    verified_name: Date;
    code_verification_status: boolean;
    display_phone_number: string;
    quality_rating: string;
    platform_type: string;
    last_onboarded_time: string;
}

const WhatsAppNumberSchema = new mongoose.Schema({
    chatbotId: { type: String, required: true },
    wabaId: { type: String, required: true },
    phoneNumberId: { type: String, required: true },
    verified_name: { type: String, required: true },
    code_verification_status: { type: String, required: true },
    display_phone_number: { type: String, required: true },
    quality_rating: { type: String, required: true },
    platform_type: { type: String, required: true },
    last_onboarded_time: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.WhatsAppNumber || mongoose.model<IWhatsAppNumber>('WhatsAppNumber', WhatsAppNumberSchema);