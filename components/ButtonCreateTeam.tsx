"use client";

import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

// Separate non-interactive content
const TeamButtonContent = () => (
  <div className="card-body">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <IconPlus className="w-5 h-5 text-primary" />
      </div>
      <div className="text-left">
        <h2 className="card-title text-lg">Create New Team</h2>
        <p className="text-sm text-base-content/70">
          Start collaborating with others
        </p>
      </div>
    </div>
  </div>
);

// Interactive button wrapper
export default function ButtonCreateTeam() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTeam = async () => {
    if (isLoading || isCreating) return;
    
    setIsLoading(true);
    setIsCreating(true);
    try {
      toast.loading("Creating team...");
      const response = await fetch("/api/team/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to create team");

      const data = await response.json();
      if (!data.teamId) throw new Error("No team ID returned");

      toast.success("Team created successfully!");
      window.location.href = `/dashboard/${data.teamId}`;
    } catch (error) {
      console.error(error);
      toast.error("Failed to create team");
      setIsLoading(false);
      setIsCreating(false);
    }
  };

  return (
    <div 
      onClick={handleCreateTeam}
      className={`card bg-base-100 hover:bg-base-200 transition-colors border border-base-200 border-dashed cursor-pointer ${(isLoading || isCreating) ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <TeamButtonContent />
    </div>
  );
} 