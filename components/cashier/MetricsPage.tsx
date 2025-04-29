'use client';

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
  Line,
  LineChart,
} from "recharts";

interface OrderItem {
  item_id: string;
  name: string;
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  chatbotId: string;
  orderId: string;
  table: string;
  items: OrderItem[];
  portal: 'web' | 'whatsapp';
  subtotal: number;
  status: 'received' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  metadata: any;
}

interface MetricsPageProps {
  orders: Order[];
  menuItems: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

interface CancellationMetrics {
  totalOrders: number;
  cancelledOrders: number;
  cancellationRate: number;
  reasons: Record<string, number>;
}

interface SatisfactionMetrics {
  avgRating: number;
  ratingDistribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
  feedbackTrends: string[];
}

export default function MetricsPage({ orders, menuItems }: MetricsPageProps) {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  });

  const calculateMetrics = () => {
    const metrics = {
      deliverySpeed: [] as { date: string; avgTime: number }[],
      popularItems: [] as { name: string; count: number; revenue: number }[],
      tableMetrics: [] as { table: string; totalValue: number; orderCount: number; avgOrderValue: number }[],
      orderValueDistribution: [] as { range: string; count: number }[],
      revenueByCategory: [] as { category: string; revenue: number; count: number }[],
      peakHours: [] as { hour: number; orderCount: number; revenue: number }[],
      customerMetrics: [] as { customerId: string; orderCount: number; totalSpent: number; avgOrderValue: number }[],
      cancellationMetrics: {
        totalOrders: 0,
        cancelledOrders: 0,
        cancellationRate: 0,
        reasons: {} as Record<string, number>
      } as CancellationMetrics,
      itemProfitability: [] as { name: string; revenue: number; margin: number; popularity: number }[],
      satisfactionMetrics: {
        avgRating: 0,
        ratingDistribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
        feedbackTrends: []
      } as SatisfactionMetrics
    };

    // Filter orders by date range
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.timestamp);
      return orderDate >= dateRange.startDate && orderDate <= dateRange.endDate;
    });

    // Calculate delivery speed
    const deliveryTimes = filteredOrders
      .filter(order => order.status === 'delivered')
      .map(order => {
        const orderTime = new Date(order.timestamp).getTime();
        const deliveredTime = new Date(order.updatedAt).getTime();
        return {
          date: new Date(order.timestamp).toISOString().split('T')[0],
          time: (deliveredTime - orderTime) / (1000 * 60) // in minutes
        };
      });

    // Group by date and calculate average
    const deliveryByDate = deliveryTimes.reduce((acc, curr) => {
      if (!acc[curr.date]) {
        acc[curr.date] = { total: 0, count: 0 };
      }
      acc[curr.date].total += curr.time;
      acc[curr.date].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    metrics.deliverySpeed = Object.entries(deliveryByDate).map(([date, data]) => ({
      date,
      avgTime: data.total / data.count
    }));

    // Calculate popular items
    const itemCounts = filteredOrders.reduce((acc, order) => {
      order.items.forEach(item => {
        if (!acc[item.name]) {
          acc[item.name] = 0;
        }
        acc[item.name] += item.qty;
      });
      return acc;
    }, {} as Record<string, number>);

    metrics.popularItems = Object.entries(itemCounts)
      .map(([name, count]) => ({ 
        name, 
        count,
        revenue: filteredOrders.reduce((sum, order) => {
          const item = order.items.find(i => i.name === name);
          return sum + (item ? item.price * item.qty : 0);
        }, 0)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate table metrics
    const tableStats = filteredOrders.reduce((acc, order) => {
      if (!order.table) return acc;
      if (!acc[order.table]) {
        acc[order.table] = { totalValue: 0, orderCount: 0 };
      }
      acc[order.table].totalValue += order.subtotal;
      acc[order.table].orderCount += 1;
      return acc;
    }, {} as Record<string, { totalValue: number; orderCount: number }>);

    metrics.tableMetrics = Object.entries(tableStats)
      .map(([table, stats]) => ({
        table,
        totalValue: stats.totalValue,
        orderCount: stats.orderCount,
        avgOrderValue: stats.totalValue / stats.orderCount
      }))
      .sort((a, b) => b.totalValue - a.totalValue);

    // Calculate order value distribution
    const valueRanges = [
      { min: 0, max: 20, label: '$0-20' },
      { min: 20, max: 50, label: '$20-50' },
      { min: 50, max: 100, label: '$50-100' },
      { min: 100, max: Infinity, label: '$100+' }
    ];

    const valueDistribution = filteredOrders.reduce((acc, order) => {
      const range = valueRanges.find(r => order.subtotal >= r.min && order.subtotal < r.max);
      if (range) {
        if (!acc[range.label]) {
          acc[range.label] = 0;
        }
        acc[range.label]++;
      }
      return acc;
    }, {} as Record<string, number>);

    metrics.orderValueDistribution = Object.entries(valueDistribution)
      .map(([range, count]) => ({ range, count }))
      .sort((a, b) => {
        const aMin = parseInt(a.range.replace(/[^0-9]/g, ''));
        const bMin = parseInt(b.range.replace(/[^0-9]/g, ''));
        return aMin - bMin;
      });

    // Calculate revenue by category
    const categoryRevenue = filteredOrders.reduce((acc, order) => {
      order.items.forEach(item => {
        const category = menuItems.find(mi => mi.id === item.item_id)?.category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = { revenue: 0, count: 0 };
        }
        acc[category].revenue += item.price * item.qty;
        acc[category].count += item.qty;
      });
      return acc;
    }, {} as Record<string, { revenue: number; count: number }>);

    metrics.revenueByCategory = Object.entries(categoryRevenue)
      .map(([category, data]) => ({
        category,
        revenue: data.revenue,
        count: data.count
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Calculate peak hours
    const hourStats = filteredOrders.reduce((acc, order) => {
      const hour = new Date(order.timestamp).getHours();
      if (!acc[hour]) {
        acc[hour] = { orderCount: 0, revenue: 0 };
      }
      acc[hour].orderCount += 1;
      acc[hour].revenue += order.subtotal;
      return acc;
    }, {} as Record<number, { orderCount: number; revenue: number }>);

    metrics.peakHours = Object.entries(hourStats)
      .map(([hour, data]) => ({
        hour: parseInt(hour),
        orderCount: data.orderCount,
        revenue: data.revenue
      }))
      .sort((a, b) => a.hour - b.hour);

    // Calculate customer metrics
    const customerStats = filteredOrders.reduce((acc, order) => {
      const customerId = order.metadata?.customerId || 'anonymous';
      if (!acc[customerId]) {
        acc[customerId] = { orderCount: 0, totalSpent: 0 };
      }
      acc[customerId].orderCount += 1;
      acc[customerId].totalSpent += order.subtotal;
      return acc;
    }, {} as Record<string, { orderCount: number; totalSpent: number }>);

    metrics.customerMetrics = Object.entries(customerStats)
      .map(([customerId, data]) => ({
        customerId,
        orderCount: data.orderCount,
        totalSpent: data.totalSpent,
        avgOrderValue: data.totalSpent / data.orderCount
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent);

    // Calculate cancellation metrics
    const cancelledOrders = filteredOrders.filter(order => order.status === 'cancelled');
    metrics.cancellationMetrics = {
      totalOrders: filteredOrders.length,
      cancelledOrders: cancelledOrders.length,
      cancellationRate: (cancelledOrders.length / filteredOrders.length) * 100,
      reasons: cancelledOrders.reduce((acc, order) => {
        const reason = order.metadata?.cancellationReason || 'Unknown';
        acc[reason] = (acc[reason] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    // Calculate item profitability
    const itemStats = filteredOrders.reduce((acc, order) => {
      order.items.forEach(item => {
        if (!acc[item.name]) {
          acc[item.name] = { revenue: 0, count: 0 };
        }
        acc[item.name].revenue += item.price * item.qty;
        acc[item.name].count += item.qty;
      });
      return acc;
    }, {} as Record<string, { revenue: number; count: number }>);

    metrics.itemProfitability = Object.entries(itemStats)
      .map(([name, data]) => ({
        name,
        revenue: data.revenue,
        margin: data.revenue * 0.3, // Assuming 30% margin for demonstration
        popularity: data.count
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Calculate satisfaction metrics (assuming ratings are in metadata)
    const ratings = filteredOrders
      .filter(order => order.metadata?.rating)
      .map(order => order.metadata.rating);

    metrics.satisfactionMetrics = {
      avgRating: ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0,
      ratingDistribution: ratings.reduce((acc, rating) => {
        acc[rating.toString() as keyof typeof acc] = (acc[rating.toString() as keyof typeof acc] || 0) + 1;
        return acc;
      }, { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }),
      feedbackTrends: filteredOrders
        .filter(order => order.metadata?.feedback)
        .map(order => order.metadata.feedback)
    };

    return metrics;
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-8">
      {/* Date Range Selector */}
      <div className="flex gap-4">
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

      {/* Total Revenue Summary */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Total Revenue</h2>
            <p className="text-gray-600">
              {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-blue-600">
              ${metrics.revenueByCategory.reduce((sum, category) => sum + category.revenue, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-600">
              {metrics.revenueByCategory.reduce((sum, category) => sum + category.count, 0)} items sold
            </p>
          </div>
        </div>
      </Card>

      {/* Delivery Speed Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Average Delivery Time</h2>
        <div className="h-[300px]">
          <ResponsiveContainer>
            <LineChart data={metrics.deliverySpeed}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgTime" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Popular Items Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Most Popular Items</h2>
        <div className="h-[300px]">
          <ResponsiveContainer>
            <BarChart data={metrics.popularItems}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8">
                {metrics.popularItems.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Table Performance */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Table Performance</h2>
        <div className="h-[300px]">
          <ResponsiveContainer>
            <BarChart data={metrics.tableMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="table" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="totalValue" name="Total Value ($)" fill="#8884d8">
                {metrics.tableMetrics.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
              <Bar yAxisId="right" dataKey="orderCount" name="Order Count" fill="#82ca9d">
                {metrics.tableMetrics.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Order Value Distribution */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Order Value Distribution</h2>
        <div className="h-[300px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={metrics.orderValueDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {metrics.orderValueDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Revenue by Category */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Revenue by Category</h2>
        <div className="h-[300px]">
          <ResponsiveContainer>
            <BarChart data={metrics.revenueByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" name="Revenue ($)" fill="#8884d8">
                {metrics.revenueByCategory.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
              <Bar yAxisId="right" dataKey="count" name="Items Sold" fill="#82ca9d">
                {metrics.revenueByCategory.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Peak Hours Analysis */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Peak Hours Analysis</h2>
        <div className="h-[300px]">
          <ResponsiveContainer>
            <LineChart data={metrics.peakHours}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="orderCount" stroke="#8884d8" name="Orders" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Customer Metrics */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Top Customers</h2>
        <div className="h-[300px]">
          <ResponsiveContainer>
            <BarChart data={metrics.customerMetrics.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="customerId" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="totalSpent" name="Total Spent ($)" fill="#8884d8">
                {metrics.customerMetrics.slice(0, 10).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
              <Bar yAxisId="right" dataKey="orderCount" name="Orders" fill="#82ca9d">
                {metrics.customerMetrics.slice(0, 10).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Item Profitability */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Item Profitability</h2>
        <div className="h-[300px]">
          <ResponsiveContainer>
            <BarChart data={metrics.itemProfitability.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" name="Revenue ($)" fill="#8884d8">
                {metrics.itemProfitability.slice(0, 10).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
              <Bar yAxisId="right" dataKey="margin" name="Profit ($)" fill="#82ca9d">
                {metrics.itemProfitability.slice(0, 10).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Customer Satisfaction */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Customer Satisfaction</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Average Rating: {metrics.satisfactionMetrics.avgRating.toFixed(1)}</h3>
            <div className="h-[200px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={Object.entries(metrics.satisfactionMetrics.ratingDistribution).map(([rating, count]) => ({
                      name: `${rating} Stars`,
                      value: count
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(metrics.satisfactionMetrics.ratingDistribution).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Recent Feedback</h3>
            <div className="h-[200px] overflow-y-auto">
              {metrics.satisfactionMetrics.feedbackTrends.slice(0, 5).map((feedback: string, index: number) => (
                <div key={index} className="p-2 border-b">
                  <p className="text-sm">{feedback}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Cancellation Analysis */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Cancellation Analysis</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Cancellation Rate: {metrics.cancellationMetrics.cancellationRate.toFixed(1)}%</h3>
            <div className="h-[200px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Completed', value: metrics.cancellationMetrics.totalOrders - metrics.cancellationMetrics.cancelledOrders },
                      { name: 'Cancelled', value: metrics.cancellationMetrics.cancelledOrders }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#00C49F" />
                    <Cell fill="#FF8042" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Cancellation Reasons</h3>
            <div className="h-[200px]">
              <ResponsiveContainer>
                <BarChart data={Object.entries(metrics.cancellationMetrics.reasons).map(([reason, count]) => ({
                  reason,
                  count
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="reason" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8">
                    {Object.entries(metrics.cancellationMetrics.reasons).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 