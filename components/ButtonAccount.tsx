"use client";

import { useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const ButtonAccount = ({ teamId }: { teamId: string }) => {
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  if (status === "unauthenticated") return null;

  return (
    <Popover className="relative z-10">
      {({ open }) => (
        <>
          <Popover.Button className="flex items-center justify-center rounded-full">
            <svg
              className="w-8 h-8 text-gray-500 hover:text-gray-700 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </Popover.Button>

          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel className="absolute right-0 z-10 mt-3 w-screen max-w-[16rem] transform">
              <div className="overflow-hidden rounded-lg shadow-lg bg-white">
                <div className="p-2">
                  <div className="px-4 py-2 text-sm text-gray-500">
                    {session?.user?.email}
                  </div>
                  <Link
                    href={teamId ? `/dashboard/${teamId}/chatbots` : "/dashboard"}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Account Settings
                  </Link>
                  <Link
                    href="/team"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Create or join team
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default ButtonAccount;
