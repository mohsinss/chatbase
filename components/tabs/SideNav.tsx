"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const TABS = [
  {
    id: "chatbots",
    label: "Chatbots",
    href: (teamId: string) => `/dashboard/${teamId}/chatbots`,
  },
  {
    id: "usage",
    label: "Usage",
    href: (teamId: string) => `/dashboard/${teamId}/usage`,
  },
  {
    id: "settings",
    label: "Settings",
    href: (teamId: string) => `/dashboard/${teamId}/settings/general`,
  },
] as const;

const SideNav = ({ teamId }: { teamId: string }) => {
  const params = useParams();
  const currentTab = params.tab as string || "chatbots";

  return (
    <div className="w-full">
      <div className="flex border-b mb-4">
        {TABS.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href(teamId)}
            className={`px-4 py-2 font-medium text-sm transition-colors duration-150
              ${currentTab === tab.id 
                ? "text-primary border-b-2 border-primary" 
                : "text-base-content/60 hover:text-base-content"
              }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideNav; 