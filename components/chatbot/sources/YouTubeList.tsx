
"use client";

import React, { useState, useEffect } from "react";
import { IconTrash, IconRefresh, IconLoader, IconDownload, IconEye, IconImageInPicture, IconPdf } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { YouTubeLink } from "./types";

interface YouTubeListProps {
  chatbotId: string;
  links: YouTubeLink[];
  onRemove: (id: string) => void;
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  transcripted: "Transcripted",
  trained: "Trained",
  error: "Error",
};

const YouTubeList: React.FC<YouTubeListProps> = ({ links, onRemove, chatbotId }) => {
  const [localLinks, setLocalLinks] = useState<YouTubeLink[]>([]);
  const [viewTranscriptId, setViewTranscriptId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setLocalLinks(links);
  }, [links]);

  const toggleViewTranscript = (id: string) => {
    if (viewTranscriptId === id) {
      setViewTranscriptId(null);
    } else {
      setViewTranscriptId(id);
    }
  };

  const handleDelete = async (id: string) => {
    const linkToDelete = localLinks.find(link => link.id === id);

    if (!linkToDelete) {
      return;
    }
    setDeletingId(id);

    try {
      const response = await fetch(`/api/chatbot/sources/youtube-transcribe?youtubeLinkId=${id}&datasetId=${linkToDelete.trieveId ?? ''}&chatbotId=${chatbotId ?? ''}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete YouTube link');
      }

      await onRemove(id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete YouTube link');
    }
    setDeletingId(null);
  }

  return (
    <div className="mt-4">
      {localLinks.length === 0 ? (
        <p className="text-gray-500">No YouTube videos added yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200 rounded border border-gray-200 bg-white">
          {localLinks.map(({ id, link, chars, transcript, status }) => (
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
                    {status && (
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded ${status === "error"
                          ? "bg-red-200 text-red-800"
                          : status === "trained"
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-200 text-yellow-800"
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
                    onClick={() => handleDelete(id)}
                    className="text-red-600 hover:text-red-800 font-bold"
                    aria-label="Remove video"
                    disabled={deletingId === id}
                  >
                    {deletingId == id ? <IconLoader className="w-5 h-5 animate-spin"/> : <IconTrash className="w-5 h-5" />}
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
