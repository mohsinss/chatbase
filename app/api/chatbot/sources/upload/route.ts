import { NextResponse } from "next/server";
import { TrieveSDK } from "trieve-ts-sdk";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    const datasetId = formData.get('datasetId') as string;

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    // Convert to base64url encoding as specified in the docs
    const base64String = Buffer.from(arrayBuffer)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const trieve = new TrieveSDK({
      apiKey: process.env.TRIEVE_API_KEY!,
      datasetId: datasetId,
      organizationId: process.env.TRIEVE_ORG_ID!
    });

    console.log('Uploading file:', {
      fileName,
      fileType: file.type,
      datasetId
    });

    const data = await trieve.uploadFile({
      base64_file: base64String,
      file_name: fileName,
      create_chunks: true,
      description: `File uploaded for chatbot ${datasetId}`,
      metadata: {
        teamId: formData.get('teamId'),
        chatbotId: datasetId,
        mime_type: file.type
      },
      target_splits_per_chunk: 20,
      rebalance_chunks: true,
      split_delimiters: ['.', '!', '?', '\n'],
      tag_set: [`chatbot-${datasetId}`]
    } as any);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("File upload error:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 }
    );
  }
} 