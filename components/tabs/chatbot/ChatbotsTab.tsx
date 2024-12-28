"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { IconMessage, IconPlus } from "@tabler/icons-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ConfigPanel from "@/components/chatbot/ConfigPanel";

interface Chatbot {
  chatbotId: string;
  name: string;
  teamId: string;
  createdBy: string;
  sources: any[];
}

const ChatbotsTab = () => {
  const router = useRouter();
  const pathname = usePathname();
  const teamId = pathname.split('/')[2];
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchChatbots = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/chatbot/list?teamId=${teamId}&t=${Date.now()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chatbots');
      }
      const data = await response.json();
      setChatbots(data.chatbots || []);
    } catch (error) {
      console.error("Failed to fetch chatbots:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshChatbots = async () => {
    try {
      const response = await fetch(`/api/chatbot/list?teamId=${teamId}&t=${Date.now()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chatbots');
      }
      const data = await response.json();
      setChatbots(data.chatbots || []);
    } catch (error) {
      console.error("Failed to fetch chatbots:", error);
    }
  };

  useEffect(() => {
    if (teamId) {
      fetchChatbots();
    }
  }, [teamId]);

  const handleNewChatbot = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Chatbots</h2>
        <button 
          onClick={handleNewChatbot}
          className="btn btn-primary gap-2"
        >
          <IconPlus className="w-4 h-4" />
          New Chatbot
        </button>
      </div>

      {chatbots.length === 0 ? (
        <div className="text-center py-12">
          <IconMessage className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No chatbots yet</h3>
          <p className="text-gray-500 mb-4">Create your first chatbot to get started</p>
          <button 
            onClick={handleNewChatbot}
            className="btn btn-primary"
          >
            Create Chatbot
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {chatbots.map((chatbot) => (
            <div 
              key={chatbot.chatbotId}
              onClick={() => router.push(`/dashboard/${teamId}/chatbot/${chatbot.chatbotId}`)}
              className="card bg-base-100 border hover:border-primary hover:shadow-md transition-all cursor-pointer"
            >
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="card-title text-lg">{chatbot.name}</h3>
                    <p className="text-sm text-base-content/70 mt-1">
                      {chatbot.sources?.length || 0} sources
                    </p>
                  </div>
                  <div className="badge badge-primary">Active</div>
                </div>
                
                <div className="card-actions justify-end mt-4">
                  <button 
                    className="btn btn-sm btn-ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/${teamId}/chatbot/${chatbot.chatbotId}/settings/general`);
                    }}
                  >
                    Settings
                  </button>
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/${teamId}/chatbot/${chatbot.chatbotId}`);
                    }}
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isCreateModalOpen} onOpenChange={handleCreateModalClose}>
        <DialogContent className="max-w-2xl">
          <ConfigPanel 
            onClose={handleCreateModalClose} 
            teamId={teamId} 
            onSuccess={refreshChatbots}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatbotsTab; 