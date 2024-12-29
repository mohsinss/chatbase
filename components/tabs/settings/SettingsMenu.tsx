import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/libs/utils";

const menuItems = [
  { icon: "⚙️", label: "General", href: "general" },
  { icon: "👥", label: "Members", href: "members" },
  { icon: "📋", label: "Plans", href: "plans" },
  { icon: "💳", label: "Billing", href: "billing" },
  { icon: "🔑", label: "API Keys", href: "api-keys" },
  { icon: "🤖", label: "OpenAI Key", href: "openai-key" },
];

export function SettingsMenu() {
  const params = useParams();
  const currentTab = params.tab as string;

  return (
    <div className="w-64 space-y-1">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={`/dashboard/${params.teamId}/settings/${item.href}`}
          className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-base-200 transition-colors",
            currentTab === item.href && "bg-base-200"
          )}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
} 