"use client";

import { useState } from "react";
import { IconUpload } from "@tabler/icons-react";

const FileUpload = () => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle the files
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // At least one file has been dropped
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    // Handle file upload logic here
    console.log("Files to upload:", files);
  };

  return (
    <div className="flex-1 p-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? "border-primary bg-primary/5" : "border-base-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-base-200 rounded-full">
            <IconUpload className="w-8 h-8" />
          </div>
          <div>
            <p className="font-medium mb-1">Drop your files here</p>
            <p className="text-sm text-base-content/70">
              or click to browse (PDF, TXT, DOCX)
            </p>
          </div>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <button className="btn btn-primary">
            Choose Files
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload; 