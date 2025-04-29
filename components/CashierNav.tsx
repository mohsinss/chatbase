import Link from "next/link";

interface CashierNavProps {
  teamId: string;
}

export default function CashierNav({ teamId }: CashierNavProps) {
  return (
    <nav className="border-b">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <Link href={`/team/${teamId}`} className="flex items-center">
            <span className="text-xl font-bold">Chatbase</span>
          </Link>
        </div>
      </div>
    </nav>
  );
} 