import { IconSend } from "@tabler/icons-react";
import { useState } from "react";
import { Conversation } from "./types";

interface SendMessageFormProps {
  conversation: Conversation;
  onSendMessage: (conversation: Conversation, message: string) => Promise<void>;
  isSending: boolean;
}

const SendMessageForm = ({ conversation, onSendMessage, isSending }: SendMessageFormProps) => {
  const [inputMsg, setInputMsg] = useState("");

  const handleSend = () => {
    if (inputMsg.trim() && !isSending) {
      onSendMessage(conversation, inputMsg);
      setInputMsg("");
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputMsg}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        onChange={(e) => setInputMsg(e.target.value)}
        className={`w-full p-3 pr-10 border focus:outline-none focus:border-blue-500 text-sm`}
        disabled={isSending}
        placeholder="Type a message..."
      />
      <button
        type="submit"
        onClick={handleSend}
        disabled={isSending || !inputMsg.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50"
      >
        <IconSend className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SendMessageForm;
