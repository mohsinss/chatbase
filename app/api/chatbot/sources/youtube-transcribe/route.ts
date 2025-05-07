import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import DatasetModel from "@/models/Dataset";

async function extractVideoId(url: string): Promise<string | null> {
  // Extract YouTube video ID from URL
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

import axios from "axios";

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

    // Update status to transcripting
    existingLink.status = "transcripting";
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

    return NextResponse.json({ resultUrl, status: "transcripting" });

  } catch (error) {
    console.error("YouTube transcription error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to transcribe YouTube video" },
      { status: 500 }
    );
  }
}
