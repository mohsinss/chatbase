import { notFound } from "next/navigation";
import Link from "next/link";
import { tutorials } from "../../tutorials";

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
          ) : tutorial.id === "behavior" ? (
            <div className="w-full h-full rounded-lg overflow-hidden relative">
              <iframe
                src="https://www.loom.com/embed/2d51e94985384bf5a4bb145540b4db43?sid=dc6fec63-9203-4c33-b862-19a770b9e3c2"
                allow="autoplay; fullscreen"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
              />
            </div>
          ) : tutorial.id === "display-settings" ? (
            <div className="w-full h-full rounded-lg overflow-hidden relative">
              <iframe
                src="https://www.loom.com/embed/e92f45fc4aed4d03baa7cb5d913bed71?sid=e3687caa-1c24-4310-babb-452850aea65b"
                allow="autoplay; fullscreen"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
              />
            </div>
          ) : tutorial.id === "media-management" ? (
            <div className="w-full h-full rounded-lg overflow-hidden relative">
              <iframe
                src="https://www.loom.com/embed/6c16f31067554f4c84751b7726633f26?sid=d13479aa-7cda-4be2-bd6b-a6b8e5e543c5"
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
              <div>
                <span className="font-semibold">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tutorial.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/guide/chatsa-academy/tag/${encodeURIComponent(tag)}`}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
          {tutorial.id === "appearance" && (
            <div className="mt-4 space-y-4">
              <p>In this tutorial, we go through the chatbot appearance. Changing the chatbot colors, header colors, and syncing the colors with the header. Chatbot bubble colors, rounded header, and rounded chatbot messages styling.</p>
              <div>
                <span className="font-semibold">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tutorial.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/guide/chatsa-academy/tag/${encodeURIComponent(tag)}`}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
          {tutorial.id === "behavior" && (
            <div className="mt-4 space-y-4">
              <p>
                In this tutorial, we discuss how users can <b>edit the initial message</b> (the first thing the chatbot user will be interacting with), add <b>suggested messages</b> at the bottom of the chatbot for quick questions, customize the <b>message placeholder</b> with a variety of options, and enable features like <b>collecting user feedback</b> and <b>regenerating messages</b>.<br />
                <span className="block mt-2">Watch the video: <a href="https://www.loom.com/share/2d51e94985384bf5a4bb145540b4db43?sid=dc6fec63-9203-4c33-b862-19a770b9e3c2" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Chat Behavior Tutorial</a></span>
              </p>
              <div>
                <span className="font-semibold">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tutorial.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/guide/chatsa-academy/tag/${encodeURIComponent(tag)}`}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
          {tutorial.id === "display-settings" && (
            <div className="mt-4 space-y-4">
              <p>
                In the display settings tutorial, we discuss aligning the chat bubble (whether on the right or left of the page). In English-speaking languages, the chat widget is usually on the right, while in other languages it's on the left. We also discuss the auto-show initial message pop-up and how you can control when it appears by setting a delay in seconds. Finally, we cover how to set the tooltip message and control when it appears after the chatbot is displayed.<br />
                <span className="block mt-2">Watch the video: <a href="https://www.loom.com/share/e92f45fc4aed4d03baa7cb5d913bed71?sid=e3687caa-1c24-4310-babb-452850aea65b" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Display Settings Tutorial</a></span>
              </p>
              <div>
                <span className="font-semibold">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tutorial.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/guide/chatsa-academy/tag/${encodeURIComponent(tag)}`}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
          {tutorial.id === "media-management" && (
            <div className="mt-4 space-y-4">
              <p>
                In this section, we go through how to change the chatbot's profile picture—either by copying from images elsewhere and pasting them here, or by uploading an image directly from your computer. We also discuss changing the icon, changing the background, and controlling the background opacity.<br />
                <span className="block mt-2">Watch the video: <a href="https://www.loom.com/share/6c16f31067554f4c84751b7726633f26?sid=d13479aa-7cda-4be2-bd6b-a6b8e5e543c5" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Media Management Tutorial</a></span>
              </p>
              <div>
                <span className="font-semibold">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tutorial.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/guide/chatsa-academy/tag/${encodeURIComponent(tag)}`}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 