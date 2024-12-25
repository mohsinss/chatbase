"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const ConfigPanel = ({ teamId }: { teamId: string }) => {
  const router = useRouter();

  const handleCreateChatbot = async () => {
    try {
      console.log("Creating chatbot for team:", teamId); // Debug log
      
      // Make API call to create chatbot
      const response = await fetch("/api/chatbot/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId: teamId, // Make sure teamId is included
          sources: [], // Add your sources data here
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

      // Navigate to the new chatbot page
      router.push(`/dashboard/${teamId}/chatbot/${data.chatbotId}`);
      toast.success("Chatbot created successfully!");
      
    } catch (error: any) {
      console.error('Failed to create chatbot:', error);
      toast.error(error.message || "Failed to create chatbot");
    }
  };

  return (
    <div className="w-80 border-l bg-base-100 p-6 h-[calc(100vh-4rem)] overflow-y-auto">
      <Card className="bg-white rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-6">Sources</h3>
            
            {/* Character count display */}
            <div className="space-y-1">
              <p className="text-lg font-medium">Total detected characters</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-semibold">0</span>
                <span className="text-gray-500">/ 6,000,000 limit</span>
              </div>
            </div>
          </div>

          {/* Create Chatbot button */}
          <Button 
            onClick={handleCreateChatbot}
            className="w-full bg-black text-white hover:bg-black/90 h-12 text-base rounded-md"
          >
            Create Chatbot
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ConfigPanel; 