"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user) {
      setEmail(session.user.email || "");
      setName(session.user.name || "");
    }
  }, [session, status, router]);

  const handleUpdateEmail = async () => {
    // Add your email update logic here
    console.log("Updating email:", email);
  };

  const handleUpdateName = async () => {
    // Add your name update logic here
    console.log("Updating name:", name);
  };

  const handleDeleteAccount = async () => {
    // Add your account deletion logic here
    console.log("Deleting account");
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <>
      <DashboardNav teamId="" />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Account</h1>

        {/* Email Section */}
        <div className="bg-white rounded-xl p-8 mb-6 shadow-sm border">
          <h2 className="text-2xl font-bold mb-2">Email</h2>
          <p className="text-gray-600 mb-4">
            Please enter the email address you want to use to sign in with.
          </p>
          <div className="flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 p-2 border rounded-lg"
              placeholder="Enter your email"
            />
            <button
              onClick={handleUpdateEmail}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Update
            </button>
          </div>
        </div>

        {/* Display Name Section */}
        <div className="bg-white rounded-xl p-8 mb-6 shadow-sm border">
          <h2 className="text-2xl font-bold mb-2">Display Name</h2>
          <p className="text-gray-600 mb-4">
            Enter your full name or a comfortable display name.
          </p>
          <div className="flex gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 p-2 border rounded-lg"
              placeholder="Enter your name"
            />
            <button
              onClick={handleUpdateName}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Update
            </button>
          </div>
        </div>

        {/* Danger Zone Divider*/}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 font-bold text-red-400">Danger Zone</span>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-6">
          <div className="bg-white rounded-xl p-8 border border-red-100">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Delete Account</h2>
            <div className="">
              <p>Once you delete your account, there is no going back. Please be certain.</p>
              <p>All your uploaded data and trained agents will be deleted.<b>&nbsp;This action is not reversible</b></p>
            </div>
            <div className="flex justify-end pt-6">
              <button
                onClick={handleDeleteAccount}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 bg-red-500 text-zinc-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/90 h-9 px-4 py-1"
              >
                Delete Your Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 