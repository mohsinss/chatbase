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

interface IYouTubeLink {
  id: string;
  link: string;
  chars: number;
  transcript?: string;
  transcriptionResultUrl?: string;
  status: "pending" | "processing" | "transcripted" | "trained" | "error";
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
  youtubeLinks?: IYouTubeLink[];
  files?: IFile[];
  createdAt: Date;
  updatedAt: Date;
  lastTrained?: Date;
  questionFlow?: {};
  metadata?: {};
  questionFlowEnable?: boolean;
  questionAIResponseEnable?: boolean;
  restartQFTimeoutMins?: number;
  sallaTrieveId?: string;
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
  sallaTrieveId: {
    type: String,
    required: false,
  },
  youtubeLinks: {
    type: [{
      id: { type: String, required: true },
      trieveId: { type: String, required: false },
      link: { type: String, required: true },
      chars: { type: Number, required: false },
      status: { type: String, required: true },
      transcript: { type: String, required: false },
      transcriptionResultUrl: { type: String, required: false },
    }],
    default: []
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  files: {
    type: [{
      trieveId: { type: String, required: false },
      trieveTaskId: { type: String, required: false },
      name: { type: String, required: true },
      url: { type: String, required: true },
      text: { type: String, required: false },
      charCount: { type: Number, required: false, default: 0 },
      status: { type: String, required: false },
      trained: { type: Boolean, required: true, default: false },
    }],
    default: []
  },
  questionFlow: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  questionFlowEnable: {
    type: Boolean,
    default: false,
  },
  restartQFTimeoutMins: {
    type: Number,
    default: 60,
  },
  questionAIResponseEnable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the date when created
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically set the date when updated
  },
  lastTrained: {
    type: Date,
    default: null,
  }
});

// Middleware to update the updatedAt field on save
datasetSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Dataset = mongoose.models.Dataset || mongoose.model('Dataset', datasetSchema);

export default Dataset;
