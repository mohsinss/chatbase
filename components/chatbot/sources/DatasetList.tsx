"use client";

import { useState, useEffect } from "react";
import { IconTrash, IconRefresh, IconFile, IconDownload, IconEye, IconImageInPicture, IconPdf } from "@tabler/icons-react";
import { TrieveSDK } from "trieve-ts-sdk";
import toast from "react-hot-toast";
import { setLazyProp } from "next/dist/server/api-utils";

interface IFile {
  trieveId: string;
  trieveTaskId: string;
  url: string;
  name: string;
  text: string;
  charCount: number;
  status: string;
  trained: boolean;
  _id: string;
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
  const [files, setFiles] = useState<IFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dFileId, setDFileId] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState(true);
  // const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [selectedViewFileId, setSelectedViewFileId] = useState<string | null>(null);
  const [selectedViewTextId, setSelectedViewTextId] = useState<string | null>(null);
  const [fileText, setFileText] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      if (!datasetId)
        return;
      // setLoading(true);

      const response = await fetch(`/api/chatbot/sources/dataset?chatbotId=${chatbotId}`);

      if (!response.ok) throw new Error("Failed to fetch file");

      const data = await response.json();
      console.log(data);

      if (data.files) {
        // @ts-ignore
        setFiles(data.files);
        setFileCount(data.files.length);
        //@ts-ignore
        setFileChars(data.files.reduce((size, file) => {
          return size + file.charCount;
        }, 0))
        // @ts-ignore
        setPendingFiles(data.files.some(file => file.status !== "Completed"));
      }

    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch files");
      setError(err instanceof Error ? err.message : "Failed to fetch files");
    } finally {
      setLoading(false);
    }

    // // @ts-ignore
    // setFiles(files.map(item => item.file));
    // setFileCount(files.length);
    // // @ts-ignore
    // setFileChars(files.reduce((size, file) => {
    //   return size + file.file.metadata.sizeInCharacters;
    // }, 0));
  };

  const handleDelete = async (fileId: string, trieveId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    setDeleting(true)
    setDFileId(fileId)

    try {
      const response = await fetch(`/api/chatbot/sources/file/${fileId}?datasetId=${datasetId}&trieveId=${trieveId}&chatbotId=${chatbotId}`, {
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

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      if (fileUrl) {
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = fileName || 'download';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }

      // fetch(fileUrl, { mode: 'no-cors' })
      //   .then(response => response.blob())
      //   .then(blob => {
      //     const a = document.createElement('a');
      //     a.href = URL.createObjectURL(blob);
      //     a.download = fileName;
      //     document.body.appendChild(a);
      //     a.click();
      //     document.body.removeChild(a);
      //     URL.revokeObjectURL(a.href); // Clean up the object URL
      //   })
      //   .catch(error => console.error('Error downloading file:', error));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download file");
    }
  };

  const handleViewPDF = (fileId: string, fileUrl: string) => {
    if (fileId == selectedViewFileId) {
      setSelectedViewFileId(null);
    } else {
      setSelectedViewFileId(fileId);
    }

    setSelectedViewTextId(null);
  }

  const handleViewImage = (fileId: string, fileUrl: string) => {
    if (fileId == selectedViewFileId) {
      setSelectedViewFileId(null);
    } else {
      setSelectedViewFileId(fileId);
    }

    setSelectedViewTextId(null);
  }

  const handleViewText = async (fileId: string, fileName: string, fileStatus: string, trieveTaskId: string) => {
    if (fileStatus != "Completed") {
      toast.error("You can't view text until the status is completed.")
      return;
    }

    if (fileName.endsWith(".txt")) {
      if (fileId == selectedViewFileId) {
        setSelectedViewFileId(null);
      } else {
        setSelectedViewFileId(fileId);
      }

      setSelectedViewTextId(null);
    } else {
      if (fileId == selectedViewTextId) {
        setSelectedViewTextId(null);
      } else {
        setSelectedViewTextId(fileId);
      }

      setSelectedViewFileId(null);

      let text = '';

      try {
        const resp = await fetch(
          `https://pdf2md.trieve.ai/api/task/${trieveTaskId}?limit=1000`,
          {
            headers: {
              Authorization: process.env.NEXT_PUBLIC_TRIEVE_PDF2MD_API_KEY,
            },
          }
        );

        if (!resp.ok) throw new Error("Failed to fetch task");

        const data = await resp.json();

        if (data.pages) {
          //@ts-ignore
          data.pages.forEach(page => {
            text += page.content + "\n";
          });
        }
      } catch (err) {
        // Handle the error
        toast.error(err instanceof Error ? err.message : "An error occurred while updating files");
        // setError(err instanceof Error ? err.message : "An error occurred while updating files");
      }

      setFileText(text);
    }
  }

  useEffect(() => {
    if (uploading)
      return;
    fetchFiles();
  }, [chatbotId, datasetId, uploading]);

  useEffect(() => {

    const updateFiles = async () => {
      try {
        if (!files || files.length === 0) return;
        if (!pendingFiles) return;

        let shouldUpdate = false;

        const newFiles = [...files];
        console.log(newFiles)
        for (let i = 0; i < newFiles.length; i++) {
          if (newFiles[i].status !== "Completed" && newFiles[i].trieveTaskId) {
            const resp = await fetch(
              `https://pdf2md.trieve.ai/api/task/${newFiles[i].trieveTaskId}`,
              {
                headers: {
                  Authorization: process.env.NEXT_PUBLIC_TRIEVE_PDF2MD_API_KEY,
                },
              }
            );

            if (!resp.ok) throw new Error("Failed to fetch task");

            const data = await resp.json();

            // Calculate the total charCount from the content of each page
            let charCount = 0;
            let text = "";

            if (data.status == "Completed") {
              const resp = await fetch(
                `https://pdf2md.trieve.ai/api/task/${newFiles[i].trieveTaskId}?limit=1000`,
                {
                  headers: {
                    Authorization: process.env.NEXT_PUBLIC_TRIEVE_PDF2MD_API_KEY,
                  },
                }
              );

              if (!resp.ok) throw new Error("Failed to fetch task");

              const data = await resp.json();

              if (data.pages) {
                //@ts-ignore
                data.pages.forEach(page => {
                  charCount += page.content.length;
                  text += page.content + "\n";
                });
              }
              // Update the file with the new data and charCount
              newFiles[i].charCount = charCount;
            }

            console.log(data.status, newFiles[i].status)

            if (data.status != newFiles[i].status) {

              // Update the status of the file
              newFiles[i].status = data.status;
              shouldUpdate = true;

              // Send a PUT request to update the file in the dataset
              const updateResp = await fetch(`/api/chatbot/sources/file/${newFiles[i]._id}?datasetId=${datasetId}`, {
                method: "PUT",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  charCount,
                  status: data.status,
                })
              });

              if (!updateResp.ok) throw new Error("Failed to update file in dataset");

              const updatedDataset = await updateResp.json();
              console.log(updatedDataset);
            }

            // Update the state with the new files array
            // setFiles(newFiles);
          }
        }

        // Wait for 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));

        // if (shouldUpdate) {
        await fetchFiles();
        // }

        // Check if there are any files with status not completed
        setPendingFiles(newFiles.some(file => file.status !== "Completed" && file.trieveTaskId));
      } catch (err) {
        // Handle the error
        toast.error(err instanceof Error ? err.message : "An error occurred while updating files");
        setError(err instanceof Error ? err.message : "An error occurred while updating files");
      }
    }

    updateFiles();

    // const intervalId = setInterval(updateFiles, 10000);

    // return () => clearInterval(intervalId); // Clear the interval when the component unmounts
  }, [files, pendingFiles]);

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
              <>
                <div
                  key={`file-${file._id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <IconFile className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-gray-500">
                        <span>{file.status != "Completed" ?
                          <><span className="my-auto loading loading-spinner loading-xs"></span> {file.status}</> : file.charCount + ' chars'}</span>
                        <span className={`rounded-md p-1 text-sm ml-5 text-black ${file.trained ? 'bg-green-300' : 'bg-red-300'}`}>{file.trained ? 'Trained' : 'Not Trained'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {file.name.endsWith('.pdf') &&
                      <button
                        onClick={() => handleViewPDF(file._id, file.url)}
                        className="text-gray-600 hover:text-gray-900"
                        disabled={deleting}
                      >
                        <IconPdf className="w-5 h-5" />
                      </button>
                    }
                    {!file.name.endsWith('.pdf') && !file.name.endsWith('.txt') &&
                      <button
                        onClick={() => handleViewImage(file._id, file.url)}
                        className="text-gray-600 hover:text-gray-900"
                        disabled={deleting}
                      >
                        <IconImageInPicture className="w-5 h-5" />
                      </button>
                    }
                    <button
                      onClick={() => handleViewText(file._id, file.name, file.status, file.trieveTaskId)}
                      className="text-gray-600 hover:text-gray-900"
                      disabled={deleting}
                    >
                      <IconEye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(file._id, file.trieveId)}
                      className="text-red-500 hover:text-red-700 flex"
                      disabled={deleting}
                    >
                      {file._id == dFileId ? <span className="my-auto loading loading-spinner loading-xs"></span> : <IconTrash className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {selectedViewFileId && selectedViewFileId == file._id && file.url && !/\.(jpe?g|png|gif|bmp|svg)$/i.test(file.url) && (
                  <iframe src={file.url} width="100%" height="500px"></iframe>
                )}
                {selectedViewFileId && selectedViewFileId == file._id && file.url && /\.(jpe?g|png|gif|bmp|svg)$/i.test(file.url) && (
                  // Use an img tag to display the image
                  <img src={file.url} alt={file.name} style={{ width: "100%", maxHeight: "500px" }} />
                )}
                {selectedViewTextId && selectedViewTextId == file._id && (
                  <div className="w-full max-h-[500px] overflow-hidden overflow-y-auto p-4">{fileText}</div>
                )}
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 