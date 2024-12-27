import { NextResponse } from "next/server";
import { TrieveSDK } from "trieve-ts-sdk";

export async function GET(
  req: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const trieve = new TrieveSDK({
      apiKey: process.env.TRIEVE_API_KEY!,
      organizationId: process.env.TRIEVE_ORG_ID!
    });

    const fileData = await trieve.getFile({
      fileId: params.fileId
    });

    return NextResponse.json(fileData);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get file" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const response = await fetch(`https://api.trieve.ai/api/file/${params.fileId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
        "TR-Organization": process.env.TRIEVE_ORG_ID!,
      }
    });

    if (!response.ok) throw new Error("Failed to delete file");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete file" },
      { status: 500 }
    );
  }
} 