import OpenAI from 'openai';

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Deepseek client
export const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

// Initialize XAI client
export const xai = new OpenAI({
  baseURL: 'https://api.x.ai/v1',
  apiKey: process.env.X_GROK_API_KEY,
});
