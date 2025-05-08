"use client";

import React, { useState, useEffect, ChangeEvent } from "react"
import { Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { IconLoader2 } from "@tabler/icons-react";

interface GeneralSettingsProps {
  chatbotId: string;
  teamId: string;
}

const GeneralSettings = ({ chatbotId }: GeneralSettingsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const teamId = pathname.split('/')[2];
  const [name, setName] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [creditLimit, setCreditLimit] = useState(false);
  const [creditLimitValue, setCreditLimitValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [chatbotId]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/chatbot/list/single?chatbotId=${chatbotId}`);
      const data = await response.json();

      if (data.chatbot) {
        setName(data.chatbot.name || "");
        setCharacterCount(data.chatbot.characterCount || 0);
        setCreditLimit(data.chatbot.creditLimitEnabled || false);
        setCreditLimitValue(data.chatbot.creditLimit || null);
      }
    } catch (error) {
      toast.error("Failed to load settings. Please try again.");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update name first to ensure syncing with external services
      await handleNameUpdate(name);

      // Update other settings
      const response = await fetch("/api/chatbot/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatbotId,
          characterCount,
          creditLimitEnabled: creditLimit,
          creditLimit: creditLimitValue,
        }),
      });

      if (!response.ok) throw new Error();

      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
    }
    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }

  const handleNameUpdate = async (newName: string) => {
    try {
      // Update chatbot name in the database
      const response = await fetch(`/api/chatbot/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatbotId,
          name: newName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update chatbot name');
      }

      // Update interface settings to keep display name in sync
      const interfaceResponse = await fetch('/api/chatbot/interface-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatbotId,
          displayName: newName,
        }),
      });

      if (!interfaceResponse.ok) {
        console.warn('Failed to update interface settings with new name');
      }

      // Update dataset name in Trieve
      const datasetResponse = await fetch(`/api/chatbot/update/dataset-name`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatbotId,
          name: newName,
        }),
      });

      if (!datasetResponse.ok) {
        console.warn('Failed to update dataset name in Trieve');
      }

      // Dispatch a custom event to notify other components about the name change
      window.dispatchEvent(new CustomEvent('chatbot-name-updated', {
        detail: { chatbotId, name: newName }
      }));

      toast.success("Chatbot name updated successfully");

      // Refresh settings
      fetchSettings();
    } catch (error) {
      console.error('Error updating chatbot name:', error);
      toast.error("Failed to update chatbot name. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      // Delete the chatbot
      const response = await fetch(`/api/chatbot/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatbotId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete chatbot");
      }
      toast.success("Chatbot deleted successfully");

      setTimeout(() => {
        router.push(`/dashboard/${teamId}`);
      }, 1000);

    } catch (error) {
      toast.error("Failed to delete chatbot. Please try again.");
    } finally {
      setIsDeleting(false);
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto space-y-8">
        {/* General Section */}
        <Card className="p-6 space-y-6">
          <h1 className="text-2xl font-semibold">
            {name || `Chatbot ${new Date().toLocaleString()}`}
          </h1>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Chatbot ID
              </label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono">{chatbotId}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copyToClipboard(chatbotId)}
                  title="Copy ID"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Number of characters
              </label>
              <p className="text-lg">{characterCount.toLocaleString()}</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">
                    Credit Limit
                  </label>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {creditLimit && (
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Enter credit limit"
                    value={creditLimitValue || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreditLimitValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500">
                    Enter the maximum number of credits this chatbot can use
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <div className="space-y-6">
          <h2 className="text-red-500 text-center">DANGER ZONE</h2>

          <Card className="border-red-200">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-red-500 mb-2">Delete All Conversations</h3>
                  <p className="text-gray-600">
                    Once you delete all your conversations, there is no going back. Please be certain.
                  </p>
                  <p className="text-gray-600">
                    All the conversations on this chatbot will be deleted. <span className="font-semibold">This action is not reversible</span>
                  </p>
                </div>
                <Button variant="destructive">Delete</Button>
              </div>
            </div>
          </Card>

          <Card className="border-red-200">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-red-500 mb-2">Delete Chatbot</h3>
                  <p className="text-gray-600">
                    Once you delete your chatbot, there is no going back. Please be certain.
                  </p>
                  <p className="text-gray-600">
                    All your uploaded data will be deleted. <span className="font-semibold">This action is not reversible</span>
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chatbot</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chatbot? This action cannot be undone and all associated data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <IconLoader2 className="w-4 h-4 animate-spin" /> : 'Delete Permanently'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GeneralSettings; 