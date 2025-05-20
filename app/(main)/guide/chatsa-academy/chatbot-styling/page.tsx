"use client";

import { useState } from "react";
import Link from "next/link";

interface TutorialCard {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

const tutorials: TutorialCard[] = [
  {
    id: "basic-settings",
    title: "Chat Interface Basic Settings",
    description: "Configure fundamental settings for your chat interface",
    videoUrl: "https://www.loom.com/embed/8627cb64312447cfb2ff114258b6e8b4?sid=79923b73-eb81-43c3-85d0-0e0cb9df41cb",
    thumbnailUrl: "https://example.com/thumbnails/basic-settings.jpg"
  },
  {
    id: "appearance",
    title: "Chat Interface Appearance",
    description: "Customize the visual appearance of your chat interface",
    videoUrl: "https://example.com/videos/appearance.mp4",
    thumbnailUrl: "https://example.com/thumbnails/appearance.jpg"
  },
  {
    id: "behavior",
    title: "Chat Behavior",
    description: "Adjust how your chat interface behaves and responds",
    videoUrl: "https://example.com/videos/behavior.mp4",
    thumbnailUrl: "https://example.com/thumbnails/behavior.jpg"
  },
  {
    id: "display-settings",
    title: "Display Settings",
    description: "Fine-tune display preferences and layout options",
    videoUrl: "https://example.com/videos/display-settings.mp4",
    thumbnailUrl: "https://example.com/thumbnails/display-settings.jpg"
  },
  {
    id: "media-management",
    title: "Chat Interface Media Management",
    description: "Manage and customize media elements in your chat interface",
    videoUrl: "https://example.com/videos/media-management.mp4",
    thumbnailUrl: "https://example.com/thumbnails/media-management.jpg"
  }
];

export default function ChatbotStylingPage() {
  const [selectedTutorial, setSelectedTutorial] = useState<TutorialCard | null>(null);

  return (
    <div className="flex-1">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/guide/chatsa-academy"
          className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Academy
        </Link>
        <span className="text-gray-400">/</span>
        <h1 className="text-4xl font-bold">Chatbot Styling</h1>
      </div>

      {selectedTutorial ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <button
            onClick={() => setSelectedTutorial(null)}
            className="text-blue-500 hover:text-blue-600 mb-4 flex items-center gap-2"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to tutorials
          </button>
          
          <h2 className="text-2xl font-bold mb-4">{selectedTutorial.title}</h2>
          
          <div className="aspect-video mb-6">
  {selectedTutorial.id === "basic-settings" ? (
    <div className="w-full h-full rounded-lg overflow-hidden relative">
      <iframe
        src={`${selectedTutorial.videoUrl}${selectedTutorial.videoUrl.includes('?') ? '&' : '?'}autoplay=1`}
        allow="autoplay; fullscreen"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
      />
    </div>
  ) : (
    <video
      className="w-full h-full rounded-lg"
      controls
      autoPlay
      muted
      poster={selectedTutorial.thumbnailUrl}
    >
      <source src={selectedTutorial.videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )}
</div>

          
          <div className="prose max-w-none">
            <p className="text-gray-600">{selectedTutorial.description}</p>
            {selectedTutorial.id === "basic-settings" && (
              <div className="mt-4 space-y-4">
                <p>This tutorial covers essential customization options for your chatbot interface:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Changing the chatbot display name</li>
                  <li>Switching between light and dark themes</li>
                  <li>Adjusting the chatbot window width</li>
                  <li>Customizing the footer text at the bottom of the chatbot</li>
                </ul>
              </div>
            )}
            {/* Add more detailed content here */}
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => (
            <button
              key={tutorial.id}
              onClick={() => setSelectedTutorial(tutorial)}
              className="block text-left bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-blue-500 transition-colors"
            >
              <div className="aspect-video mb-4">
                <img
                  src={tutorial.thumbnailUrl}
                  alt={tutorial.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{tutorial.title}</h3>
              <p className="text-gray-600">{tutorial.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 