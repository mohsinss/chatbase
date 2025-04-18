"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconRefresh, IconFilter, IconDownload, IconTrash, IconBrowserX, IconBrowserCheck, IconBrowserMaximize, IconBrowserMinus, IconBrowserOff, IconBrowserShare, IconBrowserPlus } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { IconBrandWhatsapp, IconBrandInstagram, IconMessage, IconBrandFacebook, IconSitemap, IconBrowser } from "@tabler/icons-react";
import { IconSend } from "@tabler/icons-react";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  deleted?: boolean;
  from?: string;
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
  metadata?: {
    from?: string,
    to?: string,
    to_name?: string,
    from_name?: string
    page_id?: string
    comment_id?: string
  };
}

const SUB_TABS = [
  { id: "chat-logs", label: "Chat Logs", icon: "💬" },
  { id: "leads", label: "Leads", icon: "👥" },
];

interface ChatbotData {
  id: string;
  name: string;
}

const Activity = ({ teamId, chatbotId, chatbot }: { teamId: string; chatbotId: string; chatbot: ChatbotData }) => {
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
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const [userConversations, setUserConversations] = useState<Conversation[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (selectedConversation?.platform == "whatsapp"
      || selectedConversation?.platform == "facebook"
    ) {
      fetchAutoReplyStatus(selectedConversation.metadata.to);
    }
  }, [selectedConversation])

  const toggleAutoReply = async () => {
    const newStatus = autoReplyEnabled;
    try {
      const response = await fetch('/api/chatbot/integrations/auto-reply-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: selectedConversation._id,
          disable_auto_reply: newStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update auto-reply status');
      }

      setAutoReplyEnabled(!newStatus);
      toast.success(`Auto-reply is now ${!newStatus ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating auto-reply status:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(`/api/chatbot/conversation?chatbotId=${chatbotId}&lead=0`);
        if (response.ok) {
          const data = await response.json();
          const validConversations = Array.isArray(data) ? data.filter(conv =>
            conv.messages.length > 0 &&
            conv.messages.some((m: Message) => m.role === 'user' && m.content?.trim())
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
        // First try to fetch all conversations if lead=1 is failing
        const response = await fetch(`/api/chatbot/conversation?chatbotId=${chatbotId}`);
        if (response.ok) {
          const data = await response.json();
          const validConversations = Array.isArray(data) ? data.filter(conv =>
            conv.messages.length > 0 &&
            conv.messages.some((m: Message) => m.role === 'user' && m.content?.trim()) &&
            // Filter for conversations that have lead data
            (conv.leadId || (conv.metadata && (conv.metadata.from || conv.metadata.from_name)))
          ) : [];
          setAllConversations(validConversations);
          setConversations(validConversations);
        } else {
          console.error('Failed to fetch lead conversations, status:', response.status);
          toast.error("Failed to load lead conversations");
        }
      } catch (error) {
        console.error('Failed to fetch lead conversations:', error);
        toast.error("Error loading lead data");
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

  const fetchAutoReplyStatus = async (to: string) => {
    try {
      const response = await fetch(`/api/chatbot/integrations/auto-reply-status?_id=${selectedConversation._id}`);
      if (response.ok) {
        const data = await response.json();
        setAutoReplyEnabled(data?.disable_auto_reply ?? true);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch auto-reply status:', errorData.error);
        toast.error(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error fetching auto-reply status:', error);
      toast.error(`Error fetching auto-reply status:`);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    const fetchAndRefresh = async () => {
      try {
        const response = await fetch(`/api/chatbot/conversation?chatbotId=${chatbotId}`);
        if (response.ok) {
          const data = await response.json();
          const validConversations = Array.isArray(data) ? data.filter(conv =>
            conv.messages.length > 0 &&
            conv.messages.some((m: Message) => m.role === 'user' && m.content?.trim())
          ) : [];
          console.log(validConversations);
          setAllConversations(validConversations);
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

  const truncateContent = (content: string, maxLength: number = 25) => {
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
      setIsDeleting(true);

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
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setConversationToDelete(null);
    }
  };

  const handleSendMessage = async (conversation: Conversation) => {
    setSendingMsg(true);
    try {
      let response, responseData;
      if (conversation?.platform == "whatsapp") {
        response = await fetch('/api/chatbot/chat/sendviawhatsapp', {
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
      } else if (conversation?.platform == "facebook") {
        response = await fetch('/api/chatbot/chat/sendviafacebook', {
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
      } else if (conversation?.platform == "instagram") {
        response = await fetch('/api/chatbot/chat/sendviainstagram', {
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
      } else if (conversation?.platform == "facebook-comment") {
        response = await fetch('/api/chatbot/chat/sendviafacebookcomment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: conversation.metadata.from,
            to: conversation.metadata.to,
            page_id: conversation.metadata.page_id,
            comment_id: conversation.metadata.comment_id,
            text: inputMsg,
          }),
        });
      } else if (conversation?.platform == "instagram-comment") {
        response = await fetch('/api/chatbot/chat/sendviainstagramcomment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: conversation.metadata.from,
            to: conversation.metadata.to,
            comment_id: conversation.metadata.comment_id,
            text: inputMsg,
          }),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Check if the response contains an error message
      responseData = await response.json();
      if (responseData.error) {
        throw new Error(responseData.error);
      }

      toast.success('Message is sent successfully');
      setInputMsg("");

      handleRefresh();
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error(error.message);
    }
    setSendingMsg(false);
  }

  const handleConversationFilter = (platform: string) => {
    if (platform === "all") {
      setConversations(allConversations);
      return;
    }
    console.log(allConversations)
    let filteredConversations;
    if (platform === "") {
      filteredConversations = allConversations.filter(conv => !conv.platform || conv.platform === "" || conv.platform === "Playground");
    } else {
      filteredConversations = allConversations.filter(conv => conv.platform === platform);
    }
    setConversations(filteredConversations);
  };

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setUserConversations(user.conversations);
    setSelectedConversation(null); // Clear selected conversation
  };

  const renderChatLogs = () => (
    <div className="flex flex-col h-full">
      {/* Top Header - Fixed */}
      <div className="p-4 border-b flex justify-between items-center bg-white top-0 z-10">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800 cursor-pointer mr-4" onClick={() => handleConversationFilter("all")}>Chat Logs</h2>
          <div className="flex gap-2 mx-auto">
            <button
              onClick={() => handleConversationFilter("all")}
              className="p-1.5 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors flex items-center justify-center w-16 sm:w-20 h-9"
            >
              <span className="font-medium text-gray-700">All</span>
            </button>
            <button
              onClick={() => handleConversationFilter("whatsapp")}
              className="p-1.5 border border-gray-200 rounded-md bg-green-50 hover:bg-green-100 hover:border-green-300 transition-colors flex items-center justify-center w-16 sm:w-20 h-9"
            >
              <IconBrandWhatsapp className="text-green-500 w-6 h-6" />
            </button>
            <button
              onClick={() => handleConversationFilter("facebook")}
              className="p-1.5 border border-gray-200 rounded-md bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-colors flex items-center justify-center w-16 sm:w-20 h-9"
            >
              <IconBrandFacebook className="text-blue-600 w-6 h-6" />
            </button>
            <button
              onClick={() => handleConversationFilter("facebook-comment")}
              className="p-1.5 border border-gray-200 rounded-md bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-colors flex items-center justify-center w-16 sm:w-20 h-9"
            >
              <IconMessage className="text-blue-600 w-6 h-6" />
            </button>
            <button
              onClick={() => handleConversationFilter("instagram")}
              className="p-1.5 border border-gray-200 rounded-md bg-pink-50 hover:bg-pink-100 hover:border-pink-300 transition-colors flex items-center justify-center w-16 sm:w-20 h-9"
            >
              <IconBrandInstagram className="text-pink-600 w-6 h-6" />
            </button>
            <button
              onClick={() => handleConversationFilter("instagram-comment")}
              className="p-1.5 border border-gray-200 rounded-md bg-pink-50 hover:bg-pink-100 hover:border-pink-300 transition-colors flex items-center justify-center w-16 sm:w-20 h-9"
            >
              <IconMessage className="text-pink-600 w-6 h-6" />
            </button>
            <button
              onClick={() => handleConversationFilter("")}
              className="p-1.5 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors flex items-center justify-center w-16 sm:w-20 h-9"
            >
              <IconBrowser className="text-gray-700 w-6 h-6" />
            </button>
          </div>
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
                          {conversation?.platform == "whatsapp" && <IconBrandWhatsapp className="text-green-500" />}
                          {conversation?.platform == "facebook" && <IconBrandFacebook className="text-blue-600" />}
                          {conversation?.platform == "facebook-comment" && <IconMessage className="text-blue-600" />}
                          {conversation?.platform == "instagram" && <IconBrandInstagram className="text-pink-600" />}
                          {conversation?.platform == "instagram-comment" && <IconMessage className="text-pink-600" />}
                          {(!conversation.platform || conversation.platform === "" || conversation.platform === "Playground") && <IconBrowser className="text-gray-700" />}
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
                        {chatbot.name} -
                        Source:
                        {selectedConversation?.platform == "whatsapp" && <IconBrandWhatsapp className="text-green-400" />}
                        {selectedConversation?.platform == "facebook" && <IconBrandFacebook className="text-blue-600" />}
                        {selectedConversation?.platform == "facebook-comment" && <IconMessage className="text-blue-600" />}
                        {selectedConversation?.platform == "instagram-comment" && <IconMessage className="text-pink-600" />}
                      </h3>
                      {(selectedConversation?.platform == "whatsapp" ||
                        selectedConversation?.platform == "facebook" ||
                        selectedConversation?.platform == "facebook-comment" ||
                        selectedConversation?.platform == "instagram-comment" ||
                        selectedConversation?.platform == "instagram") &&
                        <div>
                          from {selectedConversation?.metadata?.from_name ?? selectedConversation?.metadata?.from} to {selectedConversation?.metadata?.to_name ?? selectedConversation?.metadata?.to}
                        </div>
                      }
                      <div className="text-sm text-gray-500">
                        {formatDate(selectedConversation.createdAt)}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      {!(!selectedConversation?.platform ||
                        selectedConversation?.platform === "" ||
                        selectedConversation?.platform === "Playground") &&
                        <div className="flex gap-2">
                          <button
                            onClick={toggleAutoReply}
                            className={`btn btn-sm gap-2 ${autoReplyEnabled ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                              } hover:opacity-80 transition-opacity`}
                          >
                            {autoReplyEnabled ? 'Disable Auto-Reply' : 'Enable Auto-Reply'}
                          </button>
                        </div>
                      }
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <IconTrash className="w-6 h-6 text-gray-400 hover:text-red-500" />
                      </button>

                    </div>
                  </div>
                </div>
                <div className="p-4 h-[calc(100dvh-340px)] overflow-y-scroll">

                  {selectedConversation.messages.map((message, index) => {
                    let parsedContent;
                    try {
                      parsedContent = JSON.parse(message.content);
                    } catch (e) {
                      parsedContent = null;
                    }

                    return (
                      <div key={index} className={` mb-4 ${message.role === 'assistant' ? '' : 'flex justify-end'}`}>
                        <div className={`rounded-lg p-4 inline-block max-w-[80%] ${message.role === 'assistant' ? 'bg-white' : 'bg-blue-500 text-white'}`}>
                          {parsedContent?.type === 'image' && parsedContent.image ? (
                            <img src={parsedContent.image} alt="Chat Image" className="max-w-full h-auto rounded" />
                          ) : parsedContent?.type === 'interactive' && parsedContent.interactive?.type === 'button' ? (
                            <div>
                              <p className="mb-2">{parsedContent.interactive.body.text}</p>
                              <div className="flex flex-col gap-2">
                                {parsedContent.interactive.action.buttons.map((button: any) => (
                                  <button
                                    key={button.reply.id}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    onClick={() => {
                                      // Handle button click here
                                      console.log(`Button clicked: ${button.reply.title}`);
                                    }}
                                  >
                                    {button.reply.title}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="html-content" dangerouslySetInnerHTML={{ __html: message.content }} />
                          )}
                          <div className={`text-xs mt-1 ${message.role === 'assistant' ? 'bg-white' : 'bg-blue-500 text-white'}`}>
                            {new Date(message.timestamp).toLocaleString()}
                            {message.role === 'assistant' && ` by ${message?.from ?? 'Bot'}`}
                          </div>
                          { message?.deleted && 
                            <div>deleted</div>
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Send chat */}
              {
                (selectedConversation?.platform == "whatsapp"
                  || selectedConversation?.platform == "facebook"
                  || selectedConversation?.platform == "instagram"
                  || selectedConversation?.platform == "facebook-comment"
                  || selectedConversation?.platform == "instagram-comment"
                )
                &&
                <div className="relative">
                  <input
                    type="text"
                    value={inputMsg}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(selectedConversation);
                      }
                    }}
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

  const renderLeads = () => {
    // Group conversations by user (using phone number or other identifier)
    const userMap = new Map();

    allConversations.forEach(conv => {
      const userId = conv.metadata?.from ||
        (conv.leadId?.phone || conv.leadId?.email || conv.leadId?.name || "Unknown User");

      // Determine the display name based on platform and available data
      let displayName;
      let icon = null;

      if (conv.platform === "whatsapp") {
        // Format WhatsApp phone number with international code
        const phone = conv.metadata?.from || "";
        // Format phone number if it's a valid number
        let formattedPhone = phone;
        if (phone && /^\d+$/.test(phone.replace(/\+/g, ''))) {
          // Add + if missing
          if (!phone.startsWith('+')) {
            formattedPhone = `+${phone}`;
          }
          // Try to format with country code and separators
          try {
            // Basic formatting: +1 XXX-XXX-XXXX format for US numbers
            if (formattedPhone.startsWith('+1') && formattedPhone.length >= 12) {
              formattedPhone = formattedPhone.replace(/^\+1(\d{3})(\d{3})(\d{4}).*/, '+1 $1-$2-$3');
            }
          } catch (e) {
            // If formatting fails, use the original
            formattedPhone = phone;
          }
        }
        displayName = formattedPhone;
        icon = "whatsapp";
      } else if (conv.platform === "facebook") {
        displayName = conv.metadata?.from_name || "Facebook User";
        icon = "facebook";
      } else if (conv.platform === "facebook-comment") {
        displayName = conv.metadata?.from_name || "Facebook Comment";
        icon = "facebook-comment";
      } else if (conv.platform === "instagram") {
        displayName = conv.metadata?.from_name || "Instagram User";
        icon = "instagram";
      } else if (!conv.platform || conv.platform === "" || conv.platform === "Playground") {
        displayName = "Web Chat";
        icon = "web";
      } else {
        displayName = conv.metadata?.from_name || conv.leadId?.name || "Unknown User";
      }

      if (!userMap.has(userId)) {
        userMap.set(userId, {
          id: userId,
          name: displayName,
          email: conv.leadId?.email,
          phone: conv.leadId?.phone || conv.metadata?.from,
          icon: icon,
          conversations: []
        });
      }

      userMap.get(userId).conversations.push(conv);
    });

    const users = Array.from(userMap.values());

    return (
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
          {/* User List - First column */}
          <div className="w-full lg:w-[400px] lg:border-r bg-white shrink-0">
            {loading ? (
              <div className="text-center py-12 text-gray-500">
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No users found
              </div>
            ) : (
              <div className="divide-y max-h-[192px] lg:max-h-[calc(100vh-300px)] overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => {
                      setSelectedUser(user);
                      // Select the first conversation from this user
                      if (user.conversations.length > 0) {
                        setSelectedConversation(user.conversations[0]);
                      }
                    }}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedUser?.id === user.id ? 'bg-gray-50' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate flex items-center gap-1">
                          {user.icon === "whatsapp" && <IconBrandWhatsapp className="text-green-500 w-4 h-4" />}
                          {user.icon === "facebook" && <IconBrandFacebook className="text-blue-600 w-4 h-4" />}
                          {user.icon === "facebook-comment" && <IconMessage className="text-blue-600 w-4 h-4" />}
                          {user.icon === "instagram" && <IconBrandInstagram className="text-pink-600 w-4 h-4" />}
                          {user.icon === "web" && <IconBrowser className="text-gray-700 w-4 h-4" />}
                          {user.name || "Unknown User"}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{user.phone || user.email || user.id}</span>
                          <span>•</span>
                          <span>{user.conversations.length} conversations</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Conversation Details - Second column */}
          <div className="flex-1 bg-gray-50">
            {selectedConversation ? (
              <div className="flex flex-col">
                <div className="p-4 border-b bg-white sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg flex items-center gap-2 font-semibold capitalize">
                        {chatbot.name} -
                        Source:
                        {selectedConversation?.platform == "whatsapp" && <IconBrandWhatsapp className="text-green-400" />}
                        {selectedConversation?.platform == "facebook" && <IconBrandFacebook className="text-blue-600" />}
                        {selectedConversation?.platform == "facebook-comment" && <IconMessage className="text-blue-600" />}
                        {selectedConversation?.platform == "instagram" && <IconBrandInstagram className="text-pink-600" />}
                        {(!selectedConversation.platform || selectedConversation.platform === "" || selectedConversation.platform === "Playground") && <IconBrowser className="text-gray-700" />}
                      </h3>
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
                  {selectedConversation.messages.map((message, index) => {
                    let parsedContent;
                    try {
                      parsedContent = JSON.parse(message.content);
                    } catch (e) {
                      parsedContent = null;
                    }

                    return (
                      <div key={index} className={`max-w-[80%] mb-4 ${message.role === 'assistant' ? '' : 'flex justify-end'}`}>
                        <div className={`rounded-lg p-4 inline-block max-w-[80%] ${message.role === 'assistant' ? 'bg-white' : 'bg-blue-500 text-white'}`}>
                          {parsedContent?.type === 'image' && parsedContent.image ? (
                            <img src={parsedContent.image} alt="Chat Image" className="max-w-full h-auto rounded" />
                          ) : parsedContent?.type === 'interactive' && parsedContent.interactive?.type === 'button' ? (
                            <div>
                              <p className="mb-2">{parsedContent.interactive.body.text}</p>
                              <div className="flex flex-col gap-2">
                                {parsedContent.interactive.action.buttons.map((button: any) => (
                                  <button
                                    key={button.reply.id}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    onClick={() => {
                                      console.log(`Button clicked: ${button.reply.title}`);
                                    }}
                                  >
                                    {button.reply.title}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="html-content" dangerouslySetInnerHTML={{ __html: message.content }} />
                          )}
                          <div className={`text-xs mt-1 ${message.role === 'assistant' ? 'text-gray-500' : 'text-blue-200'}`}>
                            {new Date(message.timestamp).toLocaleString()}
                            {message.role === 'assistant' && ` by ${message?.from ?? 'Bot'}`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
  };

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
              disabled={isDeleting}
            >
              {isDeleting ? <span className="loading loading-spinner loading-xs"></span> : 'Delete'}
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
                  href={pathname.split('/').slice(0, -1).join('/') + `/${tab.id}`}
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