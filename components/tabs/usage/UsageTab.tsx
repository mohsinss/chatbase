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
import config from "@/config";
import { Loader2 } from "lucide-react";

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
  team?: any;
}

export default function UsageTab({ teamId, team }: UsageTabProps) {
  const [loading, setLoading] = useState(true);
  const [creditLoading, setCreditLoading] = useState(false);
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
  const [totalCreditsUsed, setTotalCreditsUsed] = useState(0);
  const [chatbotCredits, setChatbotCredits] = useState<{[chatbotId: string]: number}>({});
  //@ts-ignore
  const planConfig = config.stripe.plans[team.plan];

  useEffect(() => {
    fetchUsageData();
  }, [teamId, dateRange]);

  // Fetch and update chatbot credits whenever the usageData changes
  useEffect(() => {
    if (Object.keys(usageData.usage).length > 0) {
      fetchChatbotCredits();
    }
  }, [usageData, dateRange]);

  const fetchChatbotCredits = async () => {
    try {
      setCreditLoading(true);
      // Get all chatbot IDs
      const chatbotIds = Object.keys(usageData.usage);
      const creditsMap: {[chatbotId: string]: number} = {};
      let totalCredits = 0;
      
      // Create an array of promises for parallel fetching
      const creditPromises = chatbotIds.map(async (chatbotId) => {
        try {
          const response = await fetch(`/api/chatbot/analytics/${chatbotId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dateRange)
          });
          
          if (response.ok) {
            const analyticsData = await response.json();
            const credits = analyticsData.creditsUsed || 0;
            creditsMap[chatbotId] = credits;
            return credits;
          }
          creditsMap[chatbotId] = 0;
          return 0;
        } catch (error) {
          console.error(`Error fetching credits for chatbot ${chatbotId}:`, error);
          creditsMap[chatbotId] = 0;
          return 0;
        }
      });
      
      // Wait for all promises to resolve
      const credits = await Promise.all(creditPromises);
      
      // Sum up all the credits
      totalCredits = credits.reduce((sum, credit) => sum + credit, 0);
      
      // Update both states at once
      setTotalCreditsUsed(totalCredits);
      setChatbotCredits(creditsMap);
    } catch (error) {
      console.error('Error fetching chatbot credits:', error);
    } finally {
      setCreditLoading(false);
    }
  };

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

  if (loading) return (
    <div className="h-[80vh] w-full flex flex-col items-center justify-center">
      <div className="relative">
        <Loader2 className="h-24 w-24 text-primary animate-spin opacity-25" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-primary/20 animate-ping" />
        </div>
      </div>
      <h2 className="text-2xl font-bold mt-8 text-center">Loading Team Analytics</h2>
      <p className="text-gray-500 mt-2 text-center">Gathering your usage data across all chatbots...</p>
      <div className="flex gap-2 mt-6">
        {COLORS.slice(0, 4).map((color, i) => (
          <div 
            key={i} 
            className="h-3 w-16 rounded-full animate-pulse" 
            style={{ 
              backgroundColor: color,
              animationDelay: `${i * 200}ms`
            }} 
          />
        ))}
      </div>
    </div>
  );

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex flex-col">
            <div className="text-5xl font-bold">
              {creditLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  <span className="text-2xl text-gray-400">Calculating...</span>
                </div>
              ) : (
                <>
                  {totalCreditsUsed.toLocaleString()}
                  <span className="text-xl text-gray-500 font-normal"> / {planConfig.credits.toLocaleString()}</span>
                </>
              )}
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

        {/* <Card className="p-6">
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
        </Card> */}
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
              {Object.keys(usageData.usage).map((chatbotId, index) => {
                // Find this chatbot's daily usage data
                const chatbotData = usageData.usage[chatbotId];
                // Map the data to ensure proper structure for stacked area chart
                return (
                  <Area
                    key={chatbotId}
                    type="monotone"
                    // Map the actual data from each chatbot's dailyUsage
                    dataKey={(entry) => {
                      // Find matching date in this chatbot's dailyUsage
                      const matchingDataPoint = chatbotData.dailyUsage.find(
                        (dataPoint) => dataPoint.date === entry.date
                      );
                      return matchingDataPoint ? matchingDataPoint.count : 0;
                    }}
                    name={chatbotData.name}
                    stackId="1"
                    fill={COLORS[index % COLORS.length]}
                    stroke={COLORS[index % COLORS.length]}
                  />
                );
              })}
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
                nameKey="name"
                label={({name, value}) => value > 0 ? `${name} (${value})` : ''}
              >
                {Object.entries(usageData.aggregatedData.modelDistribution).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => Number(value).toLocaleString()} />
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
              language: lang || 'Unknown',
              count: count
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="language" />
              <YAxis tickFormatter={(value) => Number(value).toLocaleString()} />
              <Tooltip formatter={(value) => Number(value).toLocaleString()} />
              <Bar dataKey="count" fill="#3b82f6" name="Messages">
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
        {Object.entries(usageData.usage).map(([chatbotId, data], index) => {
          const chatbotCreditUsage = chatbotCredits[chatbotId] || 0;
          
          return (
            <Card key={chatbotId} className="p-6">
              <h3 className="text-lg font-bold mb-4">{data.name}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold">{data.totalMessages.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Messages</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{(data.totalChars / 1000).toFixed(1)}K</div>
                    <div className="text-sm text-gray-500">Characters</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {creditLoading ? (
                        <div className="flex items-center">
                          <Loader2 className="h-4 w-4 text-primary animate-spin mr-2" />
                          <span className="text-gray-400">Loading</span>
                        </div>
                      ) : (
                        chatbotCreditUsage.toLocaleString()
                      )}
                    </div>
                    <div className="text-sm text-gray-500">Credits</div>
                  </div>
                </div>

                {/* Model usage for this chatbot */}
                <div className="mt-2 pt-2 border-t">
                  <div className="text-sm font-medium mb-2">Model Distribution</div>
                  <div className="space-y-1">
                    {Object.entries(data.modelUsage || {}).map(([model, count]) => (
                      <div key={model} className="flex justify-between">
                        <span className="text-sm">{model}</span>
                        <span className="text-sm font-medium">{Number(count).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-[200px]">
                  <ResponsiveContainer>
                    <LineChart data={data.dailyUsage}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => Number(value).toLocaleString()} />
                      <Tooltip formatter={(value) => Number(value).toLocaleString()} />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke={COLORS[index % COLORS.length]} 
                        strokeWidth={2}
                        name="Messages"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 