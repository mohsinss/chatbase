import Link from "next/link";
import { tutorials } from "../../tutorials";

export default function TagTutorialsPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const filtered = tutorials.filter(t => t.tags.includes(tag));

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
        <h1 className="text-4xl font-bold">Tutorials tagged: <span className="text-blue-600">{tag}</span></h1>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-gray-500">No tutorials found for this tag.</div>
        ) : (
          filtered.map((tutorial) => (
            <Link
              key={tutorial.id}
              href={`/guide/chatsa-academy/chatbot-styling/${tutorial.id}`}
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
              <div className="mt-2 text-xs text-gray-400">Section: {tutorial.section}</div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
} 