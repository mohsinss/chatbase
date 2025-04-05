import { useParams } from "next/navigation";
import Link from "next/link";

interface InteractionsProps {
  teamId: string;
  chatbotId: string;
  chatbot: any;
  team: string;
}

export default function Interactions({ teamId, chatbotId, chatbot, team }: InteractionsProps) {
  const params = useParams();
  const path = params?.path as string[] || [];

  const platforms = [
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'twitter', label: 'Twitter' },
    { id: 'snapchat', label: 'Snapchat' },
    { id: 'tiktok', label: 'TikTok' }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-50 min-h-[calc(100vh-4rem)] p-4">
          <h2 className="text-xl font-semibold mb-4">Interactions</h2>
          <nav>
            {platforms.map((platform) => (
              <Link
                key={platform.id}
                href={`/dashboard/${teamId}/chatbot/${chatbotId}/interactions/${platform.id}`}
                className={`block px-4 py-2 rounded-lg mb-1 ${
                  path[0] === platform.id 
                    ? 'bg-gray-200 font-medium' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {platform.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {path[0] === 'whatsapp' ? (
            <div>
              <h1 className="text-2xl font-bold mb-4">WhatsApp Interactions</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <div>WhatsApp interaction content goes here</div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-20">
              Select a platform to view interactions
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 