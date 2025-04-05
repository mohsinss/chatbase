"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface ConfigPanelProps {
  onClose?: () => void;
  teamId: string;
  onSuccess?: () => void;
}

const ConfigPanel = ({ onClose, teamId, onSuccess }: ConfigPanelProps) => {
  const router = useRouter();
  const [chatbotName, setChatbotName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateChatbot = async () => {
    if (!chatbotName.trim()) {
      toast.error("Please enter a name for your chatbot");
      return;
    }

    if (isCreating) return;

    try {
      setIsCreating(true);
      toast.loading("Creating chatbot...");
      const response = await fetch("/api/chatbot/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId: teamId,
          name: chatbotName.trim(),
          sources: [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create chatbot");
      }

      const data = await response.json();
      
      if (!data.chatbotId) {
        throw new Error("No chatbot ID returned from server");
      }

      console.log("Created chatbot with name:", chatbotName, "response:", data);

      await onSuccess?.();
      onClose?.();
      
      setTimeout(() => {
        router.push(`/dashboard/${teamId}/chatbot/${data.chatbotId}`);
      }, 100);
      
      toast.success("Chatbot created successfully!");
      
    } catch (error: any) {
      console.error('Failed to create chatbot:', error);
      toast.error(error.message || "Failed to create chatbot");
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <Card className="bg-white rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-6">Create New Chatbot</h3>
            
            {/* Name input field */}
            <div className="space-y-2">
              <label htmlFor="chatbotName" className="block text-sm font-medium text-gray-700">
                Chatbot Name
              </label>
              <input
                id="chatbotName"
                type="text"
                value={chatbotName}
                onChange={(e) => setChatbotName(e.target.value)}
                placeholder="Enter chatbot name"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sources section */}
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-2">Sources</h4>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Total detected characters</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold">0</span>
                  <span className="text-gray-500">/ 6,000,000 limit</span>
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleCreateChatbot}
            disabled={isCreating}
            className="w-full bg-black text-white hover:bg-black/90 h-12 text-base rounded-md"
          >
            {isCreating ? "Creating..." : "Create Chatbot"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ConfigPanel; 