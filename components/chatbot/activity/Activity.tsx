"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconRefresh, IconFilter, IconDownload, IconTrash, IconBrowserX, IconBrowserCheck, IconBrowserMaximize, IconBrowserMinus, IconBrowserOff, IconBrowserShare, IconBrowserPlus } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { IconBrandWhatsapp, IconBrandInstagram, IconBrandFacebook, IconSitemap, IconBrowser } from "@tabler/icons-react";
import { IconSend } from "@tabler/icons-react";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface Lead {
  name?: string;
  email?: string;
  phone?: string;
}

interface Conversation {
  _id: string;
  chatbotId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  leadId?: Lead;
  platform?: string;
  metadata?: { from?: string, to?: string };
}

const SUB_TABS = [
  { id: "chat-logs", label: "Chat Logs", icon: "💬" },
  { id: "leads", label: "Leads", icon: "👥" },
];

const Activity = ({ teamId, chatbotId }: { teamId: string; chatbotId: string; }) => {
  const pathname = usePathname();
  const currentSubTab = pathname.split('/').pop();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<Conversation | null>(null);
  const [inputMsg, setInputMsg] = useState("");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(`/api/chatbot/conversation?chatbotId=${chatbotId}&lead=0`);
        if (response.ok) {
          const data = await response.json();
          const validConversations = Array.isArray(data) ? data.filter(conv =>
            conv.messages.length > 0 &&
            conv.messages.some((m: Message) => m.content?.trim())
          ) : [];
          setAllConversations(validConversations);
          setConversations(validConversations);
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLeadConversations = async () => {
      try {
        const response = await fetch(`/api/chatbot/conversation?chatbotId=${chatbotId}&lead=1`);
        if (response.ok) {
          const data = await response.json();
          const validConversations = Array.isArray(data) ? data.filter(conv =>
            conv.messages.length > 0 &&
            conv.messages.some((m: Message) => m.content?.trim())
          ) : [];
          setConversations(validConversations);
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentSubTab === 'leads') {
      fetchLeadConversations();
    }

    if (currentSubTab === 'chat-logs') {
      fetchConversations();
    }
  }, [chatbotId, currentSubTab]);

  const handleRefresh = () => {
    setLoading(true);
    const fetchAndRefresh = async () => {
      try {
        const response = await fetch(`/api/chatbot/conversation?chatbotId=${chatbotId}`);
        if (response.ok) {
          const data = await response.json();
          const validConversations = Array.isArray(data) ? data.filter(conv =>
            conv.messages.length > 0 &&
            conv.messages.some((m: Message) => m.content?.trim())
          ) : [];
          setConversations(validConversations);
          setSelectedConversation(validConversations.find(conv => conv._id === selectedConversation._id));
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAndRefresh();
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

  const handleDeleteClick = (conversation: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversationToDelete(conversation);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!conversationToDelete) return;

    try {
      const response = await fetch('/api/chatbot/conversation/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: conversationToDelete._id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete conversation');
      }

      // Remove conversation from state
      setConversations(conversations.filter(c => c._id !== conversationToDelete._id));

      // Clear selected conversation if it was deleted
      if (selectedConversation?._id === conversationToDelete._id) {
        setSelectedConversation(null);
      }

      toast.success('Conversation deleted successfully');
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      toast.error('Failed to delete conversation');
    } finally {
      setIsDeleteDialogOpen(false);
      setConversationToDelete(null);
    }
  };

  const handleSendMessage = async (conversation: Conversation) => {
    setSendingMsg(true);
    if (conversation?.platform == "whatsapp") {
      try {
        const response = await fetch('/api/chatbot/chat/sendviawhatsapp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: conversation.metadata.from,
            to: conversation.metadata.to,
            text: inputMsg,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        // Check if the response contains an error message
        const responseData = await response.json();
        if (responseData.error) {
          throw new Error(responseData.error);
        }

        toast.success('Message is sent successfully');

        handleRefresh();
      } catch (error) {
        console.error('Failed to send message:', error);
        toast.error(error);
      }
    }
    setSendingMsg(false);
  }

  const handleConversationFilter = (platform: string) => {
    if(platform === "all"){
      setConversations(allConversations);
      return;
    }
    console.log(allConversations)
    let filteredConversations;
    if(platform === ""){
      filteredConversations = allConversations.filter(conv => !conv.platform || conv.platform === "" || conv.platform === "Playground");
    } else {
      filteredConversations = allConversations.filter(conv => conv.platform === platform);
    }
    setConversations(filteredConversations);
  };

  const renderChatLogs = () => (
    <div className="flex flex-col h-full">
      {/* Top Header - Fixed */}
      <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
        <div className="flex gap-3 text-green-400">
        <h2 className="text-xl font-semibold text-gray-800 cursor-pointer" onClick={() => handleConversationFilter("all")}>Chat Logs</h2>
          <IconBrandWhatsapp className="cursor-pointer" onClick={() => handleConversationFilter("whatsapp")}/>
          <IconBrandFacebook className="cursor-pointer" onClick={() => handleConversationFilter("facebook")}/>
          <IconBrandInstagram className="cursor-pointer" onClick={() => handleConversationFilter("instagram")}/>
          <IconBrowser className="cursor-pointer" onClick={() => handleConversationFilter("")}/>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="btn btn-outline btn-sm gap-2"
            disabled={loading}
          >
            <IconRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button className="btn btn-outline btn-sm gap-2">
            <IconFilter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="btn btn-outline btn-sm gap-2">
            <IconDownload className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Content Container - Scrollable */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto">
        {/* Conversation List - Responsive height */}
        <div className="w-full lg:w-[400px] lg:border-r bg-white shrink-0">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading conversations...
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No chats found
            </div>
          ) : (
            <div className="divide-y max-h-[192px] lg:max-h-[calc(100vh-300px)] overflow-y-auto">
              {/* 192px = 3 rows * 64px per row on mobile */}
              {/* calc(100vh-300px) = full height minus headers and padding on desktop */}
              {conversations.map((conversation) => {
                const firstUserMessage = conversation.messages.find(m => m.role === 'user');
                return (
                  <div
                    key={conversation._id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer h-16 ${selectedConversation?._id === conversation._id ? 'bg-gray-50' : ''
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="flex items-center gap-2 font-medium text-gray-900 truncate">
                          {conversation?.platform == "whatsapp" && <IconBrandWhatsapp className="text-green-400" />}
                          {(!conversation.platform || conversation.platform === "" || conversation.platform === "Playground") && <IconBrowser className="text-green-400" />}
                          {truncateContent(firstUserMessage?.content || 'No message content')}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{formatDate(conversation.createdAt)}</span>
                          <span>•</span>
                          <span>{conversation.messages.length} messages</span>
                        </div>
                      </div>
                      <button
                        className="p-1 hover:bg-gray-100 rounded ml-2"
                        onClick={(e) => handleDeleteClick(conversation, e)}
                      >
                        <IconTrash className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Conversation Details */}
        <div className="flex-1 bg-gray-50 flex-col justify-between h-full">
          {selectedConversation ? (
            <>
              <div className="flex flex-col">
                <div className="p-4 border-b bg-white sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg flex items-center gap-2 font-semibold capitalize">
                        Source: {selectedConversation?.platform ? selectedConversation.platform : "Playground"}
                        {selectedConversation?.platform == "whatsapp" && <IconBrandWhatsapp className="text-green-400" />}
                      </h3>
                      {selectedConversation?.platform == "whatsapp" &&
                        <div>
                          from {selectedConversation?.metadata?.from} to {selectedConversation?.metadata?.to}
                        </div>
                      }
                      <div className="text-sm text-gray-500">
                        {formatDate(selectedConversation.createdAt)}
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <IconTrash className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  {selectedConversation.messages.map((message, index) => (
                    <div key={index} className={`mb-4 ${message.role === 'assistant' ? '' : 'flex justify-end'}`}>
                      <div className={`rounded-lg p-4 inline-block max-w-[80%] ${message.role === 'assistant' ? 'bg-white' : 'bg-blue-500 text-white'
                        }`}>
                        <div className="html-content" dangerouslySetInnerHTML={{ __html: message.content }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Send chat */}
              {
                (selectedConversation?.platform == "whatsapp") 
                &&
                <div className="relative">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className={`w-full p-3 pr-10 border focus:outline-none focus:border-blue-500 text-sm`}
                  disabled={sendingMsg}
                />
                <button
                  type="submit"
                  onClick={() => handleSendMessage(selectedConversation)}
                  disabled={sendingMsg || !inputMsg.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <IconSend className="w-4 h-4" />
                </button>
                </div>
              }
            </>
          ) : (
            <div className="flex-1 h-96 flex items-center justify-center text-gray-500">
              Select a conversation to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderLeads = () => (
    <div className="flex flex-col h-full">
      {/* Top Header - Fixed */}
      <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
        <h2 className="text-xl font-semibold">Leads</h2>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="btn btn-outline btn-sm gap-2"
            disabled={loading}
          >
            <IconRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button className="btn btn-outline btn-sm gap-2">
            <IconFilter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="btn btn-outline btn-sm gap-2">
            <IconDownload className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Content Container - Scrollable */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto">
        {/* Conversation List - Responsive height */}
        <div className="w-full lg:w-[400px] lg:border-r bg-white shrink-0">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading conversations...
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No chats found
            </div>
          ) : (
            <div className="divide-y max-h-[192px] lg:max-h-[calc(100vh-300px)] overflow-y-auto">
              {/* 192px = 3 rows * 64px per row on mobile */}
              {/* calc(100vh-300px) = full height minus headers and padding on desktop */}
              {conversations.map((conversation) => {
                const firstUserMessage = conversation.messages.find(m => m.role === 'user');
                return (
                  <div
                    key={conversation._id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer h-16 ${selectedConversation?._id === conversation._id ? 'bg-gray-50' : ''
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {truncateContent(conversation?.leadId?.name || conversation?.leadId?.email || conversation?.leadId?.phone || "No Lead information")}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{formatDate(conversation.createdAt)}</span>
                          <span>•</span>
                          <span>{conversation.messages.length} messages</span>
                        </div>
                      </div>
                      <button
                        className="p-1 hover:bg-gray-100 rounded ml-2"
                        onClick={(e) => handleDeleteClick(conversation, e)}
                      >
                        <IconTrash className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Conversation Details */}
        <div className="flex-1 bg-gray-50">
          {selectedConversation ? (
            <div className="flex flex-col">
              <div className="p-4 border-b bg-white sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">
                      {formatDate(selectedConversation.createdAt)}
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <IconTrash className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                {selectedConversation.messages.map((message, index) => (
                  <div key={index} className={`mb-4 ${message.role === 'assistant' ? '' : 'flex justify-end'}`}>
                    <div className={`rounded-lg p-4 inline-block max-w-[80%] ${message.role === 'assistant' ? 'bg-white' : 'bg-blue-500 text-white'
                      }`}>
                      <div className="html-content" dangerouslySetInnerHTML={{ __html: message.content }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a conversation to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col lg:flex-row min-h-[calc(100dvh-104px)]">
        {/* Navigation - Top on mobile, Side on desktop */}
        <div className="lg:w-64 border-b lg:border-b-0 lg:border-r bg-white">
          <div className="p-4 lg:p-6">
            <h1 className="text-2xl font-bold mb-4 lg:mb-6">Activity</h1>
            <nav className="flex lg:flex-col gap-2">
              {SUB_TABS.map((tab) => (
                <Link
                  key={tab.id}
                  href={`/dashboard/${teamId}/chatbot/${chatbotId}/activity/${tab.id}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors w-full
                    ${currentSubTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {currentSubTab === 'chat-logs' ? (
            renderChatLogs()
          ) : (
            renderLeads()
          )}
        </div>
      </div>
    </>
  );
};

export default Activity; 