
"use client";

import React, { useState, useEffect } from "react";
import { IconTrash, IconRefresh, IconFile, IconDownload, IconEye, IconImageInPicture, IconPdf } from "@tabler/icons-react";
import toast from "react-hot-toast";

interface YouTubeLink {
  id: string;
  link: string;
  chars: number;
  transcript?: string;
  status?: "pending" | "transcripting" | "training" | "trained" | "error";
  trained?: boolean;
}

interface YouTubeListProps {
  links: YouTubeLink[];
  onRemove: (id: string) => void;
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  transcripting: "Transcripting",
  training: "Training",
  trained: "Trained",
  error: "Error",
};

const YouTubeList: React.FC<YouTubeListProps> = ({ links, onRemove }) => {
  const [localLinks, setLocalLinks] = useState<YouTubeLink[]>([]);
  const [viewTranscriptId, setViewTranscriptId] = useState<string | null>(null);

  useEffect(() => {
    setLocalLinks(links);
  }, [links]);

  // Simulate status updates for transcripting and training (this should be replaced with real API polling)
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalLinks((prevLinks) =>
        prevLinks.map((link) => {
          if (link.status === "pending") {
            return { ...link, status: "transcripting" };
          } else if (link.status === "transcripting") {
            return { ...link, status: "training" };
          } else if (link.status === "training") {
            return { ...link, status: "trained", trained: true };
          }
          return link;
        })
      );
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const toggleViewTranscript = (id: string) => {
    if (viewTranscriptId === id) {
      setViewTranscriptId(null);
    } else {
      setViewTranscriptId(id);
    }
  };

  return (
    <div className="mt-4">
      {localLinks.length === 0 ? (
        <p className="text-gray-500">No YouTube videos added yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200 rounded border border-gray-200 bg-white">
          {localLinks.map(({ id, link, chars, transcript, status, trained }) => (
            <li key={id} className="flex flex-col p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline break-all font-semibold"
                  >
                    {link}
                  </a>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-gray-500 text-xs">
                      {chars} chars
                    </span>
                    <span className={`rounded-md p-1 text-sm text-black ${trained ? 'bg-green-300' : 'bg-red-300'}`}>
                      {trained ? 'Trained' : 'Not Trained'}
                    </span>
                    {status && (
                      <span
                        className={`text-sm font-medium ${status === "error"
                          ? "text-red-600"
                          : status === "trained"
                            ? "text-green-600"
                            : "text-yellow-600"
                          }`}
                      >
                        {statusLabels[status] || status}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {transcript && (
                    <button
                      onClick={() => toggleViewTranscript(id)}
                      className="text-gray-600 hover:text-gray-900"
                      aria-label="View transcript"
                    >
                      <IconEye className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => onRemove(id)}
                    className="text-red-600 hover:text-red-800 font-bold"
                    aria-label="Remove video"
                  >
                    <IconTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {transcript && viewTranscriptId === id && (
                <p className="text-gray-700 text-sm mt-2 whitespace-pre-wrap">{transcript}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default YouTubeList;
