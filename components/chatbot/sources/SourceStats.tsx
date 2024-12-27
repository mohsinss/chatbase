import { Button } from "@/components/ui/button";

interface SourceStatsProps {
  fileCount?: number;
  fileChars?: number;
  textInputChars?: number;
  websiteCount?: number;
  websiteChars?: number;
  qaCount?: number;
  qaChars?: number;
  notionCount?: number;
  notionChars?: number;
  charLimit: number;
  onRetrain: () => void;
}

const SourceStats = ({ 
  fileCount = 0,
  fileChars = 0,
  textInputChars = 0,
  websiteCount = 0,
  websiteChars = 0,
  qaCount = 0,
  qaChars = 0,
  notionCount = 0,
  notionChars = 0,
  charLimit,
  onRetrain 
}: SourceStatsProps) => {
  const totalChars = fileChars + textInputChars + websiteChars + qaChars + notionChars;

  const renderSourceMetric = (count: number, chars: number, label: string) => {
    if (count <= 0 || chars <= 0) return null;
    return (
      <p className="text-gray-700">
        {count} {label} ({chars.toLocaleString()} chars)
      </p>
    );
  };

  return (
    <div className="w-[300px] bg-white rounded-lg p-6 border shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Sources</h2>
      
      <div className="space-y-3 mb-6">
        {fileCount > 0 && renderSourceMetric(fileCount, fileChars, 'File')}
        {textInputChars > 0 && (
          <p className="text-gray-700">
            {textInputChars.toLocaleString()} text input chars
          </p>
        )}
        {websiteCount > 0 && renderSourceMetric(websiteCount, websiteChars, 'Website')}
        {qaCount > 0 && renderSourceMetric(qaCount, qaChars, 'Q&A')}
        {notionCount > 0 && renderSourceMetric(notionCount, notionChars, 'Notion page')}
      </div>

      {totalChars > 0 && (
        <div className="space-y-2">
          <p className="font-medium">Total detected characters</p>
          <p className="text-center">
            <span className="text-lg font-semibold">{totalChars.toLocaleString()}</span>
            <span className="text-gray-500">/ {(charLimit/1_000_000).toFixed(1)}M limit</span>
          </p>
        </div>
      )}

      <Button 
        className="w-full mt-6 bg-black text-white hover:bg-gray-800" 
        onClick={onRetrain}
      >
        Retrain Chatbot
      </Button>
    </div>
  );
};

export default SourceStats; 