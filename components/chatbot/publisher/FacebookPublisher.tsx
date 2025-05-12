"use client";

import { useState, useEffect } from "react";
import { usePostManager } from "./hooks/usePostManager";
import { PostSection } from "./PostSection";
import ScheduleDateTimePicker from "@/components/ui/ScheduleDateTimePicker";
import {
  IconList,
  IconCalendarEvent,
  IconLayoutGrid,
} from "@tabler/icons-react";

interface FacebookPublisherProps {
  chatbotId: string;
}

const VIEW_OPTIONS = [
  { id: "list", label: "List", icon: <IconList className="w-5 h-5" /> },
  { id: "calendar", label: "Calendar", icon: <IconCalendarEvent className="w-5 h-5" /> },
  { id: "grid", label: "Grid", icon: <IconLayoutGrid className="w-5 h-5" /> },
];

const FacebookPublisher = ({ chatbotId }: FacebookPublisherProps) => {
  const {
    pages: facebookPages,
    selectedPageId,
    setSelectedPageId,
    postTitle,
    setPostTitle,
    postContent,
    setPostContent,
    scheduleDate,
    setScheduleDate,
    showScheduler,
    setShowScheduler,
    attachments,
    handleAttach,
    removeAttachment,
    handlePublish,
    handleSchedule,
    handleSaveDraft,
    isPublishing,
    isScheduling,
    isSavingDraft,
  } = usePostManager({ chatbotId, platform: "messenger" });

  const [posts, setPosts] = useState<any[]>([]);
  const [selectedView, setSelectedView] = useState<string>("list");

  useEffect(() => {
    const fetchPosts = async () => {
      if (!selectedPageId) {
        setPosts([]);
        return;
      }
      try {
        const response = await fetch(
          `/api/chatbot/publisher/posts?chatbotId=${chatbotId}&platform=messenger&platformId=${selectedPageId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      }
    };

    fetchPosts();
  }, [chatbotId, selectedPageId]);

  return (
    <>
      <div className="mb-6 border rounded-lg p-4">
        <div className="mb-4">
          <label
            htmlFor="facebook-page-select"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select Facebook Page
          </label>
          <select
            id="facebook-page-select"
            value={selectedPageId}
            onChange={(e) => setSelectedPageId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {facebookPages.map((page: any) => (
              <option key={page._id} value={page._id}>
                {page.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div className="hidden">
            <label
              htmlFor="post-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Post Title
            </label>
            <input
              id="post-title"
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="Enter post title"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label
              htmlFor="post-content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Post Content
            </label>
            <textarea
              id="post-content"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What would you like to share?"
              rows={4}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="mb-4 hidden">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachments
            </label>
            <button
              type="button"
              onClick={handleAttach}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSavingDraft || isPublishing || isScheduling}
            >
              Attach Files
            </button>
          </div>

          {attachments.length > 0 && (
            <div className="border rounded-md p-3 bg-gray-50">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Attached Files
              </p>
              <div className="flex flex-wrap gap-2">
                {attachments.map((attachment: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white px-3 py-1 rounded border text-sm max-w-xs"
                  >
                    <a
                      href={attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate max-w-[120px] text-blue-600 hover:underline"
                    >
                      {attachment.split("/").pop()}
                    </a>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove attachment"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showScheduler && (
            <ScheduleDateTimePicker
              scheduleDate={scheduleDate}
              setScheduleDate={setScheduleDate}
            />
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSavingDraft || isPublishing || isScheduling}
            >
              {isSavingDraft ? "Saving Draft..." : "Save Draft"}
            </button>

            <button
              onClick={handleSchedule}
              className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/5"
              disabled={isSavingDraft || isPublishing || isScheduling}
            >
              {isScheduling ? "Scheduling..." : "Schedule"}
            </button>

            <button
              onClick={handlePublish}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              disabled={isSavingDraft || isPublishing || isScheduling}
            >
              {isPublishing ? "Publishing..." : "Publish Now"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        {VIEW_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedView(option.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md border
                ${selectedView === option.id ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
            title={option.label}
            aria-pressed={selectedView === option.id}
          >
            {option.icon}
            <span className="sr-only">{option.label}</span>
          </button>
        ))}
      </div>

      {/* Post Lists */}
      <div className="space-y-4 mt-6">
        {selectedView === "list" && (
          <>
            <PostSection
              title="Scheduled Posts"
              posts={posts.filter((post) => post.status === "scheduled")}
            />
            <PostSection
              title="Drafts"
              posts={posts.filter((post) => post.status === "draft")}
            />
            <PostSection
              title="Published Posts"
              posts={posts.filter((post) => post.status === "published")}
            />
          </>
        )}
        {selectedView === "calendar" && (
          <div className="border rounded-lg p-4 text-center text-gray-500">
            Calendar view is under construction.
          </div>
        )}
        {selectedView === "grid" && (
          <div className="grid grid-cols-3 gap-4">
            {posts.map((post, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold mb-2">{post.title}</h3>
                <p className="text-sm text-gray-600">{post.content}</p>
                <p className="mt-2 text-xs text-gray-400">Status: {post.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FacebookPublisher;
