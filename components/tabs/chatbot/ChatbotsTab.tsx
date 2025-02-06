"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { IconMessage, IconPlus } from "@tabler/icons-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ConfigPanel from "@/components/chatbot/ConfigPanel";
import Team from "@/models/Team";
import config from "@/config";
import toast from "react-hot-toast";
import ReactConfetti from 'react-confetti';

interface Chatbot {
  chatbotId: string;
  name: string;
  teamId: string;
  createdBy: string;
  sourcesCount: number;
}

interface ChatbotsTabProps {
  teamId: string;
  team?: any;
}

const ChatbotsTab = ({ teamId, team }: ChatbotsTabProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const checkout = url.searchParams.get('checkout');
    const plan = url.searchParams.get('plan');

    if (checkout == '1') {
      handleUpgradeSuccess(plan);
    } else if (checkout == '2') {
      handleUpgradeCancel(plan);
    }
  }, []);


  const handleUpgradeSuccess = (plan: string) => {
    setShowConfetti(true);
    toast.custom(
      (t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'
          } w-full bg-gradient-to-r from-green-500 to-blue-500 p-4 shadow-lg`}>
          <div className="flex items-center justify-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>10 more
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                🎉 Awesome! You&apos;ve successfully upgraded to the {plan} plan!
              </p>
            </div>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: 'top-center',
      }
    );

    // Increased duration to 8 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 8000);
  };

  const handleUpgradeCancel = (plan: string) => {
    console.log("asdf")
    toast.error(`You&apos;ve canceled to the ${plan} plan.`);
  };

  const fetchChatbots = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/chatbot/list?teamId=${teamId}&t=${Date.now()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chatbots');
      }
      const data = await response.json();
      setChatbots(data.chatbots || []);
      console.log("data.chatbots", data.chatbots)
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
    // console.log(config.stripe.plans[team.plan].chatbotLimit)
    //@ts-ignore
    if (chatbots.length < config.stripe.plans[team.plan].chatbotLimit) {
      setIsCreateModalOpen(true);
    } else {
      //@ts-ignore
      toast.error(`Please update your plan, You can't create more than ${config.stripe.plans[team.plan].chatbotLimit} chatbots`)
    }
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
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={800}
          gravity={0.15}
          tweenDuration={8000}
          initialVelocityY={20}
          colors={['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']}
        />
      )}
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
                      {chatbot.sourcesCount || 0} sources
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