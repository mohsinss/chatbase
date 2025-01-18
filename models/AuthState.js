import mongoose from 'mongoose';

// Define the schema for authentication credentials
const authSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    token: { type: String, required: true },
    creds: { type: Object, required: true } // Store authentication credentials as an object
});

if (mongoose.models.ChatbotAISettings) {
    delete mongoose.models.WAAuthStates;
}

export default mongoose.model('WAAuthStates', authSchema);
