import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface SourceStatsProps {
  fileCount: number;
  fileChars: number;
  textInputChars: number;
  charLimit: number;
  onRetrain: () => void;
  isTraining: boolean;
}

const SourceStats = ({ 
  fileCount, 
  fileChars, 
  textInputChars, 
  charLimit, 
  onRetrain,
  isTraining,
}: SourceStatsProps) => {
  const totalChars = fileChars + textInputChars;

  return (
    <div className="w-[300px] bg-white rounded-lg p-6 border shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Sources</h2>
      
      <div className="space-y-3 mb-6">
        <p className="text-gray-700">
          {fileCount} File{fileCount == 1?'':'s'}
          {/* {fileCount} File ({fileChars.toLocaleString()} chars) */}
        </p>
        <p className="text-gray-700">
          {textInputChars} text input chars
        </p>
      </div>

      <div className="space-y-2">
        <p className="font-medium">Total detected characters</p>
        <p className="text-center">
          <span className="text-lg font-semibold">{totalChars.toLocaleString()}</span>
          <span className="text-gray-500">/ {(charLimit/1_000_000).toFixed(1)}M limit</span>
        </p>
      </div>

      <Button 
        className="w-full mt-6 bg-black text-white hover:bg-gray-800" 
        onClick={onRetrain}
        disabled={isTraining}
      >
        {isTraining ? 'contructing...' : 'construct the index'}
      </Button>
    </div>
  );
};

export default SourceStats; 