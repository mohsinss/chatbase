import { notFound } from "next/navigation";
import Link from "next/link";
import { tutorials } from "../tutorials";

export default function TutorialDetailPage({ params }: { params: { tutorialId: string } }) {
  const tutorial = tutorials.find(t => t.id === params.tutorialId);
  if (!tutorial) return notFound();

  return (
    <div className="flex-1">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/guide/chatsa-academy/chatbot-styling"
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
          Back to tutorials
        </Link>
        <span className="text-gray-400">/</span>
        <h1 className="text-4xl font-bold">{tutorial.title}</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="aspect-video mb-6">
          {tutorial.id === "basic-settings" ? (
            <div className="w-full h-full rounded-lg overflow-hidden relative">
              <iframe
                src={`${tutorial.videoUrl}${tutorial.videoUrl.includes('?') ? '&' : '?'}autoplay=1`}
                allow="autoplay; fullscreen"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
              />
            </div>
          ) : tutorial.id === "appearance" ? (
            <div className="w-full h-full rounded-lg overflow-hidden relative">
              <iframe
                src="https://www.loom.com/embed/53d2ed33c10b4e28b8cfd4c6991116c7?sid=7b505150-3475-4c1b-92d1-be26ba861487&autoplay=1"
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
              poster={tutorial.thumbnailUrl}
            >
              <source src={tutorial.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <div className="prose max-w-none">
          <p className="text-gray-600">{tutorial.description}</p>
          {tutorial.id === "basic-settings" && (
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
        </div>
      </div>
    </div>
  );
} 