import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import ChatbotAISettings from "@/models/ChatbotAISettings";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const chatbotId = searchParams.get("chatbotId");

    // Remove the select and just get all fields
    const settings = await ChatbotAISettings.findOne({ chatbotId });

    // If no settings exist, return defaults
    if (!settings) {
      return NextResponse.json({
        chatbotId,
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        systemPrompt: "You are a helpful assistant.",
        knowledgeCutoff: "",
        maxTokens: 500,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0
      });
    }

    console.log("Found settings:", settings);
    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    console.log("Received body:", body);
    
    // Create the document directly without using $set
    const settingsToUpdate = {
      chatbotId: body.chatbotId,
      model: body.model || "gpt-3.5-turbo",
      temperature: body.temperature || 0.7,
      systemPrompt: body.systemPrompt || "",
      knowledgeCutoff: body.knowledgeCutoff || "",
      maxTokens: body.maxTokens || 500,
      contextWindow: body.contextWindow || 16000,
      topP: body.topP || 1,
      frequencyPenalty: body.frequencyPenalty || 0,
      presencePenalty: body.presencePenalty || 0
    };

    console.log("Updating with settings:", settingsToUpdate);

    const updatedSettings = await ChatbotAISettings.findOneAndUpdate(
      { chatbotId: body.chatbotId },
      settingsToUpdate,
      { 
        new: true, 
        upsert: true, 
        runValidators: true,
        setDefaultsOnInsert: true 
      }
    );

    console.log("Updated settings:", updatedSettings);
    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
} 