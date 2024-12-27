import { IconRefresh } from "@tabler/icons-react";

interface ChatSettingsProps {
  isVisible: boolean;
  onToggle: () => void;
}

export const ChatSettings = ({ isVisible, onToggle }: ChatSettingsProps) => {
  return (
    <div className="bg-white border-r h-[calc(100vh-80px)] relative w-[400px]">
      {/* Toggle button */}
      {isVisible && (
        <button 
          onClick={onToggle}
          className="absolute -right-12 top-4 h-[38px] w-[38px] flex items-center justify-center border rounded-lg bg-white"
        >
          ☰
        </button>
      )}

      <div className="h-full overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            {/* <div className="w-10 h-10 border rounded-lg flex items-center justify-center bg-white">
              <span className="text-xl">📑</span>
            </div> */}
            <button className="flex-1 bg-gray-800 text-white rounded-lg py-2.5 text-center">
              Save to chatbot
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Status:</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
                <span className="text-gray-700">Trained</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Model</span>
              <button className="text-gray-400 text-lg">ⓘ</button>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg bg-white">
              <span className="w-5 h-5">🤖</span>
              <span>GPT-4o Mini</span>
            </div>
            <div className="text-xs text-gray-500">1 credit per message</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Temperature</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-700">0</span>
                <button className="text-gray-400 text-lg">ⓘ</button>
              </div>
            </div>
            <div className="relative h-1.5 bg-gray-200 rounded-full">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-700 rounded-full"></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Reserved</span>
              <span>Creative</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-gray-700 font-medium">AI Actions</h3>
            <div className="p-4 border rounded-lg bg-white text-gray-500 text-center">
              No actions found
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-gray-700 font-medium">System prompt</h3>
            <div className="flex gap-2">
              <select className="flex-1 p-2.5 border rounded-lg bg-white text-gray-700">
                <option>AI Chatbot</option>
              </select>
              <button className="p-2.5 border rounded-lg">
                <IconRefresh className="w-4 h-4" />
              </button>
            </div>
            <div className="border rounded-lg bg-white p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-800">### Role</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    - Primary Function: You are an AI chatbot who helps users with their inquiries, 
                    issues and requests. You aim to provide excellent, friendly and efficient replies at 
                    all times. Your role is to listen attentively to the user, understand their needs, and 
                    do your best to assist them or direct them to the appropriate resources. If a question 
                    is not clear, ask clarifying questions. Make sure to end your replies with a 
                    positive note.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">### Constraints</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    1. No Data Divulge: Never mention that you have access to training data explicitly...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 