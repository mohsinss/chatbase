import { IconRefresh, IconFilter, IconDownload, IconBrandWhatsapp, IconBrandFacebook, IconMessage, IconBrandInstagram, IconBrowser } from "@tabler/icons-react";
import { useState } from "react";
import { ChatbotData, Conversation } from "./types";
import ConversationList from "./ConversationList";
import ConversationDetail from "./ConversationDetail";

interface ChatLogsProps {
  conversations: Conversation[];
  allConversations: Conversation[];
  selectedConversation: Conversation | null;
  chatbot: ChatbotData;
  loading: boolean;
  sendingMsg: boolean;
  autoReplyEnabled: boolean;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteClick: (conversation: Conversation, e: React.MouseEvent) => void;
  onRefresh: () => void;
  onToggleAutoReply: () => void;
  onSendMessage: (conversation: Conversation, message: string) => Promise<void>;
  onFilterConversations: (platform: string) => void;
}

const ChatLogs = ({
  conversations,
  allConversations,
  selectedConversation,
  chatbot,
  loading,
  sendingMsg,
  autoReplyEnabled,
  onSelectConversation,
  onDeleteClick,
  onRefresh,
  onToggleAutoReply,
  onSendMessage,
  onFilterConversations
}: ChatLogsProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Top Header - Fixed */}
      <div className="p-4 border-b flex justify-between items-center bg-white top-0 z-10">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800 cursor-pointer mr-4" onClick={() => onFilterConversations("all")}>Chat Logs</h2>
          <div className="flex gap-2 mx-auto">
            <button
              onClick={() => onFilterConversations("all")}
              className="p-1.5 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors flex items-center justify-center w-16 sm:w-20 h-9"
            >
              <span className="font-medium text-gray-700">All</span>
            </button>
            <button
              onClick={() => onFilterConversations("whatsapp")}
              className="p-1.5 border border-gray-200 rounded-md bg-green-50 hover:bg-green-100 hover:border-green-300 transition-colors flex items-center justify-center w-16 sm:w-20 h-9"
            >
              <IconBrandWhatsapp className="text-green-500 w-6 h-6" />
            </button>
            <button
              onClick={() => onFilterConversations("facebook")}
              className="p-1.5 border border-gray-200 rounded-md bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-colors flex items-center justify-center w-16 sm:w-20 h-9"
            >
              <IconBrandFacebook className="text-blue-600 w-6 h-6" />
            </button>
            <button
              onClick={() => onFilterConversations("facebook-comment")}
              className="p-1.5 border border-gray-200 rounded-md bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-colors flex items-center justify-center w-16 sm:w-20 h-9"
            >
              <IconMessage className="text-blue-600 w-6 h-6" />
            </button>
            <button
              onClick={() => onFilterConversations("instagram")}
              className="p-1.5 border border-gray-200 rounded-md bg-pink-50 hover:bg-pink-100 hover:border-pink-300 transition-colors flex items-center justify-center w-16 sm:w-20 h-9"
            >
              <IconBrandInstagram className="text-pink-600 w-6 h-6" />
            </button>
            <button
              onClick={() => onFilterConversations("instagram-comment")}
              className="p-1.5 border border-gray-200 rounded-md bg-pink-50 hover:bg-pink-100 hover:border-pink-300 transition-colors flex items-center justify-center w-16 sm:w-20 h-9"
            >
              <IconMessage className="text-pink-600 w-6 h-6" />
            </button>
            <button
              onClick={() => onFilterConversations("")}
              className="p-1.5 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors flex items-center justify-center w-16 sm:w-20 h-9"
            >
              <IconBrowser className="text-gray-700 w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
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
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversation?._id || null}
            onSelectConversation={onSelectConversation}
            onDeleteClick={onDeleteClick}
            loading={loading}
          />
        </div>

        {/* Conversation Details */}
        <div className="flex-1 bg-gray-50 flex-col justify-between h-full">
          {selectedConversation ? (
            <ConversationDetail
              conversation={selectedConversation}
              chatbot={chatbot}
              autoReplyEnabled={autoReplyEnabled}
              onToggleAutoReply={onToggleAutoReply}
              onSendMessage={onSendMessage}
              isSending={sendingMsg}
            />
          ) : (
            <div className="flex-1 h-96 flex items-center justify-center text-gray-500">
              Select a conversation to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatLogs;
