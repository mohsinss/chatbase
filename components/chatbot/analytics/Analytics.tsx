"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface AnalyticsData {
  totalChats: number;
  totalMessages: number;
  messagesPerDay: { date: string; count: number }[];
  messageTypes: { type: string; count: number }[];
  creditUsage: {
    used: number;
    total: number;
  };
  knowledgeBase?: {
    totalCharacters: number;
    totalSources: number;
    totalQAPairs: number;
    sources: string[];
    averageSourceSize: number;
  };
  modelUsage?: {
    [key: string]: number;
  };
  aiSettings?: {
    currentModel: string;
    temperature: number;
    maxTokens: number;
    language: string;
    contextWindow: number;
  };
}

const COLORS = ['#8b5cf6', '#3b82f6', '#22c55e', '#ef4444', '#f97316'];

const Analytics = ({
  teamId,
  chatbotId
}: {
  teamId: string;
  chatbotId: string;
}) => {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null
  });
  
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalChats: 0,
    totalMessages: 0,
    messagesPerDay: [],
    messageTypes: [],
    creditUsage: {
      used: 0,
      total: 5000 // Default limit
    }
  });

  const fetchAnalyticsData = async (dateRange: any) => {
    try {
      const response = await fetch(`/api/chatbot/analytics/${chatbotId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dateRange),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform the data for charts
      const messagesPerDay = Object.entries(data.messagesByDate || {}).map(
        ([date, count]) => ({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          count: count as number
        })
      );

      const messageTypes = [
        { type: 'User Messages', count: data.userMessages || 0 },
        { type: 'Bot Responses', count: data.botResponses || 0 },
        { type: 'System Messages', count: data.systemMessages || 0 }
      ];

      setAnalyticsData({
        totalChats: data.totalChats || 0,
        totalMessages: data.totalMessages || 0,
        messagesPerDay,
        messageTypes,
        creditUsage: {
          used: data.creditsUsed || 0,
          total: data.creditLimit || 5000
        },
        knowledgeBase: data.knowledgeBase,
        modelUsage: data.modelUsage,
        aiSettings: data.aiSettings
      });
    } catch (error) {
      console.error("Failed to fetch analytics data", error);
    }
  };

  useEffect(() => {
    fetchAnalyticsData({startDate: null, endDate: null});
  }, [chatbotId]);

  const handleDateChange = (newValue: any) => {
    setValue(newValue);
    fetchAnalyticsData(newValue);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Analytics</h1>
        <div className="w-[300px]">
          <Datepicker
            value={value}
            onChange={handleDateChange}
            showShortcuts={true}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex flex-col">
            <div className="text-5xl font-bold">
              {analyticsData.creditUsage.used}
              <span className="text-xl text-gray-500 font-normal">
                {' '}/ {analyticsData.creditUsage.total}
              </span>
            </div>
            <div className="text-gray-500 mt-2">Credits used</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <div className="text-5xl font-bold">
              {analyticsData.totalMessages}
              <span className="text-xl text-gray-500 font-normal"> messages</span>
            </div>
            <div className="text-gray-500 mt-2">Total interactions</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <div className="text-5xl font-bold">
              {(analyticsData.knowledgeBase?.totalCharacters || 0).toLocaleString()}
              <span className="text-xl text-gray-500 font-normal"> chars</span>
            </div>
            <div className="text-gray-500 mt-2">Knowledge Base Size</div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Knowledge Base Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold">
              {analyticsData.knowledgeBase?.totalSources || 0}
            </div>
            <div className="text-gray-500">Total Sources</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {analyticsData.knowledgeBase?.totalQAPairs || 0}
            </div>
            <div className="text-gray-500">Q&A Pairs</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {Math.round(analyticsData.knowledgeBase?.averageSourceSize || 0).toLocaleString()}
            </div>
            <div className="text-gray-500">Avg. Source Size (chars)</div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Model Usage Distribution</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={Object.entries(analyticsData.modelUsage || {}).map(([model, count]) => ({
                  name: model,
                  value: count
                }))}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={0}
                dataKey="value"
                nameKey="name"
                label={({name, value}) => value > 0 ? `${name} (${value})` : ''}
              >
                {Object.keys(analyticsData.modelUsage || {}).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Messages History</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer>
            <BarChart data={analyticsData.messagesPerDay}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date"
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Messages"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Message Distribution</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={analyticsData.messageTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={0}
                dataKey="count"
                nameKey="type"
                label={({type, count}) => count > 0 ? `${type} (${count})` : ''}
              >
                {analyticsData.messageTypes.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Current AI Configuration</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="font-medium">{analyticsData.aiSettings?.currentModel}</div>
            <div className="text-sm text-gray-500">Model</div>
          </div>
          <div>
            <div className="font-medium">{analyticsData.aiSettings?.temperature}</div>
            <div className="text-sm text-gray-500">Temperature</div>
          </div>
          <div>
            <div className="font-medium">{analyticsData.aiSettings?.maxTokens}</div>
            <div className="text-sm text-gray-500">Max Tokens</div>
          </div>
          <div>
            <div className="font-medium">{analyticsData.aiSettings?.language}</div>
            <div className="text-sm text-gray-500">Language</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics; 