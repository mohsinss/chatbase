"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IconFile, IconAlignLeft, IconGlobe, IconMessageQuestion, IconBrandNotion } from "@tabler/icons-react";
import { FileUpload } from "./FileUpload";
import SourceStats from './SourceStats';
import TextInput from './TextInput';
import WebsiteInput from './WebsiteInput';
import QAInput from './QAInput';
import NotionInput from './NotionInput';
import toast, { Toaster } from 'react-hot-toast';

const SOURCE_TABS = [
  { id: "files", label: "Files", icon: <IconFile className="w-5 h-5" /> },
  { id: "text", label: "Text", icon: <IconAlignLeft className="w-5 h-5" /> },
  { id: "website", label: "Website", icon: <IconGlobe className="w-5 h-5" /> },
  { id: "qa", label: "Q&A", icon: <IconMessageQuestion className="w-5 h-5" /> },
  { id: "notion", label: "Notion", icon: <IconBrandNotion className="w-5 h-5" /> },
];

const Sources = ({ 
  teamId, 
  chatbotId,
  chatbot
}: { 
  teamId: string;
  chatbotId: string;
  chatbot: any;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'files';
  const [fileCount, setFileCount] = useState<number>(0);
  const [fileSize, setFileSize] = useState<number>(0);
  const [fileChars, setFileChars] = useState<number>(0);
  const [isTraining, setIsTraining] = useState(false);
  const [dataset, setDataset] = useState<any>(null);
  const [text, setText] = useState<string>('');
  const [qaPairs, setQaPairs] = useState<{ id: string; question: string; answer: string }[]>([]);
  const [links, setLinks] = useState<{ id: string; link: string, chars: number}[]>([]);

  const fetchFiles = async () => {
    try {
      if(!dataset?.datasetId)
        return;
      // First get the dataset ID
      const datasetsResponse = await fetch("https://api.trieve.ai/api/dataset/files/"+dataset?.datasetId+"/1", {
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TRIEVE_API_KEY}`,
          "TR-Organization": process.env.NEXT_PUBLIC_TRIEVE_ORG_ID!,
          "TR-Dataset": dataset?.datasetId,
        }
      });
      
      if (!datasetsResponse.ok) throw new Error("Failed to fetch datasets");
      
      const datasets = await datasetsResponse.json();
      console.log(datasets.file_and_group_ids)
      // @ts-ignore
      const files = datasets.file_and_group_ids.filter(item => item.file.file_name != 'texttexttexttext.txt').filter(item => item.file.file_name != 'texttexttexttextqa.txt').filter(item => item.file.file_name != 'texttexttexttextlink.txt');
      // @ts-ignore
      // setFiles(files.map(item => item.file));
      setFileCount(files.length);
      // @ts-ignore
      setFileSize(files.reduce((size, file) => {
        return size + file.file.metadata.sizeInBytes;
      }, 0.0));
      // @ts-ignore
      setFileChars(files.reduce((size, file) => {
        return size + file.file.metadata.sizeInCharacters;
      }, 0));
      
      //@ts-ignore
      const texts = datasets.file_and_group_ids.filter(item => item.file.file_name == 'texttexttexttext.txt');

      for(let i = 0 ; i < texts.length ; i++){
        // Delete the file using the provided fileId
        const response = await fetch(`https://api.trieve.ai/api/file/${texts[i].file.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TRIEVE_API_KEY}`,
            "TR-Organization": process.env.NEXT_PUBLIC_TRIEVE_ORG_ID!,
            "TR-Dataset": dataset?.datasetId, // Use datasetId since it's guaranteed to be present
          }
        });

        // Check if the file deletion was successful
        if (!response.ok) {
          throw new Error(`Failed to delete file: ${response.statusText}`);
        }
      }
      //@ts-ignore
      const qas = datasets.file_and_group_ids.filter(item => item.file.file_name == 'texttexttexttextqa.txt');

      for(let i = 0 ; i < qas.length ; i++){
        // Delete the file using the provided fileId
        const response = await fetch(`https://api.trieve.ai/api/file/${qas[i].file.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TRIEVE_API_KEY}`,
            "TR-Organization": process.env.NEXT_PUBLIC_TRIEVE_ORG_ID!,
            "TR-Dataset": dataset?.datasetId, // Use datasetId since it's guaranteed to be present
          }
        });

        // Check if the file deletion was successful
        if (!response.ok) {
          throw new Error(`Failed to delete file: ${response.statusText}`);
        }
      }

      //@ts-ignore
      const links = datasets.file_and_group_ids.filter(item => item.file.file_name == 'texttexttexttextlink.txt');

      for(let i = 0 ; i < links.length ; i++){
        // Delete the file using the provided fileId
        const response = await fetch(`https://api.trieve.ai/api/file/${links[i].file.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TRIEVE_API_KEY}`,
            "TR-Organization": process.env.NEXT_PUBLIC_TRIEVE_ORG_ID!,
            "TR-Dataset": dataset?.datasetId, // Use datasetId since it's guaranteed to be present
          }
        });

        // Check if the file deletion was successful
        if (!response.ok) {
          throw new Error(`Failed to delete file: ${response.statusText}`);
        }
      }
      
    } catch (err) {
      // setError(err instanceof Error ? err.message : "Failed to fetch files");
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDataset = async () => {
      try {
        const response = await fetch(`/api/chatbot/sources/dataset?chatbotId=${chatbotId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch dataset');
        }
        const data = await response.json();
        setDataset(data); // Assuming the API returns the dataset directly
        if(data.qaPairs)
          setQaPairs(data.qaPairs)
        if(data.text)
          setText(data.text)
        if(data.links)
          setLinks(data.links)
        fetchFiles()
      } catch (error) {
        console.error("Error fetching dataset:", error);
        toast.error("Failed to load dataset");
      }
    };

    fetchDataset();
  }, [chatbotId]);

  const handleTabChange = (tabId: string) => {
    router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/sources?tab=${tabId}`);
  };

  const retrain = async () => {
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

  const renderContent = () => {
    switch (currentTab) {
      case "files":
        return <FileUpload teamId={teamId} chatbotId={chatbotId} setFileCount={setFileCount} setFileSize={setFileSize} setFileChars={setFileChars}/>;
      case "text":
        return <TextInput text={text} setText={setText} />;
      case "website":
        return <WebsiteInput links={links} setLinks={setLinks} />;
      case "qa":
        return <QAInput qaPairs={qaPairs} setQaPairs={setQaPairs}/>;
      case "notion":
        return <NotionInput 
          onConnect={() => {
            console.log('Connecting to Notion...');
          }}
        />;
      default:
        return <div>Content for {currentTab}</div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-8">Sources</h1>

      {/* Responsive Layout Container */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side nav and main content */}
        <div className="flex flex-col md:flex-row flex-1">
          {/* Source Type Tabs - Side for larger screens, Top for mobile */}
          <div className={`
            max-md:mb-8
            max-md:flex max-md:justify-center max-md:space-x-4
            md:w-[160px] md:border-r md:space-y-2 
            md:pr-3 md:mr-6
          `}>
            {SOURCE_TABS.map((tab) => (
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
            ))}
          </div>

          {/* Content Area - added min-height */}
          <div className="flex-1 min-h-[700px]">
            {renderContent()}
          </div>
        </div>

        {/* Right Stats Panel */}
        <div className="w-[300px] shrink-0">
          <SourceStats
            fileCount={fileCount}
            fileChars={fileChars}
            textInputChars={text ? text.length : 0}
            charLimit={6_000_000}
            onRetrain={retrain}
            isTraining={isTraining}
            qaInputCount={qaPairs.length}
            qaInputChars={qaPairs.reduce((total, pair) => total + pair.question.length + pair.answer.length, 0)}
            linkInputCount={links.length}
            linkInputChars={links.reduce((total, link) => total + link.chars, 0)}
          />
        </div>
      </div>
    </div>
  );
};

export default Sources; 