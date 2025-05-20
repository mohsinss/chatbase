"use client";

import { useState } from "react";
import Link from "next/link";
import { tutorials, TutorialCard } from "./../tutorials";

function TutorialIllustration({ id }: { id: string }) {
  switch (id) {
    case "basic-settings":
      // Sliders/settings icon
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-100 h-100 text-blue-400">
          <rect x="8" y="20" width="32" height="4" rx="2" fill="#60A5FA" />
          <circle cx="16" cy="22" r="6" fill="#3B82F6" />
          <rect x="8" y="32" width="32" height="4" rx="2" fill="#DBEAFE" />
          <circle cx="32" cy="34" r="4" fill="#60A5FA" />
        </svg>
      );
    case "appearance":
      // Palette icon
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-100 h-100 text-pink-400">
          <ellipse cx="24" cy="24" rx="16" ry="12" fill="#F9A8D4" />
          <circle cx="16" cy="22" r="2" fill="#F472B6" />
          <circle cx="24" cy="18" r="2" fill="#F472B6" />
          <circle cx="32" cy="22" r="2" fill="#F472B6" />
          <circle cx="28" cy="30" r="2" fill="#F472B6" />
        </svg>
      );
    case "behavior":
      // Chat bubbles
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-100 h-100 text-green-400">
          <rect x="8" y="16" width="24" height="10" rx="4" fill="#6EE7B7" />
          <rect x="16" y="28" width="20" height="8" rx="4" fill="#34D399" />
        </svg>
      );
    case "display-settings":
      // Layout/grid icon
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-100 h-100 text-yellow-400">
          <rect x="8" y="12" width="12" height="12" rx="2" fill="#FDE68A" />
          <rect x="28" y="12" width="12" height="12" rx="2" fill="#FBBF24" />
          <rect x="8" y="28" width="12" height="12" rx="2" fill="#FBBF24" />
          <rect x="28" y="28" width="12" height="12" rx="2" fill="#FDE68A" />
        </svg>
      );
    case "media-management":
      // Image/photo icon
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-100 h-100 text-purple-400">
          <rect x="8" y="14" width="32" height="20" rx="4" fill="#C4B5FD" />
          <circle cx="16" cy="22" r="3" fill="#8B5CF6" />
          <rect x="20" y="22" width="16" height="8" rx="2" fill="#A78BFA" />
        </svg>
      );
    default:
      // Fallback generic illustration
      return (
        <svg viewBox="0 0 48 48" fill="none" className="w-100 h-100 text-blue-200">
          <rect x="4" y="8" width="40" height="32" rx="6" fill="#DBEAFE" />
          <rect x="12" y="16" width="24" height="8" rx="2" fill="#60A5FA" />
          <rect x="12" y="28" width="16" height="4" rx="2" fill="#93C5FD" />
        </svg>
      );
  }
}

export default function ChatbotStylingPage() {
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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial) => (
          <Link
            key={tutorial.id}
            href={`/guide/chatsa-academy/chatbot-styling/${tutorial.id}`}
            className="block text-left bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-blue-500 transition-colors"
          >
            <div className="aspect-video mb-4 flex items-center justify-center bg-blue-50 rounded-lg p-0 overflow-hidden">
              <TutorialIllustration id={tutorial.id} />
            </div>
            <h3 className="text-xl font-semibold mb-2">{tutorial.title}</h3>
            <p className="text-gray-600">{tutorial.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
} 