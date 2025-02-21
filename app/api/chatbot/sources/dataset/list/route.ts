import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = req.url; // Access request.url directly
    const { searchParams } = new URL(url);
    const chatbotId = searchParams.get('chatbotId');

    if (!chatbotId) {
      throw new Error("chatbotId is required");
    }

    console.log('Fetching datasets for chatbot:', chatbotId);

    // Get datasets using direct API call with correct endpoint
    const datasetsResponse = await fetch(`https://api.trieve.ai/api/dataset/from_org/${process.env.TRIEVE_ORG_ID}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!datasetsResponse.ok) {
      const errorText = await datasetsResponse.text();
      console.error('Failed to fetch datasets:', errorText);
      throw new Error(`Failed to fetch datasets: ${datasetsResponse.status}`);
    }
    
    const datasets = await datasetsResponse.json();

    // Find the dataset for this chatbot
    const dataset = datasets.find((d: any) => {
      const name = d.dataset_name || '';
      return name.includes(chatbotId) || name.includes(chatbotId.replace(/-/g, ''));
    });

    if (!dataset) {
      console.log('No dataset found for chatbot:', chatbotId);
      return NextResponse.json({ files: [] });
    }

    // Get files using correct endpoint structure
    const filesResponse = await fetch(`https://api.trieve.ai/api/dataset/${dataset.id}/files`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (!filesResponse.ok) {
      const errorText = await filesResponse.text();
      console.error('Failed to fetch files:', errorText);
      return NextResponse.json({ files: [] });
    }

    const files = await filesResponse.json();
    return NextResponse.json({ files: files.files || [] });

  } catch (error) {
    console.error("Error in dataset/list route:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to fetch files",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 