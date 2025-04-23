import { IconTrash, IconBrandWhatsapp, IconBrandFacebook, IconMessage, IconBrandInstagram, IconBrowser } from "@tabler/icons-react";
import { ChatbotData, Conversation } from "./types";
import { formatDate } from "./utils";
import MessageItem from "./MessageItem";
import SendMessageForm from "./SendMessageForm";

interface ConversationDetailProps {
  conversation: Conversation;
  chatbot: ChatbotData;
  autoReplyEnabled: boolean;
  onToggleAutoReply: () => void;
  onSendMessage: (conversation: Conversation, message: string) => Promise<void>;
  isSending: boolean;
}

const ConversationDetail = ({
  conversation,
  chatbot,
  autoReplyEnabled,
  onToggleAutoReply,
  onSendMessage,
  isSending
}: ConversationDetailProps) => {
  const showSendForm = conversation?.platform === "whatsapp" ||
    conversation?.platform === "facebook" ||
    conversation?.platform === "instagram" ||
    conversation?.platform === "facebook-comment" ||
    conversation?.platform === "instagram-comment";

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg flex items-center gap-2 font-semibold capitalize">
              {chatbot.name} -
              Source:
              {conversation?.platform === "whatsapp" && <IconBrandWhatsapp className="text-green-400" />}
              {conversation?.platform === "facebook" && <IconBrandFacebook className="text-blue-600" />}
              {conversation?.platform === "facebook-comment" && <IconMessage className="text-blue-600" />}
              {conversation?.platform === "instagram" && <IconBrandInstagram className="text-pink-600" />}
              {conversation?.platform === "instagram-comment" && <IconMessage className="text-pink-600" />}
              {(!conversation.platform || conversation.platform === "" || conversation.platform === "Playground") && 
                <IconBrowser className="text-gray-700" />
              }
            </h3>
            {(conversation?.platform === "whatsapp" ||
              conversation?.platform === "facebook" ||
              conversation?.platform === "facebook-comment" ||
              conversation?.platform === "instagram-comment" ||
              conversation?.platform === "instagram") &&
              <div>
                from {conversation?.metadata?.from_name ?? conversation?.metadata?.from} to {conversation?.metadata?.to_name ?? conversation?.metadata?.to}
              </div>
            }
            <div className="text-sm text-gray-500">
              {formatDate(conversation.createdAt)}
            </div>
          </div>
          <div className="flex gap-4">
            {!(!conversation?.platform ||
              conversation?.platform === "" ||
              conversation?.platform === "Playground") &&
              <div className="flex gap-2">
                <button
                  onClick={onToggleAutoReply}
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
        {conversation.messages.map((message, index) => (
          <MessageItem 
            key={index} 
            message={message} 
            isUserMessage={message.role === 'user'} 
          />
        ))}
      </div>
      {showSendForm && (
        <SendMessageForm 
          conversation={conversation}
          onSendMessage={onSendMessage}
          isSending={isSending}
        />
      )}
    </div>
  );
};

export default ConversationDetail;
