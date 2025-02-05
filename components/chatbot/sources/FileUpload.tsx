"use client";

import { useState, useCallback, useEffect } from "react";
import { IconFile, IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { DatasetList } from "./DatasetList";
import toast from "react-hot-toast";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

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
    // Limit the number of files to 1
    if (acceptedFiles.length > 1) {
      toast.error("You can only upload one file at a time.");
      return;
    }

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
        if (file.size > 10245760) { // 10MB in bytes
          toast.error(`File size exceeds 10MB. Please upload a smaller file.`);
          return;
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileNameParts = file.name.split('.');
        const name = fileNameParts.slice(0, -1).join('.');
        const extension = fileNameParts.slice(-1)[0];
    
        // Insert the date between the name and extension
        const newFileName = `${name}-${Date.now()}.${extension}`;
    
        const key = `${datasetId}/${newFileName}`;
        let fileUrl;
    
        console.log("Uploading file to S3:", {
          bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
          key,
          contentType: file.type
        });
    
        try {
          await s3Client.send(
            new PutObjectCommand({
              Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
              Key: key,
              Body: file.slice(0, file.size, file.type),
              ContentType: file.type,
            })
          );
        } catch (s3Error) {
          console.error("S3 upload error:", s3Error);
          throw new Error(`S3 upload failed: ${s3Error.message}`);
        }

        // for testing url on localhost
        // fileUrl = 'https://proseo-images.s3.eu-west-1.amazonaws.com/319f9f97-dd40-49cf-93a2-c5ce3182d945/testimage-1738593058145.jpg';    
        fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;    

        const formData = new FormData();
        formData.append('fileName', file.name);
        formData.append('newFileName', newFileName);
        formData.append('fileUrl', fileUrl);
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
      
      setSuccess(`Successfully uploaded file`);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setUploading(false);
    }
  }, [chatbotId, teamId, datasetId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/PDF': ['.pdf', '.PDF'],
      'text/plain': ['.txt'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif']
    },
    // maxSize: 10245760, // 10MB
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
            Supported File Types: PDF, TXT, IMAGES
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