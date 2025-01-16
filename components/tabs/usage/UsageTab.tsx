"use client"

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
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
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

const COLORS = ['#8b5cf6', '#3b82f6', '#22c55e', '#ef4444', '#f97316', '#06b6d4', '#ec4899', '#14b8a6'];

interface UsageData {
  chatbots: {
    total: number;
    active: number;
    creditsUsed: number;
    creditLimit: number;
  };
  usage: {
    [chatbotId: string]: {
      name: string;
      dailyUsage: { date: string; count: number }[];
      modelUsage: { [model: string]: number };
      totalMessages: number;
      totalChars: number;
      language: string;
    };
  };
  aggregatedData: {
    totalMessages: number;
    totalChars: number;
    messagesByDate: { date: string; count: number }[];
    modelDistribution: { [key: string]: number };
    languageDistribution: { [key: string]: number };
  };
}

interface UsageTabProps {
  teamId: string;
}

export default function UsageTab({ teamId }: UsageTabProps) {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  });
  const [usageData, setUsageData] = useState<UsageData>({
    chatbots: { total: 0, active: 0, creditsUsed: 0, creditLimit: 5000 },
    usage: {},
    aggregatedData: {
      totalMessages: 0,
      totalChars: 0,
      messagesByDate: [],
      modelDistribution: {},
      languageDistribution: {}
    }
  });

  useEffect(() => {
    fetchUsageData();
  }, [teamId, dateRange]);

  const fetchUsageData = async () => {
    try {
      const response = await fetch(`/api/team/usage/${teamId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dateRange)
      });
      
      if (!response.ok) throw new Error('Failed to fetch usage data');
      const data = await response.json();
      setUsageData(data);
    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Team Usage</h1>
        <div className="flex gap-2">
          <input 
            type="date" 
            className="border rounded-md p-2"
            value={dateRange.startDate.toISOString().split('T')[0]}
            onChange={(e) => setDateRange(prev => ({
              ...prev,
              startDate: new Date(e.target.value)
            }))}
          />
          <input 
            type="date" 
            className="border rounded-md p-2"
            value={dateRange.endDate.toISOString().split('T')[0]}
            onChange={(e) => setDateRange(prev => ({
              ...prev,
              endDate: new Date(e.target.value)
            }))}
          />
        </div>
      </div>
      
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex flex-col">
            <div className="text-5xl font-bold">
              {usageData.chatbots.creditsUsed}
              <span className="text-xl text-gray-500 font-normal"> / {usageData.chatbots.creditLimit}</span>
            </div>
            <div className="text-gray-500 mt-2">Total Credits Used</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <div className="text-5xl font-bold">
              {usageData.chatbots.active}
              <span className="text-xl text-gray-500 font-normal"> / {usageData.chatbots.total}</span>
            </div>
            <div className="text-gray-500 mt-2">Active Chatbots</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <div className="text-5xl font-bold">
              {usageData.aggregatedData.totalMessages.toLocaleString()}
            </div>
            <div className="text-gray-500 mt-2">Total Messages</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <div className="text-5xl font-bold">
              {(usageData.aggregatedData.totalChars / 1000).toFixed(1)}K
            </div>
            <div className="text-gray-500 mt-2">Total Characters</div>
          </div>
        </Card>
      </div>

      {/* Usage Over Time */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Usage Over Time</h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer>
            <AreaChart data={usageData.aggregatedData.messagesByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(usageData.usage).map((chatbotId, index) => (
                <Area
                  key={chatbotId}
                  type="monotone"
                  dataKey="count"
                  name={usageData.usage[chatbotId].name}
                  stackId="1"
                  fill={COLORS[index % COLORS.length]}
                  stroke={COLORS[index % COLORS.length]}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Model Distribution */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Model Usage Distribution</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={Object.entries(usageData.aggregatedData.modelDistribution).map(([model, count]) => ({
                  name: model,
                  value: count
                }))}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={0}
                dataKey="value"
              >
                {Object.entries(usageData.aggregatedData.modelDistribution).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Language Distribution */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Language Distribution</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer>
            <BarChart data={Object.entries(usageData.aggregatedData.languageDistribution).map(([lang, count]) => ({
              language: lang,
              count: count
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="language" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6">
                {Object.entries(usageData.aggregatedData.languageDistribution).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Individual Chatbot Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(usageData.usage).map(([chatbotId, data], index) => (
          <Card key={chatbotId} className="p-6">
            <h3 className="text-lg font-bold mb-4">{data.name}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">{data.totalMessages}</div>
                  <div className="text-sm text-gray-500">Messages</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{(data.totalChars / 1000).toFixed(1)}K</div>
                  <div className="text-sm text-gray-500">Characters</div>
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer>
                  <LineChart data={data.dailyUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke={COLORS[index % COLORS.length]} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 