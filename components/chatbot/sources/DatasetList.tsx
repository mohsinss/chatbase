"use client";

import { useState, useEffect } from "react";
import { IconTrash, IconRefresh, IconFile, IconDownload } from "@tabler/icons-react";
import { TrieveSDK } from "trieve-ts-sdk";

interface File {
  id: string;
  file_name: string;
  created_at: string;
  size: number;
  metadata?: any;
}

interface DatasetListProps {
  teamId: string;
  chatbotId: string;
  datasetId: string;
  uploading: boolean;
  setFileCount: (value: number | ((prevState: number) => number)) => void;
  setFileSize: (value: number | ((prevState: number) => number)) => void;
  onDelete?: () => void;
}

export const DatasetList = ({ teamId, chatbotId, onDelete, datasetId, uploading, setFileCount, setFileSize }: DatasetListProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      if(!datasetId)
        return;
      // First get the dataset ID
      const datasetsResponse = await fetch("https://api.trieve.ai/api/dataset/files/"+datasetId+"/1", {
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TRIEVE_API_KEY}`,
          "TR-Organization": process.env.NEXT_PUBLIC_TRIEVE_ORG_ID!,
          "TR-Dataset": datasetId,
        }
      });
      
      if (!datasetsResponse.ok) throw new Error("Failed to fetch datasets");
      
      const datasets = await datasetsResponse.json();
      
      // @ts-ignore
      setFiles(datasets.file_and_group_ids.map(item => item.file));
      setFileCount(datasets.file_and_group_ids.length);
      // @ts-ignore
      setFileSize(datasets.file_and_group_ids.reduce((size, file) => {
        return size + file.size;
      }, 0.0));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const response = await fetch(`https://api.trieve.ai/api/file/${fileId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TRIEVE_API_KEY}`,
          "TR-Organization": process.env.NEXT_PUBLIC_TRIEVE_ORG_ID!,
          "TR-Dataset": datasetId,
        }
      });

      if (!response.ok) throw new Error("Failed to delete file");

      await fetchFiles();
      onDelete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete file");
    }
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const trieve = new TrieveSDK({
        apiKey: process.env.NEXT_PUBLIC_TRIEVE_API_KEY!,
        organizationId: process.env.NEXT_PUBLIC_TRIEVE_ORG_ID!
      });

      const fileData = await trieve.getFile({
        fileId
      });

      // Download using the signed URL
      if (fileData.s3_url) {
        const response = await fetch(fileData.s3_url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download file");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [chatbotId, datasetId, uploading]);

  if (loading) return <div className="text-center py-4">Loading files...</div>;
  if (error) return <div className="text-red-500 py-4">{error}</div>;

  return (
    <div className="mt-8">
        
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Uploaded Files</h2>
        <button
          onClick={() => fetchFiles()}
          className="text-gray-600 hover:text-gray-900"
        >
          <IconRefresh className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white rounded-lg border">
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No files uploaded yet
          </div>
        ) : (
          <div className="divide-y">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <IconFile className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium">{file.file_name}</div>
                    <div className="text-sm text-gray-500">
                      Size: {Math.round(file.size / 1024)}KB • Created: {new Date(file.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownload(file.id, file.file_name)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <IconDownload className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <IconTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 