import { IconTrash, IconBrandWhatsapp, IconBrandFacebook, IconMessage, IconBrandInstagram, IconBrowser } from "@tabler/icons-react";
import { Conversation } from "./types";
import { formatDate, truncateContent } from "./utils";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteClick: (conversation: Conversation, e: React.MouseEvent) => void;
  loading: boolean;
}

const ConversationList = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onDeleteClick,
  loading
}: ConversationListProps) => {
  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading conversations...
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No chats found
      </div>
    );
  }

  return (
    <div className="divide-y max-h-[192px] lg:max-h-[calc(100vh-300px)] overflow-y-auto">
      {conversations.map((conversation) => {
        const firstUserMessage = conversation.messages.find(m => m.role === 'user');
        return (
          <div
            key={conversation._id}
            onClick={() => onSelectConversation(conversation)}
            className={`p-4 hover:bg-gray-50 cursor-pointer h-16 ${
              selectedConversationId === conversation._id ? 'bg-gray-50' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1 flex-1 min-w-0">
                <p className="flex items-center gap-2 font-medium text-gray-900 truncate">
                  {conversation?.platform === "whatsapp" && <IconBrandWhatsapp className="text-green-500" />}
                  {conversation?.platform === "facebook" && <IconBrandFacebook className="text-blue-600" />}
                  {conversation?.platform === "facebook-comment" && <IconMessage className="text-blue-600" />}
                  {conversation?.platform === "instagram" && <IconBrandInstagram className="text-pink-600" />}
                  {conversation?.platform === "instagram-comment" && <IconMessage className="text-pink-600" />}
                  {(!conversation.platform || conversation.platform === "" || conversation.platform === "Playground") && 
                    <IconBrowser className="text-gray-700" />
                  }
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
                onClick={(e) => onDeleteClick(conversation, e)}
              >
                <IconTrash className="w-4 h-4 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
