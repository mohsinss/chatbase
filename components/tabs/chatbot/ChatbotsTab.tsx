"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const ChatbotsTab = () => {
  const router = useRouter();
  const pathname = usePathname();
  const teamId = pathname.split('/')[2]; // Get teamId from URL

  const handleNewChatbot = () => {
    router.push(`/dashboard/${teamId}/create-new-chatbot`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Chatbots</h2>
        <button 
          onClick={handleNewChatbot}
          className="btn btn-primary"
        >
          New Chatbot
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Example chatbot card */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title">Customer Support Bot</h3>
            <p className="text-sm text-base-content/70">
              Handles customer inquiries 24/7
            </p>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-sm btn-primary">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotsTab; 