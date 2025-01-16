import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import ChatbotConversation from "@/models/ChatbotConversation";
import ChatbotAISettings from "@/models/ChatbotAISettings";
import Dataset from "@/models/Dataset";

export async function POST(
  req: Request,
  { params }: { params: { chatbotId: string } }
) {
  try {
    await connectMongo();
    const { startDate, endDate } = await req.json();

    // Convert dates to ISO format if provided, or use defaults
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const baseQuery = {
      chatbotId: params.chatbotId,
      createdAt: { $gte: start, $lte: end }
    };

    // Get AI Settings for model info
    const aiSettings = await ChatbotAISettings.findOne({ chatbotId: params.chatbotId });

    // Get Dataset info
    const dataset = await Dataset.findOne({ chatbotId: params.chatbotId });

    // Get total conversations and messages
    const totalChats = await ChatbotConversation.countDocuments(baseQuery);

    // Aggregate messages by date, type, and model
    const messageStats = await ChatbotConversation.aggregate([
      { $match: baseQuery },
      { $unwind: "$messages" },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$messages.timestamp" } },
            role: "$messages.role",
            model: "$model" // If you store the model used for each message
          },
          count: { $sum: 1 },
          totalChars: { $sum: { $strLenCP: "$messages.content" } }
        }
      }
    ]);

    // Process message stats
    const messagesByDate: { [key: string]: number } = {};
    const modelUsage: { [key: string]: number } = {};
    let userMessages = 0;
    let botResponses = 0;
    let systemMessages = 0;
    let totalChars = 0;

    messageStats.forEach(stat => {
      const date = stat._id.date;
      const role = stat._id.role;
      const model = stat._id.model || aiSettings?.model || 'unknown';
      const count = stat.count;
      const chars = stat.totalChars;

      messagesByDate[date] = (messagesByDate[date] || 0) + count;
      modelUsage[model] = (modelUsage[model] || 0) + count;
      totalChars += chars;

      switch (role) {
        case 'user':
          userMessages += count;
          break;
        case 'assistant':
          botResponses += count;
          break;
        case 'system':
          systemMessages += count;
          break;
      }
    });

    // Fill in missing dates
    let currentDate = new Date(start);
    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (!messagesByDate[dateStr]) {
        messagesByDate[dateStr] = 0;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Sort dates
    const sortedMessagesByDate = Object.fromEntries(
      Object.entries(messagesByDate).sort(([a], [b]) => a.localeCompare(b))
    );

    // Knowledge base metrics
    const knowledgeBaseMetrics = {
      totalCharacters: dataset?.text?.length || 0,
      totalSources: dataset?.links?.length || 0,
      totalQAPairs: dataset?.qaPairs?.length || 0,
      sources: dataset?.links || [],
      averageSourceSize: dataset?.links?.reduce((acc, link) => acc + (link.chars || 0), 0) / (dataset?.links?.length || 1)
    };

    // Current AI settings
    const aiSettingsMetrics = {
      currentModel: aiSettings?.model || 'unknown',
      temperature: aiSettings?.temperature,
      maxTokens: aiSettings?.maxTokens,
      language: aiSettings?.language,
      contextWindow: aiSettings?.contextWindow
    };

    return NextResponse.json({
      totalChats,
      totalMessages: userMessages + botResponses + systemMessages,
      userMessages,
      botResponses,
      systemMessages,
      messagesByDate: sortedMessagesByDate,
      modelUsage,
      totalCharacters: totalChars,
      creditsUsed: Math.round(totalChars / 4),
      creditLimit: 5000,
      knowledgeBase: knowledgeBaseMetrics,
      aiSettings: aiSettingsMetrics
    });

  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}