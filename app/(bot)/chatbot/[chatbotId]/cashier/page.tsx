'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import DashboardNav from "@/components/DashboardNav";
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
import MetricsPage from '@/components/cashier/MetricsPage';

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

type DateRange = 'last30m' | 'last1h' | 'last12h' | 'last24h' | 'last7d' | 'last30d' | 'last3m' | 'last12m' | 'last24m';

export default function CashierPage() {
  const params = useParams();
  const chatbotId = params.chatbotId as string;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>('last24h');
  const [showDateRangeDropdown, setShowDateRangeDropdown] = useState(false);

  const getDateRangeFilter = (range: DateRange): Date => {
    const now = new Date();
    switch (range) {
      case 'last30m':
        return new Date(now.getTime() - 30 * 60 * 1000);
      case 'last1h':
        return new Date(now.getTime() - 60 * 60 * 1000);
      case 'last12h':
        return new Date(now.getTime() - 12 * 60 * 60 * 1000);
      case 'last24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case 'last7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'last30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'last3m':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case 'last12m':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      case 'last24m':
        return new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
  };

  // Add click-away listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDateRangeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch orders and menu items on component mount and periodically refresh
  useEffect(() => {
    fetchOrders();
    fetchMenuItems();

    // Set up polling to refresh orders every 30 seconds
    const intervalId = setInterval(() => {
      fetchOrders();
      fetchMenuItems();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [chatbotId, activeTab, selectedDateRange]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      let portalFilter = '';
      if (activeTab === 'whatsapp') {
        portalFilter = 'whatsapp';
      } else if (activeTab === 'web') {
        portalFilter = 'web';
      }

      const response = await fetch(`/api/chatbot/${chatbotId}/orders?portal=${portalFilter}`);

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      const startDate = getDateRangeFilter(selectedDateRange);
      
      // Filter orders by date range
      const filteredOrders = data.orders.filter((order: Order) => {
        const orderDate = new Date(order.timestamp);
        return orderDate >= startDate && orderDate <= new Date();
      });

      // Sort orders by timestamp in descending order (newest first)
      const sortedOrders = filteredOrders.sort((a: Order, b: Order) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });

      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`/api/chatbot/${chatbotId}/menu-items`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const data = await response.json();
      setMenuItems(data.menuItems || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu items. Please try again.');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/chatbot/${chatbotId}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update local state
      setOrders(orders.map(order =>
        order.orderId === orderId
          ? { ...order, status: newStatus as any }
          : order
      ));

      toast.success(`Order #${orderId} status changed to ${newStatus}`);

    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status. Please try again.');
    }
  };

  const sendWhatsAppConfirmation = async (orderId: string) => {
    try {
      const order = orders.find(o => o.orderId === orderId);

      if (!order || order.portal !== 'whatsapp') {
        toast.error('This is not a WhatsApp order');
        return;
      }

      const response = await fetch(`/api/chatbot/${chatbotId}/orders/${orderId}/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: order.status,
          message: `Your order #${orderId} status has been updated to: ${order.status}`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send WhatsApp notification');
      }

      toast.success(`WhatsApp notification sent for order #${orderId}`);

    } catch (error) {
      console.error('Error sending WhatsApp notification:', error);
      toast.error('Failed to send WhatsApp notification. Please try again.');
    }
  };

  const toggleOrderExpand = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      received: 'bg-blue-100 text-blue-800',
      preparing: 'bg-yellow-100 text-yellow-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const calculateMetrics = () => {
    const metrics = {
      deliverySpeed: [] as { date: string; avgTime: number }[],
      popularItems: [] as { name: string; count: number }[],
      tableMetrics: [] as { table: string; totalValue: number; orderCount: number }[],
      orderValueDistribution: [] as { range: string; count: number }[],
    };

    // Calculate delivery speed
    const deliveryTimes = orders
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
    const itemCounts = orders.reduce((acc, order) => {
      order.items.forEach(item => {
        if (!acc[item.name]) {
          acc[item.name] = 0;
        }
        acc[item.name] += item.qty;
      });
      return acc;
    }, {} as Record<string, number>);

    metrics.popularItems = Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate table metrics
    const tableStats = orders.reduce((acc, order) => {
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
        orderCount: stats.orderCount
      }))
      .sort((a, b) => b.totalValue - a.totalValue);

    // Calculate order value distribution
    const valueRanges = [
      { min: 0, max: 20, label: '$0-20' },
      { min: 20, max: 50, label: '$20-50' },
      { min: 50, max: 100, label: '$50-100' },
      { min: 100, max: Infinity, label: '$100+' }
    ];

    const valueDistribution = orders.reduce((acc, order) => {
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

    return metrics;
  };

  const metrics = calculateMetrics();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  return (
    <div className="container mx-auto py-6 px-4">
      <DashboardNav teamId={chatbotId} hideFields={true}/>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Order Management</h1>
          <p className="text-gray-600">
            Manage and process orders from web and WhatsApp customers
          </p>
        </div>

        <div className="p-6">
          {/* Tabs and Date Range Filter */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-md ${activeTab === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                  }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`px-4 py-2 rounded-md ${activeTab === 'whatsapp'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                  }`}
              >
                WhatsApp
              </button>
              <button
                onClick={() => setActiveTab('web')}
                className={`px-4 py-2 rounded-md ${activeTab === 'web'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                  }`}
              >
                Web
              </button>
            </div>

            <div className="flex space-x-2 items-center">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDateRangeDropdown(!showDateRangeDropdown)}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 flex items-center space-x-2"
                >
                  <span>
                    {selectedDateRange === 'last30m' ? 'Last 30 Minutes' :
                     selectedDateRange === 'last1h' ? 'Last Hour' :
                     selectedDateRange === 'last12h' ? 'Last 12 Hours' :
                     selectedDateRange === 'last24h' ? 'Last 24 Hours' :
                     selectedDateRange === 'last7d' ? 'Last 7 Days' :
                     selectedDateRange === 'last30d' ? 'Last 30 Days' :
                     selectedDateRange === 'last3m' ? 'Last 3 Months' :
                     selectedDateRange === 'last12m' ? 'Last 12 Months' :
                     'Last 24 Months'}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDateRangeDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                    <div className="py-1 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {[
                        { value: 'last30m', label: 'Last 30 Minutes' },
                        { value: 'last1h', label: 'Last Hour' },
                        { value: 'last12h', label: 'Last 12 Hours' },
                        { value: 'last24h', label: 'Last 24 Hours' },
                        { value: 'last7d', label: 'Last 7 Days' },
                        { value: 'last30d', label: 'Last 30 Days' },
                        { value: 'last3m', label: 'Last 3 Months' },
                        { value: 'last12m', label: 'Last 12 Months' },
                        { value: 'last24m', label: 'Last 24 Months' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                            selectedDateRange === option.value
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700'
                          }`}
                          onClick={() => {
                            setSelectedDateRange(option.value as DateRange);
                            setShowDateRangeDropdown(false);
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveTab('metrics')}
                className={`px-12 py-2 rounded-md ${activeTab === 'metrics'
                    ? 'bg-purple-600 text-white'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
              >
                Metrics
              </button>
              <button
                onClick={fetchOrders}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
              >
                Refresh
              </button>
            </div>
          </div>

          {activeTab === 'metrics' ? (
            <MetricsPage orders={orders} menuItems={menuItems} />
          ) : loading ? (
            <div className="flex justify-center p-8">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center p-8">No orders found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    {activeTab === 'whatsapp' ? (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        From
                      </th>
                    ) : null}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Table
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <React.Fragment key={order.orderId}>
                      <tr
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleOrderExpand(order.orderId)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {order.orderId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDate(order.timestamp)}
                        </td>
                        {activeTab === 'whatsapp' ? (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {order.metadata.from}
                          </th>
                        ) : null}
                        <td className="px-6 py-4 whitespace-nowrap hidden">
                          <span className="px-2 py-1 text-xs rounded-full border">
                            {order.portal === 'whatsapp' ? 'WhatsApp' : 'Web'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.table || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.items.length} items
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${order.subtotal.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                              className="px-2 py-1 border rounded-md text-sm"
                            >
                              <option value="received">Received</option>
                              <option value="preparing">Preparing</option>
                              <option value="ready">Ready</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>

                            {order.portal === 'whatsapp' && (
                              <button
                                className="px-2 py-1 border rounded-md text-sm"
                                onClick={() => sendWhatsAppConfirmation(order.orderId)}
                              >
                                Notify
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded order details */}
                      {expandedOrder === order.orderId && (
                        <tr>
                          <td colSpan={8} className="bg-gray-50 p-4">
                            <div className="space-y-4">
                              <h4 className="font-semibold">Order Details</h4>
                              <div className="space-y-2">
                                {order.items.map((item, index) => (
                                  <div key={index} className="flex justify-between items-center space-x-4">
                                    <div className="flex-1">
                                      <select
                                        className="w-full border border-gray-300 rounded-md p-1"
                                        value={item.name}
                                        onChange={(e) => {
                                          const newName = e.target.value;
                                          const newItems = [...order.items];
                                          newItems[index].name = newName;

                                          // Update price based on selected menu item
                                          const menuItem = menuItems.find(mi => mi.name === newName);
                                          if (menuItem) {
                                            newItems[index].price = menuItem.price;
                                            newItems[index].item_id = menuItem.id;
                                          }

                                          const newOrders = orders.map(o => {
                                            if (o.orderId === order.orderId) {
                                              return { ...o, items: newItems };
                                            }
                                            return o;
                                          });
                                          setOrders(newOrders);
                                        }}
                                      >
                                        <option value="">Select item</option>
                                        {menuItems.map((menuItem) => (
                                          <option key={menuItem.id} value={menuItem.name}>
                                            {menuItem.name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="w-20">
                                      <input
                                        type="number"
                                        min={1}
                                        className="w-full border border-gray-300 rounded-md p-1"
                                        value={item.qty}
                                        onChange={(e) => {
                                          const newQty = parseInt(e.target.value, 10) || 1;
                                          const newItems = [...order.items];
                                          newItems[index].qty = newQty;
                                          const newOrders = orders.map(o => {
                                            if (o.orderId === order.orderId) {
                                              return { ...o, items: newItems };
                                            }
                                            return o;
                                          });
                                          setOrders(newOrders);
                                        }}
                                      />
                                    </div>
                                    <div className="w-24">
                                      <input
                                        type="number"
                                        min={0}
                                        step={0.01}
                                        className="w-full border border-gray-300 rounded-md p-1 bg-gray-100 cursor-not-allowed"
                                        value={item.price}
                                        readOnly
                                      />
                                    </div>
                                    <button
                                      className="text-red-600 hover:text-red-800"
                                      onClick={() => {
                                        const newItems = order.items.filter((_, i) => i !== index);
                                        const newOrders = orders.map(o => {
                                          if (o.orderId === order.orderId) {
                                            return { ...o, items: newItems };
                                          }
                                          return o;
                                        });
                                        setOrders(newOrders);
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                ))}
                                <button
                                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md"
                                  onClick={() => {
                                    const newItems = [...order.items, { item_id: '', name: '', qty: 1, price: 0 }];
                                    const newOrders = orders.map(o => {
                                      if (o.orderId === order.orderId) {
                                        return { ...o, items: newItems };
                                      }
                                      return o;
                                    });
                                    setOrders(newOrders);
                                  }}
                                >
                                  Add Item
                                </button>
                                <div className="flex justify-between font-semibold border-t pt-2">
                                  <span>Total</span>
                                  <span>${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="pt-4 flex space-x-4">
                                  <button
                                    className="px-4 py-2 bg-green-600 text-white rounded-md"
                                    onClick={async () => {
                                      try {
                                        // Prepare updated order data
                                        const updatedOrder = orders.find(o => o.orderId === order.orderId);
                                        if (!updatedOrder) return;

                                        // Calculate new subtotal
                                        const newSubtotal = updatedOrder.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
                                        updatedOrder.subtotal = newSubtotal;

                                        // Send update request to API
                                        const response = await fetch(`/api/chatbot/${chatbotId}/orders/${order.orderId}`, {
                                          method: 'PUT',
                                          headers: {
                                            'Content-Type': 'application/json',
                                          },
                                          body: JSON.stringify(updatedOrder),
                                        });

                                        if (!response.ok) {
                                          throw new Error('Failed to update order');
                                        }

                                        // Send detailed notification if WhatsApp order
                                        if (updatedOrder.portal === 'whatsapp') {
                                          // Format order details message
                                          const orderDetailsText = `Your order #${order.orderId} has been updated. Here are the details:\n` +
                                            updatedOrder.items.map(item => `• ${item.qty}x ${item.name} - $${(item.price * item.qty).toFixed(2)}`).join('\n') +
                                            `\nTotal: $${updatedOrder.subtotal.toFixed(2)}`;

                                          // Send the detailed message
                                          await fetch(`/api/chatbot/${chatbotId}/orders/${order.orderId}/notify`, {
                                            method: 'POST',
                                            headers: {
                                              'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                              status: updatedOrder.status,
                                              message: orderDetailsText,
                                            }),
                                          });
                                        }

                                        toast.success('Order updated successfully');
                                        // Refresh orders
                                        fetchOrders();
                                      } catch (error) {
                                        console.error('Error updating order:', error);
                                        toast.error('Failed to update order. Please try again.');
                                      }
                                    }}
                                  >
                                    Update Order
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}