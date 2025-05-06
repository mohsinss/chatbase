"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import YouTubeList from "./YouTubeList";

interface YouTubeLink {
  id: string;
  link: string;
  chars: number;
  transcript?: string;
  status?: "pending" | "training" | "trained" | "error";
}

interface YouTubeInputProps {
  links: YouTubeLink[];
  setLinks: React.Dispatch<React.SetStateAction<YouTubeLink[]>>;
}

const YouTubeInput: React.FC<YouTubeInputProps> = ({ links, setLinks }) => {
  const [inputValue, setInputValue] = useState("");

  const isValidYouTubeUrl = (url: string) => {
    // Basic YouTube URL validation
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(&.*)?$/;
    return pattern.test(url);
  };

  const handleAddLink = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      toast.error("Please enter a YouTube link");
      return;
    }
    if (!isValidYouTubeUrl(trimmed)) {
      toast.error("Invalid YouTube link format");
      return;
    }
    if (links.find(link => link.link === trimmed)) {
      toast.error("This link is already added");
      return;
    }
    const newLink: YouTubeLink = {
      id: Date.now().toString(),
      link: trimmed,
      chars: 0,
      status: "pending",
    };
    setLinks([...links, newLink]);
    setInputValue("");
  };

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  return (
    <div>
      <div className=" bg-white">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter YouTube video URL"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />
          <button
            onClick={handleAddLink}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            Add
          </button>
        </div>
        <YouTubeList links={links} onRemove={handleRemoveLink} />
      </div>
    </div>
  );
};

export default YouTubeInput;
