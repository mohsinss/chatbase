"use client";

import { useState, useEffect } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import toast from "react-hot-toast";

interface PostManagerProps {
  chatbotId: string;
  platform: string;
  platformId?: string;
}

export const usePostManager = ({ chatbotId, platform, platformId }: PostManagerProps) => {
  const [pages, setPages] = useState<Array<{ _id: string; name?: string; display_phone_number?: string }>>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>(platformId || "");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [showScheduler, setShowScheduler] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);

  const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION!,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
    },
  });

  useEffect(() => {
    const fetchPages = async () => {
      let apiBasePath = "";
      if (platform === "messenger") {
        apiBasePath = "/api/chatbot/integrations/facebook-page";
      } else if (platform === "instagram") {
        apiBasePath = "/api/chatbot/integrations/instagram-page";
      } else if (platform === "whatsapp") {
        apiBasePath = "/api/chatbot/integrations/whatsapp";
      } else {
        setPages([]);
        setSelectedPageId("");
        return;
      }

      try {
        const response = await fetch(`${apiBasePath}?chatbotId=${chatbotId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch ${platform} pages`);
        }

        const data = await response.json();
        setPages(data);
        if (data.length > 0) {
          setSelectedPageId(data[0]._id);
        } else {
          setSelectedPageId("");
        }
      } catch (error) {
        console.error(`Error fetching ${platform} pages:`, error);
        setPages([]);
        setSelectedPageId("");
      }
    };

    fetchPages();
  }, [chatbotId, platform]);

  const handleAttach = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,.pdf,.doc,.docx";
    input.multiple = true;

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        for (const file of Array.from(files)) {
          if (file.size > 15728640) { // 15MB
            toast.error(`File ${file.name} exceeds 15MB size limit.`);
            continue;
          }

          const buffer = Buffer.from(await file.arrayBuffer());
          const fileNameParts = file.name.split(".");
          const name = fileNameParts.slice(0, -1).join(".");
          const extension = fileNameParts.slice(-1)[0];
          const newFileName = `${name}-${Date.now()}.${extension}`;
          const key = `${platform}-publisher/${newFileName}`;

          try {
            await s3Client.send(
              new PutObjectCommand({
                Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
                Key: key,
                Body: buffer,
                ContentType: file.type,
              })
            );
          } catch (error) {
            console.error("S3 upload error:", error);
            toast.error(`Failed to upload ${file.name}`);
            continue;
          }

          const fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
          setAttachments((prev) => [...prev, fileUrl]);
          toast.success(`Uploaded ${file.name} successfully`);
        }
      }
    };

    input.click();
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const newAttachments = [...prev];
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  const handlePublish = async () => {
    try {
      const response = await fetch("/api/chatbot/publisher/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatbotId,
          platform,
          platformId: selectedPageId,
          title: postTitle,
          content: postContent,
          status: "published",
          date: new Date(),
          attachments,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to publish post");
      }

      toast.success("Post published successfully!");
      setPostTitle("");
      setPostContent("");
      setAttachments([]);
    } catch (error) {
      console.error("Error publishing post:", error);
      toast.error("Failed to publish post");
    }
  };

  const handleSchedule = async () => {
    if (!scheduleDate) {
      setShowScheduler(true);
      return;
    }
    try {
      const response = await fetch("/api/chatbot/publisher/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatbotId,
          platform,
          platformId: selectedPageId,
          title: postTitle,
          content: postContent,
          status: "scheduled",
          date: new Date(scheduleDate),
          attachments,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to schedule post");
      }

      toast.success(`Post scheduled for ${scheduleDate}`);
      setPostTitle("");
      setPostContent("");
      setScheduleDate("");
      setShowScheduler(false);
      setAttachments([]);
    } catch (error) {
      console.error("Error scheduling post:", error);
      toast.error("Failed to schedule post");
    }
  };

  const handleSaveDraft = async () => {
    try {
      const response = await fetch("/api/chatbot/publisher/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatbotId,
          platform,
          platformId: selectedPageId,
          title: postTitle,
          content: postContent,
          status: "draft",
          date: new Date(),
          attachments,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save draft");
      }

      toast.success("Draft saved successfully!");
      setPostTitle("");
      setPostContent("");
      setAttachments([]);
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    }
  };

  return {
    pages,
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
  };
};
