"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import YouTubeList from "./YouTubeList";

import { YouTubeLink } from "./types";

interface YouTubeInputProps {
  chatbotId: string;
  links: YouTubeLink[];
  setLinks: (newLinks: YouTubeLink[], mode?: string) => void;
}

const YouTubeInput: React.FC<YouTubeInputProps> = ({ chatbotId, links, setLinks }) => {
  const [inputValue, setInputValue] = useState("");

  const isValidYouTubeUrl = (url: string) => {
    // Basic YouTube URL validation
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(&.*)?$/;
    return pattern.test(url);
  };

  const handleAddLink = async () => {
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

    try {
      // Call backend API to start transcription
      const response = await fetch("/api/chatbot/sources/youtube-transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatbotId, link: trimmed }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to start transcription");
      
        const newLink: YouTubeLink = {
          id: Date.now().toString(),
          link: trimmed,
          chars: 0,
          status: "pending",
        };
        setLinks([...links, newLink], 'create');
        setInputValue("");
        return;
      }

      const data = await response.json();

      // Save the resultUrl for polling
      const resultUrl = data.resultUrl;
      
      const newLink: YouTubeLink = {
        id: Date.now().toString(),
        link: trimmed,
        chars: 0,
        status: "processing",
        transcriptionResultUrl: resultUrl, // Placeholder for the result URL
      };
      setLinks([...links, newLink], 'create');
      setInputValue("");

      // No immediate polling here; polling will be handled globally in useEffect
    } catch (error) {
      toast.error("Error starting transcription");
    }
  };

  // Polling for all links with status "processing" and transcriptionResultUrl
  useEffect(() => {
    const pollForResult = async (link: YouTubeLink) => {
      const headers = {
        "x-gladia-key": process.env.NEXT_PUBLIC_GLADIA_API_KEY || "",
      };
      try {
        const pollResponse = await fetch(link.transcriptionResultUrl || "", { headers });
        if (!pollResponse.ok) {
          toast.error("Failed to poll transcription result");
          return false;
        }
        const pollData = await pollResponse.json();
        if (pollData.status === "done") {
          const transcript = pollData.result.transcription.full_transcript;
          setLinks(
            links.map((l: YouTubeLink) =>
              l.link === link.link
                ? { ...l, transcript, status: "transcripted", chars: transcript.length }
                : l
            ), 'update'
          );
          return true;
        } else {
          setLinks(
            links.map((l) =>
              l.link === link.link
                ? { ...l, status: pollData.status }
                : l
            ), 'update'
          );
          return false;
        }
      } catch {
        toast.error("Error polling transcription result");
        return false;
      }
    };

    const intervalId = setInterval(() => {
      links.forEach((link) => {
        if (link.status === "processing" && link.transcriptionResultUrl) {
          pollForResult(link);
        }
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [links]);

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id), 'delete');
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
