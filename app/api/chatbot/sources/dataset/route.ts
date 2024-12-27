import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { chatbotId, name } = await req.json();

    const response = await fetch("https://api.trieve.ai/api/dataset", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
        "TR-Organization": process.env.TRIEVE_ORG_ID!,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        dataset_name: name || `Chatbot Dataset ${chatbotId}`,
        server_configuration: {
          chunk_size: 512,
          chunk_overlap: 50
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Dataset creation failed:", data);
      throw new Error(data.message || "Failed to create dataset");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Dataset creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create dataset" },
      { status: 500 }
    );
  }
} 