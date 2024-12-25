"use client";

import { useState } from "react";
import { IconFile, IconAlignLeft, IconGlobe, IconMessageQuestion, IconBrandNotion } from "@tabler/icons-react";

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  {
    id: "files",
    label: "Files",
    icon: <IconFile className="w-5 h-5 text-primary" />,
  },
  {
    id: "text",
    label: "Text",
    icon: <IconAlignLeft className="w-5 h-5" />,
  },
  {
    id: "website",
    label: "Website",
    icon: <IconGlobe className="w-5 h-5" />,
  },
  {
    id: "qa",
    label: "Q&A",
    icon: <IconMessageQuestion className="w-5 h-5" />,
  },
  {
    id: "notion",
    label: "Notion",
    icon: <IconBrandNotion className="w-5 h-5" />,
  },
];

const SideNav = ({ activeItem, onItemClick }: { 
  activeItem: string;
  onItemClick: (id: string) => void;
}) => {
  return (
    <div className="w-48 border-r bg-base-100 h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${activeItem === item.id 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SideNav; 