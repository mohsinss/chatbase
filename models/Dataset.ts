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
  chars: number;
}

interface IFile {
    trieveId: string;
    trieveTaskId: string;
    url: string;
    name: string;
    text: string;
    charCount: number;
    status: string;
    trained: boolean;
}

interface IDataset {
  chatbotId: string;
  datasetId: string;
  text: string;
  qaPairs?: IQAPair[];
  links?: ILink[];
  files?: IFile[];
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
            chars: { type: Number, required: false },
        }],
        default: []
    },
    files: {
        type: [{ 
            trieveId: { type: String, required: false },
            trieveTaskId: { type: String, required: false },
            name: { type: String, required: true },
            url: { type: String, required: true },
            text: { type: String, required: false },
            charCount: {type: Number, required: false, default: 0 },
            status: { type: String, required: false },
            trained: { type: Boolean, required: true, default: false },
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
