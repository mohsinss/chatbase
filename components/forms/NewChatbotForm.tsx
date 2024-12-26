"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const NewChatbotForm = ({ teamId }: { teamId: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Add your form submission logic here
    
    setIsLoading(false);
    // After successful creation, redirect back to chatbots tab
    router.push(`/dashboard/${teamId}/chatbots`);
  };

  return (
    <div className="space-y-6">
      <div className="card bg-base-200">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">Choose Data Source</h3>
          
          {/* Data source options */}
          <div className="grid gap-4 md:grid-cols-2">
            <button className="btn btn-outline justify-start gap-3 normal-case">
              <svg 
                className="w-5 h-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              Upload Files
            </button>
            
            <button className="btn btn-outline justify-start gap-3 normal-case">
              <svg 
                className="w-5 h-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
                />
              </svg>
              Website URL
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button 
          onClick={() => router.push(`/dashboard/${teamId}/chatbots`)}
          className="btn btn-ghost"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit}
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </div>
  );
};

export default NewChatbotForm; 