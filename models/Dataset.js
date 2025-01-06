// models/Dataset.js
import mongoose from 'mongoose';

const datasetSchema = new mongoose.Schema({
    chatbotId: {
        type: String,
        required: true,
        unique: true, // Ensure each chatbot has a unique dataset
    },
    datasetId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the date when created
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Automatically set the date when updated
    }
});

// Middleware to update the updatedAt field on save
datasetSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const DatasetModel = mongoose.models.Dataset || mongoose.model('Dataset', datasetSchema);

export default DatasetModel;
