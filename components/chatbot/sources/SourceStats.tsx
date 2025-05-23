import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { IconImageInPicture, IconInfoCircle, IconRefresh } from "@tabler/icons-react";
import { formatFileSize } from "@/lib/utils";
import {
  IconFile,
  IconAlignLeft,
  IconGlobe,
  IconAdjustmentsSpark,
  IconMessageQuestion,
  IconBrandNotion,
  IconBrandYoutube,
  IconBrandAppgallery,
  IconPictureInPicture,
} from "@tabler/icons-react";

interface SourceStatsProps {
  totalChars: number;
  fileCount: number;
  fileChars: number;
  imageCount: number;
  imageChars: number;
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
  imageCount,
  imageChars,
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
    const total = fileChars + fileChars + textInputChars + linkInputChars + qaInputChars + youtubeLinkChars + notionChars;
    if (firstTotalChars === 0) {
      setFirstTotalChars(total);
    } else if (!needRetrain) {
      setNeedRetrain(total != firstTotalChars);
    }
    setIsLimited(total > charLimit && charLimit > 0);
    setTotalChars(total);
  }, [fileChars, imageChars, textInputChars, linkInputChars, qaInputChars, youtubeLinkChars, notionPages, setTotalChars]);

  return (
    <div className="bg-white rounded-lg p-6 border shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-zinc-600">Sources</h2>

      <div className="space-y-3 pb-6 border-b-[3px] border-dotted text-sm">
        {
          fileCount > 0 &&
          <div className="text-gray-700 flex items-center justify-between">
            <div className="flex gap-1 items-center">
              <IconFile className="w-4 h-4" />
              {fileCount} File{fileCount == 1 ? '' : 's'}
            </div>
            <p className="font-medium text-zinc-900">{formatFileSize(fileChars)}</p>
          </div>
        }
        {
          imageCount > 0 &&
          <div className="text-gray-700 flex items-center justify-between">
            <div className="flex gap-1 items-center">
              <IconPictureInPicture className="w-4 h-4" />
              {imageCount} Image{imageCount == 1 ? '' : 's'}
            </div>
            <p className="font-medium text-zinc-900">{formatFileSize(imageChars)}</p>
          </div>
        }
        {
          textInputChars > 0 &&
          <div className="text-gray-700 flex items-center justify-between">
            <div className="flex gap-1 items-center">
              <IconAlignLeft className="w-4 h-4" />
              Text Input
            </div>
            <p className="font-medium text-zinc-900">{formatFileSize(textInputChars)}</p>
          </div>
        }
        {
          youtubeLinkCount > 0 &&
          <div className="text-gray-700 flex items-center justify-between">
            <div className="flex gap-1 items-center">
              <IconBrandYoutube className="w-4 h-4" />
              {youtubeLinkCount} YouTube Video{youtubeLinkCount == 1 ? '' : 's'}
            </div>
            <p className="font-medium text-zinc-900">{formatFileSize(youtubeLinkChars)}</p>
          </div>
        }
        {
          linkInputCount > 0 &&
          <div className="text-gray-700 flex items-center justify-between">
            <div className="flex gap-1 items-center">
              <IconGlobe className="w-4 h-4" />
              {linkInputCount} Link{linkInputCount == 1 ? '' : 's'}
            </div>
            <p className="font-medium text-zinc-900">{formatFileSize(linkInputChars)}</p>
          </div>
        }
        {
          qaInputCount > 0 &&
          <div className="text-gray-700 flex items-center justify-between">
            <div className="flex gap-1 items-center">
              <IconMessageQuestion className="w-4 h-4" />
              {qaInputCount} Q&A{qaInputCount == 1 ? '' : 's'}
            </div>
            <p className="font-medium text-zinc-900">{formatFileSize(qaInputChars)}</p>
          </div>
        }
        {
          notionPages.length > 0 &&
          <div className="text-gray-700 flex items-center justify-between">
            <div className="flex gap-1 items-center">
              <IconMessageQuestion className="w-4 h-4" />
              {notionPages.length} Notion Page{notionPages.length == 1 ? '' : 's'}
            </div>
            <p className="font-medium text-zinc-900">{formatFileSize(notionPages.reduce((total, page) => total + (page.charCount || 0), 0))}</p>
          </div>
        }
      </div>
      
      <div className="my-5 flex flex-col gap-1 text-sm">
        <span className="flex items-center justify-between font-medium text-zinc-800">
          <span className="text-base">Total size:</span>
          <span className="font-bold">{formatFileSize(totalChars)}</span>
        </span>
        <span className="self-end font-medium text-zinc-800">/ {charLimit == 0 ? "Unlimited" : formatFileSize(charLimit) + ' limit'}</span>
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
