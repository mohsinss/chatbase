import { NextResponse } from "next/server";
import axios from "axios";
import connectMongo from "@/libs/mongoose";
import DatasetModel from "@/models/Dataset";
import ChatbotModel from "@/models/Chatbot";

async function extractVideoId(url: string): Promise<string | null> {
  // Extract YouTube video ID from URL
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function POST(req: Request) {
  try {
    const { chatbotId, link } = await req.json();

    if (!chatbotId || !link) {
      return NextResponse.json(
        { error: "chatbotId and link are required" },
        { status: 400 }
      );
    }

    const videoId = await extractVideoId(link);
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube link format" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectMongo();

    // Find dataset for chatbot
    const dataset = await DatasetModel.findOne({ chatbotId });
    if (!dataset) {
      return NextResponse.json(
        { error: "No dataset found for this chatbot" },
        { status: 404 }
      );
    }

    // Check if link already exists in dataset.youtubeLinks
    let existingLink = dataset.youtubeLinks.find((item: any) => item.link === link);

    if (!existingLink) {
      // Add new link with status pending
      existingLink = {
        id: Date.now().toString(),
        link,
        chars: 0,
        status: "pending",
        transcript: "",
      };
      dataset.youtubeLinks.push(existingLink);
      await dataset.save();
    } else {
      // If already exists and status is trained, return existing transcript
      if (existingLink.status === "trained") {
        return NextResponse.json({ transcript: existingLink.transcript, status: existingLink.status });
      }
    }

    // Update status to processing
    existingLink.status = "processing";
    await dataset.save();

    // Call Gladia API to start transcription
    const gladiaKey = process.env.GLADIA_API_KEY;
    if (!gladiaKey) {
      return NextResponse.json(
        { error: "Gladia API key not configured" },
        { status: 500 }
      );
    }

    const gladiaV2BaseUrl = "https://api.gladia.io/v2/";
    const audioUrl = `https://www.youtube.com/watch?v=${videoId}`; // Note: Gladia expects audio URL, YouTube URL may not work directly

    // For demonstration, we will send the YouTube URL as audio_url, but in real case, audio extraction is needed
    const requestData = {
      audio_url: audioUrl,
      diarization: true,
    };

    const headers = {
      "x-gladia-key": gladiaKey,
      "Content-Type": "application/json",
    };

    const initialResponse = await axios.post(gladiaV2BaseUrl + "transcription/", requestData, { headers });
    const resultUrl = initialResponse.data.result_url;

    // Save the resultUrl in the existingLink for frontend polling
    existingLink.transcriptionResultUrl = resultUrl;
    await dataset.save();

    return NextResponse.json({ resultUrl, status: "processing" });

  } catch (error) {
    console.error("YouTube transcription error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to transcribe YouTube video" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const youtubeLinkId = url.searchParams.get("youtubeLinkId");
  const chatbotId = url.searchParams.get("chatbotId");

  if (!youtubeLinkId) {
    return NextResponse.json(
      { error: "youtubeLinkId is required" },
      { status: 400 }
    );
  }

  if (!chatbotId) {
    return NextResponse.json(
      { error: "chatbotId is required" },
      { status: 400 }
    );
  }

  await connectMongo();

  const dataset = await DatasetModel.findOne({ chatbotId });
  if (!dataset) {
    return NextResponse.json(
      { error: "No dataset found for this chatbot" },
      { status: 404 }
    );
  }

  const datasetId = dataset.datasetId;
  if (!datasetId) {
    return NextResponse.json(
      { error: "No dataset ID found for this chatbot" },
      { status: 404 }
    );
  }
  
  try {
    const youtubeLink = dataset.youtubeLinks.find((l: any) => l.id === youtubeLinkId);
    const trieveId = youtubeLink?.trieveId;

    // Remove the YouTube link from dataset
    await DatasetModel.findOneAndUpdate(
      { chatbotId },
      { $pull: { youtubeLinks: { id: youtubeLinkId } } }
    );
    if (youtubeLinkId !== undefined && youtubeLinkId !== "undefined") {
      // Fetch the YouTube link metadata before deletion
      const response1 = await fetch(`https://api.trieve.ai/api/file/${trieveId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
          "TR-Organization": process.env.TRIEVE_ORG_ID!,
          "TR-Dataset": datasetId,
        }
      });

      if (!response1.ok) {
        throw new Error(`Failed to fetch YouTube link metadata: ${response1.statusText}`);
      }

      const data = await response1.json();

      // Delete the YouTube link file
      const response = await fetch(`https://api.trieve.ai/api/file/${trieveId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
          "TR-Organization": process.env.TRIEVE_ORG_ID!,
          "TR-Dataset": datasetId,
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete YouTube link file: ${response.statusText}`);
      }

      // Delete associated chunks using the uniqueTag from the metadata
      const response3 = await fetch(`https://api.trieve.ai/api/chunk`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
          "TR-Dataset": datasetId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter: {
            must: [
              {
                field: "metadata.uniqueTag",
                match_all: [data.metadata.uniqueTag]
              }
            ]
          }
        })
      });

      if (!response3.ok) {
        throw new Error(`Failed to delete YouTube link chunks: ${response3.statusText}`);
      }

      // Decrement sourcesCount in chatbot
      await ChatbotModel.findOneAndUpdate(
        { chatbotId },
        { $inc: { sourcesCount: -1 } }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("YouTube link deletion error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete YouTube link" },
      { status: 500 }
    );
  }
}
