"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/libs/api";
import toast from "react-hot-toast";

const ButtonCreateTeam = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreateTeam = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/team/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create team");
      }

      const data = await response.json();
      
      if (!data.teamId) {
        throw new Error("No team ID returned from server");
      }

      router.push(`/dashboard/${data.teamId}`);
      toast.success("Team created successfully!");
      
    } catch (error: any) {
      console.error("Create team error:", error);
      toast.error(error?.message || "Failed to create team");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleCreateTeam}
      className="btn btn-primary"
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        "Create Team"
      )}
    </button>
  );
};

export default ButtonCreateTeam; 