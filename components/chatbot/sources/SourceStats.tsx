import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface SourceStatsProps {
  totalChars: number;
  fileCount: number;
  fileChars: number;
  textInputChars: number;
  charLimit: number;
  setTotalChars: React.Dispatch<React.SetStateAction<number>>;
  onRetrain: () => Promise<void>;
  isTraining: boolean;
  qaInputCount: number;
  qaInputChars: number;
  linkInputCount: number;
  linkInputChars: number;
  youtubeLinkCount: number;
  youtubeLinkChars: number;
  notionPages: any[];
}

const SourceStats = ({
  fileCount,
  fileChars,
  textInputChars,
  qaInputCount,
  qaInputChars,
  linkInputCount,
  linkInputChars,
  youtubeLinkCount,
  youtubeLinkChars,
  charLimit,
  onRetrain,
  isTraining,
  setTotalChars,
  totalChars,
  notionPages,
}: SourceStatsProps) => {
  useEffect(() => {
    const notionChars = notionPages.reduce((total: number, page: any) => total + (page.charCount || 0), 0);
    setTotalChars(fileChars + textInputChars + linkInputChars + qaInputChars + youtubeLinkChars + notionChars);
  }, [fileChars, textInputChars, linkInputChars, qaInputChars, youtubeLinkChars, notionPages, setTotalChars]);

  return (
    <div className="w-[300px] bg-white rounded-lg p-6 border shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Sources</h2>

      <div className="space-y-3 mb-6">
        {fileCount > 0 && <p className="text-gray-700">
          {fileCount} File{fileCount == 1 ? '' : 's'} ({fileChars} chars)
        </p>}
        {textInputChars > 0 && <p className="text-gray-700">
          Text Input ({textInputChars} chars)
        </p>}
        {linkInputCount > 0 && <p className="text-gray-700">
          {linkInputCount} Links ({linkInputChars} chars)
        </p>}
        {youtubeLinkCount > 0 && <p className="text-gray-700">
          {youtubeLinkCount} YouTube Video{youtubeLinkCount == 1 ? '' : 's'} ({youtubeLinkChars} chars)
        </p>}
      {qaInputCount > 0 && <p className="text-gray-700">
        {qaInputCount} Q&A ({qaInputChars} chars)
      </p>}
      {notionPages.length > 0 && <p className="text-gray-700">
        {notionPages.length} Notion Page{notionPages.length === 1 ? '' : 's'} ({notionPages.reduce((total, page) => total + (page.charCount || 0), 0)} chars)
      </p>}
    </div>

      <div className="space-y-2">
        <p className="font-medium">Total detected characters</p>
        <p className="text-center">
          <span className="text-lg font-semibold">{totalChars.toLocaleString()}</span>
          <span className="text-gray-500">/ {charLimit == 0 ? "Unlimited" : (charLimit / 1_000_000).toFixed(1) + 'M limit'}</span>
        </p>
      </div>

      <Button
        className="w-full mt-6 bg-black text-white hover:bg-gray-800"
        onClick={onRetrain}
        disabled={isTraining}
      >
        {isTraining ? (<><span className="loading loading-spinner loading-xs"></span>&nbsp;contructing...</>) : 'construct the index'}
      </Button>
    </div>
  );
};

export default SourceStats;
