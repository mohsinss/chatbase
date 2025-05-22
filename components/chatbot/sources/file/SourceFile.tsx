"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, Trash2, Plus, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

const SourceFile = (
  {
    teamId,
    chatbotId,
    chatbot,
    team,
    file
  }: {
    teamId: string;
    chatbotId: string;
    chatbot?: any;
    team?: any;
    file?: any;
  }
) => {
  const router = useRouter();
  console.log(file)

  const handleBack = () => {
    router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/sources`)
  }

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
        </div>
      </div>
      <div className="h-full w-full bg-zinc-50">
        <div className="mx-auto grid h-full max-w-7xl gap-4 p-6">
          <div className="rounded-lg border border-zinc-200 bg-white text-zinc-950 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 flex-1 overflow-auto break-words">
            <iframe className="p-6" width="100%" height='800px' src={file.url}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SourceFile;