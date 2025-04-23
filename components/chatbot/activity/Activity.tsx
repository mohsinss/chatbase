"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ChatbotData, Conversation, User } from "./types";
import DeleteDialog from "./DeleteDialog";
import ChatLogs from "./ChatLogs";
import Leads from "./Leads";

const SUB_TABS = [
  { id: "chat-logs", label: "Chat Logs", icon: "💬" },
  { id: "leads", label: "Leads", icon: "👥" },
];

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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const [userConversations, setUserConversations] = useState<Conversation[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (selectedConversation?.platform === "whatsapp" || selectedConversation?.platform === "facebook") {
      fetchAutoReplyStatus(selectedConversation.metadata?.to);
    }
  }, [selectedConversation]);

  const toggleAutoReply = async () => {
    if (!selectedConversation) return;
    
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
            conv.messages.some((m: any) => m.role === 'user' && m.content?.trim())
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
            conv.messages.some((m: any) => m.role === 'user' && m.content?.trim()) &&
            // Filter for conversations that have lead data
            (conv.leadId || (conv.metadata && (conv.metadata.from || conv.metadata.from_name)))
          ) : [];
          setAllConversations(validConversations);
          setConversations(validConversations);
          
          // Process users from conversations
          processUsersFromConversations(validConversations);
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

  const processUsersFromConversations = (conversations: Conversation[]) => {
    // Group conversations by user (using phone number or other identifier)
    const userMap = new Map<string, User>();

    conversations.forEach(conv => {
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

      userMap.get(userId)!.conversations.push(conv);
    });

    setUsers(Array.from(userMap.values()));
  };

  const fetchAutoReplyStatus = async (to?: string) => {
    if (!selectedConversation) return;
    
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
            conv.messages.some((m: any) => m.role === 'user' && m.content?.trim())
          ) : [];
          
          setAllConversations(validConversations);
          setConversations(validConversations);
          
          if (currentSubTab === 'leads') {
            processUsersFromConversations(validConversations);
          }
          
          // Update selected conversation if it exists
          if (selectedConversation) {
            const updatedConversation = validConversations.find(conv => conv._id === selectedConversation._id);
            if (updatedConversation) {
              setSelectedConversation(updatedConversation);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAndRefresh();
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
      setAllConversations(allConversations.filter(c => c._id !== conversationToDelete._id));

      // Clear selected conversation if it was deleted
      if (selectedConversation?._id === conversationToDelete._id) {
        setSelectedConversation(null);
      }

      // Update users list if in leads view
      if (currentSubTab === 'leads') {
        processUsersFromConversations(allConversations.filter(c => c._id !== conversationToDelete._id));
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

  const handleSendMessage = async (conversation: Conversation, message: string) => {
    if (!message.trim()) return;
    
    setSendingMsg(true);
    try {
      let response, responseData;
      
      if (conversation?.platform === "whatsapp") {
        response = await fetch('/api/chatbot/chat/sendviawhatsapp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: conversation.metadata?.from,
            to: conversation.metadata?.to,
            text: message,
          }),
        });
      } else if (conversation?.platform === "facebook") {
        response = await fetch('/api/chatbot/chat/sendviafacebook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: conversation.metadata?.from,
            to: conversation.metadata?.to,
            text: message,
          }),
        });
      } else if (conversation?.platform === "instagram") {
        response = await fetch('/api/chatbot/chat/sendviainstagram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: conversation.metadata?.from,
            to: conversation.metadata?.to,
            text: message,
          }),
        });
      } else if (conversation?.platform === "facebook-comment") {
        response = await fetch('/api/chatbot/chat/sendviafacebookcomment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: conversation.metadata?.from,
            to: conversation.metadata?.to,
            page_id: conversation.metadata?.page_id,
            comment_id: conversation.metadata?.comment_id,
            text: message,
          }),
        });
      } else if (conversation?.platform === "instagram-comment") {
        response = await fetch('/api/chatbot/chat/sendviainstagramcomment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: conversation.metadata?.from,
            to: conversation.metadata?.to,
            comment_id: conversation.metadata?.comment_id,
            text: message,
          }),
        });
      } else {
        throw new Error('Unsupported platform');
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
      handleRefresh();
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error(error.message);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleConversationFilter = (platform: string) => {
    if (platform === "all") {
      setConversations(allConversations);
      return;
    }
    
    let filteredConversations;
    if (platform === "") {
      filteredConversations = allConversations.filter(conv => 
        !conv.platform || conv.platform === "" || conv.platform === "Playground"
      );
    } else {
      filteredConversations = allConversations.filter(conv => conv.platform === platform);
    }
    setConversations(filteredConversations);
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setUserConversations(user.conversations);
    
    // Select the first conversation from this user
    if (user.conversations.length > 0) {
      setSelectedConversation(user.conversations[0]);
    } else {
      setSelectedConversation(null);
    }
  };

  return (
    <>
      <DeleteDialog 
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDelete}
      />
      
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
            <ChatLogs
              conversations={conversations}
              allConversations={allConversations}
              selectedConversation={selectedConversation}
              chatbot={chatbot}
              loading={loading}
              sendingMsg={sendingMsg}
              autoReplyEnabled={autoReplyEnabled}
              onSelectConversation={setSelectedConversation}
              onDeleteClick={handleDeleteClick}
              onRefresh={handleRefresh}
              onToggleAutoReply={toggleAutoReply}
              onSendMessage={handleSendMessage}
              onFilterConversations={handleConversationFilter}
            />
          ) : (
            <Leads
              users={users}
              selectedUser={selectedUser}
              selectedConversation={selectedConversation}
              chatbot={chatbot}
              loading={loading}
              sendingMsg={sendingMsg}
              autoReplyEnabled={autoReplyEnabled}
              onSelectUser={handleUserSelect}
              onSelectConversation={setSelectedConversation}
              onRefresh={handleRefresh}
              onToggleAutoReply={toggleAutoReply}
              onSendMessage={handleSendMessage}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Activity;
