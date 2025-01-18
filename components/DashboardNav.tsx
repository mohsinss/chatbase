"use client";

import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { IconSearch, IconPlus, IconMenu2 } from "@tabler/icons-react";
import { useSession, signOut } from "next-auth/react";
import ButtonAccount from "./ButtonAccount";

interface Chatbot {
  chatbotId: string;
  name: string;
  teamId: string;
  createdBy: string;
  sources: any[];
}

const DashboardNav: React.FC<{ teamId: string }> = ({ teamId }) => {
  const { data: session } = useSession();
  const [isTeamMenuOpen, setIsTeamMenuOpen] = useState(false);
  const [isChatbotMenuOpen, setIsChatbotMenuOpen] = useState(false);
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [teams, setTeams] = useState<any[]>([]);
  const [teamSearchQuery, setTeamSearchQuery] = useState("");

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  // Fetch chatbots when component mounts or teamId changes
  useEffect(() => {
    const fetchChatbots = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/chatbot/list?teamId=${teamId}&t=${Date.now()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch chatbots');
        }
        const data = await response.json();
        setChatbots(data.chatbots || []);
      } catch (error) {
        console.error("Failed to fetch chatbots:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (teamId) {
      fetchChatbots();
    }
  }, [teamId]);

  // Fetch teams when component mounts or teamId changes
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`/api/team/list?teamId=${teamId}&t=${Date.now()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch teams');
        }
        const data = await response.json();
        setTeams(data.teams || []);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };

    fetchTeams();
  }, []);

  const handleCreateTeam = async () => {
    try {
      const response = await fetch("/api/team/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create team");
      }

      const data = await response.json();
      
      if (!data.teamId) {
        throw new Error("No team ID returned from server");
      }

      router.push(`/dashboard/${data.teamId}`);
      setIsTeamMenuOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Filter chatbots based on search query
  const filteredChatbots = chatbots.filter(chatbot => 
    chatbot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentChatbotId = pathname.includes('/chatbot/') 
    ? pathname.split('/chatbot/')[1] 
    : null;

  const isRootDashboard = pathname === "/dashboard";

  // Filter teams based on search query
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(teamSearchQuery.toLowerCase())
  );

  return (
    <div className="border-b bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex-shrink-0">
              <Image
                src="/icon.png"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
            </Link>

            {/* Always visible navigation */}
            <div className="flex items-center gap-4">
              {/* Team Selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsTeamMenuOpen(!isTeamMenuOpen);
                    setIsChatbotMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-md hover:bg-base-200"
                >
                  My Team
                  <svg
                    className="w-4 h-4 opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isTeamMenuOpen && (
                  <div className="absolute z-10 mt-2 w-72 rounded-lg shadow-lg bg-base-100 ring-1 ring-black ring-opacity-5">
                    {/* Search */}
                    <div className="p-2">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-4 w-4 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          value={teamSearchQuery}
                          onChange={(e) => setTeamSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border rounded-md text-sm bg-base-200 border-base-300 focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder="Search team..."
                        />
                      </div>
                    </div>

                    {/* Teams Section */}
                    <div className="px-2 py-1">
                      <p className="px-2 py-1 text-sm text-base-content/70">Teams</p>
                      {filteredTeams.map((team) => (
                        <button 
                          key={team.teamId}
                          onClick={() => router.push(`/dashboard/${team.id}`)}
                          className="w-full px-2 py-2 text-left rounded-md hover:bg-base-200 flex items-center justify-between group"
                        >
                          <span className="text-sm font-medium">{team.name}</span>
                          {teamId === team.teamId && (
                            <svg className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Create Team Button */}
                    <div className="border-t px-2 py-2">
                      <button
                        onClick={handleCreateTeam}
                        className="w-full px-2 py-2 text-left rounded-md hover:bg-base-200 text-primary flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">Create team</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Chatbot Selector - always visible when not on root dashboard */}
              {!isRootDashboard && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsChatbotMenuOpen(!isChatbotMenuOpen);
                      setIsTeamMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-md hover:bg-base-200"
                  >
                    Select Chatbot
                    <svg
                      className="w-4 h-4 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isChatbotMenuOpen && (
                    <div className="absolute z-10 mt-2 w-72 rounded-lg shadow-lg bg-base-100 ring-1 ring-black ring-opacity-5">
                      {/* Search */}
                      <div className="p-2">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IconSearch className="h-4 w-4 text-base-content/50" />
                          </div>
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-md text-sm bg-base-200 border-base-300 focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Search chatbot..."
                          />
                        </div>
                      </div>

                      {/* Chatbots List */}
                      <div className="max-h-64 overflow-y-auto">
                        <div className="px-2 py-1">
                          <p className="px-2 py-1 text-sm text-base-content/70">Chatbots</p>
                          {isLoading ? (
                            <div className="p-4 text-center">
                              <span className="loading loading-spinner loading-sm"></span>
                            </div>
                          ) : chatbots.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">
                              No chatbots found
                            </div>
                          ) : (
                            filteredChatbots.map((chatbot) => (
                              <button
                                key={chatbot.chatbotId}
                                onClick={() => {
                                  router.push(`/dashboard/${teamId}/chatbot/${chatbot.chatbotId}`);
                                  setIsChatbotMenuOpen(false);
                                }}
                                className="w-full px-2 py-2 text-left rounded-md hover:bg-base-200 flex items-center justify-between group"
                              >
                                <span className="text-sm font-medium">{chatbot.name}</span>
                                {currentChatbotId === chatbot.chatbotId && (
                                  <svg className="w-4 h-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Create New Chatbot Button */}
                      <div className="border-t px-2 py-2">
                        <button
                          onClick={() => {
                            router.push(`/dashboard/${teamId}/create-new-chatbot`);
                            setIsChatbotMenuOpen(false);
                          }}
                          className="w-full px-2 py-2 text-left rounded-md hover:bg-base-200 text-primary flex items-center gap-2"
                        >
                          <IconPlus className="w-5 h-5" />
                          <span className="text-sm font-medium">Create new chatbot</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center">
            {/* Desktop links and account */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/docs"
                className="text-sm font-medium hover:text-primary"
              >
                Docs
              </Link>
              <Link
                href="/help"
                className="text-sm font-medium hover:text-primary"
              >
                Help
              </Link>
              <Link
                href="/changelog"
                className="text-sm font-medium hover:text-primary"
              >
                Changelog
              </Link>
              {/* Account button - now with teamId prop */}
              <ButtonAccount teamId={teamId} />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <IconMenu2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu - now includes all items */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Email display */}
            <div className="px-3 py-2 text-sm text-gray-500">
              {session?.user?.email}
            </div>

            {/* Dashboard - now using dynamic teamId */}
            <Link
              href={teamId ? `/dashboard/${teamId}/chatbots` : "/dashboard"}
              className="block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100"
            >
              Dashboard
            </Link>

            {/* Account Settings */}
            <Link
              href="/account"
              className="block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100"
            >
              Account Settings
            </Link>

            {/* Create or join team */}
            <Link
              href="/team"
              className="block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100"
            >
              Create or join team
            </Link>

            {/* Navigation Links */}
            <Link
              href="/docs"
              className="block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100"
            >
              Docs
            </Link>
            <Link
              href="/help"
              className="block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100"
            >
              Help
            </Link>
            <Link
              href="/changelog"
              className="block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100"
            >
              Changelog
            </Link>

            {/* Sign out button */}
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 rounded-md hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardNav; 