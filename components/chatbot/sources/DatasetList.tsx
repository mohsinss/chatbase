"use client";

import { useState, useEffect } from "react";
import { IconTrash, IconRefresh, IconFile, IconDownload } from "@tabler/icons-react";
import { TrieveSDK } from "trieve-ts-sdk";
import toast from "react-hot-toast";

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
  setFileChars: (value: number | ((prevState: number) => number)) => void;
  setFileSize: (value: number | ((prevState: number) => number)) => void;
  onDelete?: () => void;
}

export const DatasetList = ({ teamId, chatbotId, onDelete, datasetId, uploading, setFileCount, setFileSize, setFileChars }: DatasetListProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dFileId, setDFileId] = useState<string | null>(null);

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
      console.log(datasets.file_and_group_ids)
      // @ts-ignore
      const files = datasets.file_and_group_ids.filter(item => item.file.file_name != 'texttexttexttext.txt')
          //@ts-ignore
          .filter(item => item.file.file_name != 'texttexttexttextqa.txt')
          //@ts-ignore
          .filter(item => item.file.file_name != 'texttexttexttextlink.txt')
          //@ts-ignore
          .filter(item => !item.file.file_name.startsWith('pdftext-'));
      // @ts-ignore
      setFiles(files.map(item => item.file));
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
            "TR-Dataset": datasetId, // Use datasetId since it's guaranteed to be present
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
            "TR-Dataset": datasetId, // Use datasetId since it's guaranteed to be present
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
            "TR-Dataset": datasetId, // Use datasetId since it's guaranteed to be present
          }
        });

        // Check if the file deletion was successful
        if (!response.ok) {
          throw new Error(`Failed to delete file: ${response.statusText}`);
        }
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    setDeleting(true)
    setDFileId(fileId)

    try {
      const response = await fetch(`/api/chatbot/sources/file/${fileId}?datasetId=${datasetId}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed to delete file");

      await fetchFiles();
      onDelete?.();
      toast.success("file is successfully deleted.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete file");
      setError(err instanceof Error ? err.message : "Failed to delete file");
    } finally {
      setDeleting(false)
      setDFileId(null);
    }
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      if(!datasetId)
        return;
      // First get the dataset ID
      const fileResponse = await fetch("https://api.trieve.ai/api/file/"+fileId, {
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TRIEVE_API_KEY}`,
          "TR-Organization": process.env.NEXT_PUBLIC_TRIEVE_ORG_ID!,
          "TR-Dataset": datasetId,
        }
      });
      
      if (!fileResponse.ok) throw new Error("Failed to fetch datasets");
      
      const fileData = await fileResponse.json();

      if (fileData.s3_url) {
        try {
            // const response = await fetch(fileData.s3_url);
            
            // if (!response.ok) {
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }
    
            // const blob = await response.blob();
            // const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            // a.href = url;
            a.href = fileData.s3_url;
            a.download = fileName || 'download';
            document.body.appendChild(a);
            a.click();
            // window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download file");
    }
  };

  useEffect(() => {
    if(uploading)
      return;
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
                      Size: {Math.round(file.metadata.sizeInBytes / 1024)}KB • Created: {new Date(file.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownload(file.id, file.file_name)}
                    className="text-gray-600 hover:text-gray-900"
                    disabled={deleting}
                  >
                    <IconDownload className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={deleting}
                  >
                    {file.id==dFileId ? <span className="loading loading-spinner loading-xs"></span> :<IconTrash className="w-5 h-5" /> }
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