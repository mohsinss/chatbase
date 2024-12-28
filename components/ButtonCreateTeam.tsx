"use client";

import { IconPlus } from "@tabler/icons-react";

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
  const handleCreateTeam = async () => {
    try {
      const response = await fetch("/api/team/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to create team");

      const data = await response.json();
      if (!data.teamId) throw new Error("No team ID returned");

      window.location.href = `/dashboard/${data.teamId}`;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div 
      onClick={handleCreateTeam}
      className="card bg-base-100 hover:bg-base-200 transition-colors border border-base-200 border-dashed cursor-pointer"
    >
      <TeamButtonContent />
    </div>
  );
} 