// models/Dataset.js
import mongoose from 'mongoose';
import toJSON from "./plugins/toJSON";

interface IDataset {
  chatbotId: string;
  datasetId: string;
  vectorStoreId?: string | null;
  openaiAssistantId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const datasetSchema = new mongoose.Schema<IDataset>({
    chatbotId: {
        type: String,
        required: true,
        unique: true, // Ensure each chatbot has a unique dataset
    },
    datasetId: {
        type: String,
        required: true,
    },
    vectorStoreId: {
        type: String,
        default: null
    },
    openaiAssistantId: {
        type: String,
        required: false
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
    this.updatedAt = new Date();
    next();
});

const DatasetModel = mongoose.models.Dataset || mongoose.model('Dataset', datasetSchema);

export default DatasetModel;
