"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface NewUserRedirectProps {
  teamId: string;
}

export default function NewUserRedirect({ teamId }: NewUserRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the team dashboard with welcome parameter
    router.push(`/dashboard/${teamId}?welcome=true`);
  }, [teamId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="mt-4 text-lg">Setting up your dashboard...</p>
    </div>
  );
}
