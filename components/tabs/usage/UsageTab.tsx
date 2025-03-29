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
  ComposedChart,
} from "recharts";
import config from "@/config";
import { BarChart3, LineChart as LineChartIcon, AreaChart as AreaChartIcon, MoreHorizontal, Loader2, PieChart as PieChartIcon, BarChart as BarChartIcon, RefreshCcw, Focus } from "lucide-react";

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
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar' | 'composed' | 'pie'>('area');
  const [focusedChatbots, setFocusedChatbots] = useState<Set<string>>(new Set());
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

  const handleChartItemClick = (chatbotId: string) => {
    setFocusedChatbots(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chatbotId)) {
        // If already selected, remove it
        newSet.delete(chatbotId);
        console.log('Unfocusing chatbot:', chatbotId);
      } else {
        // If not selected, add it
        newSet.add(chatbotId);
        console.log('Focusing on chatbot:', chatbotId);
      }
      return newSet;
    });
  };

  // Helper function to check if a chatbot is focused
  const isChatbotFocused = (chatbotId: string) => {
    return focusedChatbots.size === 0 || focusedChatbots.has(chatbotId);
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Usage Over Time</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setChartType('area')}
              className={`p-2 rounded-md ${chartType === 'area' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              title="Area Chart"
            >
              <AreaChartIcon size={18} />
            </button>
            <button 
              onClick={() => setChartType('line')}
              className={`p-2 rounded-md ${chartType === 'line' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              title="Line Chart"
            >
              <LineChartIcon size={18} />
            </button>
            <button 
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-md ${chartType === 'bar' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              title="Bar Chart"
            >
              <BarChart3 size={18} />
            </button>
            <button 
              onClick={() => setChartType('pie')}
              className={`p-2 rounded-md ${chartType === 'pie' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              title="Pie Chart"
            >
              <PieChartIcon size={18} />
            </button>
            <button 
              onClick={() => setChartType('composed')}
              className={`p-2 rounded-md ${chartType === 'composed' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              title="Combined Chart"
            >
              <MoreHorizontal size={18} />
            </button>
            {focusedChatbots.size > 0 && (
              <button 
                onClick={() => setFocusedChatbots(new Set())}
                className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-700"
                title="Reset Selection"
              >
                <RefreshCcw size={18} />
              </button>
            )}
          </div>
        </div>
        <div className="h-[400px] w-full">
          {/* Wrap each chart type in its own ResponsiveContainer to avoid multiple children error */}
          {chartType === 'area' && (
            <ResponsiveContainer>
              <AreaChart data={usageData.aggregatedData.messagesByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend onClick={(e) => {
                  // Find the chatbotId by matching the name
                  const chatbotId = Object.keys(usageData.usage).find(
                    id => usageData.usage[id].name === e.value
                  );
                  if (chatbotId) handleChartItemClick(chatbotId);
                }} />
                {Object.keys(usageData.usage).map((chatbotId, index) => {
                  const chatbotData = usageData.usage[chatbotId];
                  const isFocused = isChatbotFocused(chatbotId);
                  
                  return (
                    <Area
                      key={chatbotId}
                      type="monotone"
                      dataKey={(entry) => {
                        if (!entry || !entry.date) return 0;
                        const matchingDataPoint = chatbotData.dailyUsage.find(
                          (dataPoint) => dataPoint.date === entry.date
                        );
                        return matchingDataPoint ? matchingDataPoint.count : 0;
                      }}
                      name={chatbotData.name}
                      stackId="1"
                      fill={isFocused ? COLORS[index % COLORS.length] : COLORS[index % COLORS.length] + '40'}
                      stroke={isFocused ? COLORS[index % COLORS.length] : COLORS[index % COLORS.length] + '40'}
                      opacity={isFocused ? 1 : 0.6}
                      onClick={() => {
                        console.log('Area clicked for chatbot:', chatbotId);
                        handleChartItemClick(chatbotId);
                      }}
                    />
                  );
                })}
              </AreaChart>
            </ResponsiveContainer>
          )}
          
          {chartType === 'line' && (
            <ResponsiveContainer>
              <LineChart data={usageData.aggregatedData.messagesByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend onClick={(e) => {
                  // Find the chatbotId by matching the name
                  const chatbotId = Object.keys(usageData.usage).find(
                    id => usageData.usage[id].name === e.value
                  );
                  if (chatbotId) handleChartItemClick(chatbotId);
                }} />
                {Object.keys(usageData.usage).map((chatbotId, index) => {
                  const chatbotData = usageData.usage[chatbotId];
                  const isFocused = isChatbotFocused(chatbotId);
                  
                  return (
                    <Line
                      key={chatbotId}
                      type="monotone"
                      dataKey={(entry) => {
                        if (!entry || !entry.date) return 0;
                        const matchingDataPoint = chatbotData.dailyUsage.find(
                          (dataPoint) => dataPoint.date === entry.date
                        );
                        return matchingDataPoint ? matchingDataPoint.count : 0;
                      }}
                      name={chatbotData.name}
                      stroke={isFocused ? COLORS[index % COLORS.length] : COLORS[index % COLORS.length] + '40'}
                      strokeWidth={isFocused ? 2 : 1}
                      dot={isFocused ? { r: 3 } : { r: 2, fill: COLORS[index % COLORS.length] + '40', strokeWidth: 0 }}
                      activeDot={isFocused ? { r: 5 } : { r: 3 }}
                      opacity={isFocused ? 1 : 0.6}
                      onClick={() => {
                        console.log('Line clicked for chatbot:', chatbotId);
                        handleChartItemClick(chatbotId);
                      }}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          )}
          
          {chartType === 'bar' && (
            <ResponsiveContainer>
              <BarChart data={usageData.aggregatedData.messagesByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend onClick={(e) => {
                  // Find the chatbotId by matching the name
                  const chatbotId = Object.keys(usageData.usage).find(
                    id => usageData.usage[id].name === e.value
                  );
                  if (chatbotId) handleChartItemClick(chatbotId);
                }} />
                {Object.keys(usageData.usage).map((chatbotId, index) => {
                  const chatbotData = usageData.usage[chatbotId];
                  const isFocused = isChatbotFocused(chatbotId);
                  
                  return (
                    <Bar
                      key={chatbotId}
                      dataKey={(entry) => {
                        if (!entry || !entry.date) return 0;
                        const matchingDataPoint = chatbotData.dailyUsage.find(
                          (dataPoint) => dataPoint.date === entry.date
                        );
                        return matchingDataPoint ? matchingDataPoint.count : 0;
                      }}
                      name={chatbotData.name}
                      stackId={focusedChatbots.size > 0 ? (isFocused ? "focused" : "unfocused") : "stack"}
                      fill={isFocused ? COLORS[index % COLORS.length] : COLORS[index % COLORS.length] + '40'}
                      opacity={isFocused ? 1 : 0.6}
                      onClick={() => {
                        console.log('Bar clicked for chatbot:', chatbotId);
                        handleChartItemClick(chatbotId);
                      }}
                    />
                  );
                })}
              </BarChart>
            </ResponsiveContainer>
          )}
          
          {chartType === 'pie' && (
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={Object.keys(usageData.usage).map((chatbotId, index) => {
                    const chatbotData = usageData.usage[chatbotId];
                    const totalMessages = chatbotData.dailyUsage.reduce((sum, day) => sum + day.count, 0);
                    const isFocused = isChatbotFocused(chatbotId);
                    
                    return {
                      name: chatbotData.name,
                      value: totalMessages,
                      chatbotId: chatbotId,
                      fill: isFocused ? COLORS[index % COLORS.length] : COLORS[index % COLORS.length] + '40',
                      opacity: isFocused ? 1 : 0.6
                    };
                  })}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({name, value, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  onClick={(data) => {
                    console.log('Pie segment clicked for chatbot:', data.chatbotId);
                    handleChartItemClick(data.chatbotId);
                  }}
                />
                <Tooltip formatter={(value) => Number(value).toLocaleString()} />
                <Legend onClick={(e) => {
                  // Find the chatbotId by matching the name
                  const chatbotId = Object.keys(usageData.usage).find(
                    id => usageData.usage[id].name === e.value
                  );
                  if (chatbotId) handleChartItemClick(chatbotId);
                }} />
              </PieChart>
            </ResponsiveContainer>
          )}
          
          {chartType === 'composed' && (
            <ResponsiveContainer>
              <ComposedChart data={usageData.aggregatedData.messagesByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend onClick={(e) => {
                  // Find the chatbotId by matching the name
                  const chatbotId = Object.keys(usageData.usage).find(
                    id => usageData.usage[id].name === e.value
                  );
                  if (chatbotId) handleChartItemClick(chatbotId);
                }} />
                {Object.keys(usageData.usage).map((chatbotId, index) => {
                  const chatbotData = usageData.usage[chatbotId];
                  const isFocused = isChatbotFocused(chatbotId);
                  
                  // Alternate between bar and line for different chatbots
                  return index % 2 === 0 ? (
                    <Bar
                      key={chatbotId}
                      dataKey={(entry) => {
                        if (!entry || !entry.date) return 0;
                        const matchingDataPoint = chatbotData.dailyUsage.find(
                          (dataPoint) => dataPoint.date === entry.date
                        );
                        return matchingDataPoint ? matchingDataPoint.count : 0;
                      }}
                      name={chatbotData.name}
                      fill={isFocused ? COLORS[index % COLORS.length] : COLORS[index % COLORS.length] + '40'}
                      opacity={isFocused ? 1 : 0.6}
                      barSize={20}
                      onClick={() => {
                        console.log('Composed Bar clicked for chatbot:', chatbotId);
                        handleChartItemClick(chatbotId);
                      }}
                    />
                  ) : (
                    <Line
                      key={chatbotId}
                      type="monotone"
                      dataKey={(entry) => {
                        if (!entry || !entry.date) return 0;
                        const matchingDataPoint = chatbotData.dailyUsage.find(
                          (dataPoint) => dataPoint.date === entry.date
                        );
                        return matchingDataPoint ? matchingDataPoint.count : 0;
                      }}
                      name={chatbotData.name}
                      stroke={isFocused ? COLORS[index % COLORS.length] : COLORS[index % COLORS.length] + '40'}
                      strokeWidth={isFocused ? 2 : 1}
                      dot={isFocused ? { r: 3 } : { r: 2, fill: COLORS[index % COLORS.length] + '40', strokeWidth: 0 }}
                      activeDot={isFocused ? { r: 5 } : { r: 3 }}
                      opacity={isFocused ? 1 : 0.6}
                      onClick={() => {
                        console.log('Composed Line clicked for chatbot:', chatbotId);
                        handleChartItemClick(chatbotId);
                      }}
                    />
                  );
                })}
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
        {focusedChatbots.size > 0 && (
          <div className="mt-3 flex items-center justify-center space-x-1 text-sm text-blue-600">
            <Focus size={14} />
            <span>
              Focusing on {Array.from(focusedChatbots).map(id => usageData.usage[id]?.name).join(', ')}. 
              Click a chatbot again to deselect or use the reset button to clear all.
            </span>
          </div>
        )}
      </Card>

      {/* Model Distribution */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Model Usage Distribution</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={Object.entries(usageData.aggregatedData.modelDistribution).map(([model, count], index) => ({
                  name: model,
                  value: count,
                  fill: COLORS[index % COLORS.length]
                }))}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={0}
                dataKey="value"
                nameKey="name"
                label={({name, value}) => value > 0 ? `${name} (${value})` : ''}
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(usageData.aggregatedData.modelDistribution).map(([model, count], index) => {
            // Calculate model-specific credits
            let totalChars = 0;
            Object.values(usageData.usage).forEach(chatbot => {
              if (chatbot.modelUsage && chatbot.modelUsage[model]) {
                const modelMsgCount = chatbot.modelUsage[model];
                const totalMsgCount = Object.values(chatbot.modelUsage).reduce((sum, count) => sum + Number(count), 0);
                const proportion = modelMsgCount / totalMsgCount;
                totalChars += chatbot.totalChars * proportion;
              }
            });
            const modelCredits = Math.round(totalChars / 4);
            
            return (
              <div key={index} className="flex justify-between items-center p-2 rounded-md border">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium">{model}</span>
                </div>
                <div className="text-right">
                  <div>{Number(count).toLocaleString()} messages</div>
                  <div className="text-xs text-gray-500">{modelCredits.toLocaleString()} credits</div>
                </div>
              </div>
            );
          })}
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
          const isSelected = focusedChatbots.has(chatbotId);
          
          return (
            <Card 
              key={chatbotId} 
              className={`p-6 transition-colors ${isSelected ? 'border-2' : 'border'}`}
              style={{
                borderColor: isSelected ? COLORS[index % COLORS.length] : '',
                backgroundColor: isSelected ? `${COLORS[index % COLORS.length]}10` : ''
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center">
                  {isSelected && (
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                  )}
                  {data.name}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleChartItemClick(chatbotId)}
                    className={`p-1 rounded-md text-xs font-medium transition-colors ${
                      isSelected 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {isSelected ? 'Deselect' : 'Select'}
                  </button>
                  <a 
                    href={`/dashboard/${teamId}/chatbot/${chatbotId}/analytics/chats`} 
                    className="px-3 py-1 text-sm bg-primary hover:bg-primary/90 text-white rounded-md transition-colors"
                  >
                    View Detailed Analytics
                  </a>
                </div>
              </div>
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