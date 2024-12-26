"use client";

import { useState } from "react";
import dynamic from 'next/dynamic';
import SideNav from "./SideNav";
import FileUpload from "./FileUpload";
import ConfigPanel from "./ConfigPanel";

// Dynamically import components for different content types
const TextInput = dynamic(() => import('./TextInput'));
const WebsiteInput = dynamic(() => import('./WebsiteInput'));
const QAInput = dynamic(() => import('./QAInput'));
const NotionInput = dynamic(() => import('./NotionInput'));

const ChatbotCreator = ({ teamId }: { teamId: string }) => {
  const [activeItem, setActiveItem] = useState("files");

  const handleFileSelect = (file: File) => {
    // Handle single file
    console.log(file);
  };

  const renderContent = () => {
    switch (activeItem) {
      case "files":
        return <FileUpload onFileSelect={handleFileSelect} />;
      case "text":
        return <TextInput />;
      case "website":
        return <WebsiteInput />;
      case "qa":
        return <QAInput />;
      case "notion":
        return <NotionInput />;
      default:
        return <div className="flex-1 p-6">Select a data source</div>;
    }
  };

  return (
    <div>
      <div className="mb-8 px-8 pt-8">
        <h1 className="text-2xl font-bold mb-2">Data Sources</h1>
        <p className="text-base-content/70">
          Add your data sources to train your chatbot
        </p>
      </div>
      
      <div className="flex">
        <SideNav activeItem={activeItem} onItemClick={setActiveItem} />
        {renderContent()}
        <ConfigPanel teamId={teamId} />
      </div>
    </div>
  );
};

export default ChatbotCreator; 