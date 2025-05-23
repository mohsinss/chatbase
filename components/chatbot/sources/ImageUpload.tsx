"use client";

import { useState, useCallback, useEffect } from "react";
import { IconFile, IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { DatasetList } from "./DatasetList";
import toast from "react-hot-toast";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
// import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js';
import worker from 'pdfjs-dist/build/pdf.worker.entry.js';

GlobalWorkerOptions.workerSrc = worker;

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

interface ImageUploadProps {
  teamId: string;
  chatbotId: string;
  totalChars: number;
  limitChars: number
  setFileCount: (value: number | ((prevState: number) => number)) => void;
  setFileChars: (value: number | ((prevState: number) => number)) => void;
}

export const ImageUpload = ({ teamId, chatbotId, setFileCount, setFileChars, totalChars, limitChars }: ImageUploadProps) => {
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
    if(uploading) return;
    
    // Limit the number of files to 1
    if (acceptedFiles.length > 1) {
      toast.error("You can only upload one file at a time.");
      return;
    }

    if (totalChars > limitChars && limitChars != 0) {
      toast.error(`Please udpate your plan, you can train your bot upto ${(limitChars / 1000000).toFixed(1)}M characters.`)
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!datasetId) return;
      await Promise.all(acceptedFiles.map(async (file) => {
        if (file.size > 15245760) { // 15MB in bytes
          toast.error(`File size exceeds 15MB. Please upload a smaller file.`);
          return;
        }

        let buffer = Buffer.from(await file.arrayBuffer());
        const fileNameParts = file.name.split('.');
        const name = fileNameParts.slice(0, -1).join('.');
        const extension = fileNameParts.slice(-1)[0];
        let extractedText = '';
        if (file.type === 'application/pdf') {
          try {
            const loadingToastId = toast.loading('Loading PDF...');
            const loadingTask = getDocument({ data: buffer });
            const pdfDocument = await loadingTask.promise;

            const totalPages = pdfDocument.numPages;
            toast.dismiss(loadingToastId);

            let currentPage = 1;

            const pageTexts: string[] = [];

            for (currentPage = 1; currentPage <= totalPages; currentPage++) {
              const page = await pdfDocument.getPage(currentPage);
              const textContent = await page.getTextContent();
              const pageText = textContent.items.map((item: any) => ('str' in item ? item.str : '')).join(' ');
              pageTexts.push(`\nPage ${currentPage}:\n\n${pageText}\n`);

              // Re-render toast to show updated page number
              toast.dismiss('pdf-progress');
              toast.custom(() => (
                <div className="bg-white p-4 rounded shadow-lg w-72 text-sm border">
                  <strong className="block mb-2">Extracting PDF</strong>
                  <p className="text-gray-600">Page {currentPage} of {totalPages}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                    <div
                      className="bg-blue-500 h-2 transition-all duration-200 ease-out"
                      style={{ width: `${(currentPage / totalPages) * 100}%` }}
                    />
                  </div>
                </div>
              ), { id: 'pdf-progress', duration: Infinity });

              await new Promise((r) => setTimeout(r, 30));
            }

            toast.dismiss('pdf-progress');
            await new Promise((r) => setTimeout(r, 100));
            toast.success(`Extracted ${totalPages} pages successfully`);
            await new Promise((r) => setTimeout(r, 500));

            const extractedText = pageTexts.join('');
            console.log("Extracted text:", Buffer.from(extractedText, 'utf8').toString('utf8')); // Debug log
            buffer = Buffer.from(extractedText, 'utf8');
          } catch (err) {
            console.error("PDF extraction error:", err);
            toast.dismiss();
            toast.error("❌ Failed to extract text from PDF");
          } finally {
          }
        }

        const loadingToastId = toast.loading('Uploading File...', { duration: Infinity });
        // Insert the date between the name and extension
        const newFileName = `${name}-${Date.now()}.${extension}`;

        const key = `${datasetId}/${newFileName}`;
        let fileUrl;

        console.log("Uploading file to S3:", {
          bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
          key,
          contentType: file.type === 'application/pdf' ? 'text/plain' : file.type,
        });

        try {
          await s3Client.send(
            new PutObjectCommand({
              Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
              Key: key,
              Body: buffer,
              ContentType: file.type === 'application/pdf' ? 'text/plain;charset=utf-8' : file.type,
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
        if (extractedText) {
          formData.append('extractedText', extractedText);
        }

        const response = await fetch("/api/chatbot/sources/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || `Failed to upload a image: ${file.name}`);
        }

        const data = await response.json();
        console.log("Upload response:", data); // Debug log
      }));
      toast.dismiss();
      setSuccess(`Successfully uploaded image`);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload a image");
    } finally {
      setUploading(false);
    }
  }, [chatbotId, teamId, datasetId, totalChars]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      // 'application/pdf': ['.pdf', '.PDF'],
      // 'text/plain': ['.txt'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif']
    },
    // maxSize: 15245760, // 15MB
  });

  return (
    <div>
      <div className={`rounded-lg p-6 border bg-white`}>
        <h2 className="text-2xl font-semibold mb-4">Images</h2>
        <div {...getRootProps()} className="text-center p-16 cursor-pointer rounded-md border border-zinc-300 border-dashed bg-zinc-50">
          <input {...getInputProps()} disabled={uploading} />
          <div className="flex justify-center mb-4">
              <IconUpload className={`w-12 h-12 text-gray-400 ${uploading ? "animate-pulse" : ""}`} />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {isDragActive
              ? "Drop the image here"
              : "Drag & drop image here, or click to select image"}
          </h3>
          <p className="text-gray-500 mb-4">
            Supported File Types: IMAGES
          </p>
          <p className="text-gray-500">
            Maximum file size: 200MB
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
        setFileChars={setFileChars}
        onDelete={() => setSuccess(null)}
        onlyImages={true}
      />
    </div>
  );
};
