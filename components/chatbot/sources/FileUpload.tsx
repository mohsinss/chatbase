"use client";

import { useState, useCallback } from "react";
import { IconFile, IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { DatasetList } from "./DatasetList";

interface FileUploadProps {
  teamId: string;
  chatbotId: string;
}

export const FileUpload = ({ teamId, chatbotId }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const createDataset = async () => {
    const response = await fetch("/api/chatbot/sources/dataset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatbotId,
        name: `Chatbot ${chatbotId} Dataset`
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to create dataset");
    }

    return response.json();
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const dataset = await createDataset();
      const datasetId = dataset.id;

      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        formData.append('datasetId', datasetId);
        formData.append('teamId', teamId);

        const response = await fetch("/api/chatbot/sources/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to upload file");
        }
      }
      
      setSuccess(`Successfully uploaded ${acceptedFiles.length} file(s)`);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setUploading(false);
    }
  }, [chatbotId, teamId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    maxSize: 10485760, // 10MB
  });

  return (
    <div>
      <div className="bg-white rounded-lg p-8 border">
        <div {...getRootProps()} className="text-center cursor-pointer">
          <input {...getInputProps()} />
          <div className="flex justify-center mb-4">
            {uploading ? (
              <IconUpload className="w-12 h-12 text-gray-400 animate-pulse" />
            ) : (
              <IconFile className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {isDragActive
              ? "Drop the files here"
              : "Drag & drop files here, or click to select files"}
          </h3>
          <p className="text-gray-500 mb-4">
            Supported File Types: PDF, TXT
          </p>
          <p className="text-gray-500">
            Maximum file size: 10MB
          </p>
          {error && (
            <p className="text-red-500 mt-4">{error}</p>
          )}
          {success && (
            <p className="text-green-500 mt-4">{success}</p>
          )}
          {uploading && (
            <p className="text-primary mt-4">Uploading...</p>
          )}
        </div>
      </div>
      
      <DatasetList 
        teamId={teamId} 
        chatbotId={chatbotId} 
        onDelete={() => setSuccess(null)} 
      />
    </div>
  );
}; 