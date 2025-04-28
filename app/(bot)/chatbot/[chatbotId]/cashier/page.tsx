'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

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

export default function CashierPage() {
  const params = useParams();
  const chatbotId = params.chatbotId as string;
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  // Fetch orders on component mount and periodically refresh
  useEffect(() => {
    fetchOrders();
    
    // Set up polling to refresh orders every 30 seconds
    const intervalId = setInterval(fetchOrders, 30000);
    
    return () => clearInterval(intervalId);
  }, [chatbotId, activeTab]);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Determine portal filter based on active tab
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
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/chatbot/${chatbotId}/orders/${orderId}`, {
        method: 'PATCH',
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
      
      alert(`Order #${orderId} status changed to ${newStatus}`);
      
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };
  
  const sendWhatsAppConfirmation = async (orderId: string) => {
    try {
      const order = orders.find(o => o.orderId === orderId);
      
      if (!order || order.portal !== 'whatsapp') {
        alert('This is not a WhatsApp order');
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
      
      alert(`WhatsApp notification sent for order #${orderId}`);
      
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error);
      alert('Failed to send WhatsApp notification. Please try again.');
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
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Order Management</h1>
          <p className="text-gray-600">
            Manage and process orders from web and WhatsApp customers
          </p>
        </div>
        
        <div className="p-6">
          {/* Tabs */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'whatsapp'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                WhatsApp
              </button>
              <button
                onClick={() => setActiveTab('web')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'web'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                Web
              </button>
            </div>
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md"
            >
              Refresh
            </button>
          </div>
          
          {/* Orders Table */}
          {loading ? (
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        <td className="px-6 py-4 whitespace-nowrap">
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
                                  <div key={index} className="flex justify-between">
                                    <span>
                                      {item.qty} x {item.name}
                                    </span>
                                    <span>${(item.price * item.qty).toFixed(2)}</span>
                                  </div>
                                ))}
                                <div className="flex justify-between font-semibold border-t pt-2">
                                  <span>Total</span>
                                  <span>${order.subtotal.toFixed(2)}</span>
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
