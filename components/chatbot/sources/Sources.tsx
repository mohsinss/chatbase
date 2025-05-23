"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  IconFile,
  IconAlignLeft,
  IconGlobe,
  IconAdjustmentsSpark,
  IconMessageQuestion,
  IconBrandNotion,
  IconBrandYoutube,
  IconBrandAppgallery,
  IconPictureInPicture
} from "@tabler/icons-react";
import { FileUpload } from "./FileUpload";
import { ImageUpload } from "./ImageUpload";
import SourceStats from './SourceStats';
import TextInput from './TextInput';
import WebsiteInput from './WebsiteInput';
import QAInput from './QAInput';
import NotionInput from './NotionInput';
import toast, { Toaster } from 'react-hot-toast';
import config from "@/config";
import ChatflowV1 from "./ChatflowV1";
import { ReactFlowProvider } from "reactflow";
import YouTubeInput from "./YouTubeInput";
import { YouTubeLink } from "./types";
import Salla from "./Salla";

const SOURCE_TABS = [
  { id: "files", label: "Files", icon: <IconFile className="w-5 h-5" /> },
  { id: "images", label: "Images", icon: <IconPictureInPicture className="w-5 h-5" /> },
  { id: "text", label: "Text", icon: <IconAlignLeft className="w-5 h-5" /> },
  { id: "youtube", label: "YouTube", icon: <IconBrandYoutube className="w-5 h-5" /> },
  { id: "qa", label: "Q&A", icon: <IconMessageQuestion className="w-5 h-5" /> },
  { id: "qf", label: "QFlow", icon: <IconAdjustmentsSpark className="w-5 h-5" /> },
  { id: "website", label: "Website", icon: <IconGlobe className="w-5 h-5" /> },
  { id: "notion", label: "Notion", icon: <IconBrandNotion className="w-5 h-5" /> },
  { id: "salla", label: "Salla", icon: <IconBrandAppgallery className="w-5 h-5" /> },
];

const Sources = ({
  teamId,
  chatbotId,
  chatbot,
  team
}: {
  teamId: string;
  chatbotId: string;
  chatbot: any;
  team: any;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'files';
  const [totalChars, setTotalChars] = useState<number>(0);
  const [fileCount, setFileCount] = useState<number>(0);
  const [fileChars, setFileChars] = useState<number>(0);
  const [imageCount, setImageCount] = useState<number>(0);
  const [imageChars, setImageChars] = useState<number>(0);
  const [isTraining, setIsTraining] = useState(false);
  const [dataset, setDataset] = useState<any>(null);
  const [text, setText] = useState<string>('');
  const [qaPairs, setQaPairs] = useState<{ id: string; question: string; answer: string }[]>([]);
  const [links, setLinks] = useState<{ id: string; link: string, chars: number }[]>([]);
  const [youtubeLinks, setYoutubeLinks] = useState<YouTubeLink[]>([]);
  const [qFlow, setQFlow] = useState(null);
  const [qFlowEnabled, setQFlowEnabled] = useState(false);
  const [qFlowAIEnabled, setQFlowAIEnabled] = useState(true);
  const [restartQFTimeoutMins, setRestartQFTimeoutMins] = useState(60);
  const [notionData, setNotionData] = useState<any>(null);
  const [notionPages, setNotionPages] = useState<any[]>([]);
  const [showRetrainAlert, setShowRetrainAlert] = useState(false);
  const [lastTrained, setLastTrained] = useState<Date | null>(null);
  const [notionPagesLoading, setNotionPagesLoading] = useState(false);
  const [sallaAdditionalInfo, setSallaAdditionalInfo] = useState<string>('');

  //@ts-ignore
  const planConfig = config.stripe.plans[team.plan];

  // Fetch Notion data
  const fetchNotion = async () => {
    try {
      setNotionPagesLoading(true);
      const response = await fetch(`/api/chatbot/sources/notion?chatbotId=${chatbotId}`);
      if (!response.ok) {
        if (response.status === 403) {
          // Not connected, ignore or handle accordingly
          setNotionData(null);
          setNotionPages([]);
          setShowRetrainAlert(false);
          return;
        }
        throw new Error('Failed to fetch Notion data');
      }
      const data = await response.json();
      setNotionData(data);
      if (data.pages) {
        setNotionPages(data.pages);
      }
    } catch (error) {
      console.error("Error fetching Notion data:", error);
    } finally {
      setNotionPagesLoading(false);
    }
  };

  const fetchDataset = async () => {
    try {
      const response = await fetch(`/api/chatbot/sources/dataset?chatbotId=${chatbotId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dataset');
      }
      const data = await response.json();
      setDataset(data); // Assuming the API returns the dataset directly
      if (data?.lastTrained) {
        setLastTrained(new Date(data.lastTrained));
      }
      if (data.qaPairs)
        setQaPairs(data.qaPairs)
      if (data.text)
        setText(data.text)
      if (data.links)
        setLinks(data.links)
      if (data.youtubeLinks)
        setYoutubeLinks(data.youtubeLinks)
      if (data.files) {
        // @ts-ignore
        const filteredFiles = data.files.filter(file => (file.name.endsWith('.txt') || file.name.endsWith('.pdf')));
        // @ts-ignore
        const filteredImages = data.files.filter(file => !(file.name.endsWith('.txt') || file.name.endsWith('.pdf')));
        // @ts-ignore
        setFileCount(filteredFiles.length);
        //@ts-ignore
        setFileChars(filteredFiles.reduce((size, file) => {
          return size + file.charCount;
        }, 0))
        // @ts-ignore
        setImageCount(filteredImages.length);
        //@ts-ignore
        setImageChars(filteredImages.reduce((size, file) => {
          return size + file.charCount;
        }, 0))
      }
      if (data.questionFlow) {
        setQFlow(data.questionFlow)
      }
      setQFlowEnabled(!!data.questionFlowEnable);
      setQFlowAIEnabled(!!data.questionAIResponseEnable)
      if (data.restartQFTimeoutMins) {
        setRestartQFTimeoutMins(data.restartQFTimeoutMins)
      }
    } catch (error) {
      console.error("Error fetching dataset:", error);
      toast.error("Failed to load dataset" + error.message);
    }
  };

  useEffect(() => {
    fetchDataset();
    fetchNotion();
  }, [chatbotId]);

  const handleTabChange = (tabId: string) => {
    router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/sources?tab=${tabId}`);
  };

  const retrain = async () => {
    if (totalChars > planConfig.charactersLimit && planConfig.charactersLimit != 0) {
      toast.error(`Please udpate your plan, you can train your bot upto ${(planConfig.charactersLimit / 1000000).toFixed(1)}M characters.`)
      return;
    }
    try {
      setIsTraining(true);

      const response = await fetch("/api/chatbot/train", {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          chatbotId,
          text,
          qaPairs,
          links,
          youtubeLinks,
          questionFlow: qFlow,
          notionPages, // Include Notion data in retrain payload
          sallaAdditionalInfo, // Include Salla additional info
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Failed to retrain`);
      }

      const data = await response.json();
      console.log("Retrain response:", data);

      toast.success("Retraining completed successfully!");

      // Redirect to the sources page without the tab query parameter
      router.push(`/dashboard/${teamId}/chatbot/${chatbotId}`);
    } catch (err) {
      console.error("Retrain error:", err);

      toast.error(err instanceof Error ? err.message : "Failed to retrain");

      // setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setIsTraining(false);
    }
  }

  const updateDatasetYouTubeLinks = async (updatedLinks: any, mode: string) => {
    try {
      const response = await fetch('/api/chatbot/sources/dataset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatbotId,
          youtubeLinks: updatedLinks,
          mode, // Pass mode to backend for handling
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update YouTube links in dataset');
      }

      if (mode === 'create') {
        toast.success('YouTube link created successfully');
      } else if (mode === 'delete') {
        toast.success('YouTube link deleted successfully');
      }
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update YouTube links in dataset');
      return false;
    }
  };

  const saveNotionIntegrationSettings = async (chatbotId: string, code: string) => {
    try {
      const response = await fetch('/api/chatbot/integrations/notion/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatbotId, code }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Failed to save Notion integration settings`);
      }

      toast.success('Notion integration saved successfully');
      fetchNotion();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save Notion integration settings');
      throw error;
    }
  }

  const renderContent = () => {
    switch (currentTab) {
      case "files":
        return <FileUpload
          teamId={teamId} chatbotId={chatbotId} 
          setFileCount={setFileCount} setFileChars={setFileChars}
          limitChars={planConfig.charactersLimit} totalChars={totalChars} />;
      case "images":
        return <ImageUpload
          teamId={teamId} chatbotId={chatbotId} 
          setFileCount={setImageCount} setFileChars={setImageChars}
          limitChars={planConfig.charactersLimit} totalChars={totalChars} />;
      case "text":
        return <TextInput text={text} setText={setText} />;
      case "website":
        return <WebsiteInput links={links} setLinks={setLinks} />;
      case "youtube":
        return <YouTubeInput
          chatbotId={chatbotId}
          links={youtubeLinks}
          setLinks={async (newLinks: any, mode = 'update') => {
            const result = await updateDatasetYouTubeLinks(newLinks, mode);
            if (result) {
              setYoutubeLinks(newLinks);
            }
          }} />;
      case "qa":
        return <QAInput qaPairs={qaPairs} setQaPairs={setQaPairs} />;
      case "qf":
        return <ReactFlowProvider>
          <ChatflowV1 qFlow={qFlow} setQFlow={setQFlow}
            qFlowEnabled={qFlowEnabled} chatbotId={chatbotId}
            qFlowAIEnabled={qFlowAIEnabled} restartQFTimeoutMins={restartQFTimeoutMins} />
        </ReactFlowProvider>;
      case "notion":
        return <NotionInput
          loading={notionPagesLoading}
          connected={!!notionData}
          pages={notionPages}
          onConnect={async (code: string) => {
            await saveNotionIntegrationSettings(chatbotId, code);
          }}
          lastTrained={lastTrained}
        />;
      case "salla":
        return <Salla chatbotId={chatbotId} additionalInfo={sallaAdditionalInfo} setAdditionalInfo={setSallaAdditionalInfo} />;
      default:
        return <div>Content for {currentTab}</div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-8">Sources</h1>

      {showRetrainAlert && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          Some Notion pages have been updated since the last training. Please retrain your chatbot to include the latest content.
        </div>
      )}

      {/* Responsive Layout Container */}
      <div className="flex flex-col md:flex-row gap-6 md:items-start items-center">
        {/* Left side nav and main content */}
        <div
          style={{ width: '-webkit-fill-available' }}
          className="flex flex-col md:flex-row flex-1">
          {/* Source Type Tabs - Side for larger screens, Top for mobile */}
          <div className={`
            max-md:mb-8
            max-md:flex max-md:justify-center max-md:space-x-4
            md:w-[160px] md:border-r md:space-y-2 
            md:pr-3 md:mr-6
            w-full
            overflow-x-auto
          `}>
            {SOURCE_TABS.map((tab) => {
              if (tab.id == "salla" && chatbot?.integrations?.salla != true) {
                return null;
              }
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                  flex items-center gap-2 transition-colors w-full
                  md:px-4 md:py-2
                  max-md:px-6 max-md:py-3
                  rounded-lg
                  ${currentTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-100"}
                `}
                >
                  {tab.icon}
                  <span className="text-sm">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Content Area - added min-height */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>

        {/* Right Stats Panel */}
        <div className="md:w-[300px] shrink-0 w-full">
          <SourceStats
            totalChars={totalChars}
            fileCount={fileCount}
            fileChars={fileChars}
            imageCount={imageCount}
            imageChars={imageChars}
            textInputChars={text ? text.length : 0}
            charLimit={planConfig.charactersLimit}
            setTotalChars={setTotalChars}
            onRetrain={retrain}
            isTraining={isTraining}
            qaInputCount={qaPairs.length}
            qaInputChars={qaPairs.reduce((total, pair) => total + pair.question.length + pair.answer.length, 0)}
            linkInputCount={links.length}
            linkInputChars={links.reduce((total, link) => total + link.chars, 0)}
            youtubeLinkCount={youtubeLinks.length}
            youtubeLinkChars={youtubeLinks.reduce((total, link) => total + link.chars, 0)}
            notionPages={notionPages}
          />
        </div>
      </div>
    </div>
  );
};

export default Sources;
