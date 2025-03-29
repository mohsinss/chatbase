import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import DatasetModel from "@/models/Dataset";

export async function PUT(request: Request) {
  try {
    await connectMongo();
    const { chatbotId, name } = await request.json();

    // Find the dataset for this chatbot to get the datasetId
    const dataset = await DatasetModel.findOne({ chatbotId });
    
    if (!dataset || !dataset.datasetId) {
      return NextResponse.json(
        { error: "Dataset not found" },
        { status: 404 }
      );
    }

    console.log(`Updating dataset name for datasetId: ${dataset.datasetId} to: ${name}`);

    // Use the Trieve API to update the dataset name
    const response = await fetch(`https://api.trieve.ai/api/dataset`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
        "TR-Organization": process.env.TRIEVE_ORG_ID!,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        dataset_id: dataset.datasetId,
        dataset_name: name
      })
    });

    console.log(`Trieve API response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Failed to update dataset name in Trieve: ${response.status} ${response.statusText}`;
      try {
        // Try to parse error as JSON
        const errorData = await response.json();
        console.error("Failed to update dataset name in Trieve:", errorData);
      } catch (parseError) {
        // If JSON parsing fails, use text instead
        const errorText = await response.text().catch(() => "Unknown error");
        console.error("Failed to update dataset name in Trieve:", errorText);
        errorMessage += `: ${errorText}`;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

    // Try to read the response body whether it has JSON or not
    let responseBody;
    try {
      responseBody = await response.json();
    } catch (error) {
      const text = await response.text();
      responseBody = { text };
    }
    console.log("Response body:", responseBody);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update dataset name:", error);
    return NextResponse.json(
      { error: "Failed to update dataset name" },
      { status: 500 }
    );
  }
} 