import InstagramPage from '@/models/InstagramPage';
import Chatbot from '@/models/Chatbot';
import Dataset from '@/models/Dataset';
import { cache, getCachedOrFetch } from './cache';

// Helper function to get Instagram page
export async function getInstagramPage(instagram_business_account: string): Promise<any> {
  return getCachedOrFetch(
    cache.instagramPages,
    instagram_business_account,
    async () => await InstagramPage.findOne({ instagram_business_account })
  );
}

// Helper function to get chatbot
export async function getChatbot(chatbotId: string): Promise<any> {
  return getCachedOrFetch(
    cache.chatbots,
    chatbotId,
    async () => await Chatbot.findOne({ chatbotId })
  );
}

// Helper function to get dataset
export async function getDataset(chatbotId: string): Promise<any> {
  return getCachedOrFetch(
    cache.datasets,
    chatbotId,
    async () => await Dataset.findOne({ chatbotId })
  );
}

// Helper function to get settings from InstagramPage model
export async function getSettings(instagramPage: any): Promise<any> {
  return instagramPage.settings || {};
}
