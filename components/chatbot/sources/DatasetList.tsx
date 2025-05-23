"use client";

import React from "react";
import { useState, useEffect } from "react";
import {
  IconTrash,
  IconRefresh,
  IconFile,
  IconDownload,
  IconEye,
  IconImageInPicture,
  IconFileTypePdf,
  IconFileTypeTxt,
  IconFileTypeDoc,
  IconFileTypeDocx,
  IconFileTypeBmp,
  IconFileTypeJpg,
  IconFileTypePng,
  IconChevronRight,
  IconChevronDown,
  IconSearch,
  IconLoader2,
} from "@tabler/icons-react";
import { formatFileSize } from "@/lib/utils";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import DeleteDialog from "@/components/ui/deleteDialog";

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
  onlyImages: boolean;
  setFileCount: (value: number | ((prevState: number) => number)) => void;
  setFileChars: (value: number | ((prevState: number) => number)) => void;
  onDelete?: () => void;
}

export const DatasetList = ({
  teamId,
  chatbotId,
  datasetId,
  uploading,
  onlyImages,
  onDelete,
  setFileCount,
  setFileChars,
}: DatasetListProps) => {
  const [files, setFiles] = useState<IFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dFile, setDFile] = useState<IFile | null>(null);
  const [pendingFiles, setPendingFiles] = useState(true);
  const [selectedViewFileId, setSelectedViewFileId] = useState<string | null>(null);
  const [selectedViewTextId, setSelectedViewTextId] = useState<string | null>(null);
  const [fileText, setFileText] = useState<string | null>(null);
  // New state for selection
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
  // New state for sort option
  const [sortOption, setSortOption] = useState<string>("Default");
  // New state for search query
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteDialogOpen1, setIsDeleteDialogOpen1] = useState(false);
  const [deleteDialogTitle, setDeleteDialogTitle] = useState('Delete file(s)');
  const [deleteDialogDescription, setDeleteDialogDescription] = useState('Are you sure to delete file(s)?');

  const router = useRouter();

  const handleViewFile = (fileId: string, fileUrl: string) => {
    if (onlyImages)
      return;
    router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/sources/${fileId}`)
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return <IconFileTypePdf className="w-10 h-10 text-gray-400" />;
      case 'txt':
        return <IconFileTypeTxt className="w-10 h-10 text-gray-400" />;
      case 'doc':
        return <IconFileTypeDoc className="w-10 h-10 text-gray-400" />;
      case 'docx':
        return <IconFileTypeDocx className="w-10 h-10 text-gray-400" />;
      case 'bmp':
        return <IconFileTypeBmp className="w-10 h-10 text-gray-400" />;
      case 'jpg':
      case 'jpeg':
        return <IconFileTypeJpg className="w-10 h-10 text-gray-400" />;
      case 'png':
        return <IconFileTypePng className="w-10 h-10 text-gray-400" />;
      default:
        return <IconFile className="w-10 h-10 text-gray-400" />;
    }
  };

  // Handler to toggle selection of a single file
  const toggleFileSelection = (fileId: string) => {
    setSelectedFileIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  // Handler to toggle select all files
  const toggleSelectAll = () => {
    if (selectedFileIds.size === files.length) {
      setSelectedFileIds(new Set());
    } else {
      setSelectedFileIds(new Set(files.map(f => f._id)));
    }
  };

  // Handler for multi-delete
  const handleDeleteSelected = async () => {
    if (selectedFileIds.size === 0) return;

    setDeleting(true);
    const totalFiles = selectedFileIds.size;
    let deletedCount = 0;
    const toastId = toast.loading(`Deleting 0 of ${totalFiles} file(s)...`, { duration: Infinity });
    try {
      for (const fileId of Array.from(selectedFileIds)) {
        const file = files.find(f => f._id === fileId);
        if (!file) continue;
        const response = await fetch(`/api/chatbot/sources/file/${fileId}?datasetId=${datasetId}&trieveId=${file.trieveId}&chatbotId=${chatbotId}`, {
          method: "DELETE"
        });
        if (!response.ok) throw new Error(`Failed to delete file ${file.name}`);
        deletedCount++;
        toast.loading(`Deleting ${deletedCount} of ${totalFiles} file(s)...`, { id: toastId });
      }
      await fetchFiles();
      setSelectedFileIds(new Set());
      onDelete?.();
      toast.success(`${totalFiles} file(s) successfully deleted.`, { id: toastId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete selected files", { id: toastId });
      setError(err instanceof Error ? err.message : "Failed to delete selected files");
    } finally {
      toast.dismiss(toastId);
      setDeleting(false);
      setIsDeleteDialogOpen1(false);
    }
  };

  // Handler for multi-restore (placeholder)
  const handleRestoreSelected = () => {
    if (selectedFileIds.size === 0) return;
    toast.success(`${selectedFileIds.size} file(s) restored (placeholder).`);
    // Implement restore logic if applicable
  };

  const fetchFiles = async () => {
    try {
      if (!datasetId)
        return;
      setLoading(true);

      const response = await fetch(`/api/chatbot/sources/dataset?chatbotId=${chatbotId}`);

      if (!response.ok) throw new Error("Failed to fetch file");

      const data = await response.json();
      console.log(data);

      if (data.files) {
        if (onlyImages) {
          // @ts-ignore
          const filteredFile = data.files.filter(file => !(file.name.endsWith('.txt') || file.name.endsWith('.pdf')));
          // @ts-ignore
          setFiles([...filteredFile]);
          setFileCount(filteredFile.length);
          //@ts-ignore
          setFileChars(filteredFile.reduce((size, file) => {
            return size + file.charCount;
          }, 0))
        } else {
          // @ts-ignore
          const filteredFile = data.files.filter(file => (file.name.endsWith('.txt') || file.name.endsWith('.pdf')));
          // @ts-ignore
          setFiles([...filteredFile]);
          setFileCount(filteredFile.length);
          //@ts-ignore
          setFileChars(filteredFile.reduce((size, file) => {
            return size + file.charCount;
          }, 0))
          // @ts-ignore
          // setPendingFiles(filteredFile.some(file => file.status !== "Completed"));
        }
      }

    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch files");
      setError(err instanceof Error ? err.message : "Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!dFile)
      return;
    setDeleting(true)

    try {
      const response = await fetch(`/api/chatbot/sources/file/${dFile._id}?datasetId=${datasetId}&trieveId=${dFile.trieveId}&chatbotId=${chatbotId}`, {
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
      setDFile(null);
      setIsDeleteDialogOpen(false);
    }
  };

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

    if (fileName.endsWith(".txt") || fileName.endsWith(".pdf")) {
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

  if (error) return <div className="text-red-500 py-4">{error}</div>;

  return (
    <div className="mt-8">
      <div className="bg-white rounded-lg border divide-y">
        <div className="p-6 pb-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{onlyImages ? 'Image' : 'File'} Sources</h2>
            <div className="relative flex items-center space-x-2 flex-grow max-w-xs">
              <span className="absolute left-3 text-gray-400 pointer-events-none">
                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
                  </svg> */}
                <IconSearch className="h-4 w-4 ml-2" />
              </span>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input py-2 text-sm ring-offset-background disabled:cursor-not-allowed file:border-0 file:bg-transparent file:font-medium file:text-sm disabled:opacity-50 focus:outline-none focus-visible:ring-ring focus:ring-violet-500/10 bg-white text-zinc-900 focus:border-zinc-400 placeholder:text-zinc-400 focus-visible:ring-0 focus:ring-0 px-8"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label="Clear search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={() => fetchFiles()}
              className="text-gray-600 hover:text-gray-900 hidden"
            >
              <IconRefresh className="w-5 h-5" />
            </button>
          </div>
          {/* Add Select All checkbox */}
          {
            files.length > 0 &&
            <div className="flex justify-between items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedFileIds.size === files.length && files.length > 0}
                  onChange={toggleSelectAll}
                  id="select-all-checkbox"
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="select-all-checkbox" className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Select all</label>
              </div>
              <div className="flex items-center space-x-2">
                <span className="hidden shrink-0 text-sm text-zinc-600 tracking-tighter md:inline">Sort by:</span>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger className="flex h-10 items-center justify-between rounded-md border border-zinc-900/10 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 disabled:opacity-50 focus:outline-none w-44 border-none focus:bg-zinc-50 hover:bg-zinc-50 focus:ring-0">
                    {(() => {
                      switch (sortOption) {
                        case "Status":
                          return "Status";
                        case "Newest":
                          return "Newest";
                        case "Oldest":
                          return "Oldest";
                        case "AlphabeticalAsc":
                          return "Alphabetical (A-Z)";
                        case "AlphabeticalDesc":
                          return "Alphabetical (Z-A)";
                        case "Default":
                        default:
                          return "Default";
                      }
                    })()}
                    <IconChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent sideOffset={0} align="start">
                    <DropdownMenuItem
                      onClick={() => setSortOption("Default")}
                    >
                      Default
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("Status")}
                    >
                      Status
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("Newest")}
                    >
                      Newest
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("Oldest")}
                    >
                      Oldest
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("AlphabeticalAsc")}
                    >
                      Alphabetical (A-Z)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOption("AlphabeticalDesc")}
                    >
                      Alphabetical (Z-A)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          }
        </div>
        <div
          style={{ height: selectedFileIds.size > 0 ? '50px' : '0px' }}
          className={`overflow-hidden transition-all flex flex-col items-start justify-between gap-2 bg-zinc-50 px-6 md:flex-row md:items-center`}>
          <p className="font-medium text-sm text-zinc-700"> {selectedFileIds.size} item{selectedFileIds.size > 1 && "s"} on this page is selected</p>
        </div>
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {loading ? "Loading files..." : "No files uploaded yet"}
          </div>
        ) : (
          (() => {
            let filteredFiles = files.filter(file =>
              file.name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            let sortedFiles = [...filteredFiles];
            switch (sortOption) {
              case "Status":
                sortedFiles.sort((a, b) => a.status.localeCompare(b.status));
                break;
              case "Newest":
                // Sort by _id descending (MongoDB ObjectId contains timestamp)
                sortedFiles.sort((a, b) => b._id.localeCompare(a._id));
                break;
              case "Oldest":
                // Sort by _id ascending
                sortedFiles.sort((a, b) => a._id.localeCompare(b._id));
                break;
              case "AlphabeticalAsc":
                sortedFiles.sort((a, b) => a.name.localeCompare(b.name));
                break;
              case "AlphabeticalDesc":
                sortedFiles.sort((a, b) => b.name.localeCompare(a.name));
                break;
              case "Default":
              default:
                // No sorting or original order
                break;
            }
            return sortedFiles.map((file, index) => (
              <div
                onClick={() => handleViewFile(file._id, file.url)}
                key={`file-${file._id}-${index}`}
                className="cursor-pointer">
                <div
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    {/* Add checkbox for each file */}
                    <input
                      type="checkbox"
                      checked={selectedFileIds.has(file._id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleFileSelection(file._id);
                      }}
                      onClick={e => e.stopPropagation()}
                      className="w-4 h-4 cursor-pointer"
                      id={`checkbox-${file._id}`}
                    />
                    {getFileIcon(file.name)}
                    <div>
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap font-medium text-sm text-zinc-800 pb-1">{file.name}</div>
                      <div className="text-sm text-gray-500 flex gap-2 items-center">
                        <div
                          className={`focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-950 whitespace-nowrap flex items-center justify-center select-none font-medium border transition-colors rounded-full flex-shrink-0 px-1.5 py-0.5 text-xs shadow-none ${file.trained ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100 dark:border-zinc-800 dark:focus:ring-zinc-300 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/80' : 'focus:ring-zinc-950 focus:ring-offset-2 dark:border-zinc-800 dark:focus:ring-zinc-300 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/80 bg-red-50 text-red-600 border-red-300 hover:bg-red-100'}`}>
                          <span className="w-full truncate text-center">{file.trained ? 'Trained' : 'Not Trained'}</span>
                        </div>
                        <div className="w-[160px] flex text-xs text-zinc-700">
                          {file.status != "Completed" ?
                            <>
                              <span className="my-auto loading loading-spinner loading-xs mr-2">
                              </span> {file.status}
                            </> :
                            formatFileSize(file.charCount)
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
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
                      className={`text-gray-600 hover:text-gray-900 ${onlyImages ? "" : "hidden"}`}
                      disabled={deleting}
                    >
                      <IconEye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDFile(file);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="text-red-500 hover:text-red-700 flex"
                      disabled={deleting}
                    >
                      {file._id == dFile?._id ? <span className="my-auto loading loading-spinner loading-xs"></span> : <IconTrash stroke={1} className="w-5 h-5" />}
                    </button>
                    <button
                      // onClick={() => handleDownload(file.url, file.name)}
                      className="text-gray-600 hover:text-gray-900"
                      disabled={deleting}>
                      <IconChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {selectedViewFileId && selectedViewFileId == file._id && file.url && !/\.(jpe?g|png|gif|bmp|svg)$/i.test(file.url) && (
                  <iframe src={file.url} width="100%" height="500px" key={`iframe-${file._id}-${index}`}></iframe>
                )}
                {selectedViewFileId && selectedViewFileId == file._id && file.url && /\.(jpe?g|png|gif|bmp|svg)$/i.test(file.url) && (
                  // Use an img tag to display the image
                  <img src={file.url} alt={file.name} style={{ width: "100%", maxHeight: "500px" }} key={`img-${file._id}-${index}`} />
                )}
                {selectedViewTextId && selectedViewTextId == file._id && (
                  <div className="w-full max-h-[500px] overflow-hidden overflow-y-auto p-4" key={`div-${file._id}-${index}`}>{fileText}</div>
                )}
              </div>
            ))
          })()
        )}
      </div>
      {/* Bottom bar for selection actions */}
      {selectedFileIds.size > 0 && (
        <div className="-translate-x-1/2 fixed bottom-10 left-[50%] z-50 w-fit rounded-md bg-zinc-950 p-2 text-zinc-50">
          <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-center gap-2 md:gap-4">
            <span className="px-2 text-xs">{selectedFileIds.size} selected</span>
            <div className="shrink-0 w-[1px] hidden h-4 bg-zinc-700 md:block"></div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsDeleteDialogOpen1(true)}
                className="inline-flex items-center justify-center whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 border bg-transparent dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 px-4 py-1 h-7 rounded-md border-zinc-700 text-red-400 text-xs transition-colors disabled:border-red-400 hover:border-red-400 disabled:bg-red-500/10 hover:bg-red-500/10 disabled:text-red-300 hover:text-red-300"
                disabled={deleting}
              >
                {
                  deleting ?
                    <><IconLoader2 className="w-3 h-3 animate-spin mr-1" />Deleting...</>
                    :
                    <><IconTrash className="w-3 h-3 mr-1" />Delete</>
                }
              </button>
              <button
                onClick={handleRestoreSelected}
                className="hidden inline-flex items-center justify-center whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 border bg-transparent dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 px-4 py-1 h-7 rounded-md border-zinc-700 text-green-400 text-xs transition-colors disabled:border-green-400 hover:border-green-400 disabled:bg-green-500/10 hover:bg-green-500/10 disabled:text-green-300 hover:text-green-300"
              >
                <IconRefresh className="w-3 h-3 mr-1" /> Restore
              </button>
            </div>
          </div>
        </div>
      )}
      {/* for single deletion */}
      <DeleteDialog
        title={deleteDialogTitle}
        description={deleteDialogDescription}
        isDeleting={deleting}
        onClose={() => setIsDeleteDialogOpen(false)}
        isOpen={isDeleteDialogOpen}
        onDelete={handleDelete}
      />
      {/* for multi deletion */}
      <DeleteDialog
        title={deleteDialogTitle}
        description={deleteDialogDescription}
        isDeleting={deleting}
        onClose={() => setIsDeleteDialogOpen1(false)}
        isOpen={isDeleteDialogOpen1}
        onDelete={handleDeleteSelected}
      />
    </div>
  );
};
