import { NextResponse } from "next/server";
import { TrieveSDK } from "trieve-ts-sdk";
import { Buffer } from 'buffer'; // Import Buffer if necessary

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Validate form data
    const file = formData.get('file') as File | null;
    const fileName = formData.get('fileName') as string | null;
    const datasetId = formData.get('datasetId') as string | null;

    if (!file || !fileName || !datasetId) {
      return NextResponse.json(
        { error: "Missing required fields: file, fileName, or datasetId." },
        { status: 400 }
      );
    }

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Convert to base64url encoding as specified in the docs
    const base64String = Buffer.from(arrayBuffer)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await fetch("https://api.trieve.ai/api/file", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
        "TR-Dataset": datasetId,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        {
          base64_file: base64String,
          file_name: fileName,
        }
      )
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("File upload failed:", data);
      throw new Error(data.message || "Failed to upload file");
    }
    // const trieve = new TrieveSDK({
    //   apiKey: process.env.TRIEVE_API_KEY!,
    //   datasetId: datasetId,
    //   organizationId: process.env.TRIEVE_ORG_ID!
    // });

    // console.log('Uploading file:', {
    //   fileName,
    //   fileType: file.type,
    //   datasetId
    // });

    // const data = await trieve.uploadFile({
    //   base64_file: base64String,
    //   file_name: fileName,
    //   create_chunks: true,
    //   description: `File uploaded for chatbot ${datasetId}`,
    //   metadata: {
    //     teamId: formData.get('teamId'),
    //     chatbotId: datasetId,
    //     mime_type: file.type
    //   },
    //   target_splits_per_chunk: 20,
    //   rebalance_chunks: true,
    //   split_delimiters: ['.', '!', '?', '\n'],
    //   tag_set: [`chatbot-${datasetId}`]
    // });

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
