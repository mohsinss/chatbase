import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { IconInfoCircle, IconRefresh } from "@tabler/icons-react";
import { formatFileSize } from "@/lib/utils";

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
  const [needRetrain, setNeedRetrain] = useState(false);
  const [isLimited, setIsLimited] = useState(false);
  const [firstTotalChars, setFirstTotalChars] = useState(0);

  useEffect(() => {
    const notionChars = notionPages.reduce((total: number, page: any) => total + (page.charCount || 0), 0);
    const total = fileChars + textInputChars + linkInputChars + qaInputChars + youtubeLinkChars + notionChars;
    if (firstTotalChars === 0) {
      setFirstTotalChars(total);
    } else if (!needRetrain) {
      setNeedRetrain(total != firstTotalChars);
    }
    setIsLimited(total > charLimit && charLimit > 0);
    setTotalChars(total);
  }, [fileChars, textInputChars, linkInputChars, qaInputChars, youtubeLinkChars, notionPages, setTotalChars]);

  return (
    <div className="w-[300px] bg-white rounded-lg p-6 border shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Sources</h2>

      <div className="space-y-3 pb-6 border-b-[3px] border-dotted">
        {fileCount > 0 && <p className="text-gray-700">
          {fileCount} File{fileCount == 1 ? '' : 's'} ({formatFileSize(fileChars)})
        </p>}
        {textInputChars > 0 && <p className="text-gray-700">
          Text Input ({formatFileSize(textInputChars)})
        </p>}
        {linkInputCount > 0 && <p className="text-gray-700">
          {linkInputCount} Links ({formatFileSize(linkInputChars)})
        </p>}
        {youtubeLinkCount > 0 && <p className="text-gray-700">
          {youtubeLinkCount} YouTube Video{youtubeLinkCount == 1 ? '' : 's'} ({formatFileSize(youtubeLinkChars)})
        </p>}
        {qaInputCount > 0 && <p className="text-gray-700">
          {qaInputCount} Q&A ({formatFileSize(qaInputChars)})
        </p>}
        {notionPages.length > 0 && <p className="text-gray-700">
          {notionPages.length} Notion Page{notionPages.length === 1 ? '' : 's'} ({formatFileSize(notionPages.reduce((total, page) => total + (page.charCount || 0), 0))})
        </p>}
      </div>

      <div className="space-y-2 my-5">
        <p className="font-medium">Total size</p>
        <p className="text-center">
          <span className="text-lg font-semibold">{formatFileSize(totalChars)}</span>
          <span className="text-gray-500">/ {charLimit == 0 ? "Unlimited" : formatFileSize(charLimit) + ' limit'}</span>
        </p>
      </div>

      <Button
        className="w-full mt-6 bg-black text-white hover:bg-gray-800"
        onClick={onRetrain}
        disabled={isTraining}
      >
        {isTraining ? (<><span className="loading loading-spinner loading-xs"></span>&nbsp;contructing...</>) : 'construct the index'}
      </Button>
      {isLimited && <div className="flex flex-row items-center justify-center gap-2 rounded-md px-3 py-2.5 shadow-sm leading-tight tracking-tight bg-red-50 text-red-600 -mb-[1.2rem] mt-3 w-[calc(100%+40px)] -mx-5">
        <div>
          <IconInfoCircle size={16} className="text-red-600" />
        </div>
        <div className="space-y-0.5">
          <h1 className="font-medium text-sm">You have reached the size limit</h1>
          <p className="text-xs text-zinc-700"></p>
        </div>
      </div>}
      {!isLimited && needRetrain && <div className="flex flex-row items-center justify-center gap-2 rounded-md px-3 py-2.5 shadow-sm leading-tight tracking-tight bg-amber-50 text-amber-700 -mb-[1.2rem] mt-3 w-[calc(100%+40px)] -mx-5">
        <div>
          <IconRefresh size={16} className="text-amber-600" />
        </div>
        <div className="space-y-0.5">
          <h1 className="font-medium text-sm">Retraining is required for changes to apply</h1>
          <p className="text-xs text-zinc-700"></p>
        </div>
      </div>}
    </div>
  );
};

export default SourceStats;
