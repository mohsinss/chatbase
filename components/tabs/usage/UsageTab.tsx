"use client"

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

const mockBarData = [
  { date: 'Dec 2', value: 5 },
  { date: 'Dec 5', value: 25 },
  { date: 'Dec 8', value: 15 },
  { date: 'Dec 11', value: 10 },
  { date: 'Dec 14', value: 30 },
  { date: 'Dec 17', value: 20 },
  { date: 'Dec 20', value: 35 },
  { date: 'Dec 23', value: 0 },
  { date: 'Dec 26', value: 10 },
  { date: 'Dec 29', value: 15 },
];

const mockPieData = [
  { name: 'fem1.txt', value: 113 },
  { name: 'Chatbot 12/26/2024', value: 6 },
  { name: 'explodingtopics.com', value: 0 },
  { name: 'ui.shadcn.com', value: 0 },
  { name: 'Others', value: 0 },
];

const COLORS = ['#8b5cf6', '#3b82f6', '#22c55e', '#ef4444', '#f97316'];

interface UsageTabProps {
  teamId: string;
}

export default function UsageTab({ teamId }: UsageTabProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Usage</h1>
        <div className="flex gap-2">
          <select className="border rounded-md p-2">
            <option>All Chatbots</option>
          </select>
          <input type="date" className="border rounded-md p-2" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex flex-col">
            <div className="text-5xl font-bold">119<span className="text-xl text-gray-500 font-normal"> / 5020</span></div>
            <div className="text-gray-500 mt-2">Credits used</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <div className="text-5xl font-bold">29<span className="text-xl text-gray-500 font-normal"> / 40</span></div>
            <div className="text-gray-500 mt-2">Chatbots used</div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Usage History</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer>
            <BarChart data={mockBarData}>
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
                dataKey="value"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Credits used per chatbot</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={mockPieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={0}
                dataKey="value"
                label={({name, value}) => value > 0 ? `${name} (${value})` : ''}
              >
                {mockPieData.map((_, index) => (
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
    </div>
  );
} 