import { NextResponse } from "next/server";
import { TrieveSDK } from "trieve-ts-sdk";

export async function POST(req: Request) {
  try {
    const { chatbotId, name } = await req.json();

    // First try to get datasets using direct API call since SDK doesn't have getDatasets
    const datasetsResponse = await fetch("https://api.trieve.ai/api/dataset", {
      headers: {
        "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
        "TR-Organization": process.env.TRIEVE_ORG_ID!,
      }
    });

    if (datasetsResponse.ok) {
      const datasets = await datasetsResponse.json();
      const existingDataset = datasets.find((dataset: any) => 
        dataset.dataset_name === `Chatbot Dataset ${chatbotId}`
      );

      if (existingDataset) {
        return NextResponse.json(existingDataset);
      }
    }

    // If no existing dataset found, create a new one using SDK
    const trieve = new TrieveSDK({
      apiKey: process.env.TRIEVE_API_KEY!,
      organizationId: process.env.TRIEVE_ORG_ID!
    });

    const newDataset = await trieve.createDataset({
      dataset_name: `Chatbot Dataset ${chatbotId}`,
      server_configuration: {
        chunk_size: 512,
        chunk_overlap: 50
      }
    });

    return NextResponse.json(newDataset);
  } catch (error) {
    console.error("Dataset operation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to handle dataset operation" },
      { status: 500 }
    );
  }
} 