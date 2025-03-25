import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ChatbotInterfaceSettings from "@/models/ChatbotInterfaceSettings";
import Chatbot from "@/models/Chatbot";
import mongoose from "mongoose";

const setCorsHeaders = (res: Response) => {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
};

export async function OPTIONS(req: NextRequest) {
  const res = NextResponse.json({}, { status: 200 });
  return setCorsHeaders(res);
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const chatbotId = searchParams.get("chatbotId");
    
    // Use lean() to get a plain JavaScript object without Mongoose methods
    const settings = await ChatbotInterfaceSettings.findOne({ chatbotId }).lean();
    
    if (settings) {
      // TypeScript safe access using any type
      const settingsObj = settings as any;
      console.log("GET - Found settings with tooltipDelay:", settingsObj.tooltipDelay);
      
      // Ensure tooltipDelay is included in the response
      if (settingsObj.tooltipDelay === undefined) {
        settingsObj.tooltipDelay = 1; // Set default
        console.log("GET - Adding missing tooltipDelay with default value:", settingsObj.tooltipDelay);
      }
    }
    
    return setCorsHeaders(
      NextResponse.json(settings || {})
    );
  } catch (error) {
    console.error("Error fetching interface settings:", error);
    return setCorsHeaders(
        NextResponse.json(
        { error: "Failed to fetch interface settings" },
        { status: 500 }
      )
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { chatbotId } = body;
    
    // Copy body but remove MongoDB system fields
    const updateData = { ...body };
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    
    // Make sure tooltipDelay is a number
    if ('tooltipDelay' in updateData) {
      updateData.tooltipDelay = Number(updateData.tooltipDelay);
    }
    
    console.log("Clean update data created");

    try {
      const result = await ChatbotInterfaceSettings.findOneAndUpdate(
        { chatbotId },
        { $set: updateData },
        { new: true, upsert: true }
      );
      
      // Update chatbot name if displayName is included
      if (updateData.displayName) {
        await Chatbot.updateOne(
          { chatbotId },
          { $set: { name: updateData.displayName } }
        );
      }
      
      return setCorsHeaders(
        NextResponse.json(result)
      );
    } catch (saveError) {
      console.error("Database error:", saveError);
      return setCorsHeaders(NextResponse.json(
        { error: "Database error", details: String(saveError) },
        { status: 500 }
      ));
    }
  } catch (error) {
    console.error("API error:", error);
    return setCorsHeaders(NextResponse.json(
      { error: "Failed to save settings", details: String(error) },
      { status: 500 }
    ));
  }
} 