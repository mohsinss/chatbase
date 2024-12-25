"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { nanoid } from 'nanoid';

const ConfigPanel = ({ teamId }: { teamId: string }) => {
  const router = useRouter();

  const handleCreateChatbot = async () => {
    // Generate a unique chatbot ID using nanoid
    const chatbotId = nanoid();
    
    try {
      // Here you would typically make an API call to create the chatbot
      // For now, we'll just navigate to the new URL
      router.push(`/dashboard/${teamId}/chatbot/${chatbotId}`);
    } catch (error) {
      console.error('Failed to create chatbot:', error);
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