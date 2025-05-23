"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react"
import { IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button"
import DeleteDialog from "@/components/ui/deleteDialog";
import toast from "react-hot-toast";
import { Switch } from "@/components/ui/switch"

const ImageFile = (
  {
    teamId,
    chatbotId,
    chatbot,
    team,
    file,
    datasetId
  }: {
    teamId: string;
    chatbotId: string;
    chatbot?: any;
    team?: any;
    file?: any;
    datasetId: string;
  }
) => {
  const [deleting, setDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dFile, setDFile] = useState<any | null>(file);
  const [isImageView, setIsImageView] = useState<boolean>(false);
  const router = useRouter();

  const handleBack = () => {
    router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/sources?tab=images`)
  }

  const handleDelete = async () => {
    if (!dFile)
      return;
    setDeleting(true)

    try {
      const response = await fetch(`/api/chatbot/sources/file/${dFile._id}?datasetId=${datasetId}&trieveId=${dFile.trieveId}&chatbotId=${chatbotId}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed to delete file");
      handleBack();
      toast.success("file is successfully deleted.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete file");
    } finally {
      setDeleting(false)
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-1 basis-0 flex-col">
      <div className="border-zinc-200 border-b">
        <div className="mx-auto w-full max-w-7xl justify-between my-5 flex flex-col items-start gap-4 px-6 md:flex-row md:items-center">
          <div className="flex max-w-full flex-col items-start gap-4 truncate md:flex-row md:items-center">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h4 className="font-semibold max-w-full truncate whitespace-pre-wrap text-2xl">
              <span className="capitalize">{file?.name}</span>
            </h4>
            <div
              className={`focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-950 whitespace-nowrap flex items-center justify-center select-none font-medium border transition-colors rounded-full flex-shrink-0 px-1.5 py-0.5 text-xs shadow-none ${file.trained ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100 dark:border-zinc-800 dark:focus:ring-zinc-300 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/80' : 'focus:ring-zinc-950 focus:ring-offset-2 dark:border-zinc-800 dark:focus:ring-zinc-300 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/80 bg-red-50 text-red-600 border-red-300 hover:bg-red-100'}`}>
              <span className="w-full truncate text-center">{file.trained ? 'Trained' : 'Not Trained'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              Text/Image
              <Switch
                checked={isImageView}
                onCheckedChange={(enabled) => setIsImageView(enabled)}
              />
            </div>

            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="inline-flex items-center justify-center whitespace-nowrap font-thin focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 border bg-transparent dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 p-2 h-7 rounded-md border-red-200 text-red-400 text-xs transition-colors disabled:border-red-400 hover:border-red-400 disabled:bg-red-500/10 hover:bg-red-500/10 disabled:text-red-300 hover:text-red-300">
              <IconTrash className="text-red-400" />
            </button>
          </div>
        </div>
      </div>
      <div className="h-full w-full bg-zinc-50">
        <div className="mx-auto grid h-full max-w-7xl gap-4 p-6">
          <div className="rounded-lg border border-zinc-200 bg-white text-zinc-950 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 flex-1 overflow-auto break-words">
            {
              !isImageView &&
              <div className="p-6 w-full h-[800px]">
                {file.text}
              </div>
            }
            {
              isImageView && 
               <iframe className="p-6" width="100%" height='800px' src={file.url} />
            }
          </div>
        </div>
      </div>
      <DeleteDialog
        title={"Delete a file"}
        description={'Are you sure to delete this file?'}
        isDeleting={deleting}
        onClose={() => setIsDeleteDialogOpen(false)}
        isOpen={isDeleteDialogOpen}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default ImageFile;