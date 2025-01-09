// models/Dataset.js
import mongoose from 'mongoose';
import toJSON from "./plugins/toJSON";
import { text } from 'stream/consumers';

interface IQAPair {
  id: string;
  question: string;
  answer: string;
}

interface ILink {
  id: string;
  link: string;
}

interface IDataset {
  chatbotId: string;
  datasetId: string;
  text: string;
  qaPairs?: IQAPair[];
  links?: ILink[];
//   vectorStoreId?: string | null;
//   openaiAssistantId?: string | null;
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
    // vectorStoreId: {
    //     type: String,
    //     default: null
    // },
    // openaiAssistantId: {
    //     type: String,
    //     required: false
    // },
    text: {
        type: String,
        default: null,
    },
    qaPairs: {
        type: [{ 
            id: { type: String, required: true },
            question: { type: String, required: true },
            answer: { type: String, required: true }
        }],
        default: []
    },
    links: {
        type: [{ 
            id: { type: String, required: true },
            link: { type: String, required: true },
        }],
        default: []
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
