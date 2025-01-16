import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Chatbot from "@/models/Chatbot";
import ChatbotConversation from "@/models/ChatbotConversation";
import ChatbotAISettings from "@/models/ChatbotAISettings";
import Dataset from "@/models/Dataset";

interface ChatbotUsage {
  name: string;
  dailyUsage: { date: string; count: number }[];
  modelUsage: Record<string, number>;
  totalMessages: number;
  totalChars: number;
  language: string;
}

export async function POST(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    await connectMongo();
    const { startDate, endDate } = await req.json();

    // Convert dates to ISO format if provided, or use defaults
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Get all chatbots for this team
    const chatbots = await Chatbot.find({ teamId: params.teamId });
    const chatbotIds = chatbots.map(bot => bot.chatbotId);

    // Initialize response structure
    const usageData = {
      chatbots: {
        total: chatbots.length,
        active: 0,
        creditsUsed: 0,
        creditLimit: 5000 * chatbots.length // Assuming 5000 per chatbot
      },
      usage: {} as Record<string, ChatbotUsage>,
      aggregatedData: {
        totalMessages: 0,
        totalChars: 0,
        messagesByDate: [] as { date: string; count: number }[],
        modelDistribution: {} as Record<string, number>,
        languageDistribution: {} as Record<string, number>
      }
    };

    // Process each chatbot
    for (const chatbot of chatbots) {
      const baseQuery = {
        chatbotId: chatbot.chatbotId,
        createdAt: { $gte: start, $lte: end }
      };

      // Get AI Settings and Dataset info
      const aiSettings = await ChatbotAISettings.findOne({ chatbotId: chatbot.chatbotId });
      const dataset = await Dataset.findOne({ chatbotId: chatbot.chatbotId });

      // Aggregate messages for this chatbot
      const messageStats = await ChatbotConversation.aggregate([
        { $match: baseQuery },
        { $unwind: "$messages" },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$messages.timestamp" } },
              role: "$messages.role"
            },
            count: { $sum: 1 },
            totalChars: { $sum: { $strLenCP: "$messages.content" } }
          }
        }
      ]);

      // Process chatbot stats
      let chatbotTotalMessages = 0;
      let chatbotTotalChars = 0;
      const dailyUsage: Record<string, number> = {};

      messageStats.forEach(stat => {
        const date = stat._id.date;
        const count = stat.count;
        const chars = stat.totalChars;

        chatbotTotalMessages += count;
        chatbotTotalChars += chars;

        // Update daily usage
        dailyUsage[date] = (dailyUsage[date] || 0) + count;
        usageData.aggregatedData.messagesByDate.push({
          date,
          count: count as number
        });
      });

      // Update model and language distribution
      if (aiSettings) {
        usageData.aggregatedData.modelDistribution[aiSettings.model] = 
          (usageData.aggregatedData.modelDistribution[aiSettings.model] || 0) + chatbotTotalMessages;
        usageData.aggregatedData.languageDistribution[aiSettings.language] = 
          (usageData.aggregatedData.languageDistribution[aiSettings.language] || 0) + chatbotTotalMessages;
      }

      // Update active chatbots count
      if (chatbotTotalMessages > 0) {
        usageData.chatbots.active++;
      }

      // Add individual chatbot usage data
      usageData.usage[chatbot.chatbotId] = {
        name: chatbot.name,
        dailyUsage: Object.entries(dailyUsage).map(([date, count]) => ({
          date,
          count: count as number
        })),
        modelUsage: aiSettings ? { [aiSettings.model]: chatbotTotalMessages } : {},
        totalMessages: chatbotTotalMessages,
        totalChars: chatbotTotalChars,
        language: aiSettings?.language || 'unknown'
      };

      // Update aggregated totals
      usageData.aggregatedData.totalMessages += chatbotTotalMessages;
      usageData.aggregatedData.totalChars += chatbotTotalChars;
      usageData.chatbots.creditsUsed += Math.round(chatbotTotalChars / 4); // Assuming 4 chars = 1 credit
    }

    // Convert messagesByDate to sorted array format
    usageData.aggregatedData.messagesByDate.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json(usageData);

  } catch (error) {
    console.error("Team usage error:", error);
    return NextResponse.json(
      { error: "Failed to fetch team usage data" },
      { status: 500 }
    );
  }
} 