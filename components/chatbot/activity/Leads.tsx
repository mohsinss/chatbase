import { IconRefresh, IconFilter, IconDownload, IconBrandWhatsapp, IconBrandFacebook, IconMessage, IconBrandInstagram, IconBrowser } from "@tabler/icons-react";
import { ChatbotData, Conversation, User } from "./types";
import ConversationDetail from "./ConversationDetail";

interface LeadsProps {
  users: User[];
  selectedUser: User | null;
  selectedConversation: Conversation | null;
  chatbot: ChatbotData;
  loading: boolean;
  sendingMsg: boolean;
  autoReplyEnabled: boolean;
  onSelectUser: (user: User) => void;
  onSelectConversation: (conversation: Conversation) => void;
  onRefresh: () => void;
  onToggleAutoReply: () => void;
  onSendMessage: (conversation: Conversation, message: string) => Promise<void>;
}

const Leads = ({
  users,
  selectedUser,
  selectedConversation,
  chatbot,
  loading,
  sendingMsg,
  autoReplyEnabled,
  onSelectUser,
  onSelectConversation,
  onRefresh,
  onToggleAutoReply,
  onSendMessage
}: LeadsProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Top Header - Fixed */}
      <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
        <h2 className="text-xl font-semibold">Leads</h2>
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
                  onClick={() => onSelectUser(user)}
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
            <ConversationDetail
              conversation={selectedConversation}
              chatbot={chatbot}
              autoReplyEnabled={autoReplyEnabled}
              onToggleAutoReply={onToggleAutoReply}
              onSendMessage={onSendMessage}
              isSending={sendingMsg}
            />
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

export default Leads;
