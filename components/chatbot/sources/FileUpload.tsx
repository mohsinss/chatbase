"use client";

import { useState, useCallback, useEffect } from "react";
import { IconFile, IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { DatasetList } from "./DatasetList";
import toast from "react-hot-toast";

interface FileUploadProps {
  teamId: string;
  chatbotId: string;
  totalChars: number;
  limitChars: number
  setFileCount: (value: number | ((prevState: number) => number)) => void;
  setFileChars: (value: number | ((prevState: number) => number)) => void;
  setFileSize: (value: number | ((prevState: number) => number)) => void;
}

export const FileUpload = ({ teamId, chatbotId, setFileSize, setFileCount, setFileChars, totalChars, limitChars }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [datasetId, setDatasetId] = useState<string | null>(null);

  useEffect(() => {
    const createDataset = async () => {
      try {
        const response = await fetch("/api/chatbot/sources/dataset", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatbotId,
            name: `Chatbot Dataset ${chatbotId}`
          }),
        });
  
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to create dataset");
        }
  
        const dataset = await response.json();
        console.log("Created/Retrieved dataset:", dataset); // Debug log
        setDatasetId(dataset.id);
        return dataset;
      } catch (err) {
        console.error("Dataset creation error:", err);
        throw err;
      }
    };

    createDataset();
  }, [])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log(datasetId)
    if( totalChars > limitChars && limitChars != 0 ) {
      toast.error(`Please udpate your plan, you can train your bot upto ${(limitChars/1000000).toFixed(1)}M characters.`)
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      if(!datasetId) return;
      for (const file of acceptedFiles) {
        console.log("Uploading file:", {
          fileName: file.name,
          fileType: file.type,
          datasetId
        }); // Debug log

        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        formData.append('datasetId', datasetId);
        formData.append('teamId', teamId);

        const response = await fetch("/api/chatbot/sources/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || `Failed to upload file: ${file.name}`);
        }

        const data = await response.json();
        console.log("Upload response:", data); // Debug log
      }
      
      setSuccess(`Successfully uploaded ${acceptedFiles.length} file(s)`);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setUploading(false);
    }
  }, [chatbotId, teamId, datasetId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // accept: {
    //   '*/*': ['.pdf', '.PDF'],
    //   // iOS-specific MIME type for PDFs
    //   'com.adobe.pdf': ['.pdf', '.PDF'],
    //   'text/plain': ['.txt'],
    //   // 'image/jpeg': ['.jpg', '.jpeg'],
    //   // 'image/png': ['.png'],
    //   // 'image/gif': ['.gif']
    // },
    getFilesFromEvent: (event) => {
      return new Promise((resolve) => {
        //@ts-ignore
        const files = Array.from(event.dataTransfer?.files || event.target.files || []);
        //@ts-ignore
        resolve(files.filter((file) => file.name.toLowerCase().endsWith('.pdf') || file.name.toLowerCase().endsWith('.txt')));
      });
    },
    maxSize: 40485760, // 10MB
  });

  return (
    <div>
      <div className={`rounded-lg p-8 border ${uploading ? 'bg-slate-200' : 'bg-while'}`}>
        <div {...getRootProps()} className="text-center cursor-pointer">
          <input {...getInputProps()} disabled={uploading}/>
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
            <p className="text-primary mt-4">
              <span className="loading loading-spinner loading-xs"></span>
              &nbsp;Uploading...
            </p>
          )}
        </div>
      </div>
      
      <DatasetList 
        teamId={teamId} 
        chatbotId={chatbotId} 
        datasetId={datasetId}
        uploading={uploading}
        setFileCount={setFileCount}
        setFileSize={setFileSize}
        setFileChars={setFileChars}
        onDelete={() => setSuccess(null)} 
      />
    </div>
  );
}; 