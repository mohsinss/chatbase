"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconRefresh, IconFilter, IconDownload, IconTrash, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  _id: string;
  chatbotId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const SUB_TABS = [
  { id: "chat-logs", label: "Chat Logs", icon: "💬" },
  { id: "leads", label: "Leads", icon: "👥" },
];

const Activity = ({ teamId, chatbotId }: { teamId: string; chatbotId: string; }) => {
  const pathname = usePathname();
  const currentSubTab = pathname.split('/').pop();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    if (currentSubTab === 'chat-logs') {
      fetchConversations();
    }
  }, [chatbotId, currentSubTab]);

  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/chatbot/conversation?chatbotId=${chatbotId}`);
      if (response.ok) {
        const data = await response.json();
        const validConversations = Array.isArray(data) ? data.filter(conv => 
          conv.messages.length > 0 && 
          conv.messages.some(m => m.content?.trim())
        ) : [];
        setConversations(validConversations);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchConversations();
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return messageDate.toLocaleDateString();
  };

  const truncateContent = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Modal component for displaying full conversation
  const ConversationModal = ({ conversation }: { conversation: Conversation }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Conversation Details</h3>
          <button 
            onClick={() => setSelectedConversation(null)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-8rem)]">
          {conversation.messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'assistant' ? '' : 'flex justify-end'}`}>
              <div className={`rounded-lg p-4 inline-block max-w-[80%] ${
                message.role === 'assistant' ? 'bg-gray-100' : 'bg-blue-500 text-white'
              }`}>
                <p>{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentSubTab) {
      case 'chat-logs':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Chat Logs</h2>
              <div className="flex gap-2">
                <button 
                  onClick={handleRefresh}
                  className="btn btn-outline btn-sm gap-2"
                  disabled={loading}
                >
                  <IconRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button className="btn btn-outline btn-sm gap-2">
                  <IconFilter className="w-4 h-4" />
                  Filter
                </button>
                <button className="btn btn-outline btn-sm gap-2">
                  <IconDownload className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Chat Logs List */}
            <div className="bg-white rounded-lg border">
              {loading ? (
                <div className="text-center py-12 text-gray-500">
                  Loading conversations...
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No chats found
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-500">First Message</th>
                      <th className="text-left p-4 font-medium text-gray-500">Date</th>
                      <th className="text-left p-4 font-medium text-gray-500">Source</th>
                      <th className="text-left p-4 font-medium text-gray-500">Messages</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {conversations.map((conversation) => {
                      const firstUserMessage = conversation.messages.find(m => m.role === 'user');
                      return (
                        <tr 
                          key={conversation._id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <td className="p-4">
                            {truncateContent(firstUserMessage?.content || 'No message content')}
                          </td>
                          <td className="p-4 text-gray-500">
                            {formatDate(conversation.createdAt)}
                          </td>
                          <td className="p-4 text-gray-500">
                            Playground
                          </td>
                          <td className="p-4 text-gray-500">
                            {conversation.messages.length}
                          </td>
                          <td className="p-4">
                            <button 
                              className="p-1 hover:bg-gray-100 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Add delete functionality here
                              }}
                            >
                              <IconTrash className="w-4 h-4 text-gray-400 hover:text-red-500" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      
      case 'leads':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Leads</h2>
              <div className="flex gap-2">
                <button className="btn btn-outline btn-sm gap-2">
                  <IconFilter className="w-4 h-4" />
                  Filter
                </button>
                <button className="btn btn-outline btn-sm gap-2">
                  <IconDownload className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
            <div className="text-center py-12 text-gray-500">
              No leads found
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Title and sub-navigation */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Activity</h1>
        <div className="flex space-x-4">
          {SUB_TABS.map((tab) => (
            <Link
              key={tab.id}
              href={`/dashboard/${teamId}/chatbot/${chatbotId}/activity/${tab.id}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${currentSubTab === tab.id 
                  ? "bg-primary/10 text-primary" 
                  : "text-gray-600 hover:bg-gray-100"}`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Content based on current tab */}
      {renderContent()}

      {/* Conversation Modal */}
      {selectedConversation && (
        <ConversationModal conversation={selectedConversation} />
      )}
    </div>
  );
};

export default Activity; 