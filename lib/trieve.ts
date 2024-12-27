import { TrieveSDK } from "trieve-ts-sdk";

if (!process.env.TRIEVE_API_KEY) {
  throw new Error("TRIEVE_API_KEY is not set");
}

export const createTrieveClient = (datasetId: string) => {
  return new TrieveSDK({
    apiKey: process.env.TRIEVE_API_KEY,
    datasetId,
  });
}; 