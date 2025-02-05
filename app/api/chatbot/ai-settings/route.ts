import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import ChatbotAISettings from "@/models/ChatbotAISettings";
import Chatbot from "@/models/Chatbot";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const chatbotId = searchParams.get("chatbotId");

    const settings = await ChatbotAISettings.findOne({ chatbotId });
    const chatbot = await Chatbot.findOne({ chatbotId });

    // If no settings exist, return defaults
    if (!settings) {
      return NextResponse.json({
        lastTrained: chatbot.lastTrained.toLocaleString(),
        chatbotId,
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        systemPrompt: "You are a helpful assistant.",
        knowledgeCutoff: "",
        maxTokens: 500,
        contextWindow: 16000,
        language: "en",
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      });
    }

    //@ts-ignore
    return NextResponse.json({...settings._doc, lastTrained: chatbot.lastTrained.toLocaleString()});
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const body = await req.json();
    console.log("Received body:", body);

    // Explicitly construct the update object
    const updateData = {
      chatbotId: body.chatbotId,
      model: body.model,
      temperature: body.temperature,
      systemPrompt: body.systemPrompt,
      knowledgeCutoff: body.knowledgeCutoff,
      maxTokens: body.maxTokens,
      contextWindow: body.contextWindow,
      language: body.language || 'english', // Ensure language is set
      topP: body.topP,
      frequencyPenalty: body.frequencyPenalty,
      presencePenalty: body.presencePenalty,
    };

    // Create a new document or update existing one
    const updatedSettings = await ChatbotAISettings.findOneAndUpdate(
      { chatbotId: body.chatbotId },
      updateData,
      { 
        upsert: true, 
        new: true,
        runValidators: true, // Ensure schema validation runs
        setDefaultsOnInsert: true // Apply defaults on upsert
      }
    ).lean();

    console.log("Updated settings:", updatedSettings);

    return Response.json(updatedSettings);
  } catch (error) {
    console.error("Error updating AI settings:", error);
    return Response.json({ 
      error: "Failed to update AI settings",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 